import * as React from "react";
import { z } from "zod";
import InspectionApprovedEmail from "./InspectionApprovedEmail";
import InspectionCompletedEmail from "./InspectionCompletedEmail";
import InspectionRejectedEmail from "./InspectionRejectedEmail";
import LoanApprovedEmail from "./LoanApprovedEmail";
import LoanDisbursedEmail from "./LoanDisbursedEmail";
import LoanRejectedEmail from "./LoanRejectedEmail";
import PropertyCreatedEmail from "./PropertyCreatedEmail";
import PropertyPublishedEmail from "./PropertyPublishedEmail";
import PropertyPurchaseEmail from "./PropertyPurchaseEmail";
import PropertyRejectedEmail from "./PropertyRejectedEmail";
import ResetPasswordEmail from "./ResetPasswordEmail";
import VerifyEmailOtpEmail from "./VerifyEmailOtpEmail";
import WelcomeEmail from "./WelcomeEmail";

export type EmailTemplateType =
  | "verify-email-otp"
  | "reset-password-otp"
  | "welcome-email"
  | "property-created"
  | "property-published"
  | "property-rejected"
  | "property-purchase"
  | "inspection-approved"
  | "inspection-rejected"
  | "inspection-completed"
  | "loan-approved"
  | "loan-disbursed"
  | "loan-rejected";

export const emailTemplateKeys: EmailTemplateType[] = [
  "verify-email-otp",
  "reset-password-otp",
  "welcome-email",
  "property-created",
  "property-published",
  "property-rejected",
  "property-purchase",
  "inspection-approved",
  "inspection-rejected",
  "inspection-completed",
  "loan-approved",
  "loan-disbursed",
  "loan-rejected",
];

type TemplateSchema = z.ZodTypeAny;

interface TemplateConfig<Schema extends TemplateSchema> {
  schema: Schema;
  subject: (data: z.infer<Schema>) => string;
  previewText?: (data: z.infer<Schema>) => string;
  component: (props: z.infer<Schema> & { supportEmail: string }) => React.ReactElement;
}

const nairaFormatter = new Intl.NumberFormat("en-NG", {
  minimumFractionDigits: 0,
});

const formatNaira = (value: unknown) => {
  const numeric = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(numeric)) {
    return `${value}`;
  }
  return `₦${nairaFormatter.format(numeric)}`;
};

const templateConfigs = {
  "verify-email-otp": {
    schema: z.object({ otp: z.string() }),
    subject: () => "Verify your email",
    previewText: () => "Verify your email address",
    component: ({ supportEmail, ...data }) => (
      <VerifyEmailOtpEmail {...(data as { otp: string })} supportEmail={supportEmail} />
    ),
  },
  "reset-password-otp": {
    schema: z.object({ resetLink: z.string().url() }),
    subject: () => "Reset your password",
    previewText: () => "Reset your Property Sec password",
    component: ({ supportEmail, ...data }) => (
      <ResetPasswordEmail {...(data as { resetLink: string })} supportEmail={supportEmail} />
    ),
  },
  "welcome-email": {
    schema: z.object({ userName: z.string() }),
    subject: () => "Welcome to Prosec Properties!",
    previewText: (data) => `Welcome, ${data.userName}!`,
    component: ({ supportEmail, ...data }) => (
      <WelcomeEmail {...(data as { userName: string })} supportEmail={supportEmail} />
    ),
  },
  "property-created": {
    schema: z.object({
      userName: z.string(),
      propertyTitle: z.string(),
      propertyId: z.string(),
    }),
    subject: (data) => `Property Created Successfully - ${data.propertyTitle}`,
    previewText: (data) => `Update: ${data.propertyTitle} created`,
    component: ({ supportEmail, ...data }) => (
      <PropertyCreatedEmail
        {...(data as { userName: string; propertyTitle: string; propertyId: string })}
        supportEmail={supportEmail}
      />
    ),
  },
  "property-published": {
    schema: z.object({
      userName: z.string(),
      propertyTitle: z.string(),
      propertyId: z.string(),
    }),
    subject: (data) => `Your property ${data.propertyTitle} has been published`,
    previewText: (data) => `Update: ${data.propertyTitle} published`,
    component: ({ supportEmail, ...data }) => (
      <PropertyPublishedEmail
        {...(data as { userName: string; propertyTitle: string; propertyId: string })}
        supportEmail={supportEmail}
      />
    ),
  },
  "property-rejected": {
    schema: z
      .object({
        userName: z.string(),
        propertyTitle: z.string(),
        propertyId: z.string(),
        reason: z.string().optional(),
      })
      .transform((data) => ({
        ...data,
        reason: data.reason ?? "No reason provided",
      })),
  subject: (data) => `Property Review Update - ${data.propertyTitle}`,
  previewText: (data) => `Update: ${data.propertyTitle} review`,
    component: ({ supportEmail, ...data }) => (
      <PropertyRejectedEmail
        {...(data as { userName: string; propertyTitle: string; propertyId: string; reason: string })}
        supportEmail={supportEmail}
      />
    ),
  },
  "property-purchase": {
    schema: z.object({
      buyerName: z.string(),
      propertyTitle: z.string(),
      propertyAddress: z.string(),
      purchaseAmount: z.union([z.number(), z.string()]),
      currency: z.string(),
      transactionReference: z.string(),
      purchaseDate: z.string(),
    }),
    subject: (data) => `Property Purchase Confirmation - ${data.propertyTitle}`,
    previewText: (data) => `Purchase confirmation for ${data.propertyTitle}`,
    component: ({ supportEmail, ...data }) => (
      <PropertyPurchaseEmail
        {...(data as {
          buyerName: string;
          propertyTitle: string;
          propertyAddress: string;
          purchaseAmount: number | string;
          currency: string;
          transactionReference: string;
          purchaseDate: string;
        })}
        supportEmail={supportEmail}
      />
    ),
  },
  "inspection-approved": {
    schema: z.object({
      userName: z.string(),
      propertyTitle: z.string(),
      inspectionId: z.string(),
      inspectionAmount: z.union([z.number(), z.string()]),
    }),
    subject: (data) => `Inspection Request Approved - ${data.propertyTitle}`,
    previewText: (data) => `Inspection approved for ${data.propertyTitle}`,
    component: ({ supportEmail, ...data }) => (
      <InspectionApprovedEmail
        {...(data as {
          userName: string;
          propertyTitle: string;
          inspectionId: string;
          inspectionAmount: number | string;
        })}
        supportEmail={supportEmail}
      />
    ),
  },
  "inspection-rejected": {
    schema: z
      .object({
        userName: z.string(),
        propertyTitle: z.string(),
        inspectionId: z.string(),
        reason: z.string().optional(),
      })
      .transform((data) => ({
        ...data,
        reason: data.reason ?? "No specific reason provided",
      })),
    subject: (data) => `Inspection Request Update - ${data.propertyTitle}`,
    previewText: (data) => `Inspection update for ${data.propertyTitle}`,
    component: ({ supportEmail, ...data }) => (
      <InspectionRejectedEmail
        {...(data as {
          userName: string;
          propertyTitle: string;
          inspectionId: string;
          reason: string;
        })}
        supportEmail={supportEmail}
      />
    ),
  },
  "inspection-completed": {
    schema: z.object({
      userName: z.string(),
      propertyTitle: z.string(),
      inspectionId: z.string(),
      inspectionReport: z.string(),
    }),
    subject: (data) => `Inspection Completed - ${data.propertyTitle}`,
    previewText: (data) => `Inspection completed for ${data.propertyTitle}`,
    component: ({ supportEmail, ...data }) => (
      <InspectionCompletedEmail
        {...(data as {
          userName: string;
          propertyTitle: string;
          inspectionId: string;
          inspectionReport: string;
        })}
        supportEmail={supportEmail}
      />
    ),
  },
  "loan-approved": {
    schema: z.object({
      userName: z.string(),
      loanAmount: z.union([z.number(), z.string()]),
      loanId: z.string(),
      loanDuration: z.string(),
    }),
    subject: (data) => `Loan Application Approved - ${formatNaira(data.loanAmount)}`,
    previewText: (data) => `Loan approved for ${data.userName}`,
    component: ({ supportEmail, ...data }) => (
      <LoanApprovedEmail
        {...(data as {
          userName: string;
          loanAmount: number | string;
          loanId: string;
          loanDuration: string;
        })}
        supportEmail={supportEmail}
      />
    ),
  },
  "loan-disbursed": {
    schema: z.object({
      userName: z.string(),
      loanAmount: z.union([z.number(), z.string()]),
      loanId: z.string(),
      disbursementDate: z.string(),
    }),
    subject: (data) => `Loan Disbursed Successfully - ${formatNaira(data.loanAmount)}`,
    previewText: (data) => `Loan disbursed for ${data.userName}`,
    component: ({ supportEmail, ...data }) => (
      <LoanDisbursedEmail
        {...(data as {
          userName: string;
          loanAmount: number | string;
          loanId: string;
          disbursementDate: string;
        })}
        supportEmail={supportEmail}
      />
    ),
  },
  "loan-rejected": {
    schema: z
      .object({
        userName: z.string(),
        loanAmount: z.union([z.number(), z.string()]),
        loanId: z.string(),
        reason: z.string().optional(),
      })
      .transform((data) => ({
        ...data,
        reason: data.reason ?? "No specific reason provided",
      })),
    subject: (data) => `Loan Application Update - ${formatNaira(data.loanAmount)}`,
    previewText: (data) => `Loan update for ${data.userName}`,
    component: ({ supportEmail, ...data }) => (
      <LoanRejectedEmail
        {...(data as {
          userName: string;
          loanAmount: number | string;
          loanId: string;
          reason: string;
        })}
        supportEmail={supportEmail}
      />
    ),
  },
} satisfies Record<EmailTemplateType, TemplateConfig<TemplateSchema>>;

export const emailTemplates = templateConfigs;

export type EmailTemplateData<T extends EmailTemplateType> = z.infer<(typeof emailTemplates)[T]["schema"]>;
