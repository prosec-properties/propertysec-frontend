"use client";

import { cn } from "@/lib/utils";
import { UploadCloud } from "lucide-react";
import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { ScrollArea } from "../ui/scroll-area";
import { ACCEPTED_IMAGE_TYPES } from "@/constants/files";
import { isFileSizeGreaterThan } from "@/lib/files";
import { showToaster } from "@/lib/general";
import UploadedDoc from "./UploadedDoc";

export interface FileUploadProgress {
  progress: number;
  File: File;
  source: any | null;
}

enum FileTypes {
  Image = "image",
  Pdf = "pdf",
  Audio = "audio",
  Video = "video",
  Other = "other",
}

const ImageColor = {
  bgColor: "bg-offWhite",
  fillColor: "red-900",
};

const OtherColor = {
  bgColor: "bg-gray-400",
  fillColor: "fill-gray-400",
};

interface Props {
  wrapperClass?: string;
  files: File[] | undefined;
  setFiles: React.Dispatch<React.SetStateAction<File[] | undefined>>;
}

const UploadFile = (props: Props) => {
  const { files, setFiles } = props;
  const removeFile = (filename: string) => {
    setFiles((prevFiles) => {
      return prevFiles?.filter((item) => item.name !== filename);
    });
  };

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const newFiles = acceptedFiles.filter((file) => {
        return !isFileSizeGreaterThan(file, 5);
      });

      if (newFiles.length !== acceptedFiles.length) {
        showToaster(
          "Some files were too large and not uploaded",
          "destructive"
        );
        return;
      }

      if (newFiles.length === 0) return;

      const totalFiles = (files?.length || 0) + newFiles.length;
      if (totalFiles > 3) {
        showToaster("You can only have a maximum of 3 files uploaded", "destructive");
        return;
      }

      setFiles((prevFiles) =>
        prevFiles ? [...prevFiles, ...newFiles] : newFiles
      );
    },
    [setFiles, files]
  );

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } =
    useDropzone({
      onDrop,
      accept: {
        "image/*": ACCEPTED_IMAGE_TYPES,
      },
    });

  return (
    <div className={cn(props.wrapperClass)}>
      <label
        {...getRootProps()}
        className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 "
      >
        <div className=" text-center">
          <div className=" border p-2 rounded-md max-w-min mx-auto">
            <UploadCloud size={20} />
          </div>

          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold">Attach files</span>
          </p>
          <p className="text-xs text-gray-500">
            {isDragActive
              ? "Drop the files here ..."
              : "Upload or drag & drop your file PNG, JPG, JPEG (files should be under 10 MB)"}
          </p>
        </div>
      </label>
      <input {...getInputProps()} />

      {files && files.length > 0 && (
        <div>
          <ScrollArea className="h-40">
            <p className="font-medium my-2 mt-6 text-muted-foreground text-sm">
              Files to upload
            </p>
            <div className="space-y-2 pr-3">
              {files.map((selectedFile, index) => {
                return (
                  <UploadedDoc
                    key={selectedFile.name + index}
                    fileName={selectedFile.name}
                    fileSize={selectedFile.size}
                    deleteFile={removeFile}
                  />
                );
              })}
            </div>
          </ScrollArea>
        </div>
      )}
    </div>
  );
};

export default UploadFile;
