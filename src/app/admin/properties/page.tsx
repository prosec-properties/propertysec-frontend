import AdminProperties from "@/components/admin/Properties";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchAllPropertiesAdmin } from "@/services/admin.service";
import React from "react";

type ISearchParams = Promise<{
  status?: string;
  page?: string;
  limit?: string;
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;
  const { token } = await adminGuard();

  const status = queries.status || "all";

  const properties = await fetchAllPropertiesAdmin(
    token,
    {
      status,
      page: queries.page ? parseInt(queries.page) : 1,
      limit: queries.limit ? parseInt(queries.limit) : 20,
    },
    {
      cache: "force-cache",
      next: { revalidate: 300, tags: ["admin-properties"] },
    }
  );
  if (!properties?.success) {
    return <ErrorDisplay message="Failed to fetch listings" />;
  }

  return (
    <div>
      <AdminProperties
        properties={properties?.data?.data}
        meta={properties?.data?.meta}
      />
    </div>
  );
};

export default Page;
