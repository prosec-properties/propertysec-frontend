import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, paragraphStyle } from "../components/styles";

export interface VerifyEmailOtpEmailProps {
  otp: string;
  supportEmail: string;
}

export default function VerifyEmailOtpEmail({ otp, supportEmail }: VerifyEmailOtpEmailProps) {
  return (
    <BaseLayout previewText="Verify your email address" supportEmail={supportEmail}>
      <Section>
        <Text style={headingStyle}>Verify Email</Text>
        <Text style={paragraphStyle}>
          Verify your new Property Sec account. To confirm your email address, use the One Time Password (OTP) shown
          below:
        </Text>
        <Text
          style={{
            ...headingStyle,
            fontSize: "24px",
            textAlign: "center",
            letterSpacing: "4px",
            margin: "24px 0",
          }}
        >
          {otp}
        </Text>
        <Text style={paragraphStyle}>
          Do not share this OTP with anyone. Property Sec will never ask you to disclose your password or OTP. If you
          did not request this verification, please ignore this message.
        </Text>
      </Section>
    </BaseLayout>
  );
}
