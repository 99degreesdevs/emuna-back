import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsOptional, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { IsFutureDateConstraint } from "../helpers/constrains/is-future-date";


export class CreateMotivationalQuoteDto {
  @ApiProperty({
    type: "string",
    description: "title",
    example: "Motivational Quote Title",
  })
  @IsString({ message: "El campo title debe ser de tipo string" })
  title: string;

  @ApiProperty({
    type: "string",
    description: "Body of the Motivational Quote",
    example: "Quien madruga, Dios lo ayuda",
  })
  @IsString({ message: "El campo quote debe ser de tipo string" })
  @MinLength(2, { message: "El campo quote debe tener al menos 3 caracteres" })
  @MaxLength(600, {
    message: "El campo quote debe tener como máximo 600 caracteres",
  })
  quote: string;

  @ApiProperty({
    type: "date",
    description: "Publication date of the Motivational Quote",
    example: "2024-08-25T05:25:00.021Z",
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate( { message: "El campo publicationDate debe ser de tipo fecha" })
  @Validate(IsFutureDateConstraint, { message: "La fecha de publicación debe ser igual o mayor a la fecha actual" })
  publicationDate?: Date;
}


