import { z } from "zod";
import { CategorySchema } from "../schemas/categorySchema.tsx";

export type Category = z.infer<typeof CategorySchema> & {
    id?: number;
};
