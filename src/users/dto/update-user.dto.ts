import { IntersectionType, PartialType, PickType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto'; 
import { CreateFiscalDto } from 'src/fiscal/dto/create-fiscal.dto';

export class UpdateUserDto   extends IntersectionType(
  PartialType(CreateUserDto),
  PartialType(CreateFiscalDto),  
) { 
}
