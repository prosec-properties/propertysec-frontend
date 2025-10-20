import { authConfig } from "@/authConfig";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { fetchMyProperties } from "@/services/properties.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Landlord from "@/components/dashboard/Landlord";
import AffiliateDashboard from "@/components/dashboard/AffiliateDashboard";
import Spinner from "@/components/misc/Spinner";
import { fetchAffiliateShop } from "@/services/affiliate.service";
import { ensureAuthenticatedSession, withServerAuth } from "@/lib/serverAuthGuard";

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
  const session = ensureAuthenticatedSession(await getServerSession(authConfig));
  const token = session.user?.token || session.accessToken || "";
  if (session.user.role === USER_ROLE.BUYER) {
    redirect(HOME_ROUTE);
  }

  const user = session.user;

  const statusQuery = (Array.isArray(queries?.status)
    ? queries?.status[0]
    : queries?.status) ?? "all";

  const filterParams = {
    status: statusQuery === "all" ? undefined : statusQuery,
    search: queries?.search,
    page: queries?.page ? parseInt(queries.page) : 1,
    limit: queries?.limit ? parseInt(queries.limit) : 10,
  };

  if (
    user.role === USER_ROLE.LANDLORD ||
    user.role === USER_ROLE.DEVELOPER ||
    user.role === USER_ROLE.LAWYER
  ) {
    const myProperties = await withServerAuth(() =>
      fetchMyProperties(
        token,
        filterParams,
        {
          cache: "force-cache",
          next: {
            revalidate: 300,
            tags: [
              "my-properties",
              session.user?.id ? `my-properties-${session.user.id}` : undefined,
            ].filter(Boolean) as string[],
          },
        }
      )
    );

    return (
      <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading properties..." />}>
        <Landlord
          properties={myProperties?.data?.data || []}
          meta={myProperties?.data?.meta}
        />
      </Suspense>
    );
  }
  if (user.role === USER_ROLE.AFFILIATE) {
    const shop = await withServerAuth(() =>
  fetchAffiliateShop(token, {
        cache: "force-cache",
        next: {
          revalidate: 300,
          tags: [
            "affiliate-shop",
            session.user?.id ? `affiliate-shop-${session.user.id}` : undefined,
          ].filter(Boolean) as string[],
        },
      })
    );
    return (
      <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading shop..." />}>
        <AffiliateDashboard properties={shop?.data?.properties || []} />
      </Suspense>
    );
  }
}

export default Page;
