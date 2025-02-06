import { Module } from '@nestjs/common';
import { UsoCfdiService } from './uso-cfdi.service';
import { UsoCfdiController } from './uso-cfdi.controller';
import { UsoCfdi, usoCfdiProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [UsoCfdiController],
  providers: [UsoCfdiService, ...usoCfdiProvider],
  exports: [...usoCfdiProvider],
  imports: [ SequelizeModule.forFeature([UsoCfdi]), AuthModule],
})
export class UsoCfdiModule {}
