import { Module } from '@nestjs/common';
import { ReservationsAtelierService } from './reservations-atelier.service';
import { ReservationsAtelierControleur } from './reservations-atelier.controleur';

@Module({
    controllers: [ReservationsAtelierControleur],
    providers: [ReservationsAtelierService],
    exports: [ReservationsAtelierService],
})
export class ReservationsAtelierModule { }
