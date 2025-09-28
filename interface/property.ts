import { ICategory } from "./category";
import { IProductAvailability } from "./product";
import { InspectionDetail, IUser } from "./user";

export interface IProperty {
  id: string;
  userId: string;
  title: string;
  categoryId: string;
  type: IPropertyType;
  purpose: IPropertyPurpose;
  bedrooms: number;
  bathrooms: number;
  toilets: number;
  address: string;
  availability: IProductAvailability;
  street: string;
  price: number;
  currency: string;
  append?: string;
  stateId: string;
  cityId: string;
  description: string;
  status: IPropertyStatus;
  defaultImageUrl?: string;
  meta?: string;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  category: ICategory;
  files: IPropertyFileRecord[];

  inspections?: InspectionDetail[];
}

export const PROPERTY_TYPE_ENUMS = [
  "All",
  "House",
  "Apartment",
  "Office",
  "Land",
  "Warehouse",
  "Shop",
  "Hotel",
  "Event Center",
  "School",
  "Church",
  "Mosque",
  "Factory",
  "Farm",
  "Hostel",
  "Restaurant",
  "Bar",
  "Club",
  "Gym",
  "Salon",
  "Spa",
  "Cinema",
  "Theater",
  "Hospital",
  "Clinic",
  "Pharmacy",
  "Supermarket",
  "Mall",
  "Market",
  "Petrol Station",
] as const;

export type IPropertyType = (typeof PROPERTY_TYPE_ENUMS)[number];

export type IPropertyStatus =
  | "draft"
  | "published"
  | "pending"
  | "closed"
  | "rejected";

export interface IPropertyFileMetadata {
  clientName: string;
  size: number;
  type: string;
}

export interface IPropertyFileRecord {
  id: string;
  propertyId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  meta: string | IPropertyFileMetadata; // JSON string representing IFileMetadata
  createdAt: string;
  updatedAt: string;
}

export type IPropertyPurpose = "sale" | "rent" | "shortlet";
