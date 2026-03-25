import { Controller, Post, Get, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthentificationService } from './authentification.service';
import { InscriptionDto, ConnexionDto, RafraichirJetonDto } from './dto/authentification.dto';
import { Public } from '../../commun/decorateurs/public.decorateur';
import { UtilisateurCourant } from '../../commun/decorateurs/utilisateur-courant.decorateur';

@ApiTags('Authentification')
@Controller('authentification')
export class AuthentificationControleur {
    constructor(private readonly authentificationService: AuthentificationService) { }

    @Public()
    @Post('inscription')
    @ApiOperation({ summary: 'Inscription d\'un nouveau client' })
    @ApiResponse({ status: 201, description: 'Inscription réussie' })
    @ApiResponse({ status: 409, description: 'Email déjà utilisé' })
    async inscription(@Body() dto: InscriptionDto) {
        return this.authentificationService.inscription(dto);
    }

    @Public()
    @Post('connexion')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Connexion d\'un utilisateur' })
    @ApiResponse({ status: 200, description: 'Connexion réussie' })
    @ApiResponse({ status: 401, description: 'Identifiants invalides' })
    async connexion(@Body() dto: ConnexionDto) {
        return this.authentificationService.connexion(dto);
    }

    @Post('deconnexion')
    @HttpCode(HttpStatus.OK)
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Déconnexion de l\'utilisateur courant' })
    @ApiResponse({ status: 200, description: 'Déconnexion réussie' })
    async deconnexion(@UtilisateurCourant('id') utilisateurId: number) {
        return this.authentificationService.deconnexion(utilisateurId);
    }

    @Public()
    @Post('rafraichir')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Rafraîchir le jeton d\'accès' })
    @ApiResponse({ status: 200, description: 'Jeton rafraîchi' })
    @ApiResponse({ status: 401, description: 'Jeton invalide' })
    async rafraichir(@Body() dto: RafraichirJetonDto) {
        return this.authentificationService.rafraichirJeton(dto.jeton_rafraichissement);
    }

    @Get('profil')
    @ApiBearerAuth()
    @ApiOperation({ summary: 'Récupérer le profil de l\'utilisateur courant' })
    @ApiResponse({ status: 200, description: 'Profil récupéré' })
    async profil(@UtilisateurCourant('id') utilisateurId: number) {
        return this.authentificationService.profil(utilisateurId);
    }
}
