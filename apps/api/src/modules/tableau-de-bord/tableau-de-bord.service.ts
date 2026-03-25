import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../commun/prisma/prisma.service';

@Injectable()
export class TableauDeBordService {
    constructor(private readonly prisma: PrismaService) { }

    async resume() {
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
                include: {
                    client: { select: { id: true, nom_complet: true } },
                },
            }),
            this.prisma.articles_stock.count({
                where: {
                    deleted_at: null,
                    quantite: { lte: this.prisma.articles_stock.fields.seuil_minimal as unknown as number },
                },
            }).catch(() => 0),
            this.prisma.commandes.aggregate({
                _sum: { montant_total: true },
                where: { statut: { not: 'annulee' } },
            }),
        ]);

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
            },
        };
    }
}
