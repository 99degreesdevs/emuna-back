import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { ProductsCatService } from './products-cat.service';
import { CreateProductsCatDto } from './dto/create-products-cat.dto';
import { UpdateProductsCatDto } from './dto/update-products-cat.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TokenInterceptor } from 'src/auth/interceptors/token/token.interceptor';
import { ValidRoles } from 'src/auth/interfaces';

@Controller('products-cat')
export class ProductsCatController {
  constructor(private readonly productsCatService: ProductsCatService) {}

  @Auth(ValidRoles.admin )
  @UseInterceptors(TokenInterceptor)
  @Post()
  create(@Body() createProductsCatDto: CreateProductsCatDto) {
    return this.productsCatService.create(createProductsCatDto);
  }
  
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @Get()
  findAll() {
    return this.productsCatService.findAll();
  }
  
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productsCatService.findOne(+id);
  }
  
  @Auth(ValidRoles.admin )
  @UseInterceptors(TokenInterceptor)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProductsCatDto: UpdateProductsCatDto) {
    return this.productsCatService.update(+id, updateProductsCatDto);
  }
  
  @Auth(ValidRoles.admin )
  @UseInterceptors(TokenInterceptor)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productsCatService.remove(+id);
  }
}
 
 