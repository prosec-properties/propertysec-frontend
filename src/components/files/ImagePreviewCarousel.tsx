import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Trash2 } from "lucide-react";

interface ImageCarouselProps {
  imageUrls: string[];
  wrapperClass?: string;
  deleteSelectedImg?: (index: number) => void;
}

const ImagePreviewCarousel: React.FC<ImageCarouselProps> = ({
  imageUrls,
  wrapperClass,
  deleteSelectedImg
}) => {
  return (
    <div
      className={cn(
        "overflow-x-auto bg-offWhite flex snap-x snap-mandatory p-2",
        wrapperClass
      )}
      style={{ scrollbarWidth: "none" }}
    >
      {imageUrls.map((url, index) => (
        <div key={index}>
          <div className="flex-shrink-0 snap-center max-w-[8.125rem] max-h-[7.5rem] m-2">
            <Image
              src={url}
              alt={`Preview ${index + 1}`}
              width={200}
              height={200}
              className="rounded-[0.3125rem] h-[150px] w-[150px] object-cover"
            />
          </div>
          <div className="flex justify-center">
            <Trash2 />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImagePreviewCarousel;
