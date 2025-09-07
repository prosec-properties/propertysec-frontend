"use client";

import React from "react";
import TableSearch from "../tables/TableSearch";
import LoanTable from "../loans/LoanTable";
import { ILoan, ILoanSummary } from "@/interface/loan";
import { useRouter } from "next/navigation";
import { Stat, StatsWrapper } from "../misc/Stat";
import CustomButton from "../buttons/CustomButton";
import { formatPrice } from "@/lib/payment";
import { ADMIN_LOAN_DETAIL_ROUTE } from "@/constants/routes";

interface Props {
  initialLoans?: ILoan[];
  loanStats: ILoanSummary;
  statistics?: {
    totalLoans: number;
    activeLoans: number;
    completedLoans: number;
  };
}

const LoanRequests = (props: Props) => {
  const router = useRouter();
  const loans = props.initialLoans || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <p>Users</p>
        <div className="flex items-center gap-5 md:gap-10 flex-wrap">
          <CustomButton variant="secondary">Active Loans</CustomButton>
          <CustomButton variant="secondary">Approved Loans</CustomButton>
          <CustomButton>Loan Requests</CustomButton>
        </div>
      </div>

      <StatsWrapper className="bg-primary">
        <Stat
          title="Total Loan Disbursed"
          value={formatPrice(props.loanStats?.statusCounts?.[0]?.totalamount)}
        />
        <Stat
          title="Active Loans"
          value={String(props.statistics?.activeLoans || 0)}
        />
        <Stat
          title="Completed Loans"
          value={String(props.statistics?.completedLoans || 0)}
        />
      </StatsWrapper>
      <TableSearch
        title="Loan Requests"
        placeholder="Search by name, email, phone..."
      />

      <LoanTable
        loans={loans}
        onRowClick={(item) => {
          router.push(`${ADMIN_LOAN_DETAIL_ROUTE}/${item.id}`);
        }}
      />
    </div>
  );
};

export default LoanRequests;
