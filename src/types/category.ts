import { z } from 'zod';
import { CategorySchema } from '../schemas/categorySchema.ts';

export type Category = z.infer<typeof CategorySchema> & {
    id?: number;
};
