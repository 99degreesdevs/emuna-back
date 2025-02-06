import { PartialType } from '@nestjs/swagger';
import { CreateUsoCfdiDto } from './create-uso-cfdi.dto';

export class UpdateUsoCfdiDto extends PartialType(CreateUsoCfdiDto) {}
