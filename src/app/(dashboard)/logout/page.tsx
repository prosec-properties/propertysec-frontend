import { authConfig } from "@/authConfig";
import Logout from "@/components/auth/Logout";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Logout",
};

interface ISearchParams {}

async function Page() {
  const session = await getServerSession(authConfig);

  if (!session || !session.user || !session.user?.token) {
    redirect("/");
  }
  return <Logout />;
}

export default Page;
