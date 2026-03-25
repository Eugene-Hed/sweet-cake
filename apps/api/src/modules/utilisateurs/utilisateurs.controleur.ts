import { Controller, Get, Patch, Param, Body, Query, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UtilisateursService } from './utilisateurs.service';
import { MettreAJourUtilisateurDto, ChangerStatutUtilisateurDto } from './dto/utilisateur.dto';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { Roles } from '../../commun/decorateurs/roles.decorateur';

@ApiTags('Utilisateurs')
@ApiBearerAuth()
@Controller('utilisateurs')
export class UtilisateursControleur {
    constructor(private readonly utilisateursService: UtilisateursService) { }

    @Get()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Lister tous les utilisateurs (admin)' })
    async listerTous(@Query() dto: PaginationDto) {
        return this.utilisateursService.listerTous(dto);
    }

    @Get(':id')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Consulter un utilisateur par ID (admin)' })
    async trouverParId(@Param('id', ParseIntPipe) id: number) {
        return this.utilisateursService.trouverParId(id);
    }

    @Patch(':id')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Mettre à jour un utilisateur (admin)' })
    async mettreAJour(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: MettreAJourUtilisateurDto,
    ) {
        return this.utilisateursService.mettreAJour(id, dto);
    }

    @Patch(':id/statut')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Activer / désactiver un utilisateur (admin)' })
    async changerStatut(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: ChangerStatutUtilisateurDto,
    ) {
        return this.utilisateursService.changerStatut(id, dto);
    }
}
