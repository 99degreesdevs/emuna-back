import { Module } from '@nestjs/common';
import { ClassScheduleTransactionService } from './class-schedule-transaction.service';
import { ClassScheduleTransactionController } from './class-schedule-transaction.controller';
import { ClassScheduleTransaction, classScheduleTransactionProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [ClassScheduleTransactionController],
  providers: [ClassScheduleTransactionService, ...classScheduleTransactionProvider],
  exports: [...classScheduleTransactionProvider],
  imports: [ SequelizeModule.forFeature([ClassScheduleTransaction]), AuthModule]

})
export class ClassScheduleTransactionModule {}
 