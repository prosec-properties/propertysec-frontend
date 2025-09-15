import DashboardHeader from "@/components/header/DashboardHeader";
import { USER_ROLE } from "@/constants/user";
import { getServerSession } from "next-auth";
import { authConfig } from "@/authConfig";
import React from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import FooterMenu from "@/components/footer/FooterMenu";
import { redirect } from "next/navigation";
import { SIGN_IN_ROUTE } from "@/constants/routes";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authConfig);
  const user = session?.user;

  if (!session || !user) {
    redirect(SIGN_IN_ROUTE);
  }

  const isAdmin = user?.role === USER_ROLE.ADMIN;
  const isAffiliate = user?.role === USER_ROLE.AFFILIATE;

  if (isAdmin) {
    return (
      <>
        <AdminLayout>{children}</AdminLayout>
        <FooterMenu />
      </>
    );
  }

  return (
    <div className="relative bg-offWhite min-h-screen overflow-y-auto">
      <DashboardHeader  />
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        {children}
      </div>
      <FooterMenu />
    </div>
  );
};

export default DashboardLayout;
