import { Module } from '@nestjs/common';
import { ProduitsService } from './produits.service';
import { ProduitsControleur } from './produits.controleur';

@Module({
    controllers: [ProduitsControleur],
    providers: [ProduitsService],
    exports: [ProduitsService],
})
export class ProduitsModule { }
