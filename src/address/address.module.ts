import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { Address, addressProvider } from './entities';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [AddressController],
  providers: [AddressService, ...addressProvider],
  exports: [...addressProvider],
  imports: [AuthModule, UsersModule, SequelizeModule.forFeature([Address])],
})
export class AddressModule {}
