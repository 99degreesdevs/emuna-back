import {
  Controller,
  Get, 
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { DaysService } from './days.service'; 
import { UpdateDayDto } from './dto/update-day.dto';
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

@Controller('days')
@ApiTags('Days')
@ApiBearerAuth()
export class DaysController {
  constructor(private readonly daysService: DaysService) {}

  @Get()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Get all Days',
    description: 'Retrieves all day entries from the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Days retrieved successfully.',
    schema: {
      example: {
        response: {
          message: 'Se obtuvieron 7 días exitosamente',
          total: 7,
          days: [
            {
              id: 1, 
              day: 'lunes',
              isActive: false,
            },
          ],
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU1ODAwNjAsImV4cCI6MTcyNTYwODg2MH0.vtIyLitdh6_DkPtCLmMHNCgDwe0OAEwV5y0LjPoFmno',
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
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  findAll() {
    return this.daysService.findAll();
  }

  @Patch(':id')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Update Day',
    description: 'Updates a day entry by its ID in the database.',
  })
  @ApiResponse({
    status: 200,
    description: 'Day updated successfully.',
    schema: {
      example: {
        response: {
          message: 'El día con el id 1 fue actualizado exitosamente',
          day: {
            id: 1,
            day: 'lunes',
            isActive: false,
          },
        },
        token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjU1Nzk5ODgsImV4cCI6MTcyNTYwODc4OH0.p2n-x-8A1tPYNzDF47-KUS4d-3QqAzE3i8Hqb3tnWg0',
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
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  update(
    @Param('id') id: string,
    @Body() updateDayDto: UpdateDayDto,
    @GetUser() user: Users
  ) {
    return this.daysService.update(+id, updateDayDto, user.userId);
  }
}
