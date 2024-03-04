import { z } from 'zod';
import { OrderStatus } from '../entities/order.entity';
import { CreateOrderItemDto, UpdateOrderItemDto } from './orderItem.schema';

export const createOrderSchema = z.object({
  orderStatus: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  orderItem: z.custom<CreateOrderItemDto>().array(),
  expireTime: z.number().default(300),
});

export type CreateOrderDto = z.infer<typeof createOrderSchema>;

export const updateOrderSchema = z.object({
  orderStatus: z.nativeEnum(OrderStatus).default(OrderStatus.PENDING),
  orderItem: z.custom<UpdateOrderItemDto>().array(),
  expireTime: z.number().default(300),
});

export type UpdateOrderDto = z.infer<typeof updateOrderSchema>;
