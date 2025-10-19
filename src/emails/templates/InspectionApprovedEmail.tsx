import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface InspectionApprovedEmailProps {
  userName: string;
  propertyTitle: string;
  inspectionId: string;
  inspectionAmount: number | string;
  supportEmail: string;
}

export default function InspectionApprovedEmail({
  userName,
  propertyTitle,
  inspectionId,
  inspectionAmount,
  supportEmail,
}: InspectionApprovedEmailProps) {
  const amountNumber = typeof inspectionAmount === "number" ? inspectionAmount : Number(inspectionAmount);
  const formattedAmount = `₦${Number.isFinite(amountNumber) ? amountNumber.toLocaleString() : inspectionAmount}`;

  return (
    <BaseLayout
      previewText={`Inspection approved for ${propertyTitle}`}
      supportEmail={supportEmail}
    >
      <Section>
        <Text style={headingStyle}>Inspection Request Approved!</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          Your inspection request has been approved. Here are the details:
        </Text>
        <Text style={paragraphStyle}>
          <strong>Property:</strong> {propertyTitle}
          <br />
          <strong>Inspection ID:</strong> {inspectionId}
          <br />
          <strong>Inspection Fee:</strong> {formattedAmount}
        </Text>
        <Text style={paragraphStyle}>
          Please proceed with the payment to schedule your inspection. Our team will get in touch with you shortly to
          arrange a suitable date and time.
        </Text>
      </Section>
    </BaseLayout>
  );
}
