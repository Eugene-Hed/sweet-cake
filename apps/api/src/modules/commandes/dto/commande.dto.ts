import { IsNotEmpty, IsOptional, IsString, IsEnum, IsArray, ValidateNested, IsInt, IsNumber, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LigneCommandeDto {
    @ApiProperty({ description: 'ID du produit', example: 1 })
    @IsNotEmpty()
    @IsInt()
    produit_id: number;

    @ApiProperty({ description: 'Quantité', example: 2 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    quantite: number;
}

export class CreerCommandeDto {
    @ApiProperty({ description: 'Type de commande', enum: ['retrait', 'livraison'] })
    @IsNotEmpty()
    @IsEnum(['retrait', 'livraison'], { message: 'Le type de commande doit être retrait ou livraison' })
    type_commande: string;

    @ApiPropertyOptional({ description: 'Date planifiée', example: '2026-04-01T10:00:00Z' })
    @IsOptional()
    @IsDateString()
    planifiee_pour?: string;

    @ApiPropertyOptional({ description: 'Notes' })
    @IsOptional()
    @IsString()
    notes?: string;

    @ApiProperty({ description: 'Lignes de commande', type: [LigneCommandeDto] })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => LigneCommandeDto)
    lignes: LigneCommandeDto[];
}

export class ChangerStatutCommandeDto {
    @ApiProperty({
        description: 'Nouveau statut',
        enum: ['en_attente', 'confirmee', 'en_preparation', 'prete', 'terminee', 'annulee'],
    })
    @IsNotEmpty()
    @IsEnum(['en_attente', 'confirmee', 'en_preparation', 'prete', 'terminee', 'annulee'])
    statut: string;

    @ApiPropertyOptional({ description: 'Note de changement de statut' })
    @IsOptional()
    @IsString()
    note?: string;
}
