import { z } from "zod";
import { ResetRequestSchema, ResetSchema } from "../schemas/resetSchema";

export type ResetRequest = z.infer<typeof ResetRequestSchema>;
export type Reset = z.infer<typeof ResetSchema>;
