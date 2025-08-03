import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { fetchAllSubscriptions } from "@/services/subscriptions.service";
import React from "react";
import SubscriptionsList from "@/components/admin/SubscriptionsList";

type ISearchParams = Promise<{
  search?: string;
  page?: string;
  limit?: string;
  status?: string;
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;
  const { user } = await adminGuard();

  const subscriptions = await fetchAllSubscriptions(user.token || "", {
    search: queries.search,
    page: queries.page ? parseInt(queries.page) : 1,
    limit: queries.limit ? parseInt(queries.limit) : 50,
    status: queries.status,
  });
  
  if (!subscriptions?.success) {
    return <ErrorDisplay message="An error occurred while fetching subscriptions" />;
  }

  const subscriptionData = subscriptions?.data?.data || [];
  const statistics = subscriptions?.data?.statistics;
  
  
  return (
    <>
      <SubscriptionsList
        initialSubscriptions={subscriptionData}
        totalSubscriptions={statistics?.totalSubscriptions}
        activeSubscriptions={statistics?.activeSubscriptions}
        expiredSubscriptions={statistics?.expiredSubscriptions}
      />
    </>
  );
};

export default Page;
