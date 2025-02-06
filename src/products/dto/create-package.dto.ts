import { ApiProperty } from "@nestjs/swagger";
import {
  IsIn,
  IsNotEmpty,
  IsNumber,
  Validate,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { ProductCat } from "../interfaces/products-category.enum";

@ValidatorConstraint({ name: "IsNotCategory", async: false })
class IsNotCategory implements ValidatorConstraintInterface {
  validate(value: number) {
    return (
      value !== ProductCat.PRODUCT &&
      value !== ProductCat.PACKAGE &&
      value !== ProductCat.SERVICE
    );
  }

  defaultMessage() {
    return `: El campo category debe ser diferente de servicio, producto y/o paquete.`;
  }
}

export class PackageCustomDto {
  @ApiProperty({
    type: "number",
    description: "Categoría del producto o servicio para el paquete",
    example: "1, 2",
  })
  @IsNotEmpty({ message: "El campo category no puede estar vacío." })
  @IsIn(Object.values(ProductCat), { message: "La categoria no existe." })
  @Validate(IsNotCategory)
  category: ProductCat;

  @ApiProperty({
    type: "number",
    description: "Cantidad del producto o servicio",
    example: "1, 2, ...n, 100",
  })
  @IsNotEmpty({ message: "El campo amount es obligatorio" })
  @IsNumber({}, { message: "El campo amount debe ser un número" })
  amount: number;
}
