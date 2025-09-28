import { z } from "zod";

export const PropertyFormSchema = z.object({
  // Property Details
  title: z.string().min(3, "Title must be at least 3 characters long."),
  categoryId: z.string().min(1, "Please select the category of the property."),
  type: z.string().min(1, "Please select the type of property."),
  purpose: z.enum(['sale', 'rent', 'shortlet'], {
    required_error: "Please select the purpose of the property.",
  }),
  bedrooms: z.string().min(1, "Please enter the number of bedrooms."),
  bathrooms: z.string().min(1, "Please enter the number of bathrooms."),
  toilets: z.string().min(1, "Please enter the number of toilets."),

  // Property Address
  stateId: z.string().min(1, "Please enter the state of the property."),
  cityId: z.string().min(1, "Please enter the city of the property."),
  address: z.string().min(1, "Please enter the address of the property."),
  street: z.string().min(1, "Please enter the street of the property."),

  // Price details
  price: z.string().min(1, "Please enter the price of the property."),
  currency: z.string().min(1, "Please enter the currency of the property."),
  // append: z.string().min(1, "Please enter the appendTo of the property."),

  // Description
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long."),
});
