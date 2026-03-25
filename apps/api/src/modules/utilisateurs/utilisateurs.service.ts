import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { construirePagination, construireReponsePaginee } from '../../commun/utilitaires/pagination.utilitaire';
import { MettreAJourUtilisateurDto, ChangerStatutUtilisateurDto } from './dto/utilisateur.dto';

@Injectable()
export class UtilisateursService {
    constructor(private readonly prisma: PrismaService) { }

    async listerTous(dto: PaginationDto) {
        const { skip, take, orderBy } = construirePagination(dto);
        const where = {
            deleted_at: null,
            ...(dto.recherche && {
                OR: [
                    { nom_complet: { contains: dto.recherche } },
                    { email: { contains: dto.recherche } },
                ],
            }),
        };

        const [utilisateurs, total] = await Promise.all([
            this.prisma.utilisateurs.findMany({
                where,
                skip,
                take,
                orderBy,
                select: {
                    id: true,
                    nom_complet: true,
                    email: true,
                    telephone: true,
                    role: true,
                    est_actif: true,
                    langue_preferee: true,
                    created_at: true,
                    updated_at: true,
                },
            }),
            this.prisma.utilisateurs.count({ where }),
        ]);

        return construireReponsePaginee(utilisateurs, total, dto, 'Liste des utilisateurs récupérée');
    }

    async trouverParId(id: number) {
        const utilisateur = await this.prisma.utilisateurs.findFirst({
            where: { id, deleted_at: null },
            select: {
                id: true,
                nom_complet: true,
                email: true,
                telephone: true,
                role: true,
                est_actif: true,
                langue_preferee: true,
                created_at: true,
                updated_at: true,
            },
        });

        if (!utilisateur) {
            throw new NotFoundException('Utilisateur non trouvé');
        }

        return { message: 'Utilisateur récupéré', donnees: utilisateur };
    }

    async mettreAJour(id: number, dto: MettreAJourUtilisateurDto) {
        await this.trouverParId(id);

        const utilisateur = await this.prisma.utilisateurs.update({
            where: { id },
            data: dto,
            select: {
                id: true,
                nom_complet: true,
                email: true,
                telephone: true,
                role: true,
                est_actif: true,
                langue_preferee: true,
                updated_at: true,
            },
        });

        return { message: 'Utilisateur mis à jour', donnees: utilisateur };
    }

    async changerStatut(id: number, dto: ChangerStatutUtilisateurDto) {
        await this.trouverParId(id);

        const utilisateur = await this.prisma.utilisateurs.update({
            where: { id },
            data: { est_actif: dto.est_actif },
            select: { id: true, nom_complet: true, est_actif: true },
        });

        const message = dto.est_actif ? 'Utilisateur activé' : 'Utilisateur désactivé';
        return { message, donnees: utilisateur };
    }
}
