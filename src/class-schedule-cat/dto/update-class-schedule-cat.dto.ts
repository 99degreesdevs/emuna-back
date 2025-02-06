import { PartialType } from '@nestjs/swagger';
import { CreateClassScheduleCatDto } from './create-class-schedule-cat.dto';

export class UpdateClassScheduleCatDto extends PartialType(CreateClassScheduleCatDto) {}
