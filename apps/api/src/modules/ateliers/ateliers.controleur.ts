import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AteliersService } from './ateliers.service';
import { CreerAtelierDto, MettreAJourAtelierDto } from './dto/atelier.dto';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { Roles } from '../../commun/decorateurs/roles.decorateur';
import { Public } from '../../commun/decorateurs/public.decorateur';
import { UtilisateurCourant } from '../../commun/decorateurs/utilisateur-courant.decorateur';

@ApiTags('Ateliers')
@Controller('ateliers')
export class AteliersControleur {
    constructor(private readonly ateliersService: AteliersService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Lister les ateliers' })
    async listerTous(@Query() dto: PaginationDto) {
        return this.ateliersService.listerTous(dto);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Consulter un atelier' })
    async trouverParId(@Param('id', ParseIntPipe) id: number) {
        return this.ateliersService.trouverParId(id);
    }

    @Post()
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Créer un atelier' })
    async creer(@Body() dto: CreerAtelierDto, @UtilisateurCourant('id') createurId: number) {
        return this.ateliersService.creer(dto, createurId);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Modifier un atelier' })
    async mettreAJour(@Param('id', ParseIntPipe) id: number, @Body() dto: MettreAJourAtelierDto) {
        return this.ateliersService.mettreAJour(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Supprimer un atelier (soft delete)' })
    async supprimer(@Param('id', ParseIntPipe) id: number) {
        return this.ateliersService.supprimer(id);
    }
}
