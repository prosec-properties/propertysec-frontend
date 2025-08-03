import { z } from "zod";
import { phoneNumberSchema } from "./phoneNumberSchema";

export const BuyerProfileSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    nationality: z.string().optional(),

    // Address Details
    stateOfResidence: z.string().optional(),
    cityOfResidence: z.string().optional(),
    homeAddress: z.string().optional(),

    // Password update
    oldPassword: z
      .string()
      .min(6, "Old password must be at least 6 characters long")
      .optional()
      .or(z.literal("")),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters long")
      .optional()
      .or(z.literal("")),
    confirmPassword: z
      .string()
      .min(6, "Confirm password must be at least 6 characters long")
      .optional()
      .or(z.literal("")),
  })
  .and(phoneNumberSchema().optional())
  .refine(
    (value) => {
      if (!value.password && !value.confirmPassword) return true;
      return value.password === value.confirmPassword;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"], // Optionally specify the path to the field with the error
    }
  );
