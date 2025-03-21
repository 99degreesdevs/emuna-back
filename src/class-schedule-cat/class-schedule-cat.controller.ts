import {
  Controller,
  Get,
  Post,
  Body, 
  Param,
  Delete,
  UseInterceptors,
  Put,
} from "@nestjs/common";
import { ClassScheduleCatService } from "./class-schedule-cat.service";
import { CreateClassScheduleCatDto } from "./dto/create-class-schedule-cat.dto"; 
import { Auth } from "src/auth/decorators/auth.decorator";
import { ValidRoles } from "src/auth/interfaces";
import { TokenInterceptor } from "src/auth/interceptors/token/token.interceptor";
import { ApiResponse } from "@nestjs/swagger";
import { ApiOperation } from "@nestjs/swagger";
import { ApiParam } from "@nestjs/swagger";
import { ClassScheduleCat } from "./entities";

@Controller("class-schedule-cat")
export class ClassScheduleCatController {
  constructor(
    private readonly classScheduleCatService: ClassScheduleCatService
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Create a new class schedule category' })
  @ApiResponse({ 
    status: 201, 
    description: 'The class schedule category has been successfully created',
    type: ClassScheduleCat 
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  create(@Body() createClassScheduleCatDto: CreateClassScheduleCatDto) {
    return this.classScheduleCatService.create(createClassScheduleCatDto);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Get all class schedule categories' })
  @ApiResponse({ 
    status: 200, 
    description: 'List of all active class schedule categories',
    type: [ClassScheduleCat]
  })
  findAll() {
    return this.classScheduleCatService.findAll();
  }

  @Put(":id")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Update a class schedule category' })
  @ApiParam({ name: 'id', description: 'Class schedule category ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The class schedule category has been successfully updated',
    type: ClassScheduleCat
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  @ApiResponse({ status: 404, description: 'Class schedule category not found' })
  update(@Param("id") id: string, @Body() updateClassScheduleCatDto: CreateClassScheduleCatDto) {
    return this.classScheduleCatService.update(+id, updateClassScheduleCatDto);
  }

  @Delete(":id")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @ApiOperation({ summary: 'Delete a class schedule category' })
  @ApiParam({ name: 'id', description: 'Class schedule category ID' })
  @ApiResponse({ 
    status: 200, 
    description: 'The class schedule category has been successfully deactivated'
  })
  @ApiResponse({ status: 403, description: 'Forbidden - requires admin role' })
  @ApiResponse({ status: 404, description: 'Class schedule category not found' })
  remove(@Param("id") id: string) {
    return this.classScheduleCatService.remove(+id);
  }
}
