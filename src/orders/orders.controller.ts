import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { ZodValidationPipe } from 'src/utils/validationPipe';
import {
  CreateOrderDto,
  UpdateOrderDto,
  createOrderSchema,
} from './dto/order.schema';
import { Public, Roles } from 'src/utils/middlewares';
import { UserRole } from 'src/users/entities/user.entity';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Public()
  @Post()
  @UsePipes(new ZodValidationPipe(createOrderSchema))
  async create(@Body() order: CreateOrderDto) {
    return this.ordersService.createOrder(order);
  }

  @Get()
  async retrieveAllOrders() {
    return this.ordersService.retrieveAllOrders();
  }

  @Public()
  @Get(':id')
  async retriveOrderById(@Param('id') id: string) {
    return this.ordersService.retriveOrderById(+id);
  }

  @Patch(':id')
  async updateOrderById(
    @Param('id') id: string,
    @Body() order: UpdateOrderDto,
  ) {
    return this.ordersService.updateOrderById(+id, order);
  }

  @Delete(':id')
  async deleteOrderById(@Param('id') id: string) {
    return this.ordersService.deleteOrderById(+id);
  }
}
