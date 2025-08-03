import { $requestWithoutToken } from "@/api/general";
import { authConfig } from "@/authConfig";
import AffiliateProfileForm from "@/components/forms/AffiliateForm";
import LandlordProfileForm from "@/components/forms/LandlordProfile";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { NIGERIAN_COUNTRY_ID } from "@/constants/general";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { ICountry } from "@/interface/location";
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

  // const countries = await fetchCountries();
  const country = await fetchACountry(NIGERIAN_COUNTRY_ID);


  // console.log("countries", countries);

  if (!country?.success) {
    return <ErrorDisplay message="Error Fetching Countries" />;
  }

  switch (userRole) {
    case USER_ROLE.LANDLORD:
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

    default:
      return <div>Role is not assigned yet</div>;
  }
}
