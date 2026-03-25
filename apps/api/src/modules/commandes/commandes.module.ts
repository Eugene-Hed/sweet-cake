import { Module } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { CommandesControleur } from './commandes.controleur';

@Module({
    controllers: [CommandesControleur],
    providers: [CommandesService],
    exports: [CommandesService],
})
export class CommandesModule { }
