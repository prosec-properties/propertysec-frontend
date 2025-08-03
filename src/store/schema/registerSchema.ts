import { z } from "zod";
import { phoneNumberSchema } from "./phoneNumberSchema";
import { IUserRoleEnum } from "../../../interface/user";
import { PasswordSchema } from "./passwordSchema";

export const RegisterFormSchema = z
  .object({
    fullName: z.string({
      invalid_type_error: "Please enter a valid full name.",
    }),
    role: z.enum(IUserRoleEnum),
    email: z.string().email("Enter a valid email"),
  })
  .and(PasswordSchema)
  .and(phoneNumberSchema());
