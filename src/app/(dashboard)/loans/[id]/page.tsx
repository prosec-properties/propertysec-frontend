import { authConfig } from "@/authConfig";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";
import LoanDetail from "@/components/loans/LoanDetail";

export const metadata: Metadata = {
  title: "Loan Details",
};

interface PageProps {
  params: Promise<{ id: string }>;
}

async function Page({ params }: PageProps) {
  const { id } = await params;
  const session = await getServerSession(authConfig);

  if (!session || !session.user || !session.user?.token) {
    redirect("/");
  }

  return <LoanDetail loanId={id} />;
}

export default Page;
