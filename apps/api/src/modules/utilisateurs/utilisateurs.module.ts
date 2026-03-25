import { Module } from '@nestjs/common';
import { UtilisateursService } from './utilisateurs.service';
import { UtilisateursControleur } from './utilisateurs.controleur';

@Module({
    controllers: [UtilisateursControleur],
    providers: [UtilisateursService],
    exports: [UtilisateursService],
})
export class UtilisateursModule { }
