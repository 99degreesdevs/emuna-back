import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users, userProvider } from './entities/index';
import { SequelizeModule } from '@nestjs/sequelize';  
import { AuthModule } from 'src/auth/auth.module'; 
import { FiscalModule } from '../fiscal/fiscal.module';  

@Module({
  controllers: [UsersController],
  providers: [UsersService, ...userProvider],
  exports: [ ...userProvider],
  imports: [ SequelizeModule.forFeature([Users]), forwardRef(() => AuthModule),  FiscalModule  ]
})
export class UsersModule {} 
