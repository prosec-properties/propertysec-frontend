import { z } from "zod";

export const PasswordSchema = z
  .object({
    password: z
      .string({
        invalid_type_error: "Enter at least 6 characters",
      })
      .min(6),
    confirmPassword: z
      .string({
        invalid_type_error: "Enter at least 6 characters",
      })
      .min(6),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords must match!",
    path: ["confirmPassword"],
  });
