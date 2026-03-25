import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TableauDeBordService } from './tableau-de-bord.service';
import { Roles } from '../../commun/decorateurs/roles.decorateur';

@ApiTags('Tableau de bord')
@ApiBearerAuth()
@Controller('tableau-de-bord')
export class TableauDeBordControleur {
    constructor(private readonly tableauDeBordService: TableauDeBordService) { }

    @Get('resume')
    @Roles('administrateur', 'gestionnaire')
    @ApiOperation({ summary: 'Résumé du tableau de bord' })
    async resume() {
        return this.tableauDeBordService.resume();
    }
}
