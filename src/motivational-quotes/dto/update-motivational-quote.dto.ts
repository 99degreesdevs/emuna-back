import { PartialType } from '@nestjs/swagger';
import { CreateMotivationalQuoteDto } from './create-motivational-quote.dto';

export class UpdateMotivationalQuoteDto extends PartialType(CreateMotivationalQuoteDto) {}
