import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PageOptionsDto } from './dto/page-options.dto';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { TokenInterceptor } from 'src/auth/interceptors/token/token.interceptor';
import { ApiOperation, ApiResponse, ApiTags, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { Public } from 'src/auth/decorators/public.decorator';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('users')
@ApiTags('Users')
@ApiBearerAuth() // Indicates that the endpoints require authentication
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.user) 
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
    schema: {
      example: {
        "response": {
          "message": "Se creó el usuario exitosamente",
          "user": {
            "createdAt": "2024-08-25T16:22:17.731Z",
            "userId": "32cde0da-457b-4c99-815e-4827cefb6b38",
            "email": "usuario5@correo.com",
            "name": "javier moreno romero",
            "born": "1992-05-12T06:00:00.000Z",
            "phone": "+523456789012",
            "address": "Calle 5 de Febrero #98, C.P.: 01000, CDMX",
            "invoice": true,
            "razonSocial": "Romero y Asociados S.A. de C.V.",
            "RFC": "JLR345678PQ2",
            "cRF": 605,
            "cUsoCFDI": "G01"
          }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjQ2MDI5MzcsImV4cCI6MTcyNDYzMTczN30.nIzz0ioFn9XGgWsPyl-S5JybBXoLnMHRa-a0vxtnqzE"
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: The input data is invalid.',
    schema: {
      example: {
        statusCode: 400,
        message: 'Validation failed (userDto is invalid)',
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get('all')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'A list of all users.',
    schema: {
      example: [
        {
          "users": [
            {
              "userId": "9076eeb6-a891-4a13-81ed-cac848f1d6c4",
              "createdAt": "2024-08-25T02:25:36.447Z",
              "updatedAt": null,
              "email": "purpuresnake@gmail.com",
              "name": "jose juan ruiz saenz",
              "born": "1991-03-01T06:00:00.000Z",
              "phone": "+525544998833",
              "avatar": null,
              "roles": [
                "user",
                "admin",
                "master"
              ]
            }]
        },
      ],
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: No users found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  async findAll() {
    return this.usersService.findAll();
  }

  @Get()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Get users with pagination',
    description: `Get a paginated list of users. Use query parameters to specify the pagination options such as page number and page size.`,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination (defaults to 1)',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of users per page (defaults to 10)',
  })
  @ApiResponse({
    status: 200,
    description: 'A paginated list of users.',
    schema: {
      example: {
        "response": {
          "message": "ok",
          "users": [
            {
              "userId": "32cde0da-457b-4c99-815e-4827cefb6b38",
              "createdAt": "2024-08-25T16:22:17.731Z",
              "updatedAt": "2024-08-25T16:22:17.781Z",
              "email": "usuario5@correo.com",
              "name": "javier moreno romero",
              "born": "1992-05-12T06:00:00.000Z",
              "phone": "+523456789012",
              "avatar": "",
              "roles": [
                "user"
              ]
            }
          ],
          "meta": {
            "page": 1,
            "take": 1,
            "itemCount": 5,
            "pageCount": 5,
            "hasPreviousPage": false,
            "hasNextPage": true
          }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjQ2MDMxNzYsImV4cCI6MTcyNDYzMTk3Nn0.iQGfCfq8CVWAUzlPeNXsG4RG3VDOdwxvFNUmun67OBU"
      }
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: No users found.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  async findAllPage(@Query() pageOptionsDto: PageOptionsDto) {
    return this.usersService.findAllPage(pageOptionsDto);
  }

  @Get(':userId')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Find a user by their ID',
    description: `Get a single user by their unique ID. Ensure the ID is valid and correctly formatted.`,
  })
  @ApiResponse({
    status: 200,
    description: 'The user with the specified ID.',
    schema: {
      example: {
        "response": {
          "user": {
            "message": "Usuario con el ID 35434152-2b6c-4683-9901-518bdf78d6f6 cargado exitosamente",
            "userId": "35434152-2b6c-4683-9901-518bdf78d6f6",
            "createdAt": "2024-08-25T02:27:05.165Z",
            "updatedAt": "2024-08-25T02:27:05.255Z",
            "email": "usuario1@correo.com",
            "name": "luisa ramirez gómez",
            "born": "1995-11-07T06:00:00.000Z",
            "phone": "+525123456789",
            "avatar": "",
            "roles": [
              "user"
            ],
            "address": "Calle 16 de Septiembre #12, C.P.: 06800, CDMX",
            "invoice": true,
            "RFC": "JKJ123456RZF",
            "razonSocial": "Ortega Consultoría S.A. de C.V.",
            "cRF": 605,
            "cUsoCFDI": "G01"
          }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjQ2MDMyNjEsImV4cCI6MTcyNDYzMjA2MX0.PFcfD4YXRtcpsGx2kSSAZj7fp_wXVqdp1e3Yk8EXgao"
      }
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: The user with the specified ID does not exist.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  async findOne(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.findOne(userId);
  }

  @Patch(':userId')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Update a user by their ID',
    description: `Update the details of a user based on their unique ID. Ensure the ID is valid and the input data is correct.`,
  })
  @ApiResponse({
    status: 200,
    description: 'The updated user information.',
    schema: {
      example: {
        "response": {
          "message": "El usuario asociado al ID 35434152-2b6c-4683-9901-518bdf78d6f6 ha sido actualizado con éxito.",
          "user": {
            "userId": "35434152-2b6c-4683-9901-518bdf78d6f6",
            "createdAt": "2024-08-25T02:27:05.165Z",
            "updatedAt": "2024-08-25T03:51:02.876Z",
            "email": "usuario1@correo.com",
            "name": "luisa ramirez gómez",
            "born": "1995-11-07T06:00:00.000Z",
            "phone": "+525123456789",
            "address": "Calle 16 de Septiembre #12, C.P.: 06800, CDMX",
            "invoice": true,
            "RFC": "JKJ123456RZF",
            "razonSocial": "Ortega Consultoría S.A. de C.V.",
            "cRF": 605,
            "cUsoCFDI": "G01"
          }
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjQ1NTc4NjIsImV4cCI6MTcyNDU4NjY2Mn0.hE2DNHE9wGbf3vTEkFqFfrPlE1bNeUM-6mG9F7dK1kI"
      }
    },
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: The user with the specified ID does not exist.',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request: Invalid input data provided.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  async update(
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(userId, updateUserDto);
  }

  @Delete(':userId')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: 'Delete a user by their ID',
    description: 'Permanently delete a user by their unique ID. Ensure the ID is correct and that you are authorized to perform this action.',
  })
  @ApiResponse({
    status: 200,
    description: 'The user has been successfully deleted.',
    schema: {
      example: {
        "response": {
          "message": "Se eliminó correctamente le usuario con el id c10ccb5a-7dae-4b94-9eca-4cf5298a22bc"
        },
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjQ1NTYwNTAsImV4cCI6MTcyNDU4NDg1MH0.U0wl91GFbadb8OBD9r9LhKqsKwVoTJYx1I-UPJ0kRYY"
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found: The user with the specified ID does not exist.',
  })
  @ApiResponse({
    status: 500,
    description: 'Internal Server Error: An unexpected error occurred.',
  })
  async remove(@Param('userId', ParseUUIDPipe) userId: string) {
    return this.usersService.remove(userId);
  }

  @Post('clients')
  @Public()
  createClient(@Body() createClientDto: CreateClientDto) {
    return this.usersService.createClient(createClientDto);
  }
}
