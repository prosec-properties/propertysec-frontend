import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { authConfig } from "@/authConfig";
import { fetchSubscriptions } from "@/services/subscriptions.service";
import React from "react";
import UserSubscriptionsList from "@/components/subscription/UserSubscriptionsList";
import { getServerSession } from "next-auth";
import { ensureAuthenticatedSession, withServerAuth } from "@/lib/serverAuthGuard";

type ISearchParams = Promise<{
  search?: string;
  page?: string;
  limit?: string;
  [key: string]: string | string[] | undefined;
}>;

const isNextRedirectError = (error: unknown) =>
  typeof error === "object" &&
  error !== null &&
  "digest" in error &&
  (error as any).digest === "NEXT_REDIRECT";

const Page = async ({ searchParams }: { searchParams: ISearchParams }) => {
  const queries = await searchParams;
  const session = ensureAuthenticatedSession(await getServerSession(authConfig));
  const token = session.user?.token || session.accessToken || "";
  try {
    const subscriptions = await withServerAuth(() =>
      fetchSubscriptions(
        token,
        {
          search: queries.search,
          page: queries.page ? parseInt(queries.page) : 1,
          limit: queries.limit ? parseInt(queries.limit) : 10,
        },
        {
          cache: "force-cache",
          next: {
            revalidate: 300,
            tags: [
              "subscriptions",
              session.user?.id
                ? `subscriptions-${session.user.id}`
                : undefined,
            ].filter(Boolean) as string[],
          },
        }
      )
    );
  
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
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    return <ErrorDisplay message="An error occurred while fetching your subscriptions" />;
  }
};

export default Page;
