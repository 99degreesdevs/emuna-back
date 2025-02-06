import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
} from "@nestjs/common";
import { MotivationalQuotesService } from "./motivational-quotes.service";
import { CreateMotivationalQuoteDto } from "./dto/create-motivational-quote.dto";
import { UpdateMotivationalQuoteDto } from "./dto/update-motivational-quote.dto";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { TokenInterceptor } from "src/auth/interceptors/token/token.interceptor";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ValidRoles } from "src/auth/interfaces";
import { GetUser } from "src/auth/decorators/user.decorator";
import { Users } from "src/users/entities";

@Controller("motivational-quotes")
@ApiTags("Motivational Quotes")
@ApiBearerAuth()
export class MotivationalQuotesController {
  constructor(
    private readonly motivationalQuotesService: MotivationalQuotesService
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Create Motivational Quote",
    description: "Creates a new motivational quote entry in the database.",
  })
  @ApiResponse({
    status: 201,
    description: "Motivational quote created successfully.",
    schema: {
      example: {
        message: "Motivational quote created successfully.",
        motivationalQuote: {
          id: 6,
          createdAt: "2024-09-02T22:04:31.774Z",
          title: "Embrace the Challenge",
          quote: "This quote highlights that facing challenges can be an opportunity for growth and learning.",
          publicationDate: "2024-09-02T22:30:00.000Z",
          createdBy: "9076eeb6-a891-4a13-81ed-cac848f1d6c4",
        },
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
    description: "Internal Server Error: An unexpected error occurred during the creation process.",
  })
  create(
    @Body() createMotivationalQuoteDto: CreateMotivationalQuoteDto,
    @GetUser() user: Users
  ) {
    return this.motivationalQuotesService.create(
      createMotivationalQuoteDto,
      user.userId
    );
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Get all Motivational Quotes",
    description: "Retrieves all motivational quotes from the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Motivational quotes retrieved successfully.",
    schema: {
      example: {
        message: "Successfully retrieved all motivational quotes.",
        total: 6,
        motivationalQuotes: [
          {
            id: 6,
            createdAt: "2024-09-02T22:04:31.774Z",
            publicationDate: "2024-09-02T22:30:00.000Z",
            title: "Embrace the Challenge",
            quote: "This quote highlights that facing challenges can be an opportunity for growth and learning.",
          },
        ],
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
    description: "Internal Server Error: An unexpected error occurred during the retrieval process.",
  })
  findAll() {
    return this.motivationalQuotesService.findAll();
  }

  @Get('quote-day')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Get all Motivational Quotes",
    description: "Retrieves all motivational quotes from the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Motivational quotes retrieved successfully.",
    schema: {
      example: {
        message: "Successfully retrieved all motivational quotes.",
        total: 6,
        motivationalQuotes: [
          {
            id: 6,
            createdAt: "2024-09-02T22:04:31.774Z",
            publicationDate: "2024-09-02T22:30:00.000Z",
            title: "Embrace the Challenge",
            quote: "This quote highlights that facing challenges can be an opportunity for growth and learning.",
          },
        ],
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
    description: "Internal Server Error: An unexpected error occurred during the retrieval process.",
  })
  findQuoteDay() {
    return this.motivationalQuotesService.findQuoteDay();
  }

  @Get(":id")
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Get Motivational Quote by ID",
    description: "Retrieves a motivational quote by its ID from the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Motivational quote retrieved successfully.",
    schema: {
      example: {
        message: "Successfully retrieved the motivational quote with ID 1.",
        motivationalQuote: {
          id: 1,
          createdAt: "2024-09-02T21:30:10.251Z",
          updatedAt: "2024-09-02T21:35:10.251Z",
          publicationDate: "2024-09-02T21:30:10.251Z",
          title: "Embrace the Challenge",
          quote: "This quote highlights that facing challenges can be an opportunity for growth and learning.",
          createdBy: {
            userId: "9076eeb6-a891-4a13-81ed-cac848f1d6c4",
            name: "Otilio Betancur",
          },
          updatedBy: {
            userId: "9076eeb6-a891-4a13-81ed-cac848f1d6c4",
            name: "Otilio Betancur",
          }, 
          isNotificated: false,
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
    description: "Internal Server Error: An unexpected error occurred during the retrieval process.",
  })
  findOne(@Param("id") id: string) {
    return this.motivationalQuotesService.findOne(+id);
  }

  @Patch(":id")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Update Motivational Quote",
    description: "Updates a motivational quote by its ID in the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Motivational quote updated successfully.",
    schema: {
      example: {
        message: "Motivational quote updated successfully.",
        motivationalQuote: {
          id: 2,
          createdAt: "2024-09-02T21:32:43.542Z",
          updatedAt: "2024-09-03T03:35:54.208Z",
          publicationDate: "2024-09-04T22:30:00.000Z",
          title: "Updated Title",
          quote: "Updated quote text.",
        },
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
    description: "Internal Server Error: An unexpected error occurred during the update process.",
  })
  update(
    @Param("id") id: string,
    @Body() updateMotivationalQuoteDto: UpdateMotivationalQuoteDto,
    @GetUser() user: Users
  ) {
    return this.motivationalQuotesService.update(
      +id,
      updateMotivationalQuoteDto,
      user.userId
    );
  }

  @Delete(":id")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Delete Motivational Quote",
    description: "Deletes a motivational quote by its ID from the database.",
  })
  @ApiResponse({
    status: 200,
    description: "Motivational quote deleted successfully.",
    schema: {
      example: {
        message: "Motivational quote with ID 1 deleted successfully.",
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
    description: "Internal Server Error: An unexpected error occurred during the deletion process.",
  })
  remove(@Param("id") id: string, @GetUser() user: Users) {
    return this.motivationalQuotesService.remove(+id, user.userId);
  }
}
