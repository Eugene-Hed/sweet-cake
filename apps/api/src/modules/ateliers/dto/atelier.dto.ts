import { IsNotEmpty, IsString, IsOptional, IsInt, IsNumber, IsDateString, Min, MaxLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreerAtelierDto {
    @ApiProperty({ example: 'Atelier macarons' })
    @IsNotEmpty()
    @IsString()
    @MaxLength(255)
    titre: string;

    @ApiPropertyOptional()
    @IsOptional()
    @IsString()
    description?: string;

    @ApiProperty({ example: '2026-04-15' })
    @IsNotEmpty()
    @IsDateString()
    date_atelier: string;

    @ApiProperty({ example: '14:00' })
    @IsNotEmpty()
    @IsString()
    heure_debut: string;

    @ApiProperty({ example: '17:00' })
    @IsNotEmpty()
    @IsString()
    heure_fin: string;

    @ApiProperty({ example: 10 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    capacite: number;

    @ApiProperty({ example: 75.00 })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber({ maxDecimalPlaces: 2 })
    @Min(0)
    prix: number;
}

export class MettreAJourAtelierDto {
    @ApiPropertyOptional() @IsOptional() @IsString() @MaxLength(255) titre?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
    @ApiPropertyOptional() @IsOptional() @IsDateString() date_atelier?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() heure_debut?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() heure_fin?: string;
    @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1) capacite?: number;
    @ApiPropertyOptional() @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) prix?: number;
    @ApiPropertyOptional({ enum: ['planifie', 'complet', 'termine', 'annule'] })
    @IsOptional() @IsString() statut?: string;
}
