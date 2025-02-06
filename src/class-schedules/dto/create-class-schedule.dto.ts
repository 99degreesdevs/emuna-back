
import { ApiProperty } from "@nestjs/swagger"; 
import { IsNumber, IsOptional, IsString, MaxLength, MinLength,  IsIn, IsBoolean, IsDate, Validate } from "class-validator";  
import { IsOnlyTime } from '../validators/IsOnlyTime';
import { Type } from "class-transformer";
import { IsFutureDateConstraint } from "src/motivational-quotes/helpers/constrains/is-future-date";

export class CreateClassScheduleDto {

  @ApiProperty({
    type: "date",
    description: "Date of Class Schedulee",
    example: "2024-08-25T05:25:00.021Z",
  })
  @Type(() => Date) 
  @IsDate( { message: "El campo classDateStart debe ser de tipo fecha" })
  @Validate(IsFutureDateConstraint, { message: "La fecha de inicio de clase  debe ser mayor a la fecha actual" })
  classDateStart: Date;

  @ApiProperty({
    type: "date",
    description: "Date of Class Schedulee",
    example: "2024-08-25T05:25:00.021Z",
  })
  @Type(() => Date) 
  @IsDate( { message: "El campo classDateEnd debe ser de tipo fecha" })
  @Validate(IsFutureDateConstraint, { message: "La fecha de fin de clase debe ser mayor a la fecha actual" })
  classDateEnd: Date;
  
  @ApiProperty({
    type: "string",
    description: "Name of the Class Schedule",
    example: "Clase de Pilates",
  })
  @IsString({ message: "El campo class debe ser de tipo string" })
  @MinLength(2, { message: "El campo class debe tener al menos 3 caracteres" })
  @MaxLength(50, {
    message: "El campo class debe tener como máximo 50 caracteres",
  })
  class: string;

  @ApiProperty({
    type: "string",
    description: "Description of the Class Schedule",
    example: "Clase de Pilates para principiantes",
  })
  @IsString({ message: "El campo description debe ser de tipo string" })
  @MinLength(3, {
    message: "El campo description debe tener al menos 3 caracteres",
  })
  @MaxLength(2000, {
    message: "El campo description debe tener como máximo 2000 caracteres",
  })
  description: string;

  @ApiProperty({
    type: "string",
    description: "Link de la clase",
    example: "https://www.google.com",
  })
  @IsString({ message: "El campo link debe ser string" })
  @MaxLength(80, {
    message: "El campo link no puede tener más de 80 caracteres",
  })
  @MinLength(3, {
    message: "El campo link no puede tener menos de 3 caracteres",
  })
  @IsOptional()
  link?: string;


  // @ApiProperty({
  //   type: "number",
  //   description: "Day of the Class Schedule",
  //   example: 1,
  // })
  // @IsNumber({}, { message: "El campo day debe ser de tipo numérico" })
  // @IsIn([1, 2, 3, 4, 5, 6, 7], {
  //   message: "El campo day debe ser un número entre 1 y 7",
  // })
  // day: number;

  @ApiProperty({
    type: "number",
    description: "Category of the Class Schedule",
    example: 1,
  })
  @IsNumber({}, { message: "El campo category debe ser de tipo numérico" })
  category: number;

  // @ApiProperty({
  //   type: "string",
  //   description: "Start time of the Class Schedule",
  //   example: "10:00",
  // })
  // @IsString({ message: "El campo scheduleStart debe ser de tipo string" })
  // @IsOnlyTime()
  // @IsOptional()
  // scheduleStart?: string;

  // @ApiProperty({
  //   type: "string",
  //   description: "End time of the Class Schedule",
  //   example: "11:00",
  // })
  // @IsString({ message: "El campo scheduleEnd debe ser de tipo string" })
  // @IsOnlyTime()
  // @IsOptional()
  // scheduleEnd?: string;

  @ApiProperty({
    type: "string",
    description: "Teacher of the Class Schedule",
    example: "Juan Perez",
  })
  @IsString({ message: "El campo teacher debe ser de tipo string" })
  @MinLength(3, {
    message: "El campo teacher debe tener al menos 3 caracteres",
  })
  @MaxLength(50, {
    message: "El campo teacher debe tener como máximo 50 caracteres",
  })
  teacher: string;

  @ApiProperty({
    type: "number",
    description: "Places available in the Class Schedule",
    example: 10,
  })
  @IsNumber({}, { message: "El campo places debe ser de tipo numérico" })
  @IsOptional()
  places: number;

  @ApiProperty({
    type: "boolean",
    description: "Status of the Class Schedule",
    example: 10,
  }) 
  @IsBoolean({ message: "El campo isActive debe ser de tipo booleano" })
  @IsOptional()
  isActive: boolean;
}



