"use client";

import React, { useState, useRef } from "react";
import UploadWithImageDisplay from "../files/UploadWithImageDisplay";
import { SelectedImagePreview } from "../../../interface/image";
import CustomButton from "../buttons/CustomButton";

const ImageSearch = () => {
  const [files, setFiles] = useState<File[]>();
  const [selectedPhoto, setSelectedPhoto] =
    useState<SelectedImagePreview | null>(null);

  // Ref to trigger the hidden file upload
  const uploadRef = useRef<HTMLDivElement>(null);

  // Function to handle button click and trigger the image input
  const handleButtonClick = () => {
    if (uploadRef.current) {
      const inputElement = uploadRef.current.querySelector(
        "input[type='file']"
      ) as HTMLInputElement;
      inputElement?.click(); // Trigger the hidden input click
    }
  };

  React.useEffect(() => {
    console.log(files);
  }, [files]);

  return (
    <div className="font-medium text-lg md:text-3xl">
      <p className="font-medium text-center">OR</p>
      <p className="font-medium text-center mb-6">Upload an Image to search</p>

      <div className={`flex ${files?.length ? "" : ""} mb-6 justify-center`}>
        {/* Button to trigger the image input */}
        <CustomButton onClick={handleButtonClick}>
          Click to {files?.length ? "Change" : "Upload"} Image
        </CustomButton>
      </div>

      <div
        ref={uploadRef}
        className={files?.length ? "flex justify-center" : "hidden"}
      >
        <UploadWithImageDisplay
          fileType="image"
          format="single"
          files={files}
          setFiles={setFiles}
          wrapperClass="mb-6"
          name="files"
          selectedPhoto={selectedPhoto as SelectedImagePreview}
          setSelectedPhoto={setSelectedPhoto}
          existingImages={null}
        />
      </div>
    </div>
  );
};

export default ImageSearch;
