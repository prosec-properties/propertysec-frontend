import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

interface BaseLayoutProps {
  previewText?: string;
  children: React.ReactNode;
  supportEmail: string;
}

const bodyStyle: React.CSSProperties = {
  backgroundColor: "#F2F2F2",
  margin: 0,
  padding: "24px 0",
};

const containerStyle: React.CSSProperties = {
  backgroundColor: "#FFFFFF",
  borderRadius: "12px",
  margin: "0 auto",
  padding: "32px",
  maxWidth: "600px",
  width: "100%",
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.08)",
  fontFamily: "'Murecho', Arial, sans-serif",
};

const footerSectionStyle: React.CSSProperties = {
  margin: "24px auto 0",
  maxWidth: "600px",
  textAlign: "center" as const,
  color: "#464646",
  fontFamily: "'Murecho', Arial, sans-serif",
  fontSize: "14px",
};

const footerLinkStyle: React.CSSProperties = {
  color: "#080808",
  textDecoration: "none",
};

export function BaseLayout({ previewText, children, supportEmail }: BaseLayoutProps) {
  return (
    <Html lang="en">
      <Head />
      {previewText ? <Preview>{previewText}</Preview> : null}
      <Tailwind>
        <Body style={bodyStyle}>
          <Container style={containerStyle}>{children}</Container>
          <Section style={footerSectionStyle}>
            <Text>
              <span>Sent by </span>
              <span style={{ color: "#080808", fontWeight: 600 }}>Property Sec</span>
            </Text>
            <Text>Privacy Policy | Terms and Conditions</Text>
            <Text>
              If you have any questions please contact us at{" "}
              <a style={footerLinkStyle} href={`mailto:${supportEmail}`}>
                {supportEmail}
              </a>
            </Text>
          </Section>
        </Body>
      </Tailwind>
    </Html>
  );
}
