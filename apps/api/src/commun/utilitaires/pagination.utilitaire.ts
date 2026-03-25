import { PaginationDto } from '../dto/pagination.dto';

export interface ResultatPagine<T> {
    donnees: T[];
    message: string;
    meta: {
        page: number;
        limite: number;
        total: number;
        total_pages: number;
    };
}

/**
 * Construit les paramètres de pagination pour Prisma
 */
export function construirePagination(dto: PaginationDto) {
    const page = dto.page || 1;
    const limite = dto.limite || 20;
    const skip = (page - 1) * limite;

    return {
        skip,
        take: limite,
        orderBy: dto.tri ? { [dto.tri]: dto.ordre || 'desc' } : { created_at: 'desc' as const },
    };
}

/**
 * Construit la réponse paginée
 */
export function construireReponsePaginee<T>(
    donnees: T[],
    total: number,
    dto: PaginationDto,
    message = 'Liste récupérée avec succès',
): ResultatPagine<T> {
    const page = dto.page || 1;
    const limite = dto.limite || 20;

    return {
        donnees,
        message,
        meta: {
            page,
            limite,
            total,
            total_pages: Math.ceil(total / limite),
        },
    };
}
