import { Module } from '@nestjs/common';
import { RegimenFiscalService } from './regimen-fiscal.service';
import { RegimenFiscalController } from './regimen-fiscal.controller';
import { RegimenFiscal, regimenFiscalProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize'; 
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [RegimenFiscalController],
  providers: [RegimenFiscalService, ...regimenFiscalProvider],
  exports: [...regimenFiscalProvider],
  imports: [ SequelizeModule.forFeature([RegimenFiscal]), AuthModule],
})
export class RegimenFiscalModule {}
