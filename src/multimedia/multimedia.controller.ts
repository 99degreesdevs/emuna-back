import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from '@nestjs/common';
import { MultimediaService } from './multimedia.service';
import { CreateMultimediaDto } from './dto/create-multimedia.dto';
import { UpdateMultimediaDto } from './dto/update-multimedia.dto';
import {
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'; 
import { ValidRoles } from 'src/auth/interfaces';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { TokenInterceptor } from 'src/auth/interceptors/token/token.interceptor'; 
import { GetUser } from 'src/auth/decorators/user.decorator';
import { Users } from 'src/users/entities';

@Controller("multimedia")
@ApiTags("Multimedia")
export class MultimediaController {
  constructor(private readonly multimediaService: MultimediaService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Create Multimedia",
    description: "Creates a new multimedia entry in the database.",
  })
  @ApiResponse({
    status: 201,
    description: "Multimedia created successfully.",
    schema: {
      example: {
        response: {
          message: "Se creó el medio COSMOVISIÓN parte 2 exitosamente",
          medio: {
            createdAt: "2024-09-21T17:25:35.948Z",
            id: 2,
            title: "COSMOVISIÓN parte 2",
            medio: "video",
            duration: "00:02:47",
            publicationDate: "2024-09-28T21:30:00.000Z",
            link: "https://www.youtube.com/watch?v=7rmTlyJSrPE",
          },
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjY5Mzk1MzUsImV4cCI6MTcyNjk2ODMzNX0.Tw99fgtv8DcAOnZEA8Ek3tnVFwX1xweXy9Y-KrrzX4Q",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: Invalid DTO or missing required fields.",
    schema: {
      example: {
        statusCode: 400,
        message: "Validation failed",
        error: "Bad Request",
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      "Internal Server Error: An unexpected error occurred during the creation process.",
  })
  create(
    @Body() createMultimediaDto: CreateMultimediaDto,
    @GetUser() user: Users
  ) {
    return this.multimediaService.create(createMultimediaDto, user.userId);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Get all Multimedia",
    description: "Retrieves all multimedia entries from the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Multimedia retrieved successfully.",
    schema: {
      example: {
        response: {
          message: "Se obtuvieron 4 medios exitosamente",
          total: 4,
          multimedia: [
            {
              id: 1,
              createdAt: "2024-09-21T17:23:08.227Z",
              publicationDate: "2024-09-28T21:30:00.000Z",
              title: "Meditación Part 1",
              medio: "audio",
              link: "https://www.youtube.com/watch?v=7rmTlyJSrPE",
              duration: "00:02:47",
            },
          ],
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjcwMzQ4NDQsImV4cCI6MTcyNzA2MzY0NH0.X2fCXk8A78bqogst-CUo_SQYs_2YUfAdpa_750l3s0M",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: Invalid request or missing parameters.",
    schema: {
      example: {
        statusCode: 400,
        message: "Validation failed",
        error: "Bad Request",
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      "Internal Server Error: An unexpected error occurred during the retrieval process.",
  })
  findAll() {
    return this.multimediaService.findAll();
  }

  @Get(":id")
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Get Multimedia by ID",
    description: "Retrieves a multimedia entry by its ID from the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Multimedia retrieved successfully.",
    schema: {
      example: {
        message: "Successfully retrieved the multimedia entry with ID 1.",
        multimedia: {
          id: 1,
          title: "Sample Multimedia",
          medio: "video",
          link: "https://www.youtube.com/watch?v=7rmTlyJSrPE",
          createdAt: "2024-09-02T22:04:31.774Z",
          duration: "00:02:47",
          publicationDate: "2024-09-28T21:30:00.000Z",
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: Invalid ID or missing required fields.",
    schema: {
      example: {
        statusCode: 400,
        message: "Validation failed",
        error: "Bad Request",
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      "Internal Server Error: An unexpected error occurred during the retrieval process.",
  })
  findOne(@Param("id") id: string) {
    return this.multimediaService.findOne(+id);
  }

  @Patch(":id")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Update Multimedia",
    description: "Updates a multimedia entry by its ID in the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Multimedia updated successfully.",
    schema: {
      example: {
        response: {
          message: "Se actualizó el medio con el id 4 exitosamente.",
          multimedia: {
            id: 4,
            createdAt: "2024-09-22T19:36:08.813Z",
            updatedAt: "2024-09-22T19:38:03.477Z",
            publicationDate: "2024-09-28T21:30:00.000Z",
            title: "Meditación Part 4",
            medio: "audio",
            link: "https://www.youtube.com/watch?v=7rmTlyJSrPE",
            duration: "00:02:47",
            updatedBy: {
              userId: "9076eeb6-a891-4a13-81ed-cac848f1d6c4",
              name: "otilio bitancur",
            },
            createdBy: {
              userId: "9076eeb6-a891-4a13-81ed-cac848f1d6c4",
              name: "otilio bitancur",
            },
          },
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjcwMzM4ODMsImV4cCI6MTcyNzA2MjY4M30.66fMkED7v6TsYO4e5X0wy148LRMTPQI6rVqh_oubpw4",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: Invalid DTO or missing required fields.",
    schema: {
      example: {
        statusCode: 400,
        message: "Validation failed",
        error: "Bad Request",
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      "Internal Server Error: An unexpected error occurred during the update process.",
  })
  update(
    @Param("id") id: string,
    @Body() updateMultimediaDto: UpdateMultimediaDto,
    @GetUser() user: Users
  ) {
    return this.multimediaService.update(+id, updateMultimediaDto, user.userId);
  }

  @Delete(":id")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Delete Multimedia",
    description: "Deletes a multimedia entry by its ID from the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Multimedia deleted successfully.",
    schema: {
      example: {
        response: {
          message: "Se eliminó correctamente el medio con el id 1",
        },
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE3MjcwMzQ4MTgsImV4cCI6MTcyNzA2MzYxOH0.sE6lfZAe5Cz6jL5b3qsXLEUyvvOs5ZKJ2x_JCUfTFkI",
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: "Bad Request: Invalid ID or missing required fields.",
    schema: {
      example: {
        statusCode: 400,
        message: "Validation failed",
        error: "Bad Request",
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      "Internal Server Error: An unexpected error occurred during the deletion process.",
  })
  remove(@Param("id") id: string) {
    return this.multimediaService.remove(+id);
  }
}
