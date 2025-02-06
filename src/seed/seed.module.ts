import { Module } from "@nestjs/common";
import { SeedService } from "./seed.service";
import { SeedController } from "./seed.controller";
import { RegimenFiscalModule } from "src/regimen-fiscal/regimen-fiscal.module";
import { UsersModule } from "src/users/users.module";
import { UsoCfdiModule } from "src/uso-cfdi/uso-cfdi.module";
import { DaysModule } from "src/days/days.module";
import { ClassScheduleCatModule } from "src/class-schedule-cat/class-schedule-cat.module";
import { ProductsCatModule } from "src/products-cat/products-cat.module";

@Module({
  controllers: [SeedController],
  imports: [
    RegimenFiscalModule,
    UsersModule,
    UsoCfdiModule,
    DaysModule,
    ClassScheduleCatModule,
    ProductsCatModule,
  ],
  providers: [SeedService],
})
export class SeedModule {}
