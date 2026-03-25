import { IsNotEmpty, IsString, IsOptional, IsNumber, IsInt, IsEnum, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreerArticleStockDto {
    @ApiProperty({ example: 'Farine T55' })
    @IsNotEmpty() @IsString() @MaxLength(255) nom: string;

    @ApiProperty({ example: 'kg' })
    @IsNotEmpty() @IsString() @MaxLength(50) unite: string;

    @ApiPropertyOptional({ example: 50 })
    @IsOptional() @Type(() => Number) @IsNumber() @Min(0) quantite?: number;

    @ApiPropertyOptional({ example: 10 })
    @IsOptional() @Type(() => Number) @IsNumber() @Min(0) seuil_minimal?: number;
}

export class MettreAJourArticleStockDto {
    @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255) nom?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(50) unite?: string;
    @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber() @Min(0) seuil_minimal?: number;
}

export class CreerMouvementStockDto {
    @ApiProperty({ enum: ['entree', 'sortie', 'ajustement'] })
    @IsNotEmpty() @IsEnum(['entree', 'sortie', 'ajustement']) type_mouvement: string;

    @ApiProperty({ example: 25 })
    @IsNotEmpty() @Type(() => Number) @IsNumber() @Min(0.001) quantite: number;

    @ApiPropertyOptional({ example: 'Livraison fournisseur' })
    @IsOptional() @IsString() raison?: string;
}
