import { z } from "zod";
import { phoneNumberSchema } from "./phoneNumberSchema";

export const InspectionDetailsSchema = z
  .object({
    fullName: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
  })
  .and(phoneNumberSchema());
