import { z } from "zod";
import { phoneNumberSchema } from "./phoneNumberSchema";
import { IUserRoleEnum } from "../../../interface/user";

export const LoginFormSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z
    .string({
      invalid_type_error: "Enter at least 6 characters",
    })
    .min(6),
});

export const AccessTokenSchema = z.object({
  expiresAt: z.string(),
  token: z.string(),
});

export const CompleteProfileSchema = z
  .object({
    role: z.enum(IUserRoleEnum),
  })
  .and(phoneNumberSchema());
