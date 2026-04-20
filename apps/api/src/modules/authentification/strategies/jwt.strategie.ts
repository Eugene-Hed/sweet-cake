import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy as JwtStrategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../commun/prisma/prisma.service';

@Injectable()
export class StrategieJwt extends PassportStrategy(JwtStrategy) {
    constructor(
        configService: ConfigService,
        private readonly prisma: PrismaService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: { sub: number; email: string; role: string }) {
        const utilisateur = await this.prisma.utilisateurs.findUnique({
            where: { id: payload.sub },
            select: {
                id: true,
                email: true,
                nom_complet: true,
                role: true,
                est_actif: true,
                langue_preferee: true,
            },
        });

        if (!utilisateur || !utilisateur.est_actif) {
            throw new UnauthorizedException('Utilisateur non trouvé ou désactivé');
        }

        return {
            id: utilisateur.id,
            email: utilisateur.email,
            nom_complet: utilisateur.nom_complet,
            role: utilisateur.role,
            langue_preferee: utilisateur.langue_preferee,
        };
    }
}
