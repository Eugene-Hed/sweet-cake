import { Injectable, OnModuleInit, OnModuleDestroy, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private readonly logger = new Logger(RedisService.name);
    private client: Redis;

    constructor(private readonly configService: ConfigService) { }

    async onModuleInit() {
        this.client = new Redis({
            host: this.configService.get<string>('REDIS_HOST', 'localhost'),
            port: this.configService.get<number>('REDIS_PORT', 6379),
            password: this.configService.get<string>('REDIS_PASSWORD', ''),
            retryStrategy: (times: number) => {
                if (times > 3) {
                    this.logger.error('Impossible de se connecter a Redis apres 3 tentatives');
                    return null;
                }
                return Math.min(times * 200, 2000);
            },
        });

        this.client.on('connect', () => {
            this.logger.log('Connexion a Redis etablie');
        });

        this.client.on('error', (err) => {
            this.logger.error(`Erreur Redis: ${err.message}`);
        });
    }

    async onModuleDestroy() {
        if (this.client) {
            await this.client.quit();
            this.logger.log('Connexion a Redis fermee');
        }
    }

    getClient(): Redis {
        return this.client;
    }

    async get(cle: string): Promise<string | null> {
        return this.client.get(cle);
    }

    async set(cle: string, valeur: string, ttlSecondes?: number): Promise<void> {
        if (ttlSecondes) {
            await this.client.set(cle, valeur, 'EX', ttlSecondes);
        } else {
            await this.client.set(cle, valeur);
        }
    }

    async del(cle: string): Promise<void> {
        await this.client.del(cle);
    }

    async isConnected(): Promise<boolean> {
        try {
            const pong = await this.client.ping();
            return pong === 'PONG';
        } catch {
            return false;
        }
    }
}
