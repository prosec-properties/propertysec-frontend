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
  page?: string;
  limit?: string;
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
    page: queries?.page ? parseInt(queries.page) : 1,
    limit: queries?.limit ? parseInt(queries.limit) : 10,
  };

  if (
    user.role === USER_ROLE.LANDLORD ||
    user.role === USER_ROLE.DEVELOPER ||
    user.role === USER_ROLE.LAWYER
  ) {
    return <Landlord token={session.user?.token} />;
  }
  if (user.role === USER_ROLE.AFFILIATE) {
    return <AffiliateDashboard token={user.token || ""} />;
  }
}

export default Page;
