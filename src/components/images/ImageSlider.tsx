"use client";

import { coverImages } from "@/store/data/mockImages";
import Image, { StaticImageData } from "next/image";
import React, { useEffect, useRef, useState } from "react";

const ImageSliderWrapper = () => {
  return (
    <React.Fragment>
      <div className="h-[400px] max-h-[400px] hidden md:block">
        <ImageSlider images={coverImages.desktop} />
      </div>

      <div className="h-[400px] max-h-[400px] md:hidden">
        <ImageSlider images={coverImages.mobile} />
      </div>
    </React.Fragment>
  );
};

interface ImageSliderProps {
  images: { name: string; src: StaticImageData }[];
}

const ImageSlider: React.FC<ImageSliderProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(-1); // Initialize to -1 to avoid showing previous image on first render

  useEffect(() => {
    const interval = setInterval(() => {
      setPrevIndex(currentIndex); // Track the previous index
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex, images.length]);

  return (
    <div className="w-full h-[400px] overflow-hidden relative">
      {images.map((image, index) => (
        <Image
          key={index}
          src={image.src}
          width={1200}
          height={400}
          alt={`Slide ${index}`}
          className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
            index === currentIndex
              ? "opacity-100"
              : index === prevIndex
              ? " opacity-0" // Slide out the previous image to the left
              : " opacity-0" // Slide in the new image from the right
          }`}
        />
      ))}
    </div>
  );
};

export default ImageSliderWrapper;
