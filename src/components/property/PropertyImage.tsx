"use client";

import { USER_ROLE } from "@/constants/user";
import { useUser } from "@/hooks/useUser";
import { IProperty, IPropertyFileRecord } from "@/interface/property";
import Image from "next/image";
import React, { useState } from "react";
import { PlayCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { isVideoFile } from "@/lib/files";

interface Props {
  property: IProperty;
}

const PropertyImage = (props: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useUser();

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  const handleKeyboardNavigation = (e: React.KeyboardEvent) => {
    if (!props.property?.files || props.property.files.length <= 1) return;

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      setCurrentIndex((prev) =>
        prev === 0 ? props.property.files.length - 1 : prev - 1
      );
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      setCurrentIndex((prev) =>
        prev === props.property.files.length - 1 ? 0 : prev + 1
      );
    }
  };

  const showAllImgs = () => {
    if (!user) return false;
    if (user?.role !== USER_ROLE.BUYER) return true;
    if (user?.role === USER_ROLE.BUYER) return true;
    return user.propertyAccessRequests.some(
      (property) => property.id === props.property.id
    );
  };

  // Fixed dimensions for all images
  const imageWidth = 800;
  const imageHeight = 500;

  return (
    <div
      className="relative"
      tabIndex={0}
      onKeyDown={handleKeyboardNavigation}
      role="region"
      aria-label="Property media carousel"
    >
      {!showAllImgs() ? (
        <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-[0.625rem] border-[0.6px] border-grey100 p-3">
          <Image
            src={props.property.defaultImageUrl || ""}
            alt={"property image"}
            width={imageWidth}
            height={imageHeight}
            className="object-cover w-full h-full rounded-[0.625rem]"
            style={{
              objectPosition: "center",
            }}
          />
        </div>
      ) : (
        <>
          <div className="relative w-full h-[300px] md:h-[400px] overflow-hidden rounded-[0.625rem] border-[0.6px] border-grey100 p-3">
            {props.property?.files.map((file, index) => {
              const isVideo = isVideoFile(file);

              return (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    currentIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                >
                  {isVideo ? (
                    <div className="relative w-full h-full">
                      <video
                        src={file.fileUrl}
                        width={imageWidth}
                        height={imageHeight}
                        controls
                        className="object-cover w-full h-full rounded-[0.625rem]"
                        style={{
                          objectPosition: "center",
                        }}
                        preload="metadata"
                        poster={file.fileUrl + "#t=1"} // Show frame at 1 second as poster
                      >
                        Your browser does not support the video tag.
                      </video>
                      {/* Video indicator overlay when not active */}
                      {currentIndex !== index && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 rounded-[0.625rem]">
                          <PlayCircle className="w-12 h-12 text-white opacity-80" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Image
                      src={file.fileUrl}
                      alt="Property Image"
                      width={imageWidth}
                      height={imageHeight}
                      className="object-cover w-full h-full rounded-[0.625rem]"
                      style={{
                        objectPosition: "center",
                      }}
                    />
                  )}
                </div>
              );
            })}

            {/* Navigation arrows - only show if there are multiple files */}
            {props.property?.files && props.property.files.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === 0 ? props.property.files.length - 1 : prev - 1
                    )
                  }
                  className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all z-10"
                  aria-label="Previous media"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentIndex((prev) =>
                      prev === props.property.files.length - 1 ? 0 : prev + 1
                    )
                  }
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white rounded-full p-2 transition-all z-10"
                  aria-label="Next media"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          <div className="flex justify-center gap-2 mt-6">
            {props.property?.files.map((file, index) => {
              const isVideo = isVideoFile(file);

              return (
                <button
                  key={index}
                  onClick={() => handleDotClick(index)}
                  className={`relative w-4 h-4 rounded-full transition-all border-2 ${
                    currentIndex === index
                      ? "bg-grey8 border-grey8 scale-125"
                      : "bg-grey2 border-grey2 hover:border-grey4"
                  }`}
                  title={isVideo ? "Video" : "Image"}
                  aria-label={`${isVideo ? "Video" : "Image"} ${index + 1} of ${
                    props.property.files.length
                  }`}
                >
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${
                          currentIndex === index ? "bg-white" : "bg-grey6"
                        }`}
                      ></div>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Media type indicator */}
          {props.property?.files && props.property.files.length > 0 && (
            <div className="text-center mt-2">
              <span className="text-sm text-grey6">
                {isVideoFile(props.property.files[currentIndex])
                  ? "Video"
                  : "Image"}{" "}
                {currentIndex + 1} of {props.property.files.length}
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default PropertyImage;
