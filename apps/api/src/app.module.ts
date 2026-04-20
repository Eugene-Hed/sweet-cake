import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

// Modules communs
import { PrismaModule } from './commun/prisma/prisma.module';
import { RedisModule } from './commun/redis/redis.module';
import { I18nModule } from './commun/i18n/i18n.module';

// Gardes, filtres, intercepteurs
import { GardeJwt } from './commun/gardes/garde-jwt';
import { GardeRoles } from './commun/gardes/garde-roles';
import { FiltreExceptionsGlobal } from './commun/filtres/filtre-exceptions-global';
import { ReponseIntercepteur } from './commun/intercepteurs/reponse.intercepteur';

// Modules métier
import { AuthentificationModule } from './modules/authentification/authentification.module';
import { UtilisateursModule } from './modules/utilisateurs/utilisateurs.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { ProduitsModule } from './modules/produits/produits.module';
import { CommandesModule } from './modules/commandes/commandes.module';
import { AteliersModule } from './modules/ateliers/ateliers.module';
import { ReservationsAtelierModule } from './modules/reservations-atelier/reservations-atelier.module';
import { ArticlesStockModule } from './modules/articles-stock/articles-stock.module';
import { TableauDeBordModule } from './modules/tableau-de-bord/tableau-de-bord.module';
import { JournauxAuditModule } from './modules/journaux-audit/journaux-audit.module';
import { SanteModule } from './modules/sante/sante.module';

@Module({
    imports: [
        // Configuration
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: ['../../.env', '../../.env.local', '.env', '.env.local'],
        }),

        // Rate limiting
        ThrottlerModule.forRoot([{
            ttl: 60000,
            limit: 100,
        }]),

        // Modules communs
        PrismaModule,
        RedisModule,
        I18nModule,

        // Modules métier
        AuthentificationModule,
        UtilisateursModule,
        CategoriesModule,
        ProduitsModule,
        CommandesModule,
        AteliersModule,
        ReservationsAtelierModule,
        ArticlesStockModule,
        TableauDeBordModule,
        JournauxAuditModule,
        SanteModule,

        // Fichiers statiques (Uploads)
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'uploads'),
            serveRoot: '/uploads',
        }),
    ],
    providers: [
        // Garde JWT globale
        { provide: APP_GUARD, useClass: GardeJwt },
        // Garde de rôles globale
        { provide: APP_GUARD, useClass: GardeRoles },
        // Rate limiting global
        { provide: APP_GUARD, useClass: ThrottlerGuard },
        // Filtre d'exceptions global
        { provide: APP_FILTER, useClass: FiltreExceptionsGlobal },
        // Intercepteur de réponse uniforme
        { provide: APP_INTERCEPTOR, useClass: ReponseIntercepteur },
    ],
})
export class AppModule { }
