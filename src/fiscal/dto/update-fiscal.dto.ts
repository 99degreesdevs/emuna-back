import { PartialType } from '@nestjs/swagger';
import { CreateFiscalDto } from './create-fiscal.dto';

export class UpdateFiscalDto extends PartialType(CreateFiscalDto) {}
