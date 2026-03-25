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
import { CreerReservationDto } from './dto/reservation.dto';

@Injectable()
export class ReservationsAtelierService {
    private readonly logger = new Logger(ReservationsAtelierService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Réserver un atelier (transactionnel — contrôle de capacité)
     */
    async reserver(atelierId: number, clientId: number, dto: CreerReservationDto) {
        return this.prisma.$transaction(async (tx) => {
            const atelier = await tx.ateliers.findFirst({
                where: { id: atelierId, deleted_at: null },
            });

            if (!atelier) throw new NotFoundException('Atelier non trouvé');

            if (atelier.statut !== 'planifie') {
                throw new BadRequestException({
                    message: 'Cet atelier n\'est plus disponible pour les réservations',
                    code_metier: 'ATELIER_NON_DISPONIBLE',
                });
            }

            const placesDisponibles = atelier.capacite - atelier.places_reservees;
            if (dto.nombre_places > placesDisponibles) {
                throw new BadRequestException({
                    message: `Capacité insuffisante. Places disponibles: ${placesDisponibles}`,
                    code_metier: 'CAPACITE_ATELIER_DEPASSEE',
                });
            }

            const montantTotal = atelier.prix.mul(dto.nombre_places);

            const reservation = await tx.reservations_atelier.create({
                data: {
                    atelier_id: atelierId,
                    client_id: clientId,
                    nombre_places: dto.nombre_places,
                    montant_total: montantTotal,
                    statut: 'confirmee',
                },
            });

            // Mettre à jour les places réservées
            const nouvellesPlaces = atelier.places_reservees + dto.nombre_places;
            await tx.ateliers.update({
                where: { id: atelierId },
                data: {
                    places_reservees: nouvellesPlaces,
                    ...(nouvellesPlaces >= atelier.capacite && { statut: 'complet' }),
                },
            });

            this.logger.log(`Réservation créée: atelier #${atelierId}, client #${clientId}, ${dto.nombre_places} places`);

            return { message: 'Réservation créée avec succès', donnees: reservation };
        });
    }

    /**
     * Mes réservations (client)
     */
    async mesReservations(clientId: number, dto: PaginationDto) {
        const { skip, take, orderBy } = construirePagination(dto);
        const where = { client_id: clientId };

        const [reservations, total] = await Promise.all([
            this.prisma.reservations_atelier.findMany({
                where, skip, take, orderBy,
                include: { atelier: { select: { id: true, titre: true, date_atelier: true, prix: true } } },
            }),
            this.prisma.reservations_atelier.count({ where }),
        ]);

        return construireReponsePaginee(reservations, total, dto, 'Mes réservations récupérées');
    }

    /**
     * Toutes les réservations (admin/gestionnaire/formateur)
     */
    async listerToutes(dto: PaginationDto) {
        const { skip, take, orderBy } = construirePagination(dto);

        const [reservations, total] = await Promise.all([
            this.prisma.reservations_atelier.findMany({
                skip, take, orderBy,
                include: {
                    atelier: { select: { id: true, titre: true, date_atelier: true } },
                    client: { select: { id: true, nom_complet: true, email: true } },
                },
            }),
            this.prisma.reservations_atelier.count(),
        ]);

        return construireReponsePaginee(reservations, total, dto, 'Liste des réservations récupérée');
    }

    /**
     * Annuler une réservation
     */
    async annuler(id: number, utilisateurId: number, role: string) {
        const reservation = await this.prisma.reservations_atelier.findUnique({
            where: { id },
        });

        if (!reservation) throw new NotFoundException('Réservation non trouvée');

        if (role === 'client' && reservation.client_id !== utilisateurId) {
            throw new ForbiddenException('Vous ne pouvez annuler que vos propres réservations');
        }

        if (reservation.statut === 'annulee') {
            throw new BadRequestException({
                message: 'Cette réservation est déjà annulée',
                code_metier: 'RESERVATION_DEJA_ANNULEE',
            });
        }

        return this.prisma.$transaction(async (tx) => {
            const reservationMaj = await tx.reservations_atelier.update({
                where: { id },
                data: { statut: 'annulee', annulee_at: new Date() },
            });

            // Libérer les places
            await tx.ateliers.update({
                where: { id: reservation.atelier_id },
                data: {
                    places_reservees: { decrement: reservation.nombre_places },
                    statut: 'planifie',
                },
            });

            this.logger.log(`Réservation #${id} annulée`);

            return { message: 'Réservation annulée', donnees: reservationMaj };
        });
    }
}
