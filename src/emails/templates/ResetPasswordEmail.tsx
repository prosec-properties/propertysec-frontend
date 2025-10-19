import * as React from "react";
import { Button, Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { buttonStyle, headingStyle, paragraphStyle } from "../components/styles";

export interface ResetPasswordEmailProps {
  resetLink: string;
  supportEmail: string;
}

export default function ResetPasswordEmail({ resetLink, supportEmail }: ResetPasswordEmailProps) {
  return (
    <BaseLayout previewText="Reset your Property Sec password" supportEmail={supportEmail}>
      <Section>
        <Text style={headingStyle}>Reset Password</Text>
        <Text style={paragraphStyle}>
          You requested to reset your Property Sec account password. Click the button below to choose a new password.
        </Text>
        <Button href={resetLink} style={{ ...buttonStyle, margin: "24px 0" }}>
          Reset Password
        </Button>
        <Text style={paragraphStyle}>
          This link will expire in 20 minutes. If you did not request a password reset, please ignore this email or
          contact our support team for assistance. Property Sec will never ask you to disclose your password.
        </Text>
      </Section>
    </BaseLayout>
  );
}
