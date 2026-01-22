import LoanRequestsWrapper from "@/components/admin/LoanRequestsWrapper";
import Spinner from "@/components/misc/Spinner";
import React, { Suspense } from "react";

type ISearchParams = Promise<{
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;

  return (
    <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading loans..." />}>
      <LoanRequestsWrapper searchParams={queries} />
    </Suspense>
  );
};

export default Page;
