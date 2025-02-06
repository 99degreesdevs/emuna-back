import { Module } from '@nestjs/common';
import { MotivationalQuotesService } from './motivational-quotes.service';
import { MotivationalQuotesController } from './motivational-quotes.controller';
import { motivatinalQuoteProvider, MotivationalQuote } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MotivationalQuotesController],
  providers: [MotivationalQuotesService, ...motivatinalQuoteProvider ],
  exports: [ ...motivatinalQuoteProvider],
  imports: [ SequelizeModule.forFeature([MotivationalQuote]), AuthModule],
})
export class MotivationalQuotesModule {}
