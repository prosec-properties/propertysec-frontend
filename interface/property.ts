import { ICategory } from "./category";
import { IProductAvailability } from "./product";
import { InspectionDetail, IUser } from "./user";
import { IState } from "./location";

export interface IProperty {
  id: string;
  userId: string;
  title: string;
  categoryId: string;
  type: IPropertyType;
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
  state: IState;
  description: string;
  status: IPropertyStatus;
  defaultImageUrl: string;
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

export interface IPropertyPurchase {
  id?: string;
  purchaseAmount: number;
  currency: string;
  purchaseStatus: "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  status?: string;
  paymentStatus?: string;
  transactionReference: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  purchaserName?: string;
  purchaserEmail?: string;
  purchaserPhone?: string;
  paymentMethod?: string;
  method?: string;
  paymentGateway?: string;
  gateway?: string;
  price?: number;
  createdAt: string;
  updatedAt?: string;
  user?: {
    fullName?: string;
    email?: string;
    phoneNumber?: string;
  };
  property: IProperty & {
    user?: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

export interface IPropertyInspection {
  id: string;
  inspectionAmount: number;
  inspectionStatus: "PENDING" | "COMPLETED";
  approvalStatus?: "approved" | "pending" | "rejected";
  inspectionReport: string;
  userId: string;
  propertyId: string;
  name: string;
  email: string;
  phoneNumber: string;
  inspectionDate: string;
  createdAt: string;
  updatedAt: string;
  property: IProperty & {
    user: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
    };
  };
}
