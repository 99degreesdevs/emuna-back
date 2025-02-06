import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsString, MaxLength, MinLength } from "class-validator";

export class CreateUsoCfdiDto {
    @ApiProperty({
        type:  'string',
        description: 'cUsoCFDI',
        example: 'CN01'
      })      
      @IsString({message: 'El campo cUsoCFDI debe ser de tipo string'})
      cUsoCFDI: string;

      @ApiProperty({
        type: 'string',
        description: 'La descripción del uso del CFDI',
        example: 'General de Ley Personas Morales'
      })
      @IsString({message: 'El campo description debe ser de tipo string'})
      @MinLength(2, {message: 'El campo description debe tener al menos 2 caracteres'})
      @MaxLength(60, {message: 'Honorarios médicos, dentales y gastos hospitalarios.'}) 
      description: string;


      @ApiProperty({
        type: 'boolean',
        description: 'Persona Física',
        example: 'true'
      })
      @IsBoolean({message: 'El campo personaFisica debe ser de tipo booleano'})
      fisica: boolean;


      @ApiProperty({
        type: 'boolean',
        description: 'Persona Moral',
        example: 'true'
      })
      @IsBoolean({message: 'El campo personaFisica debe ser de tipo booleano'})
      moral: boolean;
}
