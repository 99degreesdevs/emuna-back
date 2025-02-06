import { ApiProperty, PartialType } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  IsOptional,
  IsArray,
  IsDateString,
  IsIn, 
} from 'class-validator';
import { CreateFiscalDto } from 'src/fiscal/dto/create-fiscal.dto';
export class CreateUserDto extends CreateFiscalDto {


  @ApiProperty({
    example: 'name@email.com',
    type: 'string',
    description: 'The email address of the user. When pudate user, the email not change.',

  }) 
  @IsString()
  @IsEmail({}, { message: 'El email debe ser un email válido' })
  email: string;

  @ApiProperty({
    type: 'string',
    description: 'The name of the user.',
  })
  @IsString()
  @MinLength(2, { message: 'El nombre debe tener por lo menos 2 caracteres' })
  @MaxLength(50, { message: 'El nombre debe tener máximo 50 caracteres' })
  name: string;

  @ApiProperty({
    type: 'string',
    description: 'The name of the user.',
  })
  @IsDateString({}, { message: 'La fecha de nacimiento debe ser una fecha válida' })
  born: string;

  @ApiProperty({
    type: 'string',
    description: 'The phone number of the user.',
  })
  @Matches(/^\+52\d{10}$/, {
    message: 'El número de teléfono debe estar en formato internacional +52 seguido de 10 dígitos.',
  }) 
  phone: number;

  @ApiProperty({
    example: 'Adfad123$',
    description: 'The password for the user´s account.',
  })
  @IsString( { message: 'El password debe ser un string' })
  @MinLength(6, { message: 'El password debe tener por lo menos 6 caracteres' })
  @MaxLength(30, { message: 'El password debe tener máximo 30 caracteres' })
  @Matches(/(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'El password debe tener por lo menos una letra mayúscula, una letra minúscula y un número',
  })
  password: string;

  @ApiProperty({
    type: 'file',
    description: 'The avatar of the user (image)',
  }) 
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiProperty({
    example: 'admin, master, user',
    description: 'The roles of the user.',
  })
  @IsArray()
  @IsOptional()
  @IsIn(['admin', 'master', 'user'], { each: true, message: 'El rol de usuario debe de ser: admin, master o user' }, )
  roles?: string[];
}
