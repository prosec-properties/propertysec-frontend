import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface LoanDisbursedEmailProps {
  userName: string;
  loanAmount: number | string;
  loanId: string;
  disbursementDate: string;
  supportEmail: string;
}

export default function LoanDisbursedEmail({
  userName,
  loanAmount,
  loanId,
  disbursementDate,
  supportEmail,
}: LoanDisbursedEmailProps) {
  const amountNumber = typeof loanAmount === "number" ? loanAmount : Number(loanAmount);
  const formattedAmount = `₦${Number.isFinite(amountNumber) ? amountNumber.toLocaleString() : loanAmount}`;

  return (
    <BaseLayout previewText="Your loan has been disbursed" supportEmail={supportEmail}>
      <Section>
        <Text style={headingStyle}>Loan Disbursed Successfully!</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          Great news! Your approved loan has been successfully disbursed to your account.
        </Text>
        <Text style={paragraphStyle}>
          <strong>Loan Amount:</strong> {formattedAmount}
          <br />
          <strong>Loan ID:</strong> {loanId}
          <br />
          <strong>Disbursement Date:</strong> {disbursementDate}
        </Text>
        <Text style={paragraphStyle}>
          Please ensure you start making your repayments as per the agreed schedule. You can view your repayment details
          in your dashboard.
        </Text>
      </Section>
    </BaseLayout>
  );
}
