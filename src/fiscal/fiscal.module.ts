import { Module } from '@nestjs/common';
import { FiscalService } from './fiscal.service';
import { FiscalController } from './fiscal.controller';
import { Fiscal, fiscalProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [FiscalController],
  providers: [FiscalService, ...fiscalProvider],
  exports: [ ...fiscalProvider],
  imports: [ SequelizeModule.forFeature([Fiscal])]
})
export class FiscalModule {}
