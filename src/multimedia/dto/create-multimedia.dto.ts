import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsDate, IsIn, IsOptional, IsString, MaxLength, MinLength, Validate } from "class-validator";
import { IsOnlyTime } from "src/class-schedules/validators/IsOnlyTime";
import { IsFutureDateConstraint } from "src/motivational-quotes/helpers/constrains/is-future-date";

export class CreateMultimediaDto {
  @ApiProperty({
    type: "string",
    description: "title",
    example: "Title of Video or Audio",
  })
  @IsString({ message: "El campo title debe ser de tipo string" })
  title: string;

  @ApiProperty({
    type: "string",
    description: "Type of Multimedia",
    example: "video, video",
  })
  @IsString({ message: "El medio debe ser de tipo string" })
  @IsIn(["video", "audio"], {
    message: "El campo medio debe ser 'video' o 'audio'",
  })
  medio: string;

  @ApiProperty({
    type: "string",
    description: "Duration of Multimedia",
    example: "11:00",
  })
  @IsString({ message: "El campo duration debe ser de tipo string" })
  @IsOnlyTime()
  @IsOptional()
  duration: string;

  @ApiProperty({
    type: "date",
    description: "Publication date of Multimedia",
    example: "2024-08-25T05:25:00.021Z",
  })
  @Type(() => Date)
  @IsOptional()
  @IsDate({ message: "El campo publicationDate debe ser de tipo fecha" })
  @Validate(IsFutureDateConstraint, {
    message: "La fecha de publicación debe ser igual o mayor a la fecha actual",
  })
  publicationDate?: Date;

  @ApiProperty({
    type: "string",
    description: "Link of Multimedia",
    example: "https://www.youtube.com/watch?v=7rmTlyJSrPE",
  })
  @IsString({ message: "El link debe ser de tipo string" })
  link: string;
}
