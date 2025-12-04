import { z } from "zod";
import { UserCreateSchema } from "../schemas/userSchema";

export type UserCreateRequest = z.infer<typeof UserCreateSchema> & {
    profilePicture?: File;
};

export interface UserFormData {
    name: string;
    phoneNumber: string;
    email: string;
    password?: string;
    role: string;
    deleteProfilePicture?: boolean;
    profilePicture?: string;
}

export interface UserUpdateRequest {
    name?: string;
    phoneNumber?: string;
    email?: string;
    password?: string;
    role?: string;
    deleteProfilePicture?: boolean;
    profilePicture?: File;
}
