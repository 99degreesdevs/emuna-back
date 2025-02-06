import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ParseUUIDPipe,
} from "@nestjs/common";
import { AddressService } from "./address.service";
import { CreateAddressDto } from "./dto/create-address.dto";
import { UpdateAddressDto } from "./dto/update-address.dto";
import { Auth } from "src/auth/decorators/auth.decorator";
import { ValidRoles } from "src/auth/interfaces";
import { TokenInterceptor } from "src/auth/interceptors/token/token.interceptor";
import { GetUser } from "src/auth/decorators/user.decorator";
import { Users } from "src/users/entities"; 

@Controller("address")
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  create(@Body() createAddressDto: CreateAddressDto, @GetUser() user: Users) {
    return this.addressService.create(createAddressDto, user);
  }

  @Post("new-address")
  @Auth(ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  createNewAddress(
    @Body() createAddressDto: CreateAddressDto,
    @GetUser() user: Users
  ) {
    const {userId, ...rest} = createAddressDto; 
    return this.addressService.create(rest, user);
  }

  @Get("by-user/:userId")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  findAll(@Param("userId", ParseUUIDPipe) userId: string) {
    return this.addressService.findAll(userId);
  }

  @Get("my-address")
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  getMyAddress(@GetUser() user: Users) {
    return this.addressService.findAll(user.userId);
  }

  @Get(":id")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  findOne(@Param("id") id: string) {
    return this.addressService.findOne(+id);
  }

  @Patch(":id")
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  update(
    @Param("id") id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @GetUser() user: Users
  ) {
    return this.addressService.update(+id, updateAddressDto, user);
  }

  @Patch("update-address/:id")
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  updateAddress(
    @Param("id") id: string,
    @Body() updateAddressDto: UpdateAddressDto,
    @GetUser() user: Users
  ) {
    const {userId, ...rest} = updateAddressDto;
    return this.addressService.update(+id, rest, user);
  }

  @Delete(":id")
  @Auth(ValidRoles.admin)
  remove(@Param("id") id: string) {
    return this.addressService.remove(+id);
  }

  @Delete("remove-address/:id")
  @Auth(ValidRoles.admin, ValidRoles.user)
  removeAddressUser(@Param("id") id: string, @GetUser() user: Users) {
    return this.addressService.removeUser(+id, user.userId);
  }
}
