"use client";

import { useUser } from "@/hooks/useUser";
import { IProduct } from "@/interface/product";
import Image from "next/image";
import React, { useState } from "react";

interface Props {
  product: IProduct;
}

const ProductImageGallery = ({ product }: Props) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { user } = useUser();

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="max-h-[400px] md:max-h-[500px] relative">
      <div className="max-h-[300px] md:max-h-[400px] p-3 border-[0.6px] mb-10 rounded-[0.625rem] border-grey100">
        {product?.files.length > 0 ? (
          product.files.map((file, index) => (
            <div
              key={index}
              className={`${currentIndex === index ? "block" : "hidden"}`}
            >
              <Image
                src={file.fileUrl}
                alt={file.fileName || "Product image"}
                width={400}
                height={400}
                className="rounded-[0.625rem] object-cover w-full max-h-[300px] md:max-h-[400px]"
              />
            </div>
          ))
        ) : (
          <div className="flex items-center justify-center h-[300px] bg-gray-100 rounded-[0.625rem]">
            <p>No images available</p>
          </div>
        )}
      </div>

      {product?.files.length > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {product.files.map((_, index) => (
            <button
              key={index}
              onClick={() => handleDotClick(index)}
              className={`w-3 h-3 rounded-full ${
                currentIndex === index ? "bg-grey8 scale-150" : "bg-grey2"
              }`}
              aria-label={`View image ${index + 1}`}
            ></button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;