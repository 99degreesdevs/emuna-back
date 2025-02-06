import {
  Controller,
  Get, 
  Param, 
  UseInterceptors,
  Query,
} from "@nestjs/common";
import { ClassScheduleTransactionService } from "./class-schedule-transaction.service"; 
import { Auth } from "src/auth/decorators/auth.decorator";
import { ValidRoles } from "src/auth/interfaces";
import { TokenInterceptor } from "src/auth/interceptors/token/token.interceptor";
import { SearchClassScheduleTransactionDto } from "./dto/search-transaction.dto";
import { GetUser } from "src/auth/decorators/user.decorator";
import { Users } from "src/users/entities";
import { PageOptionsDto } from "src/common/pagination";
@Controller("class-schedule-transaction")
export class ClassScheduleTransactionController {
  constructor(
    private readonly classScheduleTransactionService: ClassScheduleTransactionService
  ) {}

  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @Get()
  findAll(@Query() pageOptionsDto: SearchClassScheduleTransactionDto) {
    return this.classScheduleTransactionService.findAll(pageOptionsDto);
  }

  @Get("transaction/:id")
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  findOne(@Param("id") id: string) {
    return this.classScheduleTransactionService.findOne(+id);
  }

  @Get("my-classes")
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  getMyClasses(@GetUser() user: Users, @Query() pageOptionsDto: PageOptionsDto) {
    console.log("Myclsaess");
    return this.classScheduleTransactionService.getMyClasess(
      user.userId,
      pageOptionsDto
    );
  }
}
