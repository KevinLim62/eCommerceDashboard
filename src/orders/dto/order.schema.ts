import { z } from 'zod';
import { OrderStatus } from '../entities/order.entity';
import { CreateOrderItemDto, UpdateOrderItemDto } from './orderItem.schema';

export const createOrderSchema = z.object({
  orderStatus: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  orderItem: z.custom<CreateOrderItemDto>().array(),
  expireTime: z.number({ required_error: 'Order expire time is required' }),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = z.object({
  orderStatus: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  orderItem: z.custom<UpdateOrderItemDto>().array(),
  expireTime: z.number({ required_error: 'Order expire time is required' }),
});

export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
