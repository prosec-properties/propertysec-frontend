import React, { SetStateAction, useEffect, useRef, useState } from "react";
import { useMediaQuery } from "usehooks-ts";
import CustomButton from "../buttons/CustomButton";
import { cn } from "@/lib/utils";
import { CircleX, FileVideo, Image as ImageIcon } from "lucide-react"; // Import FileVideo icon
import { FileData } from "@/interface/file";
import { ImagePreview, SelectedImagePreview, UploadImageFormat } from "@/interface/image";

interface Props
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "placeholder"> {
  preview: ImagePreview;
  format: UploadImageFormat;
  selected?: SelectedImagePreview | null;
  setSelected?: React.Dispatch<
    SetStateAction<SelectedImagePreview | null>
  >;
  isSaved?: boolean;
  setSelectedPhotos?: React.Dispatch<SetStateAction<ImagePreview[] | null>>;
  selectedPhotos?: ImagePreview[] | null;
  file?: FileData;
  setDeletedFiles?: React.Dispatch<SetStateAction<string[]>>;
  deletedFiles?: string[];
  isUploaded?: boolean;
  isExisting?: boolean;
  onRemoveExistingImage?: (imageId: string) => void;
  imageId?: string;
}

export default function UploadImg({
  preview,
  format,
  selected,
  setSelected,
  isSaved,
  setSelectedPhotos,
  selectedPhotos,
  file,
  setDeletedFiles,
  deletedFiles,
  isUploaded,
  isExisting,
  onRemoveExistingImage,
  imageId,
  ...props
}: Props) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const isSm = useMediaQuery("(min-width: 640px)");

  useEffect(() => {
    if (!file?.id) return;
    if (deletedFiles?.includes(file?.id)) {
      setIsDeleted(true);
    } else {
      setIsDeleted(false);
    }
  }, [deletedFiles, file?.id]);

  const handleSetSelected = () => {
    setSelected?.({
      image: preview,
      fileName: file ? file.id : preview.name,
    });
  };

  const handleDeleteOverlayClick = (e: any) => {
    const elm = e.target as HTMLElement;
    if (
      elm &&
      buttonRef &&
      (buttonRef.current?.contains(elm) || buttonRef.current === elm)
    ) {
      return;
    }
    handleSetSelected();
  };

  const handleImgClick = () => {
    if (isDeleted) {
      setDeletedFiles?.((prev) => {
        const fileId = file?.id;
        if (!prev || !fileId) {
          return prev;
        }
        return prev.filter((id) => id !== fileId);
      });
      return;
    }
    handleSetSelected();
  };

  const handleDeleteClick = () => {
    if (selected && selected?.image?.url === preview.url) {
      setSelected?.(null);
    }

    if (isExisting && imageId && onRemoveExistingImage) {
      onRemoveExistingImage(imageId);
      return;
    }

    if (isUploaded) {
      const newSelectedPhotos = selectedPhotos?.filter(
        (photo) => photo.url !== preview.url
      );
      setSelectedPhotos?.(newSelectedPhotos || null);
      return;
    }

    setDeletedFiles?.((prev) => {
      const fileId = file?.id;
      if (!fileId) {
        return prev;
      }
      if (!prev || prev.includes(fileId)) {
        return prev;
      }
      return [...prev, fileId];
    });

    if (selected && selected?.image?.url === preview.url) {
      setSelected?.(null);
    }
  };

  const fileStyle = {
    style: {
      width: format === "single" ? "100%" : isSm ? 130 : 70,
      height: format === "single" ? "100%" : isSm ? 120 : 61,
    },
    class: cn(
      `
        h-full 
        w-full 
        cursor-pointer
        flex
        items-center
        justify-center
        bg-gray-900
        rounded-[7px]
      `,
      {
        [`
          max-h-[61px] 
          max-w-[70px] 
          sm:max-h-[120px]
          sm:max-w-[130px]
        `]: format === "multiple",
        [`
          object-cover
        `]: format === "single",
        [`
          border-[1px]
          border-white
          outline
          outline-[3px]
          outline-primary
        `]: selected?.image?.url === preview.url,
      }
    ),
  };

  return (
    <div
      className={cn("group relative", {
        "opacity-20": isDeleted,
        "h-full w-full": format === "single",
      })}
    >
      <div
        className={cn(
          `
            absolute
            left-0
            top-0
            hidden
            h-full
            w-full
            items-start
            justify-end
            px-[4px]
            py-[5px]
            before:absolute
            before:left-0
            before:top-0
            before:h-full
            before:w-full
            before:rounded-[7px]
            before:bg-black
            before:opacity-40
            before:transition-opacity
            before:duration-300
            before:ease-in
        `,
          {
            "group-hover:flex": (isSaved && !isDeleted) || isUploaded,
          }
        )}
        onClick={handleDeleteOverlayClick}
      >
        <CustomButton
          aria-label={"Delete this image"}
          variant={"icon"}
          className={`
            after:hidden 
            bg-white/20 
            hover:bg-white/30 
            backdrop-blur-sm 
            rounded-full 
            p-1.5
            transition-colors
            text-white
            hover:text-red-400
          `}
          onClick={handleDeleteClick}
          ref={buttonRef as any}
        >
          <CircleX className="h-5 w-5" />
        </CustomButton>
      </div>

      {preview.file.type.startsWith("image/") ? (
        <div className={fileStyle.class} onClick={handleImgClick}>
          <img
            {...props}
            src={preview.url}
            alt={preview.name}
            title={preview.name}
            style={fileStyle.style}
            aria-label={
              "You are trying to upload this file named: " + preview.name
            }
          />
          <ImageIcon className="absolute" />
        </div>
      ) : preview.file.type.startsWith("video/") ? (
        <div
          style={fileStyle.style}
          className={fileStyle.class}
          onClick={handleImgClick}
        >
          <video
            src={preview.url}
            title={preview.name}
            style={fileStyle.style}
            className="size-full"
            aria-label={
              "You are trying to upload this file named: " + preview.name
            }
          ></video>
          <FileVideo className="absolute" />
        </div>
      ) : null}
    </div>
  );
}
