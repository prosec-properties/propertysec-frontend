import { authConfig } from "@/authConfig";
import EmptyState from "@/components/misc/Empty";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { fetchMyProperties } from "@/services/properties.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import Landlord from "@/components/dashboard/Landlord";
import MultipleProperties from "@/components/property/MultipleProperties";
import AffiliateDashboard from "@/components/dashboard/AffiliateDashboard";

type ISearchParams = Promise<{
  categories?: string;
  locations?: string;
  pricing?: string;
  search?: string;
  status?: string;
  [key: string]: string | string[] | undefined;
}>;

async function Page({ searchParams }: { searchParams: ISearchParams }) {
  const queries = await searchParams;
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }

  if (session.user.role === USER_ROLE.BUYER) {
    redirect(HOME_ROUTE);
  }

  if (!session.user?.token) {
    redirect(SIGN_IN_ROUTE);
  }

  const user = session.user;

  const filterParams = {
    status: queries?.status === "all" ? undefined : queries?.status || "draft",
    search: queries?.search,
  };

  if (
    user.role === USER_ROLE.LANDLORD ||
    user.role === USER_ROLE.DEVELOPER ||
    user.role === USER_ROLE.LAWYER
  ) {
    const [properties] = await Promise.all([
      fetchMyProperties(session.user.token, filterParams),
    ]);

    if (!properties?.success) {
      return (
        <EmptyState message="Unable to fetch your properties. Please try again later." />
      );
    }

    return <Landlord properties={properties?.data?.data || []} />;
  }
  if (user.role === USER_ROLE.AFFILIATE) {
    return <AffiliateDashboard />;
  }
}

export default Page;
