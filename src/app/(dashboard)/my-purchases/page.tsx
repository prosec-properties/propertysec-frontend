import { authConfig } from "@/authConfig";
import EmptyState from "@/components/misc/Empty";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { fetchMyPurchasedProperties } from "@/services/user.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import MyPurchases from "@/components/dashboard/MyPurchases";

type ISearchParams = Promise<{
  page?: string;
  per_page?: string;
  sort_by?: string;
  order?: string;
  [key: string]: string | string[] | undefined;
}>;

export const metadata = {
  title: "My Purchased Properties",
};

async function Page({ searchParams }: { searchParams: ISearchParams }) {
  const queries = await searchParams;
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }

  if (session.user.role !== USER_ROLE.BUYER) {
    redirect(SIGN_IN_ROUTE);
  }

  if (!session.user?.token) {
    redirect(SIGN_IN_ROUTE);
  }

  const user = session.user;

  try {
    const purchases = await fetchMyPurchasedProperties(
      user?.token!,
      {
        page: queries?.page || "1",
        per_page: queries?.per_page || "20",
        sort_by: queries?.sort_by || "created_at",
        order: queries?.order || "desc",
      },
      {
        cache: "force-cache",
        next: {
          revalidate: 300,
          tags: [
            "my-purchases",
            user?.id ? `my-purchases-${user.id}` : undefined,
          ].filter(Boolean) as string[],
        },
      }
    );

    if (!purchases?.success) {
      return <ErrorDisplay message="Failed to fetch purchased properties" />;
    }

    if (!purchases.data?.purchases?.length) {
      return <EmptyState title="No purchased properties found" />;
    }

    return (
      <MyPurchases
        purchases={purchases.data.purchases}
        meta={purchases.data.meta}
      />
    );
  } catch (error) {
    return <ErrorDisplay message="Failed to fetch purchased properties" />;
  }
}

export default Page;