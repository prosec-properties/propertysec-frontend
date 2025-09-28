import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchUserProperties } from "@/services/admin.service";
import React from "react";
import UserPropertiesList from "@/components/admin/UserPropertiesList";

type ISearchParams = Promise<{
  page?: string;
  per_page?: string;
  sort_by?: string;
  order?: string;
  [key: string]: string | string[] | undefined;
}>;

interface PageProps {
  params: Promise<{ userId: string }>;
  searchParams: ISearchParams;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { userId } = await params;
  const queries = await searchParams;
  const { user, token } = await adminGuard();

  const properties = await fetchUserProperties(token || "", userId, {
    page: queries.page ? parseInt(queries.page) : 1,
    per_page: queries.per_page ? parseInt(queries.per_page) : 20,
    sort_by: queries.sort_by,
    order: queries.order,
  });

  if (!properties?.success) {
    return <ErrorDisplay message="Failed to fetch user properties" />;
  }

  return (
    <div>
      <UserPropertiesList
        initialProperties={properties?.data?.properties}
        user={properties?.data?.user}
        meta={properties?.data?.meta}
      />
    </div>
  );
};

export default Page;