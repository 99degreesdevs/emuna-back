import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto'; 

export class RecoverAuthDto extends PickType( CreateUserDto, [
  'email', 
] as const) { 
}
