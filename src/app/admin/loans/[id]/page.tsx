import LoanDetail from "@/components/admin/LoanDetail";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { getLoanDetails } from "@/services/admin.service";
import React from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { token } = await adminGuard();
  const { id } = await params;
  const loanResponse = await getLoanDetails(token, id, {
    cache: "force-cache",
    next: { revalidate: 300, tags: [`admin-loan-${id}`] },
  });

  if (!loanResponse?.success) {
    return (
      <ErrorDisplay message="Loan not found or an error occurred while fetching loan details" />
    );
  }

  return <LoanDetail loan={loanResponse.data} />;
};

export default Page;
