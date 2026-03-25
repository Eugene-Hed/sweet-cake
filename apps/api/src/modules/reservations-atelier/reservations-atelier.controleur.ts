import { Controller, Get, Post, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ReservationsAtelierService } from './reservations-atelier.service';
import { CreerReservationDto } from './dto/reservation.dto';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { Roles } from '../../commun/decorateurs/roles.decorateur';
import { UtilisateurCourant } from '../../commun/decorateurs/utilisateur-courant.decorateur';

@ApiTags('Réservations Atelier')
@ApiBearerAuth()
@Controller()
export class ReservationsAtelierControleur {
    constructor(private readonly reservationsService: ReservationsAtelierService) { }

    @Post('ateliers/:id/reservations')
    @Roles('client', 'administrateur')
    @ApiOperation({ summary: 'Réserver un atelier' })
    async reserver(
        @Param('id', ParseIntPipe) atelierId: number,
        @UtilisateurCourant('id') clientId: number,
        @Body() dto: CreerReservationDto,
    ) {
        return this.reservationsService.reserver(atelierId, clientId, dto);
    }

    @Get('reservations/mes-reservations')
    @Roles('client', 'administrateur')
    @ApiOperation({ summary: 'Mes réservations' })
    async mesReservations(
        @UtilisateurCourant('id') clientId: number,
        @Query() dto: PaginationDto,
    ) {
        return this.reservationsService.mesReservations(clientId, dto);
    }

    @Get('reservations')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Lister toutes les réservations' })
    async listerToutes(@Query() dto: PaginationDto) {
        return this.reservationsService.listerToutes(dto);
    }

    @Post('reservations/:id/annuler')
    @ApiOperation({ summary: 'Annuler une réservation' })
    async annuler(
        @Param('id', ParseIntPipe) id: number,
        @UtilisateurCourant('id') utilisateurId: number,
        @UtilisateurCourant('role') role: string,
    ) {
        return this.reservationsService.annuler(id, utilisateurId, role);
    }
}
