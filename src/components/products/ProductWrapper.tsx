"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { IProduct } from "@/interface/product";
import { useRouter } from "next/navigation";
import ProductImageGallery from "./ProductImageGallery";
import ProductDetails from "./ProductDetails";

interface Props {
  product: IProduct;
}

const ProductWrapper = ({ product }: Props) => {
  const { user } = useUser();
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-[0.625rem] border-[0.6px] border-grey100">
      <div className="border-b-[0.6px] border-b-grey100 mb-6 pb-4">
        <div
          role="button"
          className="flex cursor-pointer items-center gap-2 max-w-max"
          onClick={() => router.back()}
        >
          <ChevronLeft />
          <h2 className="text-sm font-medium text-grey9 capitalize">
            {product?.title}
          </h2>
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        <div className="mb-6 md:mb-0">
          <ProductImageGallery product={product} />
        </div>

        <ProductDetails product={product} />
      </div>
    </div>
  );
};

export default ProductWrapper;
