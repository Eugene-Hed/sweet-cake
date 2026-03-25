import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { construirePagination, construireReponsePaginee } from '../../commun/utilitaires/pagination.utilitaire';
import { CreerAtelierDto, MettreAJourAtelierDto } from './dto/atelier.dto';

@Injectable()
export class AteliersService {
    private readonly logger = new Logger(AteliersService.name);

    constructor(private readonly prisma: PrismaService) { }

    async listerTous(dto: PaginationDto) {
        const { skip, take, orderBy } = construirePagination(dto);
        const where = {
            deleted_at: null,
            ...(dto.recherche && { titre: { contains: dto.recherche } }),
        };

        const [ateliers, total] = await Promise.all([
            this.prisma.ateliers.findMany({
                where, skip, take, orderBy,
                include: {
                    createur: { select: { id: true, nom_complet: true } },
                    reservations_atelier: {
                        where: { statut: { not: 'annulee' } },
                        include: { client: { select: { id: true, nom_complet: true } } },
                    },
                },
            }),
            this.prisma.ateliers.count({ where }),
        ]);

        return construireReponsePaginee(ateliers, total, dto, 'Liste des ateliers récupérée');
    }

    async trouverParId(id: number) {
        const atelier = await this.prisma.ateliers.findFirst({
            where: { id, deleted_at: null },
            include: {
                createur: { select: { id: true, nom_complet: true } },
                reservations_atelier: {
                    where: { statut: { not: 'annulee' } },
                    include: { client: { select: { id: true, nom_complet: true } } },
                },
            },
        });
        if (!atelier) throw new NotFoundException('Atelier non trouvé');
        return { message: 'Atelier récupéré', donnees: atelier };
    }

    async creer(dto: CreerAtelierDto, createurId: number) {
        const atelier = await this.prisma.ateliers.create({
            data: {
                ...dto,
                date_atelier: new Date(dto.date_atelier),
                cree_par: createurId,
            },
        });
        this.logger.log(`Atelier créé: ${atelier.titre} par #${createurId}`);
        return { message: 'Atelier créé', donnees: atelier };
    }

    async mettreAJour(id: number, dto: MettreAJourAtelierDto) {
        await this.trouverParId(id);

        // Vérifier cohérence capacité
        if (dto.capacite) {
            const atelier = await this.prisma.ateliers.findUnique({ where: { id } });
            if (atelier && dto.capacite < atelier.places_reservees) {
                throw new BadRequestException({
                    message: 'La capacité ne peut pas être inférieure aux places déjà réservées',
                    code_metier: 'CAPACITE_INCOHERENTE',
                });
            }
        }

        const data: Record<string, unknown> = { ...dto };
        if (dto.date_atelier) data.date_atelier = new Date(dto.date_atelier);

        const atelier = await this.prisma.ateliers.update({ where: { id }, data });
        return { message: 'Atelier mis à jour', donnees: atelier };
    }

    async supprimer(id: number) {
        await this.trouverParId(id);
        await this.prisma.ateliers.update({ where: { id }, data: { deleted_at: new Date() } });
        return { message: 'Atelier supprimé' };
    }
}
