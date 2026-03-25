import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CategoriesService } from './categories.service';
import { CreerCategorieDto, MettreAJourCategorieDto } from './dto/categorie.dto';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { Roles } from '../../commun/decorateurs/roles.decorateur';
import { Public } from '../../commun/decorateurs/public.decorateur';

@ApiTags('Catégories')
@Controller('categories')
export class CategoriesControleur {
    constructor(private readonly categoriesService: CategoriesService) { }

    @Public()
    @Get()
    @ApiOperation({ summary: 'Lister toutes les catégories' })
    async listerToutes(@Query() dto: PaginationDto) {
        return this.categoriesService.listerToutes(dto);
    }

    @Public()
    @Get(':id')
    @ApiOperation({ summary: 'Consulter une catégorie' })
    async trouverParId(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.trouverParId(id);
    }

    @Post()
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Créer une catégorie' })
    async creer(@Body() dto: CreerCategorieDto) {
        return this.categoriesService.creer(dto);
    }

    @Patch(':id')
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Modifier une catégorie' })
    async mettreAJour(@Param('id', ParseIntPipe) id: number, @Body() dto: MettreAJourCategorieDto) {
        return this.categoriesService.mettreAJour(id, dto);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Supprimer une catégorie (soft delete)' })
    async supprimer(@Param('id', ParseIntPipe) id: number) {
        return this.categoriesService.supprimer(id);
    }
}
