import {
  Controller,
  Get, 
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
} from '@nestjs/common';
import { ClassSchedulesService } from './class-schedules.service';
import { CreateClassScheduleDto } from './dto/create-class-schedule.dto';
import { UpdateClassScheduleDto } from './dto/update-class-schedule.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { TokenInterceptor } from 'src/auth/interceptors/token/token.interceptor';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { Users } from 'src/users/entities';

import { PaginationDTO } from 'src/common/pagination';
import { PageOptionsDto } from 'src/users/dto';
import { SearchClassScheduleDto } from './dto';

@Controller('class-schedules')
@ApiTags('Class Schedules')
@ApiBearerAuth()
export class ClassSchedulesController {
  constructor(private readonly classSchedulesService: ClassSchedulesService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Create Class Schedule',
    description: 'Creates a new class schedule entry in the database.',
  })
  @ApiResponse({
    status: 201,
    description: 'Class schedule created successfully.',
    schema: {
      example: {
        response: {
          message: 'Se creó la clase correctamente',
          classSchedule: {
            createdAt: '2024-09-06T05:19:01.089Z',
            isActive: true,
            id: 3,
            class: 'Yoga Recreativa',
            description: 'Esta es una clase de yoga con un enfoque moderno.',
            day: 1,
            scheduleStart: '09:00:00',
            scheduleEnd: '11:00:00',
            teacher: 'Robert Roblez',
            places: 10
          }
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU1OTk5NDEsImV4cCI6MTcyNTYyODc0MX0.kVmJdO5mSBHY3VBYfJg-GIQpq_6hP2r1k8nnumUC8Ws'
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid DTO or missing required fields.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the creation process.',
  })
  create(
    @Body() createClassScheduleDto: CreateClassScheduleDto,
    @GetUser() user: Users
  ) {
    return this.classSchedulesService.create(createClassScheduleDto, user.userId);
  }

  @Post('reserve-class/:idClass')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  reserveClass(
    @Param('idClass') idClass: string,
    @GetUser() user: Users
  ){
    return this.classSchedulesService.reserveClass(+idClass, user.userId);
  }

  @Post('cancel-class/:idClass')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  cancelClass(
    @Param('idClass') idClass: string,
    @GetUser() user: Users
  ){
    return this.classSchedulesService.cancelClassReservation(+idClass, user.userId);
  }


  @Get('class-all')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Get all Class Schedules',
    description: 'Retrieves all class schedules from the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Class schedules retrieved successfully.',
    schema: {
      example: {
        message: 'Se obtuvieron 2 clases exitosamente',
        total: 2,
        classSchedules: [
          {
            id: 2,
            createdAt: '2024-09-06T05:18:54.366Z',
            class: 'Yoga Recreativa',
            description: 'Esta es una clase de yoga con un enfoque moderno.',
            day: 1,
            scheduleStart: '09:00:00',
            scheduleEnd: '11:00:00',
            teacher: 'Robert Roblez',
            places: 10,
            isActive: true
          },
          {
            id: 3,
            createdAt: '2024-09-06T05:19:01.089Z',
            class: 'Pilates',
            description: 'Esta es una clase de pilates con un enfoque moderno.',
            day: 1,
            scheduleStart: '09:00:00',
            scheduleEnd: '11:00:00',
            teacher: 'Julio Jaramillo',
            places: 10,
            isActive: true
          }
        ]
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid request or missing parameters.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the retrieval process.',
  })
  findAll() { 
    return this.classSchedulesService.findAll();
  }



  @Get('class/:id')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Get Class Schedule by ID',
    description: 'Retrieves a class schedule by its ID from the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Class schedule retrieved successfully.',
    schema: {
      example: {
        message: 'Se obtuvo la clase con el id 2 exitosamente',
        classSchedule: {
          id: 2,
          createdAt: '2024-09-06T05:18:54.366Z',
          updatedAt: '2024-09-06T05:18:54.366Z',
          class: 'Yoga Recreativa',
          description: 'Esta es una clase de yoga con un enfoque moderno.',
          scheduleStart: '09:00:00',
          scheduleEnd: '11:00:00',
          teacher: 'Robert Roblez',
          places: 10,
          updatedBy: null,
          isActive: true,
          day: 'lunes',
          createdBy: {
            userId: '9076eeb6-a891-4a13-81ed-cac848f1d6c4',
            name: 'Otilio Betancurt'
          }
        }
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid ID or missing required fields.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the retrieval process.',
  })
  findOne(@Param('id') id: string) { 
    return this.classSchedulesService.findOne(+id);
  }

  @Get('search')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Get all Class Schedules',
    description: 'Retrieves all class schedules from the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Class schedules retrieved successfully.',
    schema: {
      example: {
        message: 'Se obtuvieron 2 clases exitosamente',
        total: 2,
        classSchedules: [
          {
            id: 2,
            createdAt: '2024-09-06T05:18:54.366Z',
            class: 'Yoga Recreativa',
            description: 'Esta es una clase de yoga con un enfoque moderno.',
            day: 1,
            scheduleStart: '09:00:00',
            scheduleEnd: '11:00:00',
            teacher: 'Robert Roblez',
            places: 10,
            isActive: true
          },
          {
            id: 3,
            createdAt: '2024-09-06T05:19:01.089Z',
            class: 'Pilates',
            description: 'Esta es una clase de pilates con un enfoque moderno.',
            day: 1,
            scheduleStart: '09:00:00',
            scheduleEnd: '11:00:00',
            teacher: 'Julio Jaramillo',
            places: 10,
            isActive: true
          }
        ]
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid request or missing parameters.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the retrieval process.',
  })
  findAllByCategory(@Query() pageOptionsDto: SearchClassScheduleDto) {  
    return this.classSchedulesService.findAllPage(pageOptionsDto);
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Update Class Schedule',
    description: 'Updates a class schedule by its ID in the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Class schedule updated successfully.',
    schema: {
      example: {
        response: {
          message: 'Se actualizó la clase con el id 2 exitosamente.',
          classSchedule: {
            id: 2,
            createdAt: '2024-09-06T05:18:54.366Z',
            updatedAt: '2024-09-06T05:19:22.482Z',
            class: 'Yoga Recreativa',
            description: 'Esta es una clase de yoga con un enfoque moderno.',
            day: 1,
            scheduleStart: '09:00:00',
            scheduleEnd: '11:00:00',
            teacher: 'Robert Roblez',
            places: 10,
            isActive: false
          }
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU1OTk5NjIsImV4cCI6MTcyNTYyODc2Mn0.BBiVsfVK7C3yokStT_CwIP9pMR4BgZulnJqKC3b47qw'
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid DTO or missing required fields.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the update process.',
  })
  update(
    @Param('id') id: string,
    @Body() updateClassScheduleDto: UpdateClassScheduleDto,
    @GetUser() user: Users
  ) {
    return this.classSchedulesService.update(+id, updateClassScheduleDto, user.userId);
  }

  @Delete(':id')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Delete Class Schedule',
    description: 'Deletes a class schedule by its ID from the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Class schedule deleted successfully.',
    schema: {
      example: {
        response: {
          message: 'Se eliminó correctamente la clase con el id 2'
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU1OTk5NzAsImV4cCI6MTcyNTYyODc3MH0.YJ5dRzP3sW3NV82twwRXuAP7tDa0q7a9FsoPpN8Z2xE'
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid ID or missing required fields.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the deletion process.',
  })
  remove(@Param('id') id: string) {
    return this.classSchedulesService.remove(+id);
  }
}
