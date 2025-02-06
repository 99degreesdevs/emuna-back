import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Order, orderProvider } from './entities';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { ProductsModule } from 'src/products/products.module';
import { AddressModule } from 'src/address/address.module';

@Module({
  controllers: [OrdersController],
  providers: [OrdersService, ...orderProvider],
  exports: [...orderProvider],
  imports: [SequelizeModule.forFeature([Order]), AuthModule, AddressModule, ProductsModule]
})
export class OrdersModule {} 