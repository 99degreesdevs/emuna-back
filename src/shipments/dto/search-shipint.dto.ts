import { PartialType } from "@nestjs/swagger";
import { IsIn, IsOptional } from "class-validator";
import { PageOptionsDto } from "src/common/pagination";
import { ShipmentStatus } from "../interfaces/status-shipment.enum";

export class SearchShipmentDto extends PartialType(PageOptionsDto) {
  @IsOptional()
  @IsIn(Object.values(ShipmentStatus), {
    message: `status must be either ${Object.values(ShipmentStatus).join(", ")}.`,
  })
  readonly status?: string;
}
