import { z } from 'zod';

export const createOrderItemSchema = z.object({
  productId: z.string({ required_error: 'Product Id is required' }),
  quantity: z.number({ required_error: 'OrderItem quantity is required' }),
});

export type CreateOrderItemDto = z.infer<typeof createOrderItemSchema>;

export const updateOrderItemSchema = z.object({
  productId: z.string({ required_error: 'Product Id is required' }),
  quantity: z.number({ required_error: 'OrderItem quantity is required' }),
});

export type UpdateOrderItemDto = z.infer<typeof updateOrderItemSchema>;
