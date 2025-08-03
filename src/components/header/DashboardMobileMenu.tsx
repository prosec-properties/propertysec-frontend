import React from "react";
import { IUser } from "@/interface/user";
import UserActionButtons from "./UserActionButtons";

interface DashboardMobileMenuProps {
  isOpen: boolean;
  menuItems: React.ReactNode;
  user: IUser;
}

const DashboardMobileMenu = ({ isOpen, menuItems, user }: DashboardMobileMenuProps) => (
  <div
    className={`md:hidden ${
      isOpen ? "block" : "hidden"
    } absolute top-16 left-0 right-0 bg-white shadow-lg`}
  >
    <nav className="px-4 py-2">
      <ul className="flex flex-col space-y-4">{menuItems}</ul>
    </nav>
    <div className="px-4 py-4 border-t">
      <UserActionButtons user={user} isMobile={true} />
    </div>
  </div>
);

export default DashboardMobileMenu;
