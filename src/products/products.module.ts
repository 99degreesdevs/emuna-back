import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product, productProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';
import { PackageModule } from 'src/package/package.module';

@Module({
  controllers: [ProductsController],
  providers: [ProductsService, ...productProvider],
  exports: [...productProvider],
  imports: [ SequelizeModule.forFeature([Product]), AuthModule, PackageModule],
})
export class ProductsModule {}

 
 