import { PartialType } from '@nestjs/swagger';
import { CreateClassScheduleTransactionDto } from './create-class-schedule-transaction.dto';

export class UpdateClassScheduleTransactionDto extends PartialType(CreateClassScheduleTransactionDto) {}
