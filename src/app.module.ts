import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "./config/configuration";
import { SequelizeModule } from "@nestjs/sequelize";
import { UsersModule } from "./users/users.module";
import { AuthModule } from "./auth/auth.module";
import { MailModule } from "./mail/mail.module";
import { MailerModule } from "@nestjs-modules/mailer";
import { MessageWsModule } from "./message-ws/message-ws.module";
import { SeedModule } from "./seed/seed.module";
import { FilesModule } from "./files/files.module";
import { RegimenFiscalModule } from "./regimen-fiscal/regimen-fiscal.module";
import { FiscalModule } from "./fiscal/fiscal.module";
import { UsoCfdiModule } from "./uso-cfdi/uso-cfdi.module";
import { MotivationalQuotesModule } from "./motivational-quotes/motivational-quotes.module";
import { DaysModule } from "./days/days.module";
import { ClassSchedulesModule } from "./class-schedules/class-schedules.module";
import { MultimediaModule } from "./multimedia/multimedia.module";
import { ProductsModule } from "./products/products.module";
import { OrdersModule } from "./orders/orders.module";
import { ClassScheduleCatModule } from "./class-schedule-cat/class-schedule-cat.module";
import { ProductsCatModule } from "./products-cat/products-cat.module";
import { PackageModule } from "./package/package.module";
import { AddressModule } from "./address/address.module";
import { WebhookModule } from "./webhook/webhook.module";
import { CreditsModule } from "./credits/credits.module";
import { ShipmentsModule } from './shipments/shipments.module';
import { ClassScheduleTransactionModule } from './class-schedule-transaction/class-schedule-transaction.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ".env",
      isGlobal: true,
      load: [configuration],
    }),
    SequelizeModule.forRoot({
      dialect: "postgres",
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      database: process.env.DB_NAME,
      define: { timestamps: false },
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadModels: true,
      timezone: process.env.DB_TZ,
      synchronize: true,
      logging: true,
      sync: { alter: true },
      logQueryParameters: false,
    }),
    MailerModule.forRoot({
      transport: {
        service: "gmail",
        port: +process.env.MAILPORT,
        auth: {
          user: process.env.MAILUSER,
          pass: process.env.MAILPASS,
        },
        logger: true,
        debug: true,
      },
    }),
    UsersModule,
    AuthModule,
    MailModule,
    MessageWsModule,
    SeedModule,
    FilesModule,
    RegimenFiscalModule,
    FiscalModule,
    UsoCfdiModule,
    MotivationalQuotesModule,
    DaysModule,
    ClassSchedulesModule,
    MultimediaModule,
    ProductsModule,
    OrdersModule,
    ClassScheduleCatModule,
    ProductsCatModule,
    PackageModule,
    AddressModule,
    WebhookModule,
    CreditsModule,
    ShipmentsModule,
    ClassScheduleTransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
