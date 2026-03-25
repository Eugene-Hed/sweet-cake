import { Module } from '@nestjs/common';
import { SanteControleur } from './sante.controleur';

@Module({
    controllers: [SanteControleur],
})
export class SanteModule { }
