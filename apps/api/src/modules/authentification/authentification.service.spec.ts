import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { AuthentificationService } from './authentification.service';
import { PrismaService } from '../../commun/prisma/prisma.service';

// Mock PrismaService
const mockPrisma = {
    utilisateurs: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
    jetons_rafraichissement: {
        create: jest.fn(),
        updateMany: jest.fn(),
        findFirst: jest.fn(),
        update: jest.fn(),
    },
};

const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock-token'),
    verify: jest.fn(),
};

const mockConfigService = {
    get: jest.fn((key: string, defaultValue?: unknown) => {
        const config: Record<string, unknown> = {
            JWT_SECRET: 'test-secret',
            JWT_REFRESH_SECRET: 'test-refresh-secret',
            JWT_ACCESS_EXPIRATION: '15m',
            JWT_REFRESH_EXPIRATION: '7d',
            BCRYPT_SALT_ROUNDS: 4,
        };
        return config[key] || defaultValue;
    }),
};

describe('AuthentificationService', () => {
    let service: AuthentificationService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthentificationService,
                { provide: PrismaService, useValue: mockPrisma },
                { provide: JwtService, useValue: mockJwtService },
                { provide: ConfigService, useValue: mockConfigService },
            ],
        }).compile();

        service = module.get<AuthentificationService>(AuthentificationService);
        jest.clearAllMocks();
    });

    describe('inscription', () => {
        it('doit créer un utilisateur et retourner des jetons', async () => {
            mockPrisma.utilisateurs.findUnique.mockResolvedValue(null);
            mockPrisma.utilisateurs.create.mockResolvedValue({
                id: 1,
                nom_complet: 'Test User',
                email: 'test@example.com',
                role: 'client',
                langue_preferee: 'fr',
                created_at: new Date(),
            });
            mockPrisma.jetons_rafraichissement.create.mockResolvedValue({});

            const result = await service.inscription({
                nom_complet: 'Test User',
                email: 'test@example.com',
                mot_de_passe: 'MotDePasse1',
            });

            expect(result.donnees.jeton_acces).toBeDefined();
            expect(result.donnees.utilisateur.email).toBe('test@example.com');
        });

        it('doit lever une erreur si l\'email existe déjà', async () => {
            mockPrisma.utilisateurs.findUnique.mockResolvedValue({ id: 1 });

            await expect(
                service.inscription({
                    nom_complet: 'Test',
                    email: 'existant@example.com',
                    mot_de_passe: 'MotDePasse1',
                }),
            ).rejects.toThrow(ConflictException);
        });
    });

    describe('connexion', () => {
        it('doit lever une erreur si l\'utilisateur n\'existe pas', async () => {
            mockPrisma.utilisateurs.findUnique.mockResolvedValue(null);

            await expect(
                service.connexion({
                    email: 'inexistant@example.com',
                    mot_de_passe: 'MotDePasse1',
                }),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('deconnexion', () => {
        it('doit révoquer les jetons de rafraîchissement', async () => {
            mockPrisma.jetons_rafraichissement.updateMany.mockResolvedValue({ count: 1 });

            const result = await service.deconnexion(1);
            expect(result.message).toContain('Déconnexion');
            expect(mockPrisma.jetons_rafraichissement.updateMany).toHaveBeenCalled();
        });
    });
});
