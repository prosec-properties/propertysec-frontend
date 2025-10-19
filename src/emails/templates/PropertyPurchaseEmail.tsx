import * as React from "react";
import { Section, Text } from "@react-email/components";
import { BaseLayout } from "../components/BaseLayout";
import { headingStyle, listItemStyle, paragraphStyle, subHeadingStyle } from "../components/styles";

export interface PropertyPurchaseEmailProps {
  buyerName: string;
  propertyTitle: string;
  propertyAddress: string;
  purchaseAmount: number | string;
  currency: string;
  transactionReference: string;
  purchaseDate: string;
  supportEmail: string;
}

export default function PropertyPurchaseEmail({
  buyerName,
  propertyTitle,
  propertyAddress,
  purchaseAmount,
  currency,
  transactionReference,
  purchaseDate,
  supportEmail,
}: PropertyPurchaseEmailProps) {
  const amountNumber = typeof purchaseAmount === "number" ? purchaseAmount : Number(purchaseAmount);
  const formattedAmount = `${currency} ${
    Number.isFinite(amountNumber) ? amountNumber.toLocaleString() : purchaseAmount
  }`;

  return (
    <BaseLayout
      previewText={`Confirmation for ${propertyTitle}`}
      supportEmail={supportEmail}
    >
      <Section>
        <Text style={headingStyle}>Property Purchase Confirmation</Text>
        <Text style={paragraphStyle}>Dear {buyerName},</Text>
        <Text style={paragraphStyle}>
          Congratulations! Your property purchase has been completed successfully. Here are the details of your
          transaction:
        </Text>
        <Text style={subHeadingStyle}>Purchase Details</Text>
        <Text style={paragraphStyle}>
          <strong>Property:</strong> {propertyTitle}
          <br />
          <strong>Address:</strong> {propertyAddress}
          <br />
          <strong>Purchase Amount:</strong> {formattedAmount}
          <br />
          <strong>Transaction Reference:</strong> {transactionReference}
          <br />
          <strong>Purchase Date:</strong> {purchaseDate}
        </Text>
        <Text style={paragraphStyle}>What happens next?</Text>
        <ul style={{ paddingLeft: "20px", margin: "8px 0" }}>
          <li style={listItemStyle}>Our team will contact you within 24 hours to discuss the next steps.</li>
          <li style={listItemStyle}>You will receive documentation and ownership transfer details.</li>
          <li style={listItemStyle}>A property handover appointment will be scheduled.</li>
          <li style={listItemStyle}>You will receive your official receipt and ownership documents.</li>
        </ul>
        <Text style={paragraphStyle}>
          Thank you for choosing Property Sec for your property investment. We look forward to completing your property
          purchase process.
        </Text>
      </Section>
    </BaseLayout>
  );
}
