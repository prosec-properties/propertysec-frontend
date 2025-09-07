"use client";

import React, { useState, useMemo } from "react";
import LoanStats from "./LoanStats";
import LoanHeader from "./LoanHeader";
import LoanTable from "./LoanTable";
import { IUserLoansResponse } from "@/services/loan.service";

interface Props {
  loanData: IUserLoansResponse;
}
const LoanWrapper = (props: Props) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredLoans = useMemo(() => {
    if (!props.loanData?.loans?.data) return [];

    if (activeFilter === "all") {
      return props.loanData.loans.data;
    }

    if (activeFilter === "approved") {
      // Include approved and disbursed loans that are still active (not completed)
      return props.loanData.loans.data.filter(
        (loan) =>
          loan.loanStatus === "approved" || loan.loanStatus === "disbursed"
      );
    }

    return props.loanData.loans.data.filter(
      (loan) => loan.loanStatus === activeFilter
    );
  }, [props.loanData?.loans?.data, activeFilter]);

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div>
      <div className="mb-6">
        <LoanHeader
          onFilterChange={handleFilterChange}
          activeFilter={activeFilter}
        />
      </div>
      <div className="mb-6">
        <LoanStats
          stats={props.loanData?.stats}
          loans={props.loanData?.loans?.data}
        />
      </div>

      <div>
        <h1 className="text-2xl font-medium mb-6">
          {activeFilter === "all"
            ? "Loan Activity"
            : activeFilter === "pending"
            ? "Loan Requests"
            : activeFilter === "approved"
            ? "Active Loans"
            : activeFilter === "disbursed"
            ? "Disbursed Loans"
            : activeFilter === "overdue"
            ? "Due Loans"
            : "Loan Activity"}
        </h1>
        <LoanTable loans={filteredLoans} activeFilter={activeFilter} />
      </div>
    </div>
  );
};

export default LoanWrapper;
