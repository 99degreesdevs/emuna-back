import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { RegimenFiscalService } from './regimen-fiscal.service';
import { CreateRegimenFiscalDto } from './dto/create-regimen-fiscal.dto';
import { UpdateRegimenFiscalDto } from './dto/update-regimen-fiscal.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags, ApiParam } from '@nestjs/swagger';
import { ValidRoles } from 'src/auth/interfaces';
import { TokenInterceptor } from 'src/auth/interceptors/token/token.interceptor';

@Controller('regimen-fiscal')
@ApiTags('Regimen Fiscal')
@ApiBearerAuth()
export class RegimenFiscalController {

  constructor(private readonly regimenFiscalService: RegimenFiscalService) { }

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Create Regimen Fiscal',
    description: 'Creates a new Regimen Fiscal entry in the database.'
  })
  @ApiResponse({
    status: 201,
    description: 'Regimen Fiscal created successfully.',
    schema: {
      example: {
        "message": "Regimen fiscal creado exitosamente",
        "regimenFiscal": {
          "createdAt": "2024-08-25T05:25:00.021Z",
          "cRF": 632,
          "description": "General de Ley Personas Morales..asdfa",
          "fisica": false,
          "moral": true,
          "updatedAt": "2024-08-25T05:25:00.013Z",
          "deletedAt": null
        }
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid DTO or missing required fields.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the creation process.',
  })
  create(@Body() createRegimenFiscalDto: CreateRegimenFiscalDto) {
    return this.regimenFiscalService.create(createRegimenFiscalDto);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Get All Regimen Fiscales',
    description: 'Retrieves a list of all Regimen Fiscales in the system.'
  })
  @ApiResponse({
    status: 200,
    description: 'List of Regimen Fiscales retrieved successfully.',
    schema: {
      example: {
        "response": {
          "message": "Se obtuvieron 19 regimenes fiscales exitosamente.",
          "total": 19,
          "regimenFiscales": [
            {
              "cRF": 601,
              "description": "General de Ley Personas Morales",
              "fisica": false,
              "moral": true
            }]
        }
      }
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: No Regimen Fiscales found in the database.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred while retrieving the data.',
  })
  findAll() {
    return this.regimenFiscalService.findAll();
  }

  @Get(':cRF')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Get Regimen Fiscal by cRF',
    description: 'Retrieves a Regimen Fiscal entry based on its unique identifier (cRF).'
  })
  @ApiParam({
    name: 'cRF',
    description: 'The unique identifier for the Regimen Fiscal.',
    example: '1234',
  })
  @ApiResponse({
    status: 200,
    description: 'Regimen Fiscal retrieved successfully.',
    schema: {
      example: {
        "response": {
          "message": "Se obtuvo el regimen fiscal con el 601 exitosamente.",
          "regimenFiscal": {
            "cRF": 601,
            "description": "General de Ley Personas Morales",
            "fisica": false,
            "moral": true
          }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjQ2MTE2ODEsImV4cCI6MTcyNDY0MDQ4MX0.BA8Fil1EGcMleyli23e6gFC2Q2HF3Y1zptA0ZAc4uPU"
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Regimen Fiscal with the specified cRF not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred while retrieving the data.',
  })
  findOne(@Param('cRF') cRF: string) {
    return this.regimenFiscalService.findOne(+cRF);
  }

  @Patch(':cRF')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Update Regimen Fiscal by cRF',
    description: 'Updates an existing Regimen Fiscal entry based on its unique identifier (cRF).'
  })
  @ApiParam({
    name: 'cRF',
    description: 'The unique identifier for the Regimen Fiscal to be updated.',
    example: '1234',
  })
  @ApiResponse({
    status: 200,
    description: 'Regimen Fiscal updated successfully.',
    schema: {
      example: {
        "message": "Se actualizó el regimen fiscal con el 632 exitosamente.",
        "regimenFiscal": {
          "cRF": 632,
          "createdAt": "2024-08-25T05:25:00.021Z",
          "updatedAt": "2024-08-25T05:33:45.561Z",
          "description": "General de Ley Personas Morales",
          "fisica": true,
          "moral": true
        }
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid DTO or missing required fields.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Regimen Fiscal with the specified cRF not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the update process.',
  })
  update(@Param('cRF') cRF: string, @Body() updateRegimenFiscalDto: UpdateRegimenFiscalDto) {
    return this.regimenFiscalService.update(+cRF, updateRegimenFiscalDto);
  }

  @Delete(':cRF')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Delete Regimen Fiscal by cRF',
    description: 'Deletes a Regimen Fiscal entry based on its unique identifier (cRF).'
  })
  @ApiParam({
    name: 'cRF',
    description: 'The unique identifier for the Regimen Fiscal to be deleted.',
    example: '1234',
  })
  @ApiResponse({
    status: 200,
    description: 'Regimen Fiscal deleted successfully.',
    schema: {
      example: {
        "response": {
          "message": "Se eliminó correctamente el Regimen Fiscal con el id 601"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjQ2MTE3MzAsImV4cCI6MTcyNDY0MDUzMH0.odUUuYdUOaYvmiCXkOIRnzKlFheYzWD_vwvW5D0o2-A"
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: Regimen Fiscal with the specified cRF not found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the deletion process.',
  })
  remove(@Param('cRF') cRF: string) {
    return this.regimenFiscalService.remove(+cRF);
  }
}
