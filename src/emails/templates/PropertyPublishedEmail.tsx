import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface PropertyPublishedEmailProps {
  userName: string;
  propertyTitle: string;
  propertyId: string;
  supportEmail: string;
}

export default function PropertyPublishedEmail({
  userName,
  propertyTitle,
  propertyId,
  supportEmail,
}: PropertyPublishedEmailProps) {
  return (
    <BaseLayout
      previewText={`Your property \"${propertyTitle}\" is now live`}
      supportEmail={supportEmail}
    >
      <Section>
        <Text style={headingStyle}>Property Published Successfully!</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          Congratulations! Your property &quot;{propertyTitle}&quot; has been reviewed and published successfully. It is now
          visible to potential buyers on our platform.
        </Text>
        <Text style={paragraphStyle}>Property ID: {propertyId}</Text>
        <Text style={paragraphStyle}>You can view your published property in your dashboard or share it with others.</Text>
      </Section>
    </BaseLayout>
  );
}
