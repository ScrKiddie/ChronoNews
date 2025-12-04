import { z } from "zod";
import { PasswordSchema } from "../schemas/passwordSchema";

export type PasswordUpdate = z.infer<typeof PasswordSchema>;
