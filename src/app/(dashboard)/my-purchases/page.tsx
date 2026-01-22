import { authConfig } from "@/authConfig";
import MyPurchasesWrapper from "@/components/dashboard/MyPurchasesWrapper";
import Spinner from "@/components/misc/Spinner";
import React, { Suspense } from "react";

type ISearchParams = Promise<{
  page?: string;
  per_page?: string;
  sort_by?: string;
  order?: string;
  [key: string]: string | string[] | undefined;
}>;

export const metadata = {
  title: "My Purchased Properties",
};

async function Page({ searchParams }: { searchParams: ISearchParams }) {
  const queries = await searchParams;

  return (
    <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading purchases..." />}>
      <MyPurchasesWrapper searchParams={queries} />
    </Suspense>
  );
}

export default Page;