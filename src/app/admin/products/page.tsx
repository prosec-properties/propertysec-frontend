import { authConfig } from "@/authConfig";
import AdminProducts from "@/components/admin/Products";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { adminGuard } from "@/lib/admin";
import { fetchAllProducts } from "@/services/product.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

const Page = async () => {
  await adminGuard();

  const products = await fetchAllProducts();
  if (!products?.success) {
    return <ErrorDisplay message="Failed to fetch listings" />;
  }

  return (
    <div>
      <AdminProducts products={products?.data?.data} />
    </div>
  );
};

export default Page;
