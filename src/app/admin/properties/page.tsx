import PropertiesListWrapper from "@/components/admin/PropertiesListWrapper";
import Spinner from "@/components/misc/Spinner";
import React, { Suspense } from "react";

type ISearchParams = Promise<{
  status?: string;
  page?: string;
  limit?: string;
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;

  return (
    <div>
      <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading properties..." />}>
        <PropertiesListWrapper searchParams={queries} />
      </Suspense>
    </div>
  );
};

export default Page;
