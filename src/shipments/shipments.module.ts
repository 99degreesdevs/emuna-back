import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { Shipment, shipmentProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ShipmentsController],
  providers: [ShipmentsService, ...shipmentProvider],
  exports: [...shipmentProvider],
  imports: [SequelizeModule.forFeature([Shipment]), AuthModule]
})
export class ShipmentsModule {}
