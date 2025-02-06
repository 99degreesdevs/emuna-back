import {
  Controller,
  Get,
  ParseUUIDPipe,
  Query,
  UseInterceptors,
} from "@nestjs/common";
import { CreditsService } from "./credits.service";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ValidRoles } from "src/auth/interfaces";
import { TokenInterceptor } from "src/auth/interceptors/token/token.interceptor";
import { GetUser } from "src/auth/decorators/user.decorator";
import { Users } from "src/users/entities";

@Controller("credits")
export class CreditsController {
  constructor(private readonly creditsService: CreditsService) {}

  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  @Get("my-credits")
  myCredits(@GetUser() user: Users) {
    return this.creditsService.myCredits(user.userId);
  }

  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  @Get("user-credits/:userId")
  userCredits(@Query("userId", ParseUUIDPipe) userId: string) {
    return this.creditsService.myCredits(userId);
  }
}
