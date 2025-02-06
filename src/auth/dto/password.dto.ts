import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto'; 

export class PasswordAuthDto extends PickType( CreateUserDto, [
  'password',
] as const) { 
}
