import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface PropertyCreatedEmailProps {
  userName: string;
  propertyTitle: string;
  propertyId: string;
  supportEmail: string;
}

export default function PropertyCreatedEmail({
  userName,
  propertyTitle,
  propertyId,
  supportEmail,
}: PropertyCreatedEmailProps) {
  return (
    <BaseLayout
      previewText={`Your property \"${propertyTitle}\" was created successfully`}
      supportEmail={supportEmail}
    >
      <Section>
        <Text style={headingStyle}>Property Created Successfully!</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          Your property &quot;{propertyTitle}&quot; has been created successfully and is now under review. Our team will
          review it shortly and notify you once it&apos;s published.
        </Text>
        <Text style={paragraphStyle}>Property ID: {propertyId}</Text>
        <Text style={paragraphStyle}>You can check the status of your property in your dashboard.</Text>
      </Section>
    </BaseLayout>
  );
}
