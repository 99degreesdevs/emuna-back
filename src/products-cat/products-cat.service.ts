import { Injectable } from '@nestjs/common';
import { CreateProductsCatDto } from './dto/create-products-cat.dto';
import { UpdateProductsCatDto } from './dto/update-products-cat.dto';

@Injectable()
export class ProductsCatService {
  create(createProductsCatDto: CreateProductsCatDto) {
    return 'This action adds a new productsCat';
  }

  findAll() {
    return `This action returns all productsCat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} productsCat`;
  }

  update(id: number, updateProductsCatDto: UpdateProductsCatDto) {
    return `This action updates a #${id} productsCat`;
  }

  remove(id: number) {
    return `This action removes a #${id} productsCat`;
  }
}
