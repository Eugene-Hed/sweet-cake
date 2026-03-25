import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ProduitsService } from './produits.service';
import { CreerProduitDto, MettreAJourProduitDto, FiltreProduitsDto } from './dto/produit.dto';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { Roles } from '../../commun/decorateurs/roles.decorateur';
import { Public } from '../../commun/decorateurs/public.decorateur';

@ApiTags('Produits')
@Controller('produits')
export class ProduitsControleur {
    constructor(private readonly produitsService: ProduitsService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Lister les produits avec filtres' })
    async listerTous(@Query() paginationDto: PaginationDto, @Query() filtreDto: FiltreProduitsDto) {
        return this.produitsService.listerTous(paginationDto, filtreDto);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Consulter un produit' })
    async trouverParId(@Param('id', ParseIntPipe) id: number) {
        return this.produitsService.trouverParId(id);
    }

    @Post()
    @ApiBearerAuth()
    @Roles('administrateur', 'gestionnaire')
    @ApiOperation({ summary: 'Créer un produit' })
    async creer(@Body() dto: CreerProduitDto) {
        return this.produitsService.creer(dto);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @Roles('administrateur', 'gestionnaire')
    @ApiOperation({ summary: 'Modifier un produit' })
    async mettreAJour(@Param('id', ParseIntPipe) id: number, @Body() dto: MettreAJourProduitDto) {
        return this.produitsService.mettreAJour(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Supprimer un produit (soft delete)' })
    async supprimer(@Param('id', ParseIntPipe) id: number) {
        return this.produitsService.supprimer(id);
    }
}
