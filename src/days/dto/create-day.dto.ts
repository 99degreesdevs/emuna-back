import { ApiProperty } from '@nestjs/swagger'; 
import {
  IsString,
  MaxLength,
  MinLength,
  IsOptional,
  IsBoolean
} from 'class-validator';

export class CreateDayDto {
  @ApiProperty({
    example: 'Lunes',
    description: 'Nombre del día',
  })
  @MinLength(2)
  @MaxLength(30)
  @IsString()
  @IsOptional()
  day: string;

  @ApiProperty({
    example: 'true',
    description: 'Estado del día',
  })
  @IsOptional()
  @IsBoolean()
  isActive: boolean;
}
