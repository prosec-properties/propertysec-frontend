import { z } from "zod";
import { phoneNumberSchema } from "./phoneNumberSchema";

export const LandlordProfileSchema = z
  .object({
    fullName: z.string().min(1, "Full name is required").optional(),
    email: z.string().email("Invalid email address").optional(),
    nationality: z.string().optional(),
    stateOfOrigin: z.string().optional(),
    businessName: z.string().optional(),
    businessRegNo: z.string().optional(),
    businessAddress: z.string().optional(),

    nin: z
      .string()
      .optional()
      .refine(
        (value) => {
          if (!value) return true;
          return (
            Boolean(value) &&
            !isNaN(Number(value)) &&
            typeof Number(value) === "number"
          );
        },
        {
          message: "NIN must be a number",
        }
      )
      .refine(
        (value) => {
          if (!value) return true;
          return value.length === 11;
        },
        {
          message: "NIN must be 11 digits long",
        }
      ),

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
