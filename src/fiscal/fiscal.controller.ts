import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FiscalService } from './fiscal.service';
import { CreateFiscalDto } from './dto/create-fiscal.dto';
import { UpdateFiscalDto } from './dto/update-fiscal.dto';

@Controller('fiscal')
export class FiscalController {
  constructor(private readonly fiscalService: FiscalService) {}

  @Post()
  create(@Body() createFiscalDto: CreateFiscalDto) {
    return this.fiscalService.create(createFiscalDto);
  }

  @Get()
  findAll() {
    return this.fiscalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.fiscalService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateFiscalDto: UpdateFiscalDto) {
    return this.fiscalService.update(+id, updateFiscalDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.fiscalService.remove(+id);
  }
}
