import { Injectable } from '@nestjs/common';
import { CreateFiscalDto } from './dto/create-fiscal.dto';
import { UpdateFiscalDto } from './dto/update-fiscal.dto';

@Injectable()
export class FiscalService {
  create(createFiscalDto: CreateFiscalDto) {
    return 'This action adds a new fiscal';
  }

  findAll() {
    return `This action returns all fiscal`;
  }

  findOne(id: number) {
    return `This action returns a #${id} fiscal`;
  }

  update(id: number, updateFiscalDto: UpdateFiscalDto) {
    return `This action updates a #${id} fiscal`;
  }

  remove(id: number) {
    return `This action removes a #${id} fiscal`;
  }
}
