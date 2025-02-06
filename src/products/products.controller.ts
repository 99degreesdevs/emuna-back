import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ValidationPipe,
  UsePipes,
  Query,
} from "@nestjs/common";
import { ProductsService } from "./products.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { GetUser } from "src/auth/decorators/user.decorator";
import { Users } from "src/users/entities";
import { Auth } from "src/auth/decorators/auth.decorator";
import { TokenInterceptor } from "src/auth/interceptors/token/token.interceptor";
import { ValidRoles } from "src/auth/interfaces";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { SearchProductDto } from "./dto/search-package.dto";

@Controller("products")
@ApiTags("Products and Services")
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Create a new product",
    description: "Creates a new product in the system.",
  })
  @ApiResponse({
    status: 201,
    description: "Product created successfully.",
    schema: {
      example: {
        response: {
          message: "Se creó el producto o servicio dentista exitosamente",
          medio: {
            createdAt: "2024-09-23T00:14:49.744Z",
            sku: "fea08403-20db-4f54-9145-da3f790a2a29",
            product: "consulta dentista",
            description: "Consulta con un dentista.",
            type: "servicio",
            stockQuantity: 0,
            price: "0.00",
          },
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
      "Internal Server Error: An unexpected error occurred during creation.",
  })
  create(@Body() createProductDto: CreateProductDto, @GetUser() user: Users) {
    return this.productsService.create(createProductDto, user.userId);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Get all products and services",
    description: "Retrieves all products and services.",
  })
  @ApiResponse({
    status: 200,
    description: "Products and services retrieved successfully.",
    schema: {
      example: {
        response: {
          message: "Se obtuvieron 4 productos y servicios exitosamente",
          total: 4,
          products: [
            {
              sku: "27b0c056-6a33-4e1d-bfa0-5ff25c749a6a",
              product: "consulta dentista",
              type: "servicio",
              description: "Consulta con un dentista.",
              stockQuantity: 30,
              price: "0.00",
            },
          ],
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
      "Internal Server Error: An unexpected error occurred during retrieval.",
  })
  findAll() {
    return this.productsService.findAll();
  }

  @Get('search')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Get all products and services",
    description: "Retrieves all products and services.",
  })
  @ApiResponse({
    status: 200,
    description: "Products and services retrieved successfully.",
    schema: {
      example: {
        response: {
          message: "Se obtuvieron 4 productos y servicios exitosamente",
          total: 4,
          products: [
            {
              sku: "27b0c056-6a33-4e1d-bfa0-5ff25c749a6a",
              product: "consulta dentista",
              type: "servicio",
              description: "Consulta con un dentista.",
              stockQuantity: 30,
              price: "0.00",
            },
          ],
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
      "Internal Server Error: An unexpected error occurred during retrieval.",
  })
  findAllPagination(@Query() pageOptionsDto: SearchProductDto) {
    return this.productsService.findAllPagination(pageOptionsDto);
  }

  @Get(":sku")
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Get product by SKU",
    description: "Retrieves a specific product and service by its SKU.",
  })
  @ApiResponse({
    status: 200,
    description: "Product retrieved successfully.",
    schema: {
      example: {
        response: {
          message:
            "Se obtuvo el producto o servicio con el sku fea08403-20db-4f54-9145-da3f790a2a29 exitosamente",
          product: {
            sku: "fea08403-20db-4f54-9145-da3f790a2a29",
            createdAt: "2024-09-23T00:14:49.744Z",
            updatedAt: "2024-09-23T00:14:49.738Z",
            product: "consulta dentista",
            type: "servicio",
            description: "Consulta con un dentista.",
            stockQuantity: 0,
            price: "0.00",
            updatedBy: null,
            createdBy: {
              userId: "9076eeb6-a891-4a13-81ed-cac848f1d6c4",
              name: "otilio betancur",
            },
          },
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not Found: Product with given SKU does not exist.",
    schema: {
      example: {
        statusCode: 404,
        message: "Product not found",
        error: "Not Found",
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      "Internal Server Error: An unexpected error occurred during retrieval.",
  })
  findOne(@Param("sku") sku: string) {
    return this.productsService.findOne(sku);
  }

  @Patch(":sku")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Update product by SKU",
    description: "Updates an existing product or service identified by SKU.",
  })
  @ApiResponse({
    status: 200,
    description: "Product updated successfully.",
    schema: {
      example: {
        response: {
          message:
            "Se actualizó el producto o servicio con el sku fea08403-20db-4f54-9145-da3f790a2a29 exitosamente.",
          product: {
            sku: "fea08403-20db-4f54-9145-da3f790a2a29",
            product: "Consulta dentista",
            type: "producto",
            description: "Consulta con un dentista.",
            stockQuantity: 50,
            price: "185.50",
          },
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
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
    status: 404,
    description: "Not Found: Product with given SKU does not exist.",
    schema: {
      example: {
        statusCode: 404,
        message: "Product not found",
        error: "Not Found",
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      "Internal Server Error: An unexpected error occurred during update.",
  })
  update(
    @Param("sku") sku: string,
    @Body() updateProductDto: UpdateProductDto,
    @GetUser() user: Users
  ) {
    return this.productsService.update(sku, updateProductDto, user.userId);
  }

  @Delete(":sku")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({
    summary: "Delete product or service by SKU",
    description: "Deletes a product identified by SKU.",
  })
  @ApiResponse({
    status: 200,
    description: "Product deleted successfully.",
    schema: {
      example: {
        response: {
          message:
            "Se eliminó correctamente el producto o servicio con el sku fea08403-20db-4f54-9145-da3f790a2a29",
        },
        token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: "Not Found: Product with given SKU does not exist.",
    schema: {
      example: {
        statusCode: 404,
        message: "Product not found",
        error: "Not Found",
      },
    },
  })
  @ApiResponse({
    status: 500,
    description:
      "Internal Server Error: An unexpected error occurred during deletion.",
  })
  remove(@Param("sku") sku: string) {
    return this.productsService.remove(sku);
  }
}
