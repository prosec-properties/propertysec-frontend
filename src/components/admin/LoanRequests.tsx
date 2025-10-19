"use client";

import React, { useMemo, useState } from "react";
import TableSearch from "../tables/TableSearch";
import LoanTable from "../loans/LoanTable";
import { ILoan, ILoanSummary, ILoanStatus } from "@/interface/loan";
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

const COMPLETED_STATUSES: ILoanStatus[] = ["disbursed", "completed"];

const LoanRequests = (props: Props) => {
  const router = useRouter();
  const loans = useMemo(() => props.initialLoans ?? [], [props.initialLoans]);
  const [activeFilter, setActiveFilter] = useState<"all" | "active" | "completed">("all");

  const filteredLoans = useMemo(() => {
    switch (activeFilter) {
      case "active":
        return loans.filter((loan) => loan.loanStatus === "approved");
      case "completed":
        return loans.filter((loan) =>
          COMPLETED_STATUSES.includes(loan.loanStatus)
        );
      default:
        return loans;
    }
  }, [activeFilter, loans]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center gap-2 flex-wrap">
        <p>Users</p>
        <div className="flex items-center gap-5 md:gap-10 flex-wrap">
          <CustomButton
            variant={activeFilter === "active" ? "primary" : "secondary"}
            onClick={() => setActiveFilter("active")}
          >
            Active Loans
          </CustomButton>
          <CustomButton
            variant={activeFilter === "completed" ? "primary" : "secondary"}
            onClick={() => setActiveFilter("completed")}
          >
            Approved Loans
          </CustomButton>
          <CustomButton
            variant={activeFilter === "all" ? "primary" : "secondary"}
            onClick={() => setActiveFilter("all")}
          >
            Loan Requests
          </CustomButton>
        </div>
      </div>

      <StatsWrapper className="bg-primary">
        <Stat
          title="Total Loan Disbursed"
          value={formatPrice(props.loanStats?.disbursedLoans || "0")}
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
        loans={filteredLoans}
        activeFilter={activeFilter}
        onRowClick={(item) => {
          router.push(`${ADMIN_LOAN_DETAIL_ROUTE}/${item.id}`);
        }}
      />
    </div>
  );
};

export default LoanRequests;
