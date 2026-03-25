import { Controller, Get, Post, Patch, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CommandesService } from './commandes.service';
import { CreerCommandeDto, ChangerStatutCommandeDto } from './dto/commande.dto';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { Roles } from '../../commun/decorateurs/roles.decorateur';
import { UtilisateurCourant } from '../../commun/decorateurs/utilisateur-courant.decorateur';

@ApiTags('Commandes')
@ApiBearerAuth()
@Controller('commandes')
export class CommandesControleur {
    constructor(private readonly commandesService: CommandesService) { }

    @Post()
    @Roles('client', 'administrateur')
    @ApiOperation({ summary: 'Créer une commande' })
    async creer(
        @UtilisateurCourant('id') clientId: number,
        @Body() dto: CreerCommandeDto,
    ) {
        return this.commandesService.creer(clientId, dto);
    }

    @Get('mes-commandes')
    @Roles('client', 'administrateur')
    @ApiOperation({ summary: 'Consulter mes commandes' })
    async mesCommandes(
        @UtilisateurCourant('id') clientId: number,
        @Query() dto: PaginationDto,
    ) {
        return this.commandesService.mesCommandes(clientId, dto);
    }

    @Get()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Lister toutes les commandes (admin)' })
    async listerToutes(@Query() dto: PaginationDto) {
        return this.commandesService.listerToutes(dto);
    }

    @Get(':id')
    @Roles('client', 'administrateur')
    @ApiOperation({ summary: 'Consulter une commande' })
    async trouverParId(
        @Param('id', ParseIntPipe) id: number,
        @UtilisateurCourant('id') utilisateurId: number,
        @UtilisateurCourant('role') role: string,
    ) {
        return this.commandesService.trouverParId(id, utilisateurId, role);
    }

    @Patch(':id/statut')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Changer le statut d\'une commande (admin)' })
    async changerStatut(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ChangerStatutCommandeDto,
        @UtilisateurCourant('id') utilisateurId: number,
    ) {
        return this.commandesService.changerStatut(id, dto, utilisateurId);
    }

    @Post(':id/annuler')
    @Roles('client', 'administrateur')
    @ApiOperation({ summary: 'Annuler une commande' })
    async annuler(
        @Param('id', ParseIntPipe) id: number,
        @UtilisateurCourant('id') utilisateurId: number,
        @UtilisateurCourant('role') role: string,
    ) {
        return this.commandesService.annuler(id, utilisateurId, role);
    }

    @Get(':id/historique')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Historique des statuts d\'une commande' })
    async historique(@Param('id', ParseIntPipe) id: number) {
        return this.commandesService.historique(id);
    }
}
