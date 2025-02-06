import { Module } from '@nestjs/common';
import { CreditsService } from './credits.service';
import { CreditsController } from './credits.controller';
import { Credit, creditProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [CreditsController],
  providers: [CreditsService, ...creditProvider],
  exports: [...creditProvider],
  imports: [ SequelizeModule.forFeature([Credit]), AuthModule ],
})
export class CreditsModule {}
 