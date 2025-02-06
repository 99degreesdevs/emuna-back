import { PartialType } from '@nestjs/swagger';
import { CreateProductsCatDto } from './create-products-cat.dto';

export class UpdateProductsCatDto extends PartialType(CreateProductsCatDto) {}
