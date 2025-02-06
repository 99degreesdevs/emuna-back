import {
  Controller,
  Get,
  Post,
  Body, 
  Param,
  Delete,
  UseInterceptors,
} from "@nestjs/common";
import { ClassScheduleCatService } from "./class-schedule-cat.service";
import { CreateClassScheduleCatDto } from "./dto/create-class-schedule-cat.dto"; 
import { Auth } from "src/auth/decorators/auth.decorator";
import { ValidRoles } from "src/auth/interfaces";
import { TokenInterceptor } from "src/auth/interceptors/token/token.interceptor";

@Controller("class-schedule-cat")
export class ClassScheduleCatController {
  constructor(
    private readonly classScheduleCatService: ClassScheduleCatService
  ) {}

  @Post()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  create(@Body() createClassScheduleCatDto: CreateClassScheduleCatDto) {
    return this.classScheduleCatService.create(createClassScheduleCatDto);
  }

  @Get()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  findAll() {
    return this.classScheduleCatService.findAll();
  }

  @Delete(":id")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  remove(@Param("id") id: string) {
    return this.classScheduleCatService.remove(+id);
  }
}
