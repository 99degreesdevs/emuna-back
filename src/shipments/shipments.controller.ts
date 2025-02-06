import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { ShipmentsService } from "./shipments.service";
import { UpdateShipmentDto } from "./dto/update-shipment.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { TokenInterceptor } from "src/auth/interceptors/token/token.interceptor";
import { ValidRoles } from "src/auth/interfaces"; 
import { SearchShipmentDto } from "./dto/search-shipint.dto";
import { ParseUUIDPipe } from '@nestjs/common';

@Controller("shipments")
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @Get(":orderId")
  findAll(@Param("orderId", ParseUUIDPipe) orderId: string, @Query() pageOptionsDto: SearchShipmentDto) {
    return this.shipmentsService.findAll(pageOptionsDto, orderId);
  }

 

  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @Patch(":id")
  update(
    @Param("id") id: string,
    @Body() updateShipmentDto: UpdateShipmentDto
  ) {
    return this.shipmentsService.update(+id, updateShipmentDto);
  }

  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @Delete(":id")
  remove(@Param("id") id: string) {
    return this.shipmentsService.remove(+id);
  }
}
