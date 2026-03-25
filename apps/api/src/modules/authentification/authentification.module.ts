import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthentificationService } from './authentification.service';
import { AuthentificationControleur } from './authentification.controleur';
import { StrategieJwt } from './strategies/jwt.strategie';

@Module({
    imports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => ({
                secret: configService.get<string>('JWT_SECRET'),
                signOptions: {
                    expiresIn: configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
                },
            }),
        }),
    ],
    controllers: [AuthentificationControleur],
    providers: [AuthentificationService, StrategieJwt],
    exports: [AuthentificationService, JwtModule],
})
export class AuthentificationModule { }
