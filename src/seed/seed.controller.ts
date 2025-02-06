import { Controller, Post, Body } from '@nestjs/common';
import { SeedService } from './seed.service';
import { CreateSeedDto } from './dto/create-seed.dto';
import { ApiOperation, ApiResponse, ApiTags, ApiSecurity } from '@nestjs/swagger';
import { BasicAuthProtected } from 'src/auth/decorators/basic-auth.decorator';

@Controller('seed')
@ApiTags('Seed')
@ApiSecurity('Basic', ['username', 'password']) // Indicates that the endpoints use Basic Authentication
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @ApiOperation({ 
    summary: 'Create All Catalogs and User Accounts (admin)', 
    description: 'Generates the initial catalogs and user accounts to start the server.' 
  })
  @ApiResponse({
    status: 201,
    description: 'Seed entry successfully created.', 
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
    status: 401,
    description: 'Unauthorized: Basic Authentication failed.',
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred during the creation process.',
    schema: {
      example: {
        statusCode: 500,
        message: 'Internal Server Error',
        error: 'Internal Server Error',
      },
    },
  })
  create(@Body() createSeedDto: CreateSeedDto, @BasicAuthProtected() status: string) {
    return this.seedService.create(createSeedDto);
  }
}
