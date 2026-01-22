import ProductsListWrapper from "@/components/admin/ProductsListWrapper";
import Spinner from "@/components/misc/Spinner";
import React, { Suspense } from "react";

const Page = async () => {
  return (
    <div>
      <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading products..." />}>
        <ProductsListWrapper />
      </Suspense>
    </div>
  );
};

export default Page;
