import { Controller, Get, Post, Patch, Delete, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ArticlesStockService } from './articles-stock.service';
import { CreerArticleStockDto, MettreAJourArticleStockDto, CreerMouvementStockDto } from './dto/article-stock.dto';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { Roles } from '../../commun/decorateurs/roles.decorateur';
import { UtilisateurCourant } from '../../commun/decorateurs/utilisateur-courant.decorateur';

@ApiTags('Articles Stock')
@ApiBearerAuth()
@Controller()
export class ArticlesStockControleur {
    constructor(private readonly articlesStockService: ArticlesStockService) { }

    @Get('articles-stock')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Lister les articles de stock' })
    async listerTous(@Query() dto: PaginationDto) {
        return this.articlesStockService.listerTous(dto);
    }

    @Get('articles-stock/:id')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Consulter un article de stock' })
    async trouverParId(@Param('id', ParseIntPipe) id: number) {
        return this.articlesStockService.trouverParId(id);
    }

    @Post('articles-stock')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Créer un article de stock' })
    async creer(@Body() dto: CreerArticleStockDto) {
        return this.articlesStockService.creer(dto);
    }

    @Patch('articles-stock/:id')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Modifier un article de stock' })
    async mettreAJour(@Param('id', ParseIntPipe) id: number, @Body() dto: MettreAJourArticleStockDto) {
        return this.articlesStockService.mettreAJour(id, dto);
    }

    @Delete('articles-stock/:id')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Supprimer un article de stock (soft delete)' })
    async supprimer(@Param('id', ParseIntPipe) id: number) {
        return this.articlesStockService.supprimer(id);
    }

    @Post('articles-stock/:id/mouvements')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Enregistrer un mouvement de stock' })
    async creerMouvement(
        @Param('id', ParseIntPipe) id: number,
        @Body() dto: CreerMouvementStockDto,
        @UtilisateurCourant('id') utilisateurId: number,
    ) {
        return this.articlesStockService.creerMouvement(id, dto, utilisateurId);
    }

    @Get('alertes-stock')
    @Roles('administrateur')
    @ApiOperation({ summary: 'Alertes de stock faible' })
    async alertesStockFaible() {
        return this.articlesStockService.alertesStockFaible();
    }
}
