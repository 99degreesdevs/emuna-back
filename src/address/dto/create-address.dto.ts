import { ApiProperty } from "@nestjs/swagger";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from "class-validator";

export class CreateAddressDto {
  @ApiProperty({
    type: String,
    description: "User ID associated with the address.",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @IsString({ message: "User ID must be a string." })
  @IsOptional()
  userId?: string;

  @ApiProperty({
    type: String,
    description: "Street name for the address.",
    example: "Main St.",
  })
  @IsString({ message: "Street must be a string." })
  @IsNotEmpty({ message: "Street is required." })
  street: string;

  @ApiProperty({
    type: String,
    description: "External number of the property.",
    example: "123A",
  })
  @IsString({ message: "External number must be a string." })
  @IsNotEmpty({ message: "External number is required." })
  externalNumber: string;

  @ApiProperty({
    type: String,
    description: "Internal number or apartment number of the property.",
    example: "B1",
    required: false,
  })
  @IsString({ message: "Internal number must be a string." })
  @IsOptional()
  internalNumber?: string;

  @ApiProperty({
    type: String,
    description: "Postal code of the address location.",
    example: "90210",
  })
  @IsString({ message: "Postal code must be a string." })
  @IsNotEmpty({ message: "Postal code is required." })
  @Length(5, 5, { message: "Postal code must be 5 characters long." })
  postalCode: string;

  @ApiProperty({
    type: String,
    description: "Type of property (e.g., apartment, house).",
    example: "Apartment",
    required: false,
  })
  @IsString({ message: "Property type must be a string." })
  @IsOptional()
  propertyType?: string;

  @ApiProperty({
    type: String,
    description: "Additional notes or references for locating the property.",
    example: "The house with the red door.",
    required: false,
  })
  @IsString({ message: "Notes must be a string." })
  @IsOptional()
  notes?: string;

  @ApiProperty({
    type: Boolean,
    description:
      "Indicates if this address is the default address for the user.",
    example: true,
    required: false,
  })
  @IsBoolean({ message: "isDefault must be a boolean value." })
  @IsOptional()
  isDefault?: boolean;
}
