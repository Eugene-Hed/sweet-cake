import { IsNotEmpty, IsString, IsNumber, IsOptional, IsBoolean, IsInt, MaxLength, Min, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '../../../commun/dto/pagination.dto';

export class OptionProduitDto {
    @ApiPropertyOptional({ description: 'ID de l\'option (pour mise à jour)', example: 1 })
    @IsOptional()
    @IsInt()
    id?: number;

    @ApiProperty({ description: 'Nom de l\'option', example: 'Parfum' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    nom: string;

    @ApiProperty({ description: 'Valeurs possibles (séparées par des virgules)', example: 'Chocolat, Vanille, Fraise' })
    @IsNotEmpty()
    @IsString()
    valeurs: string;

    @ApiPropertyOptional({ description: 'Est obligatoire', example: false })
    @IsOptional()
    @IsBoolean()
    est_obligatoire?: boolean;
}

export class CreerProduitDto {
    @ApiProperty({ description: 'ID de la catégorie', example: 1 })
    @IsNotEmpty()
    @IsInt()
    categorie_id: number;

    @ApiProperty({ description: 'Nom du produit', example: 'Croissant au beurre' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    nom: string;

    @ApiPropertyOptional({ description: 'Description' })
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ description: 'Prix en euros', example: 2.50 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    prix: number;

    @ApiPropertyOptional({ description: 'URL de l\'image' })
    @IsOptional()
    @IsString()
    @MaxLength(500)
    image_url?: string;

    @ApiPropertyOptional({ description: 'Est disponible en stock' })
    @IsOptional()
    @IsBoolean()
    est_disponible?: boolean;

    @ApiPropertyOptional({ description: 'Est affiché sur le catalogue' })
    @IsOptional()
    @IsBoolean()
    est_actif?: boolean;

    @ApiPropertyOptional({ description: 'Options de personnalisation', type: [OptionProduitDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionProduitDto)
    options?: OptionProduitDto[];
}

export class MettreAJourProduitDto {
    @ApiPropertyOptional()
    @IsOptional()
    @IsInt()
    categorie_id?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    @MaxLength(255)
    nom?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    prix?: number;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    image_url?: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    est_disponible?: boolean;

    @ApiPropertyOptional()
    @IsOptional()
    @IsBoolean()
    est_actif?: boolean;

    @ApiPropertyOptional({ description: 'Options de personnalisation', type: [OptionProduitDto] })
    @IsOptional()
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => OptionProduitDto)
    options?: OptionProduitDto[];
}

export class FiltreProduitsDto extends PaginationDto {
    @ApiPropertyOptional({ description: 'ID de la catégorie' })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    categorie_id?: number;

    @ApiPropertyOptional({ description: 'Produits disponibles uniquement' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    est_disponible?: boolean;

    @ApiPropertyOptional({ description: 'Produits actifs uniquement' })
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    est_actif?: boolean;

    @ApiPropertyOptional({ description: 'Prix minimum' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    prix_min?: number;

    @ApiPropertyOptional({ description: 'Prix maximum' })
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    prix_max?: number;
}
