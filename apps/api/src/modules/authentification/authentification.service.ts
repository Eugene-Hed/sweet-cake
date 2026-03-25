import {
    Injectable,
    ConflictException,
    UnauthorizedException,
    ForbiddenException,
    Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../../commun/prisma/prisma.service';
import { InscriptionDto, ConnexionDto } from './dto/authentification.dto';

@Injectable()
export class AuthentificationService {
    private readonly logger = new Logger(AuthentificationService.name);

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) { }

    /**
     * Inscription d'un nouveau client
     */
    async inscription(dto: InscriptionDto) {
        // Vérifier si l'email existe déjà
        const existant = await this.prisma.utilisateurs.findUnique({
            where: { email: dto.email },
        });

        if (existant) {
            throw new ConflictException({
                message: 'Cet email est déjà utilisé',
                code_metier: 'EMAIL_EXISTE',
            });
        }

        // Hacher le mot de passe
        const tours = Number(this.configService.get<number>('BCRYPT_SALT_ROUNDS', 12));
        const motDePasseHash = await bcrypt.hash(dto.mot_de_passe, tours);

        // Créer l'utilisateur
        const utilisateur = await this.prisma.utilisateurs.create({
            data: {
                nom_complet: dto.nom_complet,
                email: dto.email,
                mot_de_passe_hash: motDePasseHash,
                telephone: dto.telephone,
                role: 'client',
                langue_preferee: dto.langue_preferee || 'fr',
            },
            select: {
                id: true,
                nom_complet: true,
                email: true,
                role: true,
                langue_preferee: true,
                created_at: true,
            },
        });

        // Générer les jetons
        const jetons = await this.genererJetons(utilisateur.id, utilisateur.email, utilisateur.role);

        this.logger.log(`Nouvel utilisateur inscrit: ${utilisateur.email}`);

        return {
            message: 'Inscription réussie',
            donnees: {
                utilisateur,
                ...jetons,
            },
        };
    }

    /**
     * Connexion d'un utilisateur
     */
    async connexion(dto: ConnexionDto) {
        // Trouver l'utilisateur
        const utilisateur = await this.prisma.utilisateurs.findUnique({
            where: { email: dto.email },
        });

        if (!utilisateur) {
            throw new UnauthorizedException({
                message: 'Email ou mot de passe incorrect',
                code_metier: 'IDENTIFIANTS_INVALIDES',
            });
        }

        // Vérifier si l'utilisateur est actif
        if (!utilisateur.est_actif) {
            throw new ForbiddenException({
                message: 'Ce compte utilisateur est désactivé',
                code_metier: 'UTILISATEUR_INACTIF',
            });
        }

        // Vérifier le mot de passe
        const motDePasseValide = await bcrypt.compare(dto.mot_de_passe, utilisateur.mot_de_passe_hash);
        if (!motDePasseValide) {
            throw new UnauthorizedException({
                message: 'Email ou mot de passe incorrect',
                code_metier: 'IDENTIFIANTS_INVALIDES',
            });
        }

        // Générer les jetons
        const jetons = await this.genererJetons(utilisateur.id, utilisateur.email, utilisateur.role);

        this.logger.log(`Connexion réussie: ${utilisateur.email}`);

        return {
            message: 'Connexion réussie',
            donnees: {
                utilisateur: {
                    id: utilisateur.id,
                    nom_complet: utilisateur.nom_complet,
                    email: utilisateur.email,
                    role: utilisateur.role,
                    langue_preferee: utilisateur.langue_preferee,
                },
                ...jetons,
            },
        };
    }

    /**
     * Déconnexion — révoque le jeton de rafraîchissement
     */
    async deconnexion(utilisateurId: number) {
        await this.prisma.jetons_rafraichissement.updateMany({
            where: {
                utilisateur_id: utilisateurId,
                revoked_at: null,
            },
            data: {
                revoked_at: new Date(),
            },
        });

        this.logger.log(`Déconnexion: utilisateur #${utilisateurId}`);

        return { message: 'Déconnexion réussie' };
    }

    /**
     * Rafraîchir le jeton d'accès via le jeton de rafraîchissement
     */
    async rafraichirJeton(jetonRafraichissement: string) {
        // Vérifier et décoder le jeton
        let payload: { sub: number; email: string; role: string; jti: string };
        try {
            payload = this.jwtService.verify(jetonRafraichissement, {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
            });
        } catch {
            throw new UnauthorizedException({
                message: 'Jeton de rafraîchissement invalide ou expiré',
                code_metier: 'JETON_INVALIDE',
            });
        }

        // Vérifier que le jeton existe en BDD et n'est pas révoqué
        const hashJeton = await bcrypt.hash(payload.jti, 4);
        const jetonEnBase = await this.prisma.jetons_rafraichissement.findFirst({
            where: {
                utilisateur_id: payload.sub,
                revoked_at: null,
                expires_at: { gt: new Date() },
            },
            orderBy: { created_at: 'desc' },
        });

        if (!jetonEnBase) {
            throw new UnauthorizedException({
                message: 'Jeton de rafraîchissement révoqué ou expiré',
                code_metier: 'JETON_REVOQUE',
            });
        }

        // Révoquer l'ancien jeton (rotation)
        await this.prisma.jetons_rafraichissement.update({
            where: { id: jetonEnBase.id },
            data: { revoked_at: new Date() },
        });

        // Générer un nouveau couple de jetons
        const nouveauxJetons = await this.genererJetons(payload.sub, payload.email, payload.role);

        this.logger.log(`Jeton rafraîchi pour l'utilisateur #${payload.sub}`);

        return {
            message: 'Jeton rafraîchi avec succès',
            donnees: nouveauxJetons,
        };
    }

    /**
     * Récupérer le profil de l'utilisateur courant
     */
    async profil(utilisateurId: number) {
        const utilisateur = await this.prisma.utilisateurs.findUnique({
            where: { id: utilisateurId },
            select: {
                id: true,
                nom_complet: true,
                email: true,
                telephone: true,
                role: true,
                est_actif: true,
                langue_preferee: true,
                created_at: true,
                updated_at: true,
            },
        });

        return {
            message: 'Profil récupéré avec succès',
            donnees: utilisateur,
        };
    }

    /**
     * Génère un couple access token + refresh token
     */
    private async genererJetons(utilisateurId: number, email: string, role: string) {
        const jti = uuidv4();

        const payload = { sub: utilisateurId, email, role };

        const jetonAcces = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_SECRET'),
            expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION', '15m'),
        });

        const jetonRafraichissement = this.jwtService.sign(
            { ...payload, jti },
            {
                secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
                expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION', '7d'),
            },
        );

        // Stocker le hash du refresh token en BDD
        const hashJeton = await bcrypt.hash(jti, 4);
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 7);

        await this.prisma.jetons_rafraichissement.create({
            data: {
                utilisateur_id: utilisateurId,
                jeton_hash: hashJeton,
                expires_at: expiresAt,
            },
        });

        return {
            jeton_acces: jetonAcces,
            jeton_rafraichissement: jetonRafraichissement,
        };
    }
}
