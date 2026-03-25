import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('Bootstrap');
    const app = await NestFactory.create(AppModule, {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    // Préfixe global
    app.setGlobalPrefix('api/v1', {
        exclude: ['health', 'ready'],
    });

    // Sécurité — Helmet
    app.use(helmet());

    // CORS
    app.enableCors({
        origin: process.env.CORS_ORIGINS?.split(',') || ['http://localhost:3000'],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });

    // Validation globale
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            forbidNonWhitelisted: true,
            transform: true,
            transformOptions: { enableImplicitConversion: true },
        }),
    );

    // Swagger / OpenAPI
    const configSwagger = new DocumentBuilder()
        .setTitle('Sweet-Cake API')
        .setDescription(
            'API de la plateforme de pâtisserie Sweet-Cake — Vente et ateliers de formation.\n\n' +
            '**Langues supportées** : français (par défaut), anglais.\n' +
            'Utilisez l\'en-tête `Accept-Language: en` pour les messages en anglais.',
        )
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('Authentification', 'Inscription, connexion, jetons')
        .addTag('Utilisateurs', 'Gestion des utilisateurs')
        .addTag('Catégories', 'Gestion des catégories de produits')
        .addTag('Produits', 'Catalogue des produits')
        .addTag('Commandes', 'Gestion des commandes')
        .addTag('Ateliers', 'Gestion des ateliers de formation')
        .addTag('Réservations Atelier', 'Réservations aux ateliers')
        .addTag('Articles Stock', 'Gestion du stock')
        .addTag('Tableau de bord', 'Résumé administrateur')
        .addTag('Journaux Audit', 'Journaux d\'audit')
        .addTag('Santé', 'Vérifications de santé')
        .build();

    const document = SwaggerModule.createDocument(app, configSwagger);
    SwaggerModule.setup('api/docs', app, document, {
        customSiteTitle: 'Sweet-Cake API — Documentation',
        swaggerOptions: {
            persistAuthorization: true,
            filter: true,
            displayRequestDuration: true,
        },
    });

    const port = process.env.PORT || 3000;
    await app.listen(port);

    logger.log(`🍰 Sweet-Cake API démarrée sur le port ${port}`);
    logger.log(`📖 Documentation Swagger : http://localhost:${port}/api/docs`);
    logger.log(`🏥 Health check : http://localhost:${port}/health`);
}

bootstrap();
