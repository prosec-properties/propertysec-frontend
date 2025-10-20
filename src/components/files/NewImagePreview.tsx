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
  onRemoveExistingImage?: (imageId: string) => void;
}

const NewImagePreview = (props: Props) => {
  const [selected, setSelected] = React.useState<
    SelectedImagePreview | undefined
  >();

  React.useEffect(() => {
    if (!props.selectedPhoto) return;
    setSelected(props.selectedPhoto);
  }, [props.selectedPhoto]);

  const fileType = selected?.image?.file?.type ?? "";
  const isImage = fileType.startsWith("image");
  const isVideo = fileType.startsWith("video");

  const previewWrapperClasses = cn(
    "relative mx-auto w-full overflow-hidden rounded-lg bg-neutral-100 sm:mx-0",
    "max-w-[240px] h-[200px]",
    "sm:max-w-[320px] sm:h-[240px]",
    "md:max-w-[360px] md:h-[260px]",
    "lg:max-w-[420px] lg:h-[300px]",
    "xl:max-w-[480px] xl:h-[340px]"
  );

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
        <div>
          {isImage ? (
            <div className={cn("sm:basis-[50%]", previewWrapperClasses)}>
              <Image
                src={selected.image.url}
                alt={selected.fileName}
                fill
                sizes="(min-width: 1280px) 480px, (min-width: 1024px) 420px, (min-width: 768px) 360px, (min-width: 640px) 320px, 240px"
                className="object-contain"
              />
            </div>
          ) : isVideo ? (
            <div className={cn("sm:basis-[50%]", previewWrapperClasses)}>
              <video
                controls
                src={selected.image.url}
                className="h-full w-full object-contain"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          ) : null}
        </div>
      )}
      <div className="sm:basis-[50%] w-full">
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
          onRemoveExistingImage={props.onRemoveExistingImage}
        />
      </div>
    </div>
  );
};

export default NewImagePreview;
