import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { construirePagination, construireReponsePaginee } from '../../commun/utilitaires/pagination.utilitaire';

@Injectable()
export class JournauxAuditService {
    private readonly logger = new Logger(JournauxAuditService.name);

    constructor(private readonly prisma: PrismaService) { }

    /**
     * Enregistrer une entrée d'audit
     */
    async enregistrer(params: {
        utilisateur_id?: number;
        action: string;
        type_entite: string;
        entite_id?: string;
        metadonnees?: Record<string, unknown>;
    }) {
        await this.prisma.journaux_audit.create({ data: params as any });
        this.logger.debug(`Audit: ${params.action} sur ${params.type_entite} #${params.entite_id}`);
    }

    /**
     * Lister les journaux d'audit
     */
    async listerTous(dto: PaginationDto) {
        const { skip, take, orderBy } = construirePagination(dto);

        const [journaux, total] = await Promise.all([
            this.prisma.journaux_audit.findMany({
                skip, take, orderBy,
                include: { utilisateur: { select: { id: true, nom_complet: true, email: true } } },
            }),
            this.prisma.journaux_audit.count(),
        ]);

        return construireReponsePaginee(journaux, total, dto, 'Journaux d\'audit récupérés');
    }
}
