import {
  Home,
  Package,
  Building,
  Users,
  HandCoins,
  Newspaper,
  CreditCard,
} from "lucide-react";
import { USER_ROLE } from "@/constants/user";

export const useMenuItems = (userRole?: string) => {
  const regularMenuItems = [
    { name: "Dashboard", url: "/dashboard", icon: Home },
    { name: "Products", url: "/products", icon: Package },
    { name: "Properties", url: "/properties", icon: Building },
  ];

  const adminMenuItems = [
    // { name: "Products", url: "/admin/products", icon: Package },
    { name: "Properties", url: "/admin/properties", icon: Building },
    { name: "Users", url: "/admin/users", icon: Users },
    { name: "Loans", url: "/admin/loans", icon: HandCoins },
    // { name: "Front Page", url: "/admin/front-page", icon: Newspaper },
    { name: "Subscription", url: "/admin/subscription", icon: CreditCard },
  ];

  return userRole === USER_ROLE.ADMIN ? adminMenuItems : regularMenuItems;
};
