import { z } from "zod"
import {
    validateName,
    validatePhoneNumber,
    validateEmail,
} from "./UserSchema"

export const ProfileSchema = z.object({
    name: validateName,
    phoneNumber: validatePhoneNumber,
    email: validateEmail,
})
