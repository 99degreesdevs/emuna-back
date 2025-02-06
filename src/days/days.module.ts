import { Module } from '@nestjs/common';
import { DaysService } from './days.service';
import { DaysController } from './days.controller';
import { daysProvider } from './entities';
import { AuthModule } from 'src/auth/auth.module'; 
import { SequelizeModule } from '@nestjs/sequelize';
import { Day } from './entities/day.entity';

@Module({
  controllers: [DaysController],
  providers: [DaysService, ...daysProvider],
  exports:[...daysProvider],
  imports: [SequelizeModule.forFeature([Day]), AuthModule],
})
export class DaysModule {}
