import { ApiProperty } from "@nestjs/swagger";
import { IsString, MaxLength, MinLength } from "class-validator";

export class CreateClassScheduleCatDto {
    @ApiProperty({
        type: "string",
        description: "Name of the Category",
        example: "Clase de Pilates",
      })
      @IsString({ message: "El campo category debe ser de tipo string" })
      @MinLength(2, { message: "El campo category debe tener al menos 3 caracteres" })
      @MaxLength(30, {
        message: "El campo category debe tener como máximo 30 caracteres",
      })
      category: string;

      @ApiProperty({
        type: "string",
        description: "description of the Category",
        example: "clase de entretamiento para niños",
      })
      @IsString({ message: "El campo description debe ser de tipo string" })
      @MinLength(5, { message: "El campo description debe tener al menos 5 caracteres" })
      @MaxLength(2000, { message: "El campo description debe tener como máximo 2000 caracteres" })
      description: string;

      @ApiProperty({
        type: "string",
        description: "Link of the Category",
        example: "https://www.google.com",
      })
      @IsString({ message: "El campo link debe ser de tipo string" })
      @MinLength(5, { message: "El campo link debe tener al menos 5 caracteres" })
      @MaxLength(255, { message: "El campo link debe tener como máximo 255 caracteres" })
      link: string;
}
