export enum PRODUCT_CONDITION_ENUMS {
  NEW = "new",
  USED = "used",
  REFURBISHED = "refurbished",
}

export enum IPRODUCT_STATUS_ENUMS {
  DRAFT = "draft",
  PUBLISHED = "published",
  PENDING = "pending",
  CLOSED = "closed",
  REJECTED = "rejected",
}

export type IProductStatus =
  | "draft"
  | "published"
  | "pending"
  | "closed"
  | "rejected";

export type IProductCondition = "new" | "used" | "refurbished";

export interface IProduct {
  id: string;
  title: string;
  description: string;
  price: number;
  condition: IProductCondition;
  status: IProductStatus;
  brand?: string;
  model?: string;
  specifications?: string | null;
  countryId: string;
  stateId: string;
  cityId: string;
  address: string;
  userId: string;
  availability: IProductAvailability
  categoryId: string;
  subCategoryId: string;
  negotiable: boolean;
  quantity: number;
  views: number;
  files: IProductFileRecord[];
  defaultImageUrl?: string;
  meta?: string;
  createdAt: string;
  updatedAt: string;
}

export interface IProductFileRecord {
  id: string;
  productId: string;
  fileUrl: string;
  fileName: string;
  fileType: string;
  meta: string | IProductFileMetadata; // JSON string representing IFileMetadata
  createdAt: string;
  updatedAt: string;
}

export interface IProductFileMetadata {
  clientName: string;
  size: number;
  type: string;
}

export type IProductAvailability = "available" | "sold"