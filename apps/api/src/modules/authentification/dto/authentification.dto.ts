import { IsEmail, IsNotEmpty, IsString, MinLength, MaxLength, Matches, IsOptional, IsIn } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class InscriptionDto {
    @ApiProperty({ description: 'Nom complet', example: 'Marie Dupont' })
    @IsNotEmpty({ message: 'Le nom complet est requis' })
    @IsString()
    @MinLength(2)
    @MaxLength(255)
    nom_complet: string;

    @ApiProperty({ description: 'Adresse email', example: 'marie@example.com' })
    @IsNotEmpty({ message: 'L\'email est requis' })
    @IsEmail({}, { message: 'Format d\'email invalide' })
    email: string;

    @ApiProperty({ description: 'Mot de passe (min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre)', example: 'MotDePasse1' })
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    @IsString()
    @MinLength(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
    @MaxLength(128)
    @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
        message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule et un chiffre',
    })
    mot_de_passe: string;

    @ApiPropertyOptional({ description: 'Numéro de téléphone', example: '+33612345678' })
    @IsOptional()
    @IsString()
    @MaxLength(20)
    telephone?: string;

    @ApiPropertyOptional({ description: 'Langue préférée', enum: ['fr', 'en'], default: 'fr' })
    @IsOptional()
    @IsIn(['fr', 'en'])
    langue_preferee?: string = 'fr';
}

export class ConnexionDto {
    @ApiProperty({ description: 'Adresse email', example: 'admin@sweet-cake.fr' })
    @IsNotEmpty({ message: 'L\'email est requis' })
    @IsEmail({}, { message: 'Format d\'email invalide' })
    email: string;

    @ApiProperty({ description: 'Mot de passe', example: 'MotDePasse1' })
    @IsNotEmpty({ message: 'Le mot de passe est requis' })
    @IsString()
    mot_de_passe: string;
}

export class RafraichirJetonDto {
    @ApiProperty({ description: 'Jeton de rafraîchissement' })
    @IsNotEmpty({ message: 'Le jeton de rafraîchissement est requis' })
    @IsString()
    jeton_rafraichissement: string;
}
