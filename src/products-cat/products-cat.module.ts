import { Module } from '@nestjs/common';
import { ProductsCatService } from './products-cat.service';
import { ProductsCatController } from './products-cat.controller';
import { ProductsCat, productsCatProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ProductsCatController],
  providers: [ProductsCatService, ...productsCatProvider],
  exports: [...productsCatProvider],
  imports: [ SequelizeModule.forFeature([ProductsCat]), AuthModule],

})
export class ProductsCatModule {}
