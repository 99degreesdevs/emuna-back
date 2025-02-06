import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { UsoCfdiService } from './uso-cfdi.service';
import { CreateUsoCfdiDto } from './dto/create-uso-cfdi.dto';
import { UpdateUsoCfdiDto } from './dto/update-uso-cfdi.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { TokenInterceptor } from 'src/auth/interceptors/token/token.interceptor';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('uso-cfdi')
@ApiTags('Uso CFDI')
@ApiBearerAuth() 
export class UsoCfdiController {
  
  constructor(private readonly usoCfdiService: UsoCfdiService) { }

  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Create a new Uso CFDI entry' })
  @ApiResponse({ status: 201, description: 'The Uso CFDI entry has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Invalid input data provided.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred while processing the request.' })
  @Post()
  create(@Body() createUsoCfdiDto: CreateUsoCfdiDto) {
    return this.usoCfdiService.create(createUsoCfdiDto);
  }

  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Get All Uso CFDI' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 404, description: 'Not Found' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @Get()
  findAll() {
    return this.usoCfdiService.findAll();
  }

  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Get a Uso CFDI entry by its identifier' })
  @ApiResponse({ status: 200, description: 'The Uso CFDI entry with the specified identifier.' })
  @ApiResponse({ status: 404, description: 'The Uso CFDI entry with the specified identifier was not found.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred while processing the request.' })
  @Get(':cUsoCFDI')
  findOne(@Param('cUsoCFDI') cUsoCFDI: string) {
    return this.usoCfdiService.findOne(cUsoCFDI);
  }

  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Update Uso CFDI by cUsoCFDI' })
  @ApiOperation({ summary: 'Update a Uso CFDI entry by its identifier' })
  @ApiResponse({ status: 200, description: 'The Uso CFDI entry has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'The Uso CFDI entry with the specified identifier was not found.' })
  @ApiResponse({ status: 400, description: 'Invalid input data provided.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred while processing the request.' })
  
  @Patch(':cUsoCFDI')
  update(@Param('cUsoCFDI') cUsoCFDI: string, @Body() updateUsoCfdiDto: UpdateUsoCfdiDto) {
    return this.usoCfdiService.update(cUsoCFDI, updateUsoCfdiDto);
  }


  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Delete a Uso CFDI entry by its identifier', description: 'Delete a Uso CFDI entry by its identifier' })
  @ApiResponse({ status: 200, description: 'The Uso CFDI entry has been successfully deleted.' })
  @ApiResponse({ status: 404, description: 'The Uso CFDI entry with the specified identifier was not found.' })
  @ApiResponse({ status: 500, description: 'An unexpected error occurred while processing the request.' })
  @Delete(':cUsoCFDI')
  remove(@Param('cUsoCFDI') cUsoCFDI: string) { 
    return this.usoCfdiService.remove(cUsoCFDI);
  }
}
