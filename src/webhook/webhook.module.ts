import { Module } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import { WebhookController } from './webhook.controller';
import { OrdersModule } from 'src/orders/orders.module'; 
import { PackageModule } from 'src/package/package.module';
import { CreditsModule } from 'src/credits/credits.module';
import { ShipmentsModule } from '../shipments/shipments.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
  imports: [ OrdersModule,  ShipmentsModule, PackageModule, CreditsModule, ProductsModule]
})
export class WebhookModule {}
