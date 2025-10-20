"use server";

import { revalidateTag } from "next/cache";

export const revalidateProductData = async (productId?: string) => {
  if (productId) {
    revalidateTag(`product-${productId}`);
  }
};
