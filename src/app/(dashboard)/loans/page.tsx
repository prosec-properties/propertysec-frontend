import { authConfig } from "@/authConfig";
import LoanWrapper from "@/components/loans/LoanWrapper";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Loans",
};

interface ISearchParams {
  tab?: string;
}

async function Page(props: { searchParams?: Promise<ISearchParams> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams?.tab || "1";
  const session = await getServerSession(authConfig);

  if (!session || !session.user || !session.user.token) {
    redirect("/");
  }

  return <LoanWrapper />;
}

export default Page;
