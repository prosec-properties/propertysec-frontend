import MyInspectionsWrapper from "@/components/dashboard/MyInspectionsWrapper";
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
  title: "My Inspection Payments",
};

async function Page({ searchParams }: { searchParams: ISearchParams }) {
  const queries = await searchParams;

  return (
    <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading inspections..." />}>
      <MyInspectionsWrapper searchParams={queries} />
    </Suspense>
  );
}

export default Page;
