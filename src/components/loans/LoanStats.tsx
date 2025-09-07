import React from "react";
import { Stat, StatsWrapper } from "../misc/Stat";
import { formatPrice } from "@/lib/payment";
import { ILoan } from "@/interface/loan";

interface ILoanStats {
  totalLoans: number;
  totalAmount: number;
  approvedAmount: number;
  pendingAmount: number;
  rejectedAmount: number;
}

interface Props {
  stats?: ILoanStats;
}

const LoanStats = ({ stats }: Props) => {
  const interestAmount = stats ? stats.totalAmount * 0.1 : 0;

  const amountPaid = stats ? stats.approvedAmount * 0.6 : 0;

  const balance = stats
    ? stats.approvedAmount + interestAmount - amountPaid
    : 0;

  const activeLoansDuration = stats && stats.totalLoans > 0 ? "6 months" : "-";

  return (
    <StatsWrapper>
      <Stat title="Loan Amount" value={formatPrice(stats?.totalAmount || 0)} />
      <Stat title="Interest (10%)" value={formatPrice(interestAmount)} />
      <Stat title="Amount Paid" value={formatPrice(amountPaid)} />
      <Stat title="Balance" value={formatPrice(balance)} />
      <Stat title="Duration" value={activeLoansDuration} />
    </StatsWrapper>
  );
};

export default LoanStats;
