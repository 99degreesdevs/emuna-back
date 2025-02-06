import { PartialType } from '@nestjs/swagger';
import { CreateRegimenFiscalDto } from './create-regimen-fiscal.dto';

export class UpdateRegimenFiscalDto extends PartialType(CreateRegimenFiscalDto) {}
