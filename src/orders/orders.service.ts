import { Injectable } from '@nestjs/common';
import { CreateOrderDto, UpdateOrderDto } from './dto/order.schema';
import { DeleteResult, Repository } from 'typeorm';
import { Order, OrderEntity } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductsService } from 'src/products/products.service';
import { OrderItemEntity } from './entities/orderItem.entity';
import { createStripePaymentLink } from 'src/utils/stripe';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class OrdersService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly ordersRepository: Repository<OrderEntity>,
    private productsService: ProductsService,
    private usersService: UsersService,
  ) {}

  async createOrder(order: CreateOrderDto) {
    const Order = new OrderEntity();
    Order.orderStatus = order.orderStatus;
    Order.expireTime = order.expireTime;

    const orderItem = await Promise.all(
      order.orderItem.map(async (item) => {
        const OrderItem = new OrderItemEntity();
        const Product = await this.productsService.retrieveProductById(
          +item.productId,
        );

        OrderItem.product = Product;
        OrderItem.quantity = item.quantity;

        return OrderItem;
      }),
    );

    const user = await this.usersService.retrieveUserById(+order.userId);

    Order.orderItem = orderItem;
    Order.user = user;
    const paymentOrder = await this.ordersRepository.save(Order);
    const paymentLink = await createStripePaymentLink(
      paymentOrder.id.toString(),
      order,
    );

    return {
      Order: paymentOrder,
      StripePaymentLink: paymentLink,
    };
  }
  async retrieveAllOrders(): Promise<Order[]> {
    return this.ordersRepository.find({
      relations: { orderItem: { product: true }, user: true },
    });
  }

  async retriveOrderById(id: number): Promise<Order> {
    return this.ordersRepository.findOne({
      where: {
        id: id,
      },
      relations: { orderItem: { product: true }, user: true },
    });
  }

  async retriveOrderByUserId(userId: number): Promise<Order[]> {
    return this.ordersRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      relations: { orderItem: { product: true }, user: true },
    });
  }

  async updateOrderById(id: number, order: UpdateOrderDto): Promise<Order> {
    await this.ordersRepository.update(id, order);
    return this.retriveOrderById(id);
  }

  async deleteOrderById(id: number): Promise<DeleteResult> {
    return this.ordersRepository.delete(id);
  }
}
