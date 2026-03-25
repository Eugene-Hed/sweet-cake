import { Module } from '@nestjs/common';
import { AteliersService } from './ateliers.service';
import { AteliersControleur } from './ateliers.controleur';

@Module({
    controllers: [AteliersControleur],
    providers: [AteliersService],
    exports: [AteliersService],
})
export class AteliersModule { }
