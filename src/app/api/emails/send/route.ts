import { NextRequest, NextResponse } from "next/server";
import { render } from "@react-email/render";
import { z } from "zod";
import { emailTemplates } from "@/emails/templates";

const emailTemplateEnum = z.enum([
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
] as const);

const requestSchema = z.object({
  type: emailTemplateEnum,
  to: z
    .union([z.string().email(), z.array(z.string().email())])
    .refine((value) => (Array.isArray(value) ? value.length > 0 : true), {
      message: "Recipient list cannot be empty",
    }),
  data: z.record(z.any()),
});

const fetchErrorMessage = async (response: Response) => {
  try {
    const payload = await response.json();
    return JSON.stringify(payload);
  } catch (error) {
    try {
      return await response.text();
    } catch {
      return "Unable to read response body";
    }
  }
};

export async function POST(request: NextRequest) {
  const dispatchKey = process.env.EMAIL_DISPATCH_API_KEY;
  const resendKey = process.env.RESEND_API_KEY;
  const fromAddress = process.env.EMAIL_FROM_ADDRESS;
  const supportEmail = process.env.SUPPORT_EMAIL ?? "propertyseconline@gmail.com";

  if (!dispatchKey) {
    return NextResponse.json(
      { error: "Email dispatch key is not configured" },
      { status: 500 }
    );
  }

  if (!resendKey || !fromAddress) {
    return NextResponse.json(
      { error: "Email delivery service is not configured" },
      { status: 500 }
    );
  }

  const providedKey = request.headers.get("x-email-api-key");
  if (providedKey !== dispatchKey) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch (error) {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
  }

  let parsedRequest;
  try {
    parsedRequest = requestSchema.parse(payload);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid request body", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const templateConfig = emailTemplates[parsedRequest.type];
  let templateData;
  try {
    templateData = templateConfig.schema.parse(parsedRequest.data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid template data", details: error.flatten() },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Invalid template data" }, { status: 400 });
  }

  const props = { ...templateData, supportEmail } as Record<string, unknown>;
  const emailComponent = templateConfig.component(props as any);

  const htmlOutput = render(emailComponent);
  const textOutput = render(emailComponent, { plainText: true });

  const subject = templateConfig.subject(templateData as any);
  const recipients = Array.isArray(parsedRequest.to) ? parsedRequest.to : [parsedRequest.to];

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromAddress,
        to: recipients,
        subject,
        html: htmlOutput,
        text: textOutput,
      }),
    });

    if (!response.ok) {
      const errorDetails = await fetchErrorMessage(response);
      return NextResponse.json(
        {
          error: "Failed to send email",
          status: response.status,
          details: errorDetails,
        },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Unexpected error while sending email",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 502 }
    );
  }
}
