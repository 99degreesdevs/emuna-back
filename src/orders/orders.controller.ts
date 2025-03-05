import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { TokenInterceptor } from 'src/auth/interceptors/token/token.interceptor';
import { Auth } from 'src/auth/decorators/auth.decorator';
import { ValidRoles } from 'src/auth/interfaces';
import { GetUser } from 'src/auth/decorators/user.decorator';
import { Users } from 'src/users/entities';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  create(@Body() createOrderDto: CreateOrderDto, @GetUser() user: Users) { 
    console.log(user);
    return this.ordersService.create(createOrderDto, user.userId);
  }

  @Get()
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  findAll() {
    return this.ordersService.findAll();
  } 

  @Get(':order')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  findOne(@Param('order') order: string) {
    return this.ordersService.findOne(order);
  }

  @Patch(':order')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  update(@Param('order') order: string, @Body() updateOrderDto: UpdateOrderDto) {
    return this.ordersService.update(order, updateOrderDto);
  }

  @Delete(':order')
  @Auth(ValidRoles.admin)
  @UseInterceptors(TokenInterceptor)
  remove(@Param('order') order: string) {
    return this.ordersService.remove(order);
  }

  @Get('order/:userId')
  @Auth(ValidRoles.admin, ValidRoles.user)
  @UseInterceptors(TokenInterceptor)
  findByUser(@Param('userId') userId: string) {
    return this.ordersService.findByUser(userId);
  }
}
