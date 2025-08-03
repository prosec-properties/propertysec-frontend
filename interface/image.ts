export interface ImagePreview {
  url: string;
  name: string;
  file: File;
}

export type UploadImageFormat = "single" | "multiple";

export interface SelectedImagePreview {
  image: ImagePreview;
  fileName: string;
}
