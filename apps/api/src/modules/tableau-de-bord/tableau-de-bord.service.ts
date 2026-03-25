import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../commun/prisma/prisma.service';

@Injectable()
export class TableauDeBordService {
    constructor(private readonly prisma: PrismaService) { }

    async resume() {
        const aujourdhui = new Date();
        const ilYa7Jours = new Date();
        ilYa7Jours.setDate(aujourdhui.getDate() - 7);

        const [
            totalCommandes,
            totalProduits,
            totalAteliers,
            totalClients,
            commandesRecentes,
            alertesStock,
            revenus,
        ] = await Promise.all([
            this.prisma.commandes.count(),
            this.prisma.produits.count({ where: { deleted_at: null } }),
            this.prisma.ateliers.count({ where: { deleted_at: null } }),
            this.prisma.utilisateurs.count({ where: { role: 'client', deleted_at: null } }),
            this.prisma.commandes.findMany({
                take: 10,
                orderBy: { created_at: 'desc' },
                include: { client: { select: { id: true, nom_complet: true } } },
            }),
            this.prisma.$queryRaw<{ count: any }[]>`
                SELECT COUNT(*) as count 
                FROM articles_stock 
                WHERE deleted_at IS NULL AND quantite <= seuil_minimal
            `.then(res => Number(res[0]?.count) || 0).catch(() => 0),
            this.prisma.commandes.aggregate({
                _sum: { montant_total: true },
                where: { statut: { not: 'annulee' } },
            }),
        ]);

        // Stats hebdomadaires groupées par jour (SQL brut pour MySQL)
        const statsHebdo: any[] = await this.prisma.$queryRaw`
            SELECT DATE(created_at) as date, SUM(montant_total) as total
            FROM commandes
            WHERE created_at >= ${ilYa7Jours}
              AND statut != 'annulee'
            GROUP BY DATE(created_at)
            ORDER BY date ASC
        `;

        // Stats par catégorie avec noms (SQL brut)
        const statsCategories: any[] = await this.prisma.$queryRaw`
            SELECT c.nom as label, COUNT(p.id) as valeur
            FROM categories c
            LEFT JOIN produits p ON p.categorie_id = c.id AND p.deleted_at IS NULL
            WHERE c.deleted_at IS NULL
            GROUP BY c.id, c.nom
            HAVING valeur > 0
        `;

        return {
            message: 'Résumé du tableau de bord récupéré',
            donnees: {
                total_commandes: totalCommandes,
                total_produits: totalProduits,
                total_ateliers: totalAteliers,
                total_clients: totalClients,
                alertes_stock_faible: alertesStock,
                revenus_estimes: revenus._sum.montant_total || 0,
                commandes_recentes: commandesRecentes,
                stats_hebdo: statsHebdo.map(s => ({
                    label: new Date(s.date).toLocaleDateString('fr-FR', { weekday: 'short' }),
                    valeur: Number(s.total) || 0
                })),
                stats_categories: statsCategories,
            },
        };
    }
}
