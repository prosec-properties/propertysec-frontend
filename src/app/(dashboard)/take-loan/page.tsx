import { authConfig } from "@/authConfig";
import LoanFormWrapper from "@/components/loans/LoanFormWrapper";
import Spinner from "@/components/misc/Spinner";
import { NIGERIAN_COUNTRY_ID } from "@/constants/general";
import { fetchACountry } from "@/services/location.service";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Take Loan",
};

interface ISearchParams {
  tab?: string;
}

async function Page(props: { searchParams?: Promise<ISearchParams> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams?.tab || "1";
  const session = await getServerSession(authConfig);

  if (!session || !session.user || !session.user?.token) {
    redirect("/");
  }

  const countries = await fetchACountry(NIGERIAN_COUNTRY_ID);

  return (
    <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading loan application..." />}>
      <LoanFormWrapper
        token={session.user?.token}
        countries={countries?.data ? [countries?.data] : []}
      />
    </Suspense>
  );
}

export default Page;
