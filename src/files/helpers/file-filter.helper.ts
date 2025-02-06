import { BadRequestException } from '@nestjs/common';
import * as path from 'path';
import * as mime from 'mime-types';

export const fileFilter = (
  req: Express.Request, 
  file: Express.Multer.File,
  callback: Function,

  
) => {  
  if (!file)
    return callback(
      new BadRequestException('No se cargó ningún fichero'),
      false,
    );

  const fileExtension = file.originalname.split('.').pop();
  const allowedExtensions = [ 'jpg', 'jpeg', 'png', 'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mpeg'];

  if (!allowedExtensions.includes(fileExtension)) {   
    console.log('formato invalido');
    return callback(
       new BadRequestException('Formato de archivo invalido')
    );
  }  

  if (file.size === 0) {
    return callback(new BadRequestException('El archivo está vacío'));
  }

  callback(null, true);
};
