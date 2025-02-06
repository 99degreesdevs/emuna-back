import { Module } from '@nestjs/common';
import { ClassScheduleCatService } from './class-schedule-cat.service';
import { ClassScheduleCatController } from './class-schedule-cat.controller';
import { ClassScheduleCat, classScheduleCatProvider } from './entities';
import { AuthModule } from 'src/auth/auth.module';
import { SequelizeModule } from '@nestjs/sequelize';

@Module({
  controllers: [ClassScheduleCatController],
  providers: [ClassScheduleCatService, ...classScheduleCatProvider],
  exports: [...classScheduleCatProvider],
  imports: [AuthModule, SequelizeModule.forFeature([ClassScheduleCat])],

})
export class ClassScheduleCatModule {}
