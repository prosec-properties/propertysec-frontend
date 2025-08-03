import { authConfig } from "@/authConfig";
import ProductWrapper from "@/components/products/ProductWrapper";
import { fetchProductById } from "@/services/product.service";
import { getServerSession } from "next-auth";
import React from "react";

interface IParams {
  params: Promise<{
    id: string;
  }>;
}

export default async function Page(props: IParams) {
  const params = await props.params;
  const session = await getServerSession(authConfig);

  const product = await fetchProductById(params.id);

  if (!product?.success || !product?.data) {
    return (
      <div className="container mx-auto py-10">
        <p className="text-center text-lg">Product not found</p>
      </div>
    );
  }

  return <ProductWrapper product={product.data} />;
}
