import { Module } from "@nestjs/common";
import { ClassSchedulesService } from "./class-schedules.service";
import { ClassSchedulesController } from "./class-schedules.controller";
import { ClassSchedule, classScheduleProvider } from "./entities";
import { AuthModule } from "src/auth/auth.module";
import { SequelizeModule } from "@nestjs/sequelize";
import { ClassScheduleCatModule } from "src/class-schedule-cat/class-schedule-cat.module";
import { CreditsModule } from "src/credits/credits.module";
import { ClassScheduleTransactionModule } from "src/class-schedule-transaction/class-schedule-transaction.module";

@Module({
  controllers: [ClassSchedulesController],
  providers: [ClassSchedulesService, ...classScheduleProvider],
  exports: [...classScheduleProvider],
  imports: [
    AuthModule,
    ClassScheduleCatModule,
    SequelizeModule.forFeature([ClassSchedule]),
    CreditsModule,
    ClassScheduleTransactionModule,
  ],
})
export class ClassSchedulesModule {}
