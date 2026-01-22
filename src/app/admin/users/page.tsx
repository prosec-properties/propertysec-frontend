import React, { Suspense } from "react";
import UsersListWrapper from "@/components/admin/UsersListWrapper";
import Spinner from "@/components/misc/Spinner";

type ISearchParams = Promise<{
  search?: string;
  page?: string;
  per_page?: string;
  role?: string;
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;

  return (
    <>
      <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading users..." />}>
        <UsersListWrapper searchParams={queries} />
      </Suspense>
    </>
  );
};

export default Page;
