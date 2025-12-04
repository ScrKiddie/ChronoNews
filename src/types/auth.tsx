import { z } from "zod";
import { loginSchema } from "../schemas/authSchema.tsx";

export type LoginData = z.infer<typeof loginSchema>;
