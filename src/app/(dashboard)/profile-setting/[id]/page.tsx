import { authConfig } from "@/authConfig";
import AffiliateProfileForm from "@/components/forms/AffiliateForm";
import LandlordProfileForm from "@/components/forms/LandlordProfile";
import BuyerProfileForm from "@/components/forms/BuyerProfile";
import AdminProfileForm from "@/components/forms/AdminProfile";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { NIGERIAN_COUNTRY_ID } from "@/constants/general";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { fetchACountry, fetchCountries } from "@/services/location.service";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Profile",
};

type IParams = Promise<{
  id: string;
}>;

export default async function Page({ params }: { params: IParams }) {
  const session = await getServerSession(authConfig);

  if (!session || !session.user || !session.user) {
    redirect(SIGN_IN_ROUTE);
  }

  const userRole = session.user.role;

  const country = await fetchACountry(NIGERIAN_COUNTRY_ID);
  const countries = await fetchCountries();

  // console.log("Fetched countries:", countries?.data?.);

  if (!country?.success) {
    return <ErrorDisplay message="Error Fetching Countries" />;
  }

  switch (userRole) {
    case USER_ROLE.LANDLORD:
    case USER_ROLE.DEVELOPER:
    case USER_ROLE.LAWYER:
      return (
        <LandlordProfileForm
          token={session.accessToken}
          country={country?.data || {}}
        />
      );
    case USER_ROLE.AFFILIATE:
      return (
        <AffiliateProfileForm
          token={session.accessToken}
          country={country?.data || {}}
        />
      );
    case USER_ROLE.BUYER:
      return <BuyerProfileForm country={country?.data || {}} />;
    case USER_ROLE.ADMIN:
      return <AdminProfileForm token={session.accessToken} />;

    default:
      return <div>Role is not assigned yet</div>;
  }
}
