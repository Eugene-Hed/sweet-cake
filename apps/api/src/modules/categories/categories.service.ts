import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { construirePagination, construireReponsePaginee } from '../../commun/utilitaires/pagination.utilitaire';
import { CreerCategorieDto, MettreAJourCategorieDto } from './dto/categorie.dto';

@Injectable()
export class CategoriesService {
    constructor(private readonly prisma: PrismaService) { }

    async listerToutes(dto: PaginationDto) {
        const { skip, take, orderBy } = construirePagination(dto);
        const where = {
            deleted_at: null,
            ...(dto.recherche && { nom: { contains: dto.recherche } }),
        };

        const [categories, total] = await Promise.all([
            this.prisma.categories.findMany({ where, skip, take, orderBy }),
            this.prisma.categories.count({ where }),
        ]);

        return construireReponsePaginee(categories, total, dto, 'Liste des catégories récupérée');
    }

    async trouverParId(id: number) {
        const categorie = await this.prisma.categories.findFirst({
            where: { id, deleted_at: null },
            include: { produits: { where: { deleted_at: null }, take: 10 } },
        });
        if (!categorie) throw new NotFoundException('Catégorie non trouvée');
        return { message: 'Catégorie récupérée', donnees: categorie };
    }

    async creer(dto: CreerCategorieDto) {
        const categorie = await this.prisma.categories.create({ data: dto });
        return { message: 'Catégorie créée', donnees: categorie };
    }

    async mettreAJour(id: number, dto: MettreAJourCategorieDto) {
        await this.trouverParId(id);
        const categorie = await this.prisma.categories.update({ where: { id }, data: dto });
        return { message: 'Catégorie mise à jour', donnees: categorie };
    }

    async supprimer(id: number) {
        await this.trouverParId(id);
        await this.prisma.categories.update({ where: { id }, data: { deleted_at: new Date() } });
        return { message: 'Catégorie supprimée' };
    }
}
