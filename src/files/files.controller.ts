import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors, HttpCode, BadRequestException } from '@nestjs/common';
import { FilesService } from './files.service';
import { CreateFileDto } from './dto/create-file.dto';
import { UpdateFileDto } from './dto/update-file.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { fileFilter, } from './helpers/file-filter.helper';
import { diskStorage } from 'multer';
import { fileNamer } from './helpers/file-namer.helper';




@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post('upload')
  @Auth(ValidRoles.user)
  @HttpCode(200)
  @ApiOperation({ summary: 'Upload Media' })
  @ApiResponse({ status: 200, description: 'Oks' })
  @ApiResponse({ status: 400, description: 'Bad Request X-API-KEY or Coor.' })
  @ApiResponse({ status: 500, description: 'Internal Server Error' })
  @UseInterceptors( FileInterceptor ('file', {
    fileFilter: fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 },
    storage: diskStorage(
      {
        destination: './static/uploads',
        filename: fileNamer
      },
    ),

  }))
  uploadFile( @UploadedFile() file: Express.Multer.File) {
    console.log('START  ')

    if (!file) {
      throw new BadRequestException('No se cargó ningún archivo');
    }

    return {
      message: 'Archivo subido correctamente', 
    }
     
  }

 
}
