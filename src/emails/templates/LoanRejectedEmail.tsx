import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface LoanRejectedEmailProps {
  userName: string;
  loanAmount: number | string;
  loanId: string;
  reason: string;
  supportEmail: string;
}

export default function LoanRejectedEmail({
  userName,
  loanAmount,
  loanId,
  reason,
  supportEmail,
}: LoanRejectedEmailProps) {
  const amountNumber = typeof loanAmount === "number" ? loanAmount : Number(loanAmount);
  const formattedAmount = `₦${Number.isFinite(amountNumber) ? amountNumber.toLocaleString() : loanAmount}`;

  return (
    <BaseLayout previewText="Update on your loan application" supportEmail={supportEmail}>
      <Section>
        <Text style={headingStyle}>Loan Application Update</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          We have reviewed your loan application and unfortunately, it doesn&apos;t meet our current approval criteria.
        </Text>
        <Text style={paragraphStyle}>
          <strong>Loan Amount:</strong> {formattedAmount}
          <br />
          <strong>Loan ID:</strong> {loanId}
        </Text>
        <Text style={paragraphStyle}>
          <strong>Reason for rejection:</strong> {reason}
        </Text>
        <Text style={paragraphStyle}>
          You can review your application details and consider reapplying with updated information.
        </Text>
      </Section>
    </BaseLayout>
  );
}
