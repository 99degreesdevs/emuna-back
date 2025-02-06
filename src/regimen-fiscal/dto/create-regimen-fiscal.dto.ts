import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString, MaxLength, MinLength } from "class-validator";

export class CreateRegimenFiscalDto {
    @ApiProperty({
        type:  'number',
        description: 'c_RegimenFiscal',
        example: '601'
      })
      @IsNumber({}, {message: 'El campo c_RegimenFiscal debe ser de tipo numérico y corresponder al catálogo del SAT'}) 
      cRF: number;

      @ApiProperty({
        type: 'string',
        description: 'Descripción del Regimen Fiscal',
        example: 'General de Ley Personas Morales'
      })
      @IsString({message: 'El campo description debe ser de tipo string'})
      @MinLength(2, {message: 'El campo description debe tener al menos 2 caracteres'})
      @MaxLength(60, {message: 'El campo description debe tener como máximo 60 caracteres'}) 
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
