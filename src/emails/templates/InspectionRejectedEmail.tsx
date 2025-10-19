import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface InspectionRejectedEmailProps {
  userName: string;
  propertyTitle: string;
  inspectionId: string;
  reason: string;
  supportEmail: string;
}

export default function InspectionRejectedEmail({
  userName,
  propertyTitle,
  inspectionId,
  reason,
  supportEmail,
}: InspectionRejectedEmailProps) {
  return (
    <BaseLayout
      previewText={`Update on your inspection request for ${propertyTitle}`}
      supportEmail={supportEmail}
    >
      <Section>
        <Text style={headingStyle}>Inspection Request Update</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          We have reviewed your inspection request and unfortunately, it cannot be approved at this time.
        </Text>
        <Text style={paragraphStyle}>
          <strong>Property:</strong> {propertyTitle}
          <br />
          <strong>Inspection ID:</strong> {inspectionId}
        </Text>
        <Text style={paragraphStyle}>
          <strong>Reason:</strong> {reason}
        </Text>
        <Text style={paragraphStyle}>
          You can contact our support team if you need further clarification or wish to submit a new request.
        </Text>
      </Section>
    </BaseLayout>
  );
}
