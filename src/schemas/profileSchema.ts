import { z } from 'zod';
import { validateName, validatePhoneNumber, validateEmail } from './userSchema.ts';

export const ProfileSchema = z.object({
    name: validateName,
    phoneNumber: validatePhoneNumber,
    email: validateEmail,
});
