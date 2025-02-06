import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

var colors = require('colors/safe');
var mainLooger = new Logger('Main');


async function bootstrap() { 


  const app = await NestFactory.create(AppModule, 
    { 
      cors: true,
      logger: ['error', 'warn', 'fatal', 'log'],
    });
  const configService = app.get(ConfigService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, 
    })
  );


  const config = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Emuna Api')
    .setDescription(`
      Este servicio web ofrece endpoints para la gestión integral de la aplicación Emuna. 
      Permite realizar operaciones CRUD (Crear, Leer, Actualizar, Eliminar) 
      para la administración eficiente de las clases y la gestión detallada de los asociados.`)
    .setVersion('1.0')
    .addTag('server')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(configService.get<number>('PORT'));
  console.log(colors.green(` 
  ███████╗███╗   ███╗██╗   ██╗███╗   ██╗ █████╗ 
  ██╔════╝████╗ ████║██║   ██║████╗  ██║██╔══██╗
  █████╗  ██╔████╔██║██║   ██║██╔██╗ ██║███████║
  ██╔══╝  ██║╚██╔╝██║██║   ██║██║╚██╗██║██╔══██║
  ███████╗██║ ╚═╝ ██║╚██████╔╝██║ ╚████║██║  ██║
  ╚══════╝╚═╝     ╚═╝ ╚═════╝ ╚═╝  ╚═══╝╚═╝  ╚═╝
                                                                                                                     
 `));
  console.log(colors.green(`
╔═══════════╦══════╗
║  SERVER   ║ PORT ║
╠═══════════╬══════╣
║   EMUNA   ║ ${configService.get<number>('PORT')} ║
╚═══════════╩══════╝
  `));

  mainLooger.log('Run service on ' + configService.get<string>('HOST_API')+ ':' + configService.get<number>('PORT') + '/api');
}
bootstrap();
