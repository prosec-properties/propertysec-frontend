export type FileFormat = "IMAGE" | "VIDEO" | "DOC";

export type IProfileFileCategory =
  | "passport"
  | "power_of_attorney"
  | "id_card"
  | "approval_agreement"
  | "profile_image"
  | "other";

export interface FileData {
  id: string;
  url: string;
  format: FileFormat;
  meta: null | {
    selectedImage: boolean;
    clientName: string;
    size: number;
    type: string;
    [key: string]: any;
  };
  createdAt: string;
  updatedAt: string;
}

export interface IProfileFileInterface {
  id: string;
  userId: string;
  fileUrl: string;
  fileName: string;
  fileType: "image" | "video" | "other";
  fileCategory: IProfileFileCategory;
  meta?: string;
  createdAt: string;
  updatedAt: string;
}

export type ICategoryType = 'product' | 'property' 