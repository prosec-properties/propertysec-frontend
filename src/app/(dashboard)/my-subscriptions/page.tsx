import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { authConfig } from "@/authConfig";
import { fetchSubscriptions } from "@/services/subscriptions.service";
import React from "react";
import UserSubscriptionsList from "@/components/subscription/UserSubscriptionsList";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { SIGN_IN_ROUTE } from "@/constants/routes";

type ISearchParams = Promise<{
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: string | string[] | undefined;
}>;

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;
  const session = await getServerSession(authConfig);

  if (!session || !session?.user || !session.user?.token) {
    redirect(SIGN_IN_ROUTE);
  }

  const subscriptions = await fetchSubscriptions(session.user?.token, {
    search: queries.search,
    page: queries.page ? parseInt(queries.page) : 1,
    limit: queries.limit ? parseInt(queries.limit) : 10,
  });
  
  if (!subscriptions?.success) {
    return <ErrorDisplay message="An error occurred while fetching your subscriptions" />;
  }
  
  return (
    <div className="container mx-auto px-4 py-6">
      <UserSubscriptionsList
        subscriptions={subscriptions?.data?.data?.data}
        statistics={subscriptions?.data?.data?.statistics}
      />
    </div>
  );
};

export default Page;
