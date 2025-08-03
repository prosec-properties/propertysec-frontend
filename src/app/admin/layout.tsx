import DashboardHeader from "@/components/header/DashboardHeader";
import { USER_ROLE } from "@/constants/user";
import { getServerSession } from "next-auth";
import { authConfig } from "@/authConfig";
import AdminSideMenu from "@/components/header/AdminSideMenu";
import AdminLayout from "@/components/admin/AdminLayout";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const session = await getServerSession(authConfig);
  const user = session?.user;
  const isAdmin = user?.role === USER_ROLE.ADMIN;

  return <AdminLayout>{children}</AdminLayout>;
};

export default DashboardLayout;
