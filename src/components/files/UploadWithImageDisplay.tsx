"use client";

import { ACCEPTED_IMAGE_TYPES } from "@/constants/files";
import { cn } from "@/lib/utils";
import { Image as ImageIcon } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import Small from "../misc/Small";
import { isFileSizeGreaterThan } from "@/lib/files";
import { isNotAnEmptyArray, showToaster } from "@/lib/general";
import UploadImg from "../images/UploadImg";
import UploadImageArea from "../images/UploadImageArea";
import { ImagePreview, UploadImageFormat } from "@/interface/image";
import { IExistingImage } from "./NewImagePreview";

export interface SelectedImagePreview {
  image: ImagePreview;
  fileName: string;
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
  fileType: "image" | "video" | "both";
  maxFileNumber?: number;
  existingImages: IExistingImage[] | null;
  isVideoUploadAllowed?: boolean; // Add new prop
}

const MAX_IMAGE_SIZE_MB = 5;
const MAX_VIDEO_SIZE_MB = 10;

const UploadWithImageDisplay = (props: Props) => {
  const [imagePreviewUrls, setImagePreviewUrls] = useState<ImagePreview[]>([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [hasExceededMaxFileNumber, setHasExceededMaxFileNumber] =
    useState(false);

  const {
    format: propsFormat,
    setSelectedPhoto: propsSetSelectedPhoto,
    existingImages: propsExistingImages,
    fileType: propsFileType,
    isVideoUploadAllowed: propsIsVideoUploadAllowed,
    maxFileNumber: propsMaxFileNumber,
    setFiles: propsSetFiles,
  } = props;

  const handleFileUpload = useCallback(
    async (files: File[]) => {
      if (!files || files.length < 1) return;
      setErrorMsg("");

      try {
        if (propsFormat === "single" && files.length > 0) {
          const preview = await createFilePreview(files[0]);
          setImagePreviewUrls([preview]);
          propsSetSelectedPhoto({ image: preview, fileName: preview.name });
        } else if (propsFormat === "multiple") {
          const previews = await Promise.all(files.map(createFilePreview));
          setImagePreviewUrls((prev) => [...(prev || []), ...previews]);
          // Always set the last uploaded file as the selected photo
          const lastPreview = previews[previews.length - 1];
          propsSetSelectedPhoto({
            image: lastPreview,
            fileName: lastPreview.name,
          });
        }
      } catch (error) {
        setErrorMsg("Failed to upload one or more files. Please try again.");
        console.error(error);
      }
    },
    [propsFormat, propsSetSelectedPhoto]
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Check if video upload is allowed
      if (propsFileType === "both" || propsFileType === "video") {
        const containsVideo = acceptedFiles.some((file) =>
          file.type.startsWith("video/")
        );
        if (containsVideo && !propsIsVideoUploadAllowed) {
          showToaster(
            "Video uploads are only available for subscribed users.",
            "destructive"
          );
          // Filter out video files if upload is not allowed
          acceptedFiles = acceptedFiles.filter(
            (file) => !file.type.startsWith("video/")
          );
          if (acceptedFiles.length === 0) return; // If only videos were there, and none are allowed.
        }
      }

      // Check if current files + new files would exceed max
      if (
        propsMaxFileNumber &&
        imagePreviewUrls.length + acceptedFiles.length > propsMaxFileNumber
      ) {
        showToaster(
          `Cannot add more files. Maximum of ${propsMaxFileNumber} files allowed.`,
          "destructive"
        );
        return;
      }

      if (hasExceededMaxFileNumber) {
        showToaster(
          `Maximum number of files (${propsMaxFileNumber}) has been reached.`,
          "destructive"
        );
        return;
      }

      const duplicateFiles = acceptedFiles.filter((newFile) =>
        imagePreviewUrls.some(
          (existing) =>
            existing.name === newFile.name &&
            existing.file.size === newFile.size
        )
      );

      if (duplicateFiles.length > 0) {
        showToaster("This file has already been selected", "destructive");
        return;
      }

      const newFiles = acceptedFiles.filter((file) => {
        const isVideo = file.type.startsWith("video/");
        const maxSize = isVideo ? MAX_VIDEO_SIZE_MB : MAX_IMAGE_SIZE_MB;
        return !isFileSizeGreaterThan(file, maxSize);
      });

      if (newFiles.length !== acceptedFiles.length) {
        showToaster(
          "Some files were too large and not uploaded",
          "destructive"
        );
        return;
      }

      if (newFiles.length === 0) {
        setErrorMsg(
          `You can only upload a maximum of ${propsFormat} file at a time`
        );
        return;
      }

      handleFileUpload(newFiles);
      propsSetFiles((prevFiles) =>
        prevFiles ? [...prevFiles, ...newFiles] : newFiles
      );
    },
    [
      propsSetFiles,
      imagePreviewUrls,
      hasExceededMaxFileNumber,
      propsMaxFileNumber,
      propsFileType,
      propsIsVideoUploadAllowed,
      handleFileUpload,
      propsFormat,
    ]
  );

  useEffect(() => {
    if (!props.selectedPhoto) return;
    if (propsMaxFileNumber && imagePreviewUrls.length >= propsMaxFileNumber) {
      setImagePreviewUrls((prev) => prev.slice(0, propsMaxFileNumber));
      showToaster(
        `You can only upload a maximum of ${propsMaxFileNumber} files. The rest have been removed`,
        "destructive"
      );
      setHasExceededMaxFileNumber(true);
      return;
    } else {
      setHasExceededMaxFileNumber(false);
    }
  }, [props.selectedPhoto, imagePreviewUrls.length, propsMaxFileNumber]);

  useEffect(() => {
    if (
      !propsExistingImages ||
      !isNotAnEmptyArray(propsExistingImages) ||
      propsExistingImages.length === 0
    )
      return;

    const loadExistingImages = (images: IExistingImage[]) => {
      const previews = images.map((img) => ({
        url: img.url,
        name: `image-${img.id}`,
        file: new File([new Blob()], `image-${img.id}`, { type: "image/jpeg" }),
      }));

      setImagePreviewUrls(previews);
      if (previews.length > 0) {
        propsSetSelectedPhoto({
          image: previews[0],
          fileName: previews[0].name,
        });
      }
    };

    loadExistingImages(propsExistingImages);
  }, [propsExistingImages, propsSetSelectedPhoto]);

  const createFilePreview = (file: File): Promise<ImagePreview> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const target = e.target as FileReader;
        if (target && typeof target.result === "string") {
          resolve({ url: target.result, name: file.name, file });
        } else {
          reject(new Error("Failed to read file"));
        }
      };
      reader.onerror = () => reject(new Error("File reading error"));
      reader.readAsDataURL(file);
    });
  };

  const acceptedFileTypes = () => {
    const videoTypes = { "video/*": ["video/mp4", "video/webm", "video/ogg"] };
    const imageTypes = { "image/*": ACCEPTED_IMAGE_TYPES };

    if (propsFormat === "single") {
      switch (propsFileType) {
        case "video":
          return propsIsVideoUploadAllowed ? videoTypes : {}; // Only allow video if subscribed
        default:
          return imageTypes;
      }
    }

    if (propsFormat === "multiple") {
      switch (propsFileType) {
        case "video":
          return propsIsVideoUploadAllowed ? videoTypes : {}; // Only allow video if subscribed
        case "both":
          return propsIsVideoUploadAllowed
            ? { ...imageTypes, ...videoTypes }
            : imageTypes; // Allow both if subscribed, else only images
        default:
          return imageTypes;
      }
    }
    return imageTypes; // Default to image types
  };

  const exceedsMaxFileNumber = () => {
    if (propsMaxFileNumber && imagePreviewUrls.length > propsMaxFileNumber) {
      setErrorMsg(
        `You can only upload a maximum of ${propsMaxFileNumber} files but you have selected ${imagePreviewUrls.length} files`
      );
      setImagePreviewUrls((prev) => prev.slice(0, propsMaxFileNumber));
      showToaster(
        `You can only upload a maximum of ${propsMaxFileNumber} files`,
        "destructive"
      );
      return;
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: acceptedFileTypes(),
  });

  return (
    <div
      className={cn(
        `
      flex
      items-center
      gap-x-3
      gap-y-2.5
      sm:flex-col
      sm:items-start
      `,
        {
          "flex-wrap gap-x-[7px] sm:flex-row sm:gap-x-4":
            propsFormat === "multiple",
        },
        props.wrapperClass
      )}
    >
      {!hasExceededMaxFileNumber && (
        <label {...getRootProps()}>
          <UploadImageArea
            format={propsFormat}
            name={props.name}
            className={cn(props.uploadAreaClass)}
            onClick={exceedsMaxFileNumber}
          >
            {propsFormat === "single" ? (
              <>
                {props.selectedPhoto ? (
                  <UploadImg
                    preview={props.selectedPhoto.image}
                    format={propsFormat}
                    setSelected={
                      propsSetSelectedPhoto as React.Dispatch<
                        React.SetStateAction<SelectedImagePreview | null>
                      >
                    }
                    selected={props.selectedPhoto}
                  />
                ) : (
                  <ImageIcon className="w-[16px] h-[16px] sm:w-[32px] sm:h-[32px]" />
                )}
              </>
            ) : null}

            {propsFormat === "multiple" ? (
              <ImageIcon className="w-[16px] h-[16px] sm:w-[32px] sm:h-[32px]" />
            ) : null}
          </UploadImageArea>
        </label>
      )}

      {propsFormat === "multiple"
        ? imagePreviewUrls?.map((photo, i) => (
            <UploadImg
              preview={photo}
              key={i}
              format={propsFormat}
              setSelected={propsSetSelectedPhoto}
              selected={props.selectedPhoto}
              isUploaded
              setSelectedPhotos={
                setImagePreviewUrls as React.Dispatch<
                  React.SetStateAction<ImagePreview[] | null>
                >
              }
              selectedPhotos={imagePreviewUrls}
            />
          ))
        : null}

      <input {...getInputProps()} />
      <Small
        className={cn(`text-[11px] text-red-600 sm:text-xs `, props.errorClass)}
      >
        {props.errorMessage || errorMsg}
      </Small>
    </div>
  );
};

export default UploadWithImageDisplay;
