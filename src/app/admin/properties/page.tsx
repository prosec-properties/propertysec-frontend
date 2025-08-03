import AdminProperties from "@/components/admin/Properties";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchAllProperties } from "@/services/properties.service";
import { redirect } from "next/navigation";
import React from "react";

type ISearchParams = Promise<{
  status?: string;
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;
  await adminGuard();

  const status = queries.status;

  const properties = await fetchAllProperties({
    status,
  });
  if (!properties?.success) {
    return <ErrorDisplay message="Failed to fetch listings" />;
  }

  return (
    <div>
      <AdminProperties properties={properties?.data?.data} />
    </div>
  );
};

export default Page;
