import { IsOptional, IsString, IsBoolean, IsIn } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class MettreAJourUtilisateurDto {
    @ApiPropertyOptional({ description: 'Nom complet' })
    @IsOptional()
    @IsString()
    nom_complet?: string;

    @ApiPropertyOptional({ description: 'Téléphone' })
    @IsOptional()
    @IsString()
    telephone?: string;

    @ApiPropertyOptional({ description: 'Langue préférée', enum: ['fr', 'en'] })
    @IsOptional()
    @IsIn(['fr', 'en'])
    langue_preferee?: string;
}

export class ChangerStatutUtilisateurDto {
    @ApiPropertyOptional({ description: 'Activer ou désactiver l\'utilisateur' })
    @IsBoolean()
    est_actif: boolean;
}

export class ChangerRoleUtilisateurDto {
    @ApiPropertyOptional({ description: 'Nouveau rôle', enum: ['client', 'administrateur'] })
    @IsIn(['client', 'administrateur'])
    role: string;
}
