import { authConfig } from "@/authConfig";
import EmptyState from "@/components/misc/Empty";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { fetchMyInspectedProperties } from "@/services/user.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import MyInspections from "@/components/dashboard/MyInspections";

type ISearchParams = Promise<{
  page?: string;
  per_page?: string;
  sort_by?: string;
  order?: string;
  [key: string]: string | string[] | undefined;
}>;

export const metadata = {
  title: "My Inspected Properties",
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
    const inspections = await fetchMyInspectedProperties(user?.token!, {
      page: queries?.page || "1",
      per_page: queries?.per_page || "20",
      sort_by: queries?.sort_by || "created_at",
      order: queries?.order || "desc",
    });

    if (!inspections?.success) {
      return <ErrorDisplay message="Failed to fetch inspected properties" />;
    }

    if (!inspections.data?.inspections?.length) {
      return <EmptyState title="No inspected properties found" />;
    }

    return (
      <MyInspections
        inspections={inspections.data.inspections}
        meta={inspections.data.meta}
      />
    );
  } catch (error) {
    return <ErrorDisplay message="Failed to fetch inspected properties" />;
  }
}

export default Page;