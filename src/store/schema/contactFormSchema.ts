import { z } from "zod";
import { phoneNumberSchema } from "./phoneNumberSchema";

export const ContactFormSchema = z
  .object({
    firstName: z.string().min(1, "Name is required"),
    lastName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    message: z.string().min(1, "Message is required"),
  })
  .and(phoneNumberSchema());
