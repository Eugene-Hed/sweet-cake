import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JournauxAuditService } from './journaux-audit.service';
import { PaginationDto } from '../../commun/dto/pagination.dto';
import { Roles } from '../../commun/decorateurs/roles.decorateur';

@ApiTags('Journaux Audit')
@ApiBearerAuth()
@Controller('journaux-audit')
export class JournauxAuditControleur {
    constructor(private readonly journauxAuditService: JournauxAuditService) { }

    @Get()
    @Roles('administrateur')
    @ApiOperation({ summary: 'Consulter les journaux d\'audit (admin)' })
    async listerTous(@Query() dto: PaginationDto) {
        return this.journauxAuditService.listerTous(dto);
    }
}
