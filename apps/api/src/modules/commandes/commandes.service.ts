import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { construirePagination, construireReponsePaginee } from '../../commun/utilitaires/pagination.utilitaire';
import { CreerCommandeDto, ChangerStatutCommandeDto } from './dto/commande.dto';
import { v4 as uuidv4 } from 'uuid';
import { Decimal } from '@prisma/client/runtime/library';

// Transitions de statut autorisées
const TRANSITIONS_AUTORISEES: Record<string, string[]> = {
    en_attente: ['confirmee', 'annulee'],
    confirmee: ['en_preparation', 'annulee'],
    en_preparation: ['prete'],
    prete: ['terminee'],
    terminee: [],
    annulee: [],
};

@Injectable()
export class CommandesService {
    private readonly logger = new Logger(CommandesService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Création d'une commande par un client (transactionnelle)
     */
    async creer(clientId: number, dto: CreerCommandeDto) {
        if (!dto.lignes || dto.lignes.length === 0) {
            throw new BadRequestException({
                message: 'Une commande doit contenir au moins une ligne',
                code_metier: 'COMMANDE_VIDE',
            });
        }

        return this.prisma.$transaction(async (tx) => {
            // Récupérer les produits
            const produitIds = dto.lignes.map((l) => l.produit_id);
            const produits = await tx.produits.findMany({
                where: {
                    id: { in: produitIds },
                    deleted_at: null,
                    est_actif: true,
                    est_disponible: true,
                },
            });

            // Vérifier que tous les produits sont disponibles
            for (const ligne of dto.lignes) {
                const produit = produits.find((p) => p.id === ligne.produit_id);
                if (!produit) {
                    throw new BadRequestException({
                        message: `Le produit #${ligne.produit_id} n'est pas disponible`,
                        code_metier: 'PRODUIT_INDISPONIBLE',
                    });
                }
            }

            // Calculer le total
            let montantTotal = new Decimal(0);
            const lignesData = dto.lignes.map((ligne) => {
                const produit = produits.find((p) => p.id === ligne.produit_id)!;
                const sousTotal = produit.prix.mul(ligne.quantite);
                montantTotal = montantTotal.add(sousTotal);
                return {
                    produit: { connect: { id: ligne.produit_id } },
                    quantite: ligne.quantite,
                    prix_unitaire: produit.prix,
                    sous_total: sousTotal,
                    options_choisies: (ligne.options_choisies || null) as any
                };
            });

            // Créer la commande
            const numeroCommande = `CMD-${Date.now()}-${uuidv4().substring(0, 4).toUpperCase()}`;

            const commande = await tx.commandes.create({
                data: {
                    client_id: clientId,
                    numero_commande: numeroCommande,
                    type_commande: dto.type_commande as 'retrait' | 'livraison',
                    montant_total: montantTotal,
                    planifiee_pour: dto.planifiee_pour ? new Date(dto.planifiee_pour) : null,
                    notes: dto.notes,
                    lignes_commande: {
                        create: lignesData,
                    },
                    historiques_statut_commande: {
                        create: {
                            ancien_statut: 'en_attente',
                            nouveau_statut: 'en_attente',
                            change_par: clientId,
                            note: 'Commande créée',
                        },
                    },
                },
                include: {
                    lignes_commande: {
                        include: { produit: { select: { id: true, nom: true } } },
                    },
                },
            });

            this.logger.log(`Commande créée: ${numeroCommande} par client #${clientId}`);

            return { message: 'Commande créée avec succès', donnees: commande };
        });
    }

    /**
     * Mes commandes (client courant)
     */
    async mesCommandes(clientId: number, dto: PaginationDto) {
        const { skip, take, orderBy } = construirePagination(dto);
        const where = { client_id: clientId };

        const [commandes, total] = await Promise.all([
            this.prisma.commandes.findMany({
                where,
                skip,
                take,
                orderBy,
                include: {
                    lignes_commande: {
                        include: { produit: { select: { id: true, nom: true, image_url: true } } },
                    },
                },
            }),
            this.prisma.commandes.count({ where }),
        ]);

        return construireReponsePaginee(commandes, total, dto, 'Mes commandes récupérées');
    }

    /**
     * Toutes les commandes (admin/gestionnaire)
     */
    async listerToutes(dto: PaginationDto) {
        const { skip, take, orderBy } = construirePagination(dto);

        const [commandes, total] = await Promise.all([
            this.prisma.commandes.findMany({
                skip,
                take,
                orderBy,
                include: {
                    client: { select: { id: true, nom_complet: true, email: true } },
                    lignes_commande: {
                        include: { produit: { select: { id: true, nom: true } } },
                    },
                },
            }),
            this.prisma.commandes.count(),
        ]);

        return construireReponsePaginee(commandes, total, dto, 'Liste des commandes récupérée');
    }

    /**
     * Détail d'une commande
     */
    async trouverParId(id: number, utilisateurId?: number, role?: string) {
        const commande = await this.prisma.commandes.findUnique({
            where: { id },
            include: {
                client: { select: { id: true, nom_complet: true, email: true, telephone: true } },
                lignes_commande: {
                    include: { produit: { select: { id: true, nom: true, prix: true, image_url: true } } },
                },
                historiques_statut_commande: {
                    orderBy: { changed_at: 'desc' },
                    include: { utilisateur: { select: { id: true, nom_complet: true } } },
                },
            },
        });

        if (!commande) throw new NotFoundException('Commande non trouvée');

        // Vérifier que le client ne voit que ses propres commandes
        if (role === 'client' && commande.client_id !== utilisateurId) {
            throw new ForbiddenException('Vous ne pouvez consulter que vos propres commandes');
        }

        return { message: 'Commande récupérée', donnees: commande };
    }

    /**
     * Changer le statut d'une commande (avec règles métier)
     */
    async changerStatut(id: number, dto: ChangerStatutCommandeDto, utilisateurId: number) {
        const commande = await this.prisma.commandes.findUnique({ where: { id } });
        if (!commande) throw new NotFoundException('Commande non trouvée');

        const statutActuel = commande.statut;
        const nouveauStatut = dto.statut;

        // Vérifier la transition
        const transitionsPermises = TRANSITIONS_AUTORISEES[statutActuel] || [];
        if (!transitionsPermises.includes(nouveauStatut)) {
            throw new BadRequestException({
                message: `Transition de statut invalide : de '${statutActuel}' vers '${nouveauStatut}'`,
                code_metier: 'TRANSITION_STATUT_INVALIDE',
            });
        }

        return this.prisma.$transaction(async (tx) => {
            const commandeMaj = await tx.commandes.update({
                where: { id },
                data: {
                    statut: nouveauStatut as any,
                    ...(nouveauStatut === 'annulee' && { annulee_at: new Date() }),
                },
            });

            await tx.historiques_statut_commande.create({
                data: {
                    commande_id: id,
                    ancien_statut: statutActuel,
                    nouveau_statut: nouveauStatut as any,
                    change_par: utilisateurId,
                    note: dto.note,
                },
            });

            this.logger.log(`Commande #${id}: ${statutActuel} → ${nouveauStatut}`);

            return { message: 'Statut de la commande mis à jour', donnees: commandeMaj };
        });
    }

    /**
     * Annuler une commande
     */
    async annuler(id: number, utilisateurId: number, role: string) {
        const commande = await this.prisma.commandes.findUnique({ where: { id } });
        if (!commande) throw new NotFoundException('Commande non trouvée');

        if (role === 'client' && commande.client_id !== utilisateurId) {
            throw new ForbiddenException('Vous ne pouvez annuler que vos propres commandes');
        }

        if (!['en_attente', 'confirmee'].includes(commande.statut)) {
            throw new BadRequestException({
                message: 'Cette commande ne peut plus être annulée',
                code_metier: 'ANNULATION_IMPOSSIBLE',
            });
        }

        return this.changerStatut(id, { statut: 'annulee', note: 'Annulation demandée' }, utilisateurId);
    }

    /**
     * Historique des statuts d'une commande
     */
    async historique(id: number) {
        const historiques = await this.prisma.historiques_statut_commande.findMany({
            where: { commande_id: id },
            orderBy: { changed_at: 'desc' },
            include: { utilisateur: { select: { id: true, nom_complet: true } } },
        });
        return { message: 'Historique récupéré', donnees: historiques };
    }
}
