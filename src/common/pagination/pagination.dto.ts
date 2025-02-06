import { Type } from 'class-transformer';
import { IsIn, IsNumber, IsNumberString, Max, Min } from 'class-validator';

export class PaginationDTO {
  @IsNumberString()
  @IsIn(['2', '5', '10', '15', '20', '25', '30'])
  limit: number;

  @IsNumber()
  @Min(0, { message: 'El valor mínimo de la paginación es 0' })
  @Max(1000, { message: 'El valor máximo de la paginación es 100' })
  @Type(() => Number)
  page: number;
}
