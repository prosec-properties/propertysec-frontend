import { authConfig } from "@/authConfig";
import PropertyForm from "@/components/forms/PropertyForm";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import { ICountry } from "@/interface/location";
import { fetchCategories } from "@/services/categories.service";
import { fetchACountry } from "@/services/location.service";
import Spinner from "@/components/misc/Spinner";

const NIGERIAN_COUNTRY_ID = "161";

async function Page() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }

  if (session.user.role === USER_ROLE.BUYER) {
    redirect(HOME_ROUTE);
  }

  const [categories, country] = await Promise.all([
    fetchCategories("property"),
    fetchACountry(NIGERIAN_COUNTRY_ID),
  ]);


  return (
    <Suspense fallback={<Spinner fullScreen={false} />}>
      <PropertyForm
        country={country?.data as ICountry}
        categories={categories?.data || []}
      />
    </Suspense>
  );
}

export default Page;
