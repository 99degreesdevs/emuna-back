

import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNumber, IsString, Matches, MaxLength, MinLength } from "class-validator";
export class CreateFiscalDto {
    @ApiProperty({
        type: 'string',
        description: 'Address user',
        example: 'Calle 123, Colonia Centro, CDMX'
    })
    @IsString({ message: 'El campo address debe ser de tipo string' })
    @MinLength(10, { message: 'El campo address debe tener al menos 10 caracteres' })
    @MaxLength(60, { message: 'El campo address debe tener como máximo 60 caracteres' })
    address: string;

    @ApiProperty({
        type: 'boolean',
        description: 'The user requires invoice',
        example: 'true'
    })
    @IsBoolean({ message: 'El campo invoice debe ser de tipo boolean' })
    invoice: boolean;

    @ApiProperty({
        type: 'string',
        description: 'RFC user',
        example: 'XAXX010101000'
    })
    @IsString({ message: 'El campo rfc debe ser de tipo string' })
    @Matches(/^[A-ZÑ&]{3,4}[0-9]{6}[A-Z0-9]{3}$/, {

        message:
            'El RFC debe tener 3 letras, 6 números y 3 caracteres alfanuméricos',
    })
    RFC: string;

    @ApiProperty({
        type: 'string',
        description: 'Razon social user',
        example: 'Mi empresa S.A. de C.V.'
    })

    @IsString({ message: 'El campo razonSocial debe ser de tipo string' })
    @MinLength(5, { message: 'El campo razonSocial debe tener al menos 5 caracteres' })
    @MaxLength(60, { message: 'El campo razonSocial debe tener como máximo 60 caracteres' })
    razonSocial: string;

    @ApiProperty({
        type: 'number',
        description: 'Regimen fiscal cRF',
        example: '601'
    })
    @IsNumber()
    cRF: number;

    @ApiProperty({
        type: 'string',
        description: 'Uso CFDI cUsoCFDI',
        example: 'G01'
    })
    @IsString()
    cUsoCFDI: string;


}
