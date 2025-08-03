import { authConfig } from "@/authConfig";
import EmptyState from "@/components/misc/Empty";
import AllProperties from "@/components/property/AllProperties";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { ICategory } from "@/interface/category";
import { ICountry } from "@/interface/location";
import { IProperty } from "@/interface/property";
import { isNotAnEmptyArray } from "@/lib/general";
import { fetchCategories } from "@/services/categories.service";
import { fetchMyProperties } from "@/services/properties.service";
import { fetchACountry } from "@/services/location.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import { NIGERIAN_COUNTRY_ID } from "@/constants/general";
import { fetchAffiliateShop } from "@/services/affiliate.service";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import MultipleProducts from "@/components/products/MultipleProducts";
import Landlord from "@/components/dashboard/Landlord";

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
    status: queries?.status || "draft",
    search: queries?.search,
  };

  if (user.role === USER_ROLE.LANDLORD || user.role === USER_ROLE.DEVELOPER || user.role === USER_ROLE.LAWYER) {
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
    const affiliateShop = await fetchAffiliateShop(user.token || "");

    console.log("affiliate", affiliateShop?.success);

    if (!affiliateShop?.success) {
      return (
        <ErrorDisplay message="Unable to fetch your properties. Please try again later." />
      );
    }
    console.log('affiliates,', affiliateShop.data?.products)
    

    return <MultipleProducts products={affiliateShop.data?.products} />;
  }
}

export default Page;
