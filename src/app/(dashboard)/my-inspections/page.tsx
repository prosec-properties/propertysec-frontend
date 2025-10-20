import { authConfig } from "@/authConfig";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import MyInspections from "@/components/dashboard/MyInspections";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { IMeta } from "@/interface/general";
import { IPropertyInspection } from "@/interface/property";
import { fetchMyInspectedProperties } from "@/services/user.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";


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
  const queries = await searchParams;

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }

  if (session.user.role === USER_ROLE.ADMIN) {
    redirect(SIGN_IN_ROUTE);
  }

  if (!session.user?.token) {
    redirect(SIGN_IN_ROUTE);
  }

  const getParamValue = (param?: string | string[]): string | undefined => {
    if (Array.isArray(param)) {
      return param[0];
    }
    return param;
  };

  try {
    const page = getParamValue(queries.page) ?? "1";
    const per_page = getParamValue(queries.per_page) ?? "20";
    const sort_by = getParamValue(queries.sort_by) ?? "created_at";
    const order = getParamValue(queries.order) ?? "desc";

    const response = await fetchMyInspectedProperties(
      session.user.token,
      {
        page,
        per_page,
        sort_by,
        order,
      },
      {
        cache: "force-cache",
        next: {
          revalidate: 300,
          tags: [
            "my-inspections",
            session.user?.id ? `my-inspections-${session.user.id}` : undefined,
          ].filter(Boolean) as string[],
        },
      }
    );

    const inspections = response?.data?.inspections ?? [];
    const meta = response?.data?.meta;

    return <MyInspectionsClient inspections={inspections} meta={meta} />;
  } catch (error) {
    return <ErrorDisplay message="Failed to fetch inspection payments" />;
  }
}

function MyInspectionsClient({
  inspections,
  meta,
}: {
  inspections: IPropertyInspection[];
  meta?: IMeta;
}) {
  return <MyInspections inspections={inspections} meta={meta} />;
}

export default Page;
