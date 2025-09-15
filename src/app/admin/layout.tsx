import AdminLayout from "@/components/admin/AdminLayout";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  return <AdminLayout>{children}</AdminLayout>;
};

export default DashboardLayout;
