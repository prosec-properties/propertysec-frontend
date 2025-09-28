import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchAffiliateProperties } from "@/services/admin.service";
import React from "react";
import AffiliatePropertiesList from "@/components/admin/AffiliatePropertiesList";

type ISearchParams = Promise<{
  page?: string;
  per_page?: string;
  sort_by?: string;
  order?: string;
  [key: string]: string | string[] | undefined;
}>;

interface PageProps {
  params: Promise<{ affiliateId: string }>;
  searchParams: ISearchParams;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { affiliateId } = await params;
  const queries = await searchParams;
  const { token } = await adminGuard();

  const properties = await fetchAffiliateProperties(token || "", affiliateId, {
    page: queries.page ? parseInt(queries.page) : 1,
    per_page: queries.per_page ? parseInt(queries.per_page) : 20,
    sort_by: queries.sort_by,
    order: queries.order,
  });

  if (!properties?.success) {
    return <ErrorDisplay message="Failed to fetch affiliate properties" />;
  }

  return (
    <div>
      <AffiliatePropertiesList
        initialProperties={properties?.data?.properties}
        affiliate={properties?.data?.affiliate}
        meta={properties?.data?.meta}
      />
    </div>
  );
};

export default Page;