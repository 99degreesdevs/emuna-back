import { Module } from '@nestjs/common';
import { PackageService } from './package.service';
import { PackageController } from './package.controller';
import { Package, packageProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [PackageController],
  providers: [PackageService, ...packageProvider],
  exports: [...packageProvider],
  imports: [SequelizeModule.forFeature([Package]), AuthModule]
})
export class PackageModule {}
