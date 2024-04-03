import { z } from 'zod';

export const createProductSchema = z.object({
  name: z.string({ required_error: 'Product name is required' }),
  price: z.number({ required_error: 'Product price is required' }),
  imageSrc: z
    .string({ required_error: 'Product imageSrc is required' })
    .array(),
  description: z.string({ required_error: 'Product description is required' }),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;

export const retrieveProductSchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  sort: z.string().optional(),
  order: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
});

export type RetrieveProductDto = z.infer<typeof retrieveProductSchema>;

export const updateProductSchema = z.object({
  name: z.string({ required_error: 'Product name is required' }),
  price: z.number({ required_error: 'Product price is required' }),
  imageSrc: z
    .string({ required_error: 'Product imageSrc is required' })
    .array(),
  description: z.string({ required_error: 'Product description is required' }),
});

export type UpdateProductDto = z.infer<typeof updateProductSchema>;
