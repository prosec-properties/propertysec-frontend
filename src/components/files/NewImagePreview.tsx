import React, { Dispatch, SetStateAction } from "react";
import { UploadImageFormat } from "../../../interface/image";
import UploadWithImageDisplay, {
  SelectedImagePreview,
} from "./UploadWithImageDisplay";
import { cn } from "@/lib/utils";
import Image from "next/image";

export interface IExistingImage {
  id: string;
  url: string;
  itemId: string;
}

interface Props {
  name: string;
  wrapperClass?: string;
  uploadAreaClass?: string;
  files: File[] | undefined;
  isMultiple?: boolean;
  errorMessage?: string;
  errorClass?: string;
  format: UploadImageFormat;
  selectedPhoto: SelectedImagePreview;
  setSelectedPhoto: React.Dispatch<
    React.SetStateAction<SelectedImagePreview | null>
  >;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
  setHasError?: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage?: React.Dispatch<React.SetStateAction<string>>;
  fileType: "image" | "video" | "both"; // default is image
  maxFileNumber?: number;
  existingImages: IExistingImage[] | null;
  isVideoUploadAllowed?: boolean; 
}

const NewImagePreview = (props: Props) => {
  const [selected, setSelected] = React.useState<
    SelectedImagePreview | undefined
  >();

  React.useEffect(() => {
    if (!props.selectedPhoto) return;
    setSelected(props.selectedPhoto);
  }, [props.selectedPhoto]);

  const isImage = selected?.image?.file.type.startsWith("image");
  const isVideo = selected?.image?.file.type.startsWith("video");

  return (
    <div
      className={cn(`
        flex
        h-full
        w-full
        flex-col
        justify-between
        gap-x-4
        gap-y-6
        sm:flex-row
      `)}
    >
      {selected && (
        <>
          {isImage ? (
            <div className="sm:basis-[50%] bg-red-800 h-[300px] w-[300px]">
              <Image
                src={selected.image.url}
                alt={selected.fileName}
                width={300}
                height={300}
                className="h-full w-full object-cover"
              />
            </div>
          ) : isVideo ? (
            <div className="sm:basis-[50%] bg-red-800 h-[300px] w-[300px]">
              <video
                width={300}
                height={300}
                controls
                src={selected.image.url}
                className="h-full w-full object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : null}
        </>
      )}
      <div className="sm:basis-[50%]">
        <UploadWithImageDisplay
          format="multiple"
          files={props.files}
          setFiles={props.setFiles}
          name="files"
          selectedPhoto={props.selectedPhoto}
          setSelectedPhoto={props.setSelectedPhoto}
          fileType={props.fileType}
          maxFileNumber={props.maxFileNumber}
          existingImages={props.existingImages}
          isVideoUploadAllowed={props.isVideoUploadAllowed} 
        />
      </div>
    </div>
  );
};

export default NewImagePreview;
