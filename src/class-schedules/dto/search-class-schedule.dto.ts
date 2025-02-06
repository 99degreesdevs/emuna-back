import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { PageOptionsDto } from "src/common/pagination";

export class SearchClassScheduleDto extends PartialType(PageOptionsDto) {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsOptional()
  readonly category?: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsOptional()
  readonly day?: number = 0;

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Boolean)
  @IsOptional()
  readonly isActive?: boolean

  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Date)
  @IsOptional()
  readonly classDate?: Date
}


