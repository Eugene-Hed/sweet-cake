import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { construirePagination, construireReponsePaginee } from '../../commun/utilitaires/pagination.utilitaire';
import { CreerArticleStockDto, MettreAJourArticleStockDto, CreerMouvementStockDto } from './dto/article-stock.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class ArticlesStockService {
    private readonly logger = new Logger(ArticlesStockService.name);

    constructor(private readonly prisma: PrismaService) { }

    async listerTous(dto: PaginationDto) {
        const { skip, take, orderBy } = construirePagination(dto);
        const where = {
            deleted_at: null,
            ...(dto.recherche && { nom: { contains: dto.recherche } }),
        };

        const [articles, total] = await Promise.all([
            this.prisma.articles_stock.findMany({ where, skip, take, orderBy }),
            this.prisma.articles_stock.count({ where }),
        ]);

        return construireReponsePaginee(articles, total, dto, 'Liste des articles de stock récupérée');
    }

    async trouverParId(id: number) {
        const article = await this.prisma.articles_stock.findFirst({
            where: { id, deleted_at: null },
            include: {
                mouvements_stock: {
                    orderBy: { created_at: 'desc' },
                    take: 20,
                    include: { createur: { select: { id: true, nom_complet: true } } },
                },
            },
        });
        if (!article) throw new NotFoundException('Article de stock non trouvé');
        return { message: 'Article récupéré', donnees: article };
    }

    async creer(dto: CreerArticleStockDto) {
        const article = await this.prisma.articles_stock.create({ data: dto });
        return { message: 'Article de stock créé', donnees: article };
    }

    async mettreAJour(id: number, dto: MettreAJourArticleStockDto) {
        await this.trouverParId(id);
        const article = await this.prisma.articles_stock.update({ where: { id }, data: dto });
        return { message: 'Article mis à jour', donnees: article };
    }

    async supprimer(id: number) {
        await this.trouverParId(id);
        await this.prisma.articles_stock.update({ where: { id }, data: { deleted_at: new Date() } });
        return { message: 'Article supprimé' };
    }

    /**
     * Créer un mouvement de stock (transactionnel)
     */
    async creerMouvement(articleId: number, dto: CreerMouvementStockDto, utilisateurId: number) {
        return this.prisma.$transaction(async (tx) => {
            const article = await tx.articles_stock.findFirst({
                where: { id: articleId, deleted_at: null },
            });
            if (!article) throw new NotFoundException('Article de stock non trouvé');

            const quantiteMouvement = new Decimal(dto.quantite);
            let nouvelleQuantite: Decimal;

            switch (dto.type_mouvement) {
                case 'entree':
                    nouvelleQuantite = article.quantite.add(quantiteMouvement);
                    break;
                case 'sortie':
                    if (article.quantite.lessThan(quantiteMouvement)) {
                        throw new BadRequestException({
                            message: `Stock insuffisant pour l'article '${article.nom}'`,
                            code_metier: 'STOCK_INSUFFISANT',
                        });
                    }
                    nouvelleQuantite = article.quantite.sub(quantiteMouvement);
                    break;
                case 'ajustement':
                    nouvelleQuantite = quantiteMouvement;
                    break;
                default:
                    throw new BadRequestException('Type de mouvement invalide');
            }

            await tx.articles_stock.update({
                where: { id: articleId },
                data: { quantite: nouvelleQuantite },
            });

            const mouvement = await tx.mouvements_stock.create({
                data: {
                    article_stock_id: articleId,
                    type_mouvement: dto.type_mouvement as 'entree' | 'sortie' | 'ajustement',
                    quantite: quantiteMouvement,
                    raison: dto.raison,
                    cree_par: utilisateurId,
                },
            });

            this.logger.log(`Mouvement stock: ${dto.type_mouvement} de ${dto.quantite} sur article #${articleId}`);

            return { message: 'Mouvement de stock enregistré', donnees: mouvement };
        });
    }

    /**
     * Alertes de stock faible
     */
    async alertesStockFaible() {
        const alertes = await this.prisma.$queryRaw`
      SELECT id, nom, unite, quantite, seuil_minimal
      FROM articles_stock
      WHERE deleted_at IS NULL
        AND quantite <= seuil_minimal
        AND seuil_minimal > 0
      ORDER BY (quantite / seuil_minimal) ASC
    `;

        return { message: 'Alertes de stock faible récupérées', donnees: alertes };
    }
}
