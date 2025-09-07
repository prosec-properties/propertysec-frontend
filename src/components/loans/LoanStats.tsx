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
  loans?: ILoan[];
}

const LoanStats = ({ stats }: Props) => {
  // Calculate interest (assuming 10% for demonstration)
  const interestAmount = stats ? stats.approvedAmount * 0.1 : 0;
  // Calculate amount paid (assuming 60% for demonstration)
  const amountPaid = stats ? stats.approvedAmount * 0.6 : 0;
  // Calculate balance
  const balance = stats
    ? stats.approvedAmount + interestAmount - amountPaid
    : 0;
  // Calculate duration (assuming 6 months for active loans)
  const activeLoansDuration = stats && stats.totalLoans > 0 ? "6 months" : "-";

  console.log({ stats, interestAmount, amountPaid, balance });

  return (
    <StatsWrapper>
      <Stat
        title="Loan Amount"
        value={stats ? formatPrice(stats.totalAmount) : formatPrice(0)}
      />
      <Stat title="Interest (10%)" value={formatPrice(interestAmount)} />
      <Stat title="Amount Paid" value={formatPrice(amountPaid)} />
      <Stat title="Balance" value={formatPrice(balance)} />
      <Stat title="Duration" value={activeLoansDuration} />
    </StatsWrapper>
  );
};

export default LoanStats;
