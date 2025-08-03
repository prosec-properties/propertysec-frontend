"use client";

import { useUser } from "@/hooks/useUser";
import CustomSideMenu from "../misc/CustomSidemenu";
import { AdminMenuData } from "./adminData";
import { SidebarProvider } from "../misc/SidebarContext";

const AdminSideMenu = () => {
  const { user } = useUser();

  return (
    <SidebarProvider>
      <CustomSideMenu
        menuItems={AdminMenuData}
        user={user}
        variant="admin"
        className="h-[calc(100vh-4rem)] overflow-y-auto sticky top-2"
      />
    </SidebarProvider>
  );
};

export default AdminSideMenu;
