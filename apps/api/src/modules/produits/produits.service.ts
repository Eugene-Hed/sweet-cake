import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { construirePagination, construireReponsePaginee } from '../../commun/utilitaires/pagination.utilitaire';
import { CreerProduitDto, MettreAJourProduitDto, FiltreProduitsDto } from './dto/produit.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProduitsService {
    constructor(private readonly prisma: PrismaService) { }

    async listerTous(paginationDto: PaginationDto, filtreDto: FiltreProduitsDto) {
        const { skip, take, orderBy } = construirePagination(paginationDto);

        const where: Prisma.produitsWhereInput = {
            deleted_at: null,
            ...(filtreDto.categorie_id && { categorie_id: filtreDto.categorie_id }),
            ...(filtreDto.est_disponible !== undefined && { est_disponible: filtreDto.est_disponible }),
            ...(filtreDto.est_actif !== undefined && { est_actif: filtreDto.est_actif }),
            ...(paginationDto.recherche && {
                OR: [
                    { nom: { contains: paginationDto.recherche } },
                    { description: { contains: paginationDto.recherche } },
                ],
            }),
            ...((filtreDto.prix_min !== undefined || filtreDto.prix_max !== undefined) && {
                prix: {
                    ...(filtreDto.prix_min !== undefined && { gte: filtreDto.prix_min }),
                    ...(filtreDto.prix_max !== undefined && { lte: filtreDto.prix_max }),
                },
            }),
        };

        const [produits, total] = await Promise.all([
            this.prisma.produits.findMany({
                where,
                skip,
                take,
                orderBy,
                include: { 
                    categorie: { select: { id: true, nom: true } },
                    options_produit: true
                },
            }),
            this.prisma.produits.count({ where }),
        ]);

        return construireReponsePaginee(produits, total, paginationDto, 'Liste des produits récupérée');
    }

    async trouverParId(id: number) {
        const produit = await this.prisma.produits.findFirst({
            where: { id, deleted_at: null },
            include: { 
                categorie: { select: { id: true, nom: true } },
                options_produit: true
            },
        });
        if (!produit) throw new NotFoundException('Produit non trouvé');
        return { message: 'Produit récupéré', donnees: produit };
    }

    async creer(dto: CreerProduitDto) {
        const { options, ...donneesProduit } = dto;
        const produit = await this.prisma.produits.create({
            data: {
                ...donneesProduit,
                options_produit: options ? {
                    create: options.map(o => ({
                        nom: o.nom,
                        valeurs: o.valeurs,
                        est_obligatoire: o.est_obligatoire ?? false
                    }))
                } : undefined
            },
            include: { 
                categorie: { select: { id: true, nom: true } },
                options_produit: true
            },
        });
        return { message: 'Produit créé', donnees: produit };
    }

    async mettreAJour(id: number, dto: MettreAJourProduitDto) {
        await this.trouverParId(id);
        const { options, ...donneesProduit } = dto;
        
        const produit = await this.prisma.produits.update({
            where: { id },
            data: {
                ...donneesProduit as any,
                options_produit: options ? {
                    deleteMany: {},
                    create: options.map(o => ({
                        nom: o.nom,
                        valeurs: o.valeurs,
                        est_obligatoire: o.est_obligatoire ?? false
                    }))
                } : undefined
            },
            include: { 
                categorie: { select: { id: true, nom: true } },
                options_produit: true
            },
        });
        return { message: 'Produit mis à jour', donnees: produit };
    }

    async supprimer(id: number) {
        await this.trouverParId(id);
        await this.prisma.produits.update({ where: { id }, data: { deleted_at: new Date() } });
        return { message: 'Produit supprimé' };
    }
}
