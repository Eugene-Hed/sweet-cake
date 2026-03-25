import { Module } from '@nestjs/common';
import { TableauDeBordService } from './tableau-de-bord.service';
import { TableauDeBordControleur } from './tableau-de-bord.controleur';

@Module({
    controllers: [TableauDeBordControleur],
    providers: [TableauDeBordService],
})
export class TableauDeBordModule { }
