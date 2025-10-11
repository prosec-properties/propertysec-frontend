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
  title: "My Inspection Payments",
};

async function Page({ searchParams }: { searchParams: ISearchParams }) {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }

  if (session.user.role === USER_ROLE.ADMIN) {
    redirect(SIGN_IN_ROUTE);
  }

  if (!session.user?.token) {
    redirect(SIGN_IN_ROUTE);
  }

  return <MyInspectionsClient token={session.user.token} />;
}

function MyInspectionsClient({ token }: { token: string }) {
  return <MyInspections token={token} />;
}

export default Page;
