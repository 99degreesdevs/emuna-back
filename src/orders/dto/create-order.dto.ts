import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsUUID,
  IsNumberString,
  Matches,
  IsArray,
  Min,
  IsOptional,
  Max,
  IsInt,
  ValidateNested,
  IsPositive,
} from "class-validator";

class ProductDto {
  @IsNotEmpty({ message: "El SKU es obligatorio" })
  @IsUUID("all", { message: "El SKU debe ser de tipo UUID válido" })
  sku: string;

  @IsNotEmpty({ message: "La cantidad es obligatoria" })
  @IsNumber({}, { message: "La cantidad debe ser un número" })
  amount: number;

  @IsOptional()
  @IsString({ message: "El nombre del producto debe ser una cadena" })
  product?: string;

  @IsOptional()
  @IsNumberString({}, { message: "El monto debe ser un número" })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: "El monto debe tener hasta dos decimales. Ejem.: 100.75",
  })
  price?: string;

  @IsOptional()
  @IsNumberString({}, { message: "El discount debe ser un número" })
  @IsInt({ message: "El discount debe ser un número entero" })
  @Min(0, { message: "El campo discount no puede ser menor a 0" })
  @Max(100, { message: "El campo discount no puede ser mayor a 100" })
  discount?: string;
}

export class CreateOrderDto {

  @IsPositive({ message: "El id de la dirección debe ser un número positivo" })
  @IsOptional()
  @IsNumber({}, { message: "El id de la dirección debe ser un número" })
  addressId?: number;

  @ApiProperty({
    type: [ProductDto],
    description: "Lista de productos a ordenar",
  })
  @IsArray({ message: "Los productos deben ser un arreglo" })
  @IsNotEmpty({ message: "La lista de productos es obligatoria para formar un paquete." })
  @ValidateNested({ each: true }) // Valida cada elemento del array
  @Type(() => ProductDto) // Indica que cada elemento es del tipo ProductDto
  products: ProductDto[];
}
