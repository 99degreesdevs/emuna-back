import { ApiProperty } from "@nestjs/swagger";
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsPositive,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength, 
  ValidateIf,
  ValidateNested,
} from "class-validator";

import { ProductCat } from "../interfaces/products-category.enum";
import { Type } from "class-transformer";
import { PackageCustomDto } from "./create-package.dto";
import { IsUniqueCategory } from "../Decorators/unique-category.decorator";

export class CreateProductDto {
  @ApiProperty({
    type: "string",
    description: "Nombre del producto o servicio",
    example: "Asesoramiento en marketing digital",
  })
  @IsString({ message: "El campo product debe ser de tipo string" })
  product: string;

  @ApiProperty({
    type: "number",
    description: "Categoría del producto o servicio",
    example: "1, 2",
  })
  @IsNumber({}, { message: "El tipo de categoría debe ser un número" })
  @Min(1, { message: "El tipo de categoría debe ser mayor a 0" })
  category: number;

  @ApiProperty({
    type: "string",
    description: "Descripción del producto o servicio",
    example: "producto, servicio",
  })
  @IsString({ message: "El tipo de descripción debe ser string" })
  @MaxLength(500, {
    message: "La descripción no puede tener más de 500 caracteres",
  })
  @MinLength(3, {
    message: "La descripción no puede tener menos de 3 caracteres",
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    type: "string",
    description: "Detalles del producto o servicio",
    example: "producto, servicio",
  })
  @IsString({ message: "El tipo detalles debe ser string" })
  @MaxLength(2000, {
    message: "El campo detalles no puede tener más de 2000 caracteres",
  })
  @MinLength(3, {
    message: "El campo detalles no puede tener menos de 3 caracteres",
  })
  @IsOptional()
  details?: string;

  @ApiProperty({
    type: "string",
    description: "Link del producto o servicio",
    example: "https://www.google.com",
  })
  @IsString({ message: "El tipo link debe ser string" })
  @MaxLength(200, {
    message: "El campo link no puede tener más de 80 caracteres",
  })
  @MinLength(3, {
    message: "El campo link no puede tener menos de 3 caracteres",
  })
  @IsOptional()
  link?: string;


  @ApiProperty({
    type: "number",
    description: "Cantidad del producto (solo para productos)",
    example: "25",
  })
  @ValidateIf((o) => o.category === ProductCat.PRODUCT)
  @IsNotEmpty({ message: "El campo stockQuantity (stock) es obligatorio para productos" })
  @IsNumber(
    { allowNaN: false, allowInfinity: false },
    { message: "El campo stockQuantity debe ser un número" }
  )
  @Min(0, { message: "El campo stockQuantity no puede ser menor a 0" })
  @Max(1000, { message: "El campo stockQuantity no puede ser mayor a 1000" })
  stockQuantity?: number;

  @ApiProperty({
    type: "string",
    description: "Precio del producto o servicio",
    example: "200.00",
  })
  @IsNotEmpty({ message: "El campo price no puede estar vacío." })
  @IsNumberString({}, { message: "El monto debe ser un número" })
  @Matches(/^\d+(\.\d{1,2})?$/, {
    message: "El monto debe tener hasta dos decimales. Ejemplo: 100.75",
  })
  price: string;

  @ApiProperty({
    type: "number",
    description: "Descuento del producto o servicio en porcentaje",
    example: "15",
  })
  @IsNumber({}, { message: "El campo discount debe ser de tipo number" }) 
  @Min(0, { message: "El campo discount no puede ser menor a 0" })
  @Max(100, { message: "El campo discount no puede ser mayor a 100" })
  @IsOptional()
  discount?: number;

  @ValidateIf((o) => o.category === ProductCat.PACKAGE)
  @ApiProperty({
    type: "Array",
    description: "Lista de servicios o clases",
    example: "[{category: 1, amount: 2}, {category: 2, amount: 1}]",
  })
  @IsArray({ message: "La lista de productos debe ser un arreglo" })
  @IsNotEmpty({
    message:
      "La lista de productos es obligatoria para la creación de un paquete.",
  })
  @ValidateNested({ each: true }) 
  @Type(() => PackageCustomDto)  
  @IsUniqueCategory() 

  packageCustom?: PackageCustomDto[];
}
