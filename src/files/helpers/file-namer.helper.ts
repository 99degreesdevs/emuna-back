import { BadRequestException } from '@nestjs/common';
import { v4 as uuid } from 'uuid'; 

export const fileNamer = (
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
   const fileName = `${uuid()}.${fileExtension}`; 
   console.log('fileName', fileName);

  callback(null, fileName);
};
