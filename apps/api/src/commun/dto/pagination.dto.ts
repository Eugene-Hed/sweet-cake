import { IsOptional, IsInt, Min, Max, IsString, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class PaginationDto {
    @ApiPropertyOptional({ description: 'Numéro de page', default: 1, minimum: 1 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    page?: number = 1;

    @ApiPropertyOptional({ description: 'Nombre d\'éléments par page', default: 20, minimum: 1, maximum: 100 })
    @IsOptional()
    @Type(() => Number)
    @IsInt()
    @Min(1)
    @Max(100)
    limite?: number = 20;

    @ApiPropertyOptional({ description: 'Champ de tri' })
    @IsOptional()
    @IsString()
    tri?: string = 'created_at';

    @ApiPropertyOptional({ description: 'Ordre de tri', enum: ['asc', 'desc'], default: 'desc' })
    @IsOptional()
    @IsIn(['asc', 'desc'])
    ordre?: 'asc' | 'desc' = 'desc';

    @ApiPropertyOptional({ description: 'Terme de recherche' })
    @IsOptional()
    @IsString()
    recherche?: string;
}
