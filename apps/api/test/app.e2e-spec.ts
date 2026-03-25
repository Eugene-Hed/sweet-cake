import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Sweet-Cake API (E2E)', () => {
    let app: INestApplication;
    let jetonAdmin: string;
    let jetonClient: string;

    beforeAll(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        app.setGlobalPrefix('api/v1', { exclude: ['health', 'ready'] });
        app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
        await app.init();
    });

    afterAll(async () => {
        await app.close();
    });

    // === Santé ===
    describe('Santé', () => {
        it('GET /health — doit retourner le statut ok', () => {
            return request(app.getHttpServer())
                .get('/health')
                .expect(200)
                .expect((res) => {
                    expect(res.body.succes).toBe(true);
                });
        });
    });

    // === Authentification ===
    describe('Authentification', () => {
        const nouveauClient = {
            nom_complet: 'Test Client E2E',
            email: `test-e2e-${Date.now()}@example.com`,
            mot_de_passe: 'MotDePasse1',
            telephone: '+33600000099',
        };

        it('POST /api/v1/authentification/inscription — inscription réussie', () => {
            return request(app.getHttpServer())
                .post('/api/v1/authentification/inscription')
                .send(nouveauClient)
                .expect(201)
                .expect((res) => {
                    expect(res.body.donnees?.jeton_acces).toBeDefined();
                    expect(res.body.donnees?.jeton_rafraichissement).toBeDefined();
                    jetonClient = res.body.donnees.jeton_acces;
                });
        });

        it('POST /api/v1/authentification/inscription — email dupliqué doit échouer', () => {
            return request(app.getHttpServer())
                .post('/api/v1/authentification/inscription')
                .send(nouveauClient)
                .expect(409);
        });

        it('POST /api/v1/authentification/connexion — mot de passe incorrect', () => {
            return request(app.getHttpServer())
                .post('/api/v1/authentification/connexion')
                .send({ email: 'admin@sweet-cake.fr', mot_de_passe: 'mauvais' })
                .expect(401);
        });

        it('POST /api/v1/authentification/connexion — connexion admin', () => {
            return request(app.getHttpServer())
                .post('/api/v1/authentification/connexion')
                .send({ email: 'admin@sweet-cake.fr', mot_de_passe: 'MotDePasse1' })
                .expect(200)
                .expect((res) => {
                    expect(res.body.donnees?.jeton_acces).toBeDefined();
                    jetonAdmin = res.body.donnees.jeton_acces;
                });
        });

        it('GET /api/v1/authentification/profil — profil authentifié', () => {
            return request(app.getHttpServer())
                .get('/api/v1/authentification/profil')
                .set('Authorization', `Bearer ${jetonAdmin}`)
                .expect(200)
                .expect((res) => {
                    expect(res.body.donnees?.email).toBe('admin@sweet-cake.fr');
                });
        });

        it('GET /api/v1/authentification/profil — accès refusé sans jeton', () => {
            return request(app.getHttpServer())
                .get('/api/v1/authentification/profil')
                .expect(401);
        });
    });

    // === Contrôle d'accès ===
    describe('Contrôle d\'accès', () => {
        it('GET /api/v1/utilisateurs — accès refusé pour un client', () => {
            return request(app.getHttpServer())
                .get('/api/v1/utilisateurs')
                .set('Authorization', `Bearer ${jetonClient}`)
                .expect(403);
        });

        it('GET /api/v1/utilisateurs — accès autorisé pour un admin', () => {
            return request(app.getHttpServer())
                .get('/api/v1/utilisateurs')
                .set('Authorization', `Bearer ${jetonAdmin}`)
                .expect(200);
        });
    });

    // === Catégories (publique) ===
    describe('Catégories', () => {
        it('GET /api/v1/categories — liste publique', () => {
            return request(app.getHttpServer())
                .get('/api/v1/categories')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.donnees)).toBe(true);
                });
        });
    });

    // === Produits (publique) ===
    describe('Produits', () => {
        it('GET /api/v1/produits — liste publique', () => {
            return request(app.getHttpServer())
                .get('/api/v1/produits')
                .expect(200)
                .expect((res) => {
                    expect(Array.isArray(res.body.donnees)).toBe(true);
                });
        });
    });

    // === Validation ===
    describe('Validation des entrées', () => {
        it('POST /api/v1/authentification/inscription — mot de passe trop faible', () => {
            return request(app.getHttpServer())
                .post('/api/v1/authentification/inscription')
                .send({
                    nom_complet: 'Test',
                    email: 'weak@test.com',
                    mot_de_passe: '123',
                })
                .expect(400);
        });

        it('POST /api/v1/authentification/inscription — email invalide', () => {
            return request(app.getHttpServer())
                .post('/api/v1/authentification/inscription')
                .send({
                    nom_complet: 'Test',
                    email: 'pas-un-email',
                    mot_de_passe: 'MotDePasse1',
                })
                .expect(400);
        });
    });
});
