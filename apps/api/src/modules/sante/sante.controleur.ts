import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../commun/decorateurs/public.decorateur';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { RedisService } from '../../commun/redis/redis.service';

@ApiTags('Santé')
@Controller()
export class SanteControleur {
    constructor(
        private readonly prisma: PrismaService,
        private readonly redis: RedisService,
    ) { }

    @Public()
    @Get('/health')
    @ApiOperation({ summary: 'Vérification de santé basique' })
    async health() {
        return {
            succes: true,
            message: 'Le système est opérationnel',
            donnees: {
                statut: 'ok',
                horodatage: new Date().toISOString(),
            },
        };
    }

    @Public()
    @Get('/ready')
    @ApiOperation({ summary: 'Vérification de disponibilité (BDD + Redis)' })
    async ready() {
        const verifications: Record<string, string> = {};

        // Vérifier MySQL
        try {
            await this.prisma.$queryRaw`SELECT 1`;
            verifications['base_de_donnees'] = 'ok';
        } catch {
            verifications['base_de_donnees'] = 'erreur';
        }

        // Vérifier Redis
        try {
            const redisOk = await this.redis.isConnected();
            verifications['redis'] = redisOk ? 'ok' : 'erreur';
        } catch {
            verifications['redis'] = 'erreur';
        }

        const toutOk = Object.values(verifications).every((v) => v === 'ok');

        return {
            succes: toutOk,
            message: toutOk ? 'Le système est prêt' : 'Le système a des problèmes',
            donnees: {
                statut: toutOk ? 'ok' : 'degradé',
                verifications,
                horodatage: new Date().toISOString(),
            },
        };
    }
}
