import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface InspectionCompletedEmailProps {
  userName: string;
  propertyTitle: string;
  inspectionId: string;
  inspectionReport: string;
  supportEmail: string;
}

export default function InspectionCompletedEmail({
  userName,
  propertyTitle,
  inspectionId,
  inspectionReport,
  supportEmail,
}: InspectionCompletedEmailProps) {
  return (
    <BaseLayout
      previewText={`Inspection completed for ${propertyTitle}`}
      supportEmail={supportEmail}
    >
      <Section>
        <Text style={headingStyle}>Inspection Completed!</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          Your property inspection has been completed. Here are the details:
        </Text>
        <Text style={paragraphStyle}>
          <strong>Property:</strong> {propertyTitle}
          <br />
          <strong>Inspection ID:</strong> {inspectionId}
        </Text>
        <Text style={paragraphStyle}>
          <strong>Inspection Report:</strong>
        </Text>
        <Text style={paragraphStyle}>{inspectionReport}</Text>
        <Text style={paragraphStyle}>
          You can view the full inspection details and download the report from your dashboard.
        </Text>
      </Section>
    </BaseLayout>
  );
}
