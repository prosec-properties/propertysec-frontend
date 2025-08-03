import React from "react";
import DashboardHeader from "../header/DashboardHeader";
import AdminSideMenu from "../header/AdminSideMenu";

interface Props {
  children: React.ReactNode;
}
const AdminLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col min-h-screen bg-offWhite">
      <DashboardHeader className="sticky top-0 z-10" isAffiliate={false} />

      <div className="flex flex-1">
        <div className="sticky top-16 h-[calc(100vh-64px)] overflow-y-auto">
          <AdminSideMenu />
        </div>

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto space-y-8 py-8 pr-8 lg:space-y-16">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
