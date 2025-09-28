import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchBuyerInspectedProperties, fetchBuyerPurchasedProperties } from "@/services/admin.service";
import React from "react";
import BuyerPropertiesList from "@/components/admin/BuyerPropertiesList";

type ISearchParams = Promise<{
  page?: string;
  per_page?: string;
  sort_by?: string;
  order?: string;
  tab?: string;
  [key: string]: string | string[] | undefined;
}>;

interface PageProps {
  params: Promise<{ buyerId: string }>;
  searchParams: ISearchParams;
}

const Page = async ({ params, searchParams }: PageProps) => {
  const { buyerId } = await params;
  const queries = await searchParams;
  const { token } = await adminGuard();

  const tab = queries.tab || 'inspected';

  let inspectedProperties: any = null;
  let purchasedProperties: any = null;

  if (tab === 'inspected') {
    inspectedProperties = await fetchBuyerInspectedProperties(token || "", buyerId, {
      page: queries.page ? parseInt(queries.page) : 1,
      per_page: queries.per_page ? parseInt(queries.per_page) : 20,
      sort_by: queries.sort_by,
      order: queries.order,
    });
  } else if (tab === 'purchased') {
    purchasedProperties = await fetchBuyerPurchasedProperties(token || "", buyerId, {
      page: queries.page ? parseInt(queries.page) : 1,
      per_page: queries.per_page ? parseInt(queries.per_page) : 20,
      sort_by: queries.sort_by,
      order: queries.order,
    });
  }

  if ((tab === 'inspected' && !inspectedProperties?.success) ||
      (tab === 'purchased' && !purchasedProperties?.success)) {
    return <ErrorDisplay message="Failed to fetch buyer properties" />;
  }

  return (
    <div>
      <BuyerPropertiesList
        buyerId={buyerId}
        initialInspectedProperties={inspectedProperties?.data?.inspections || []}
        initialPurchasedProperties={purchasedProperties?.data?.purchases || []}
        buyer={inspectedProperties?.data?.buyer || purchasedProperties?.data?.buyer}
        inspectedMeta={inspectedProperties?.data?.meta}
        purchasedMeta={purchasedProperties?.data?.meta}
        activeTab={tab}
      />
    </div>
  );
};

export default Page;