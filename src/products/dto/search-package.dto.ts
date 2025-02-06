import { ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsOptional } from "class-validator";
import { PageOptionsDto } from "src/common/pagination";

export class SearchProductDto extends PartialType(PageOptionsDto) {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsOptional()
  readonly category?: number = 0;

  @ApiPropertyOptional({
  })
  @Type(() => String)
  @IsOptional()
  readonly product?: string;

}


