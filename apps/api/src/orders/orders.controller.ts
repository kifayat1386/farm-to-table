import { Controller, Post, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';

@Controller('v1/checkout')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('accrual')
  async createOrder(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }
}
