import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface LoanApprovedEmailProps {
  userName: string;
  loanAmount: number | string;
  loanId: string;
  loanDuration: string;
  supportEmail: string;
}

export default function LoanApprovedEmail({
  userName,
  loanAmount,
  loanId,
  loanDuration,
  supportEmail,
}: LoanApprovedEmailProps) {
  const amountNumber = typeof loanAmount === "number" ? loanAmount : Number(loanAmount);
  const formattedAmount = `₦${Number.isFinite(amountNumber) ? amountNumber.toLocaleString() : loanAmount}`;

  return (
    <BaseLayout previewText="Your loan has been approved" supportEmail={supportEmail}>
      <Section>
        <Text style={headingStyle}>Loan Application Approved!</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          Congratulations! Your loan application has been approved. Here are the details:
        </Text>
        <Text style={paragraphStyle}>
          <strong>Loan Amount:</strong> {formattedAmount}
          <br />
          <strong>Loan ID:</strong> {loanId}
          <br />
          <strong>Duration:</strong> {loanDuration}
        </Text>
        <Text style={paragraphStyle}>
          Your loan will be disbursed to your account shortly. You can track the status in your dashboard.
        </Text>
      </Section>
    </BaseLayout>
  );
}
