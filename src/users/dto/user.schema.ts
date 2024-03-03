import { z } from 'zod';
import { UserRole } from '../entities/user.entity';

export const createUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  email: z.string({ required_error: 'Email is required' }),
  password: z.string({ required_error: 'Password is required' }),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  name: z.string({ required_error: 'Name is required' }),
  email: z.string({ required_error: 'Email is required' }),
  password: z.string({ required_error: 'Password is required' }),
  role: z.nativeEnum(UserRole).default(UserRole.USER),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;
