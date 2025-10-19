import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface WelcomeEmailProps {
  userName: string;
  supportEmail: string;
}

export default function WelcomeEmail({ userName, supportEmail }: WelcomeEmailProps) {
  return (
    <BaseLayout previewText="Welcome to Property Sec" supportEmail={supportEmail}>
      <Section>
        <Text style={headingStyle}>Welcome to Property Sec!</Text>
        <Text style={paragraphStyle}>Hi {userName},</Text>
        <Text style={paragraphStyle}>
          Your email has been successfully verified. You can now explore properties, manage your account, and use every
          feature Property Sec offers. We are excited to have you on board.
        </Text>
        <Text style={paragraphStyle}>
          If you need any assistance, our support team is always happy to help.
        </Text>
      </Section>
    </BaseLayout>
  );
}
