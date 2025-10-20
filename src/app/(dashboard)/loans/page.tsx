import { authConfig } from "@/authConfig";
import LoanWrapper from "@/components/loans/LoanWrapper";
import Spinner from "@/components/misc/Spinner";
import { getUserLoans, IUserLoansResponse } from "@/services/loan.service";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Loans",
};

interface ISearchParams {
  tab?: string;
}

const defaultLoanData: IUserLoansResponse = {
  loans: {
    data: [],
    meta: {
      total: 0,
      perPage: 10,
      currentPage: 1,
      lastPage: 1,
      firstPage: 1,
      firstPageUrl: "",
      lastPageUrl: "",
      nextPageUrl: null,
      previousPageUrl: null,
    },
  },
  stats: {
    totalLoans: 0,
    totalAmount: 0,
    approvedAmount: 0,
    pendingAmount: 0,
    rejectedAmount: 0,
  },
};

async function Page(props: { searchParams?: Promise<ISearchParams> }) {
  const searchParams = await props.searchParams;
  const session = await getServerSession(authConfig);

  if (!session || !session.user || !session.user?.token) {
    redirect("/");
  }
  const response = await getUserLoans(session.user?.token, {
    cache: "force-cache",
    next: {
      revalidate: 300,
      tags: [
        "user-loans",
        session.user?.id ? `user-loans-${session.user.id}` : undefined,
      ].filter(Boolean) as string[],
    },
  });

  return (
    <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading loans..." />}>
      <LoanWrapper loanData={response?.data || defaultLoanData} />
    </Suspense>
  );
}

export default Page;
