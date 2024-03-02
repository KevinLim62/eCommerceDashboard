import { z } from 'zod';

export const createUploadSchema = z.object({
  name: z.string({ required_error: 'File name is required' }),
});

export type CreateUploadDto = z.infer<typeof createUploadSchema>;
