import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface PropertyRejectedEmailProps {
  userName: string;
  propertyTitle: string;
  propertyId: string;
  reason: string;
  supportEmail: string;
}

export default function PropertyRejectedEmail({
  userName,
  propertyTitle,
  propertyId,
  reason,
  supportEmail,
}: PropertyRejectedEmailProps) {
  return (
    <BaseLayout
      previewText={`Update on your property \"${propertyTitle}\"`}
      supportEmail={supportEmail}
    >
      <Section>
        <Text style={headingStyle}>Property Review Update</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          We have reviewed your property &quot;{propertyTitle}&quot; and unfortunately, it cannot be approved at this time.
        </Text>
        <Text style={paragraphStyle}>Property ID: {propertyId}</Text>
        <Text style={paragraphStyle}>Reason: {reason}</Text>
        <Text style={paragraphStyle}>
          You can contact our support team if you need further clarification or wish to submit a new request.
        </Text>
      </Section>
    </BaseLayout>
  );
}
