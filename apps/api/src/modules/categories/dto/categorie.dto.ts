import { IsNotEmpty, IsString, IsOptional, IsBoolean, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreerCategorieDto {
    @ApiProperty({ description: 'Nom de la catégorie', example: 'Viennoiseries' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    nom: string;

    @ApiPropertyOptional({ description: 'Description' })
    @IsOptional()
    @IsString()
    description?: string;
}

export class MettreAJourCategorieDto {
    @ApiPropertyOptional({ description: 'Nom' })
    @IsOptional()
    @IsString()
    @MaxLength(255)
    nom?: string;

    @ApiPropertyOptional({ description: 'Description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional({ description: 'Catégorie active' })
    @IsOptional()
    @IsBoolean()
    est_active?: boolean;
}
