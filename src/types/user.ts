import { z } from 'zod';
import { UserCreateSchema, UserUpdateSchema } from '../schemas/userSchema.ts';
import { ProfileSchema } from '../schemas/profileSchema.ts';

export type User = z.infer<typeof UserCreateSchema> & {
    id: number;
    profilePicture?: string;
    createdAt: string;
    updatedAt: string;
};

export type UserCreateRequest = z.infer<typeof UserCreateSchema> & {
    profilePicture?: File;
};

export type UserUpdateRequest = z.infer<typeof UserUpdateSchema> & {
    profilePicture?: File;
    deleteProfilePicture?: boolean;
};

export type ProfileUpdateServiceRequest = z.infer<typeof ProfileSchema> & {
    profilePicture?: File;
    deleteProfilePicture?: boolean;
};

export type UserManagementFormData = z.infer<typeof UserCreateSchema> &
    z.infer<typeof UserUpdateSchema> & {
        deleteProfilePicture?: boolean;
        profilePicture?: string;
    };

export type ProfileFormData = z.infer<typeof ProfileSchema> & {
    deleteProfilePicture?: boolean;
    profilePicture?: string;
};
