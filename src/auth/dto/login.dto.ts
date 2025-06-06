import { PickType } from '@nestjs/swagger';
import { CreateUserDto } from '../../users/dto'; 

export class LoginAuthDto extends PickType( CreateUserDto, [
  'email',
  'password',
] as const) { 
}
