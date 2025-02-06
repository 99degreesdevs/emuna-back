import { Module } from '@nestjs/common';
import { MultimediaService } from './multimedia.service';
import { MultimediaController } from './multimedia.controller';
import { Multimedia, multimediaProvider } from './entities';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [MultimediaController],
  providers: [MultimediaService, ...multimediaProvider ],
  exports: [ ...multimediaProvider],
  imports: [ SequelizeModule.forFeature([Multimedia]), AuthModule],
})
export class MultimediaModule {}
 