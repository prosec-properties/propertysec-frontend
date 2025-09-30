import type { Metadata } from "next";
import { Niramit } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { NextAuthProvider } from "@/components/misc/SessionProvider";
import { getServerSession } from "next-auth";
import { authConfig } from "@/authConfig";
import React from "react";
import Script from "next/script";
import { TanstackProviders } from "@/components/misc/TanstackProvider";
import ErrorBoundary from "@/components/misc/ErrorBoundary";

const niramit = Niramit({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: { template: "%s | Property Sec", default: "Property Sec" },
  description:
    "Property Sec is a property management platform that helps you manage your properties with ease.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en">
      <body className={niramit.className}>
        <ErrorBoundary>
          <NextAuthProvider session={session as any}>
            <TanstackProviders>{children}</TanstackProviders>
          </NextAuthProvider>
        </ErrorBoundary>
        <Toaster />
      </body>
      <Script src={"https://js.paystack.co/v2/inline.js"}></Script>
    </html>
  );
}
