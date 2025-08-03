"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PRODUCTS_ROUTE, PROPERTIES_ROUTE } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { formatPrice } from "@/lib/payment";
import { IProduct } from "@/interface/product";

interface Props {
  product: IProduct;
  className?: string;
}

const ProductCard = ({ product, className }: Props) => {
  const { user } = useUser();
  
  const commission = user?.role === "affiliate" 
    ? product.price * 0.05 // Default to 5% if commission not specified
    : 0;

  return (
    <Link
      href={`${PRODUCTS_ROUTE}/${product.id}`}
      className={cn(
        "block rounded-[0.675rem] p-4 shadow-sm shadow-indigo-100 bg-white",
        "transition-transform",
        // "focus:outline-none focus:ring-2 focus:ring-indigo-500",
        className
      )}
      aria-label={`View details for ${product.title}`}
    >
      <div className="relative aspect-video w-full mb-6 rounded-[0.675rem] overflow-hidden">
        <Image
          alt={product.title || "Property image"}
          src={product.files?.[0]?.fileUrl || "/placeholder-image.jpg"}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>

      <div className="space-y-2">
        <h3 className="font-medium text-grey9 line-clamp-1">
          {product.title}
        </h3>

        <p className="text-sm text-gray-500 line-clamp-1">
          {product.address}
        </p>

        <p className="text-sm font-semibold">
          {formatPrice(product.price, 'NGN')}
        </p>

        {product.description && (
          <p className="mt-4 text-xs text-greyBody line-clamp-2">
            {product.description}
          </p>
        )}

        {/* {user?.role === "affiliate" && (
          <div className="pt-2 font-medium text-sm">
            <span className="text-success200">Commission:</span>{" "}
            <span>{formatPrice(commission, 'NGN')}</span>
          </div>
        )} */}
      </div>
    </Link>
  );
};

export default ProductCard;