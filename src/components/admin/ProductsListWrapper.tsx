import AdminProducts from "@/components/admin/Products";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchAllProducts } from "@/services/product.service";
import React from "react";

export default async function ProductsListWrapper() {
    await adminGuard();

    const products = await fetchAllProducts();

    if (!products?.success) {
        return <ErrorDisplay message="Failed to fetch listings" />;
    }

    return <AdminProducts products={products?.data?.data} />;
}
