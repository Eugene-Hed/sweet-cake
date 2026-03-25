import { IsNotEmpty, IsInt, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreerReservationDto {
    @ApiProperty({ description: 'Nombre de places', example: 2 })
    @IsNotEmpty()
    @IsInt()
    @Min(1)
    nombre_places: number;
}
