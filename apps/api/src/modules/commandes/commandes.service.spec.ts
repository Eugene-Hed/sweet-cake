import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { CommandesService } from './commandes.service';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

const mockPrisma: Record<string, any> = {
    commandes: {
        create: jest.fn(),
        findMany: jest.fn(),
        findUnique: jest.fn(),
        count: jest.fn(),
        update: jest.fn(),
    },
    produits: {
        findMany: jest.fn(),
    },
    historiques_statut_commande: {
        create: jest.fn(),
        findMany: jest.fn(),
    },
    $transaction: jest.fn((fn: any): any => fn(mockPrisma)),
};

describe('CommandesService', () => {
    let service: CommandesService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                CommandesService,
                { provide: PrismaService, useValue: mockPrisma },
            ],
        }).compile();

        service = module.get<CommandesService>(CommandesService);
        jest.clearAllMocks();
    });

    describe('creer', () => {
        it('doit rejeter une commande sans lignes', async () => {
            await expect(
                service.creer(1, { type_commande: 'retrait', lignes: [] }),
            ).rejects.toThrow(BadRequestException);
        });

        it('doit rejeter si un produit n\'est pas disponible', async () => {
            mockPrisma.produits.findMany.mockResolvedValue([]);

            await expect(
                service.creer(1, {
                    type_commande: 'retrait',
                    lignes: [{ produit_id: 999, quantite: 1 }],
                }),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('changerStatut', () => {
        it('doit rejeter une transition de statut invalide', async () => {
            mockPrisma.commandes.findUnique.mockResolvedValue({
                id: 1,
                statut: 'terminee',
            });

            await expect(
                service.changerStatut(1, { statut: 'en_attente' }, 1),
            ).rejects.toThrow(BadRequestException);
        });

        it('doit rejeter la transition prete → en_attente', async () => {
            mockPrisma.commandes.findUnique.mockResolvedValue({
                id: 1,
                statut: 'prete',
            });

            await expect(
                service.changerStatut(1, { statut: 'en_attente' }, 1),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('annuler', () => {
        it('doit rejeter l\'annulation d\'une commande en_preparation', async () => {
            mockPrisma.commandes.findUnique.mockResolvedValue({
                id: 1,
                statut: 'en_preparation',
                client_id: 1,
            });

            await expect(
                service.annuler(1, 1, 'client'),
            ).rejects.toThrow(BadRequestException);
        });
    });
});
