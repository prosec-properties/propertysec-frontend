import {
  ADMIN_PROPERTIES_ROUTE,
  ADMIN_USERS_ROUTE,
  ADMIN_LOANS_ROUTE,
  ADMIN_SUBSCRIPTION_ROUTE,
  SIGN_OUT_ROUTE,
  ADMIN_INSPECTIONS_ROUTE,
} from "@/constants/routes";
import {
  HomeIcon,
  UsersIcon,
  LogOutIcon,
  ClipboardCheckIcon,
} from "lucide-react";
import SubscriptionIcon from "../icons/Subscription";
import LoanIcon from "../icons/Loan";

export interface IAdminMenu {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string; strokeColor?: string }>;
  adminOnly?: boolean;
  iconType?: "lucid" | "custom";
}

export const AdminMenuData: IAdminMenu[] = [
  // {
  //   name: "Products",
  //   url: ADMIN_PRODUCTS_ROUTE,
  //   icon: MarketPlaceIcon,
  //   adminOnly: true,
  //   iconType: "custom",
  // },
  {
    name: "Properties",
    url: ADMIN_PROPERTIES_ROUTE,
    icon: HomeIcon,
    adminOnly: true,
    iconType: "lucid",
  },
  {
    name: "Inspections",
    url: ADMIN_INSPECTIONS_ROUTE,
    icon: ClipboardCheckIcon,
    adminOnly: true,
    iconType: "lucid",
  },
  {
    name: "Users",
    url: ADMIN_USERS_ROUTE,
    icon: UsersIcon,
    adminOnly: true,
    iconType: "lucid",
  },
  {
    name: "Loans",
    url: ADMIN_LOANS_ROUTE,
    icon: LoanIcon,
    adminOnly: true,
    iconType: "custom",
  },
  // {
  //   name: "Front Page",
  //   url: ADMIN_FRONT_PAGE_ROUTE,
  //   icon: NewspaperIcon,
  //   adminOnly: true,
  //   iconType: "lucid",
  // },
  {
    name: "Subscription",
    url: ADMIN_SUBSCRIPTION_ROUTE,
    icon: SubscriptionIcon,
    adminOnly: true,
    iconType: "custom",
  },
  {
    name: "Logout",
    url: SIGN_OUT_ROUTE,
    icon: LogOutIcon,
    adminOnly: true,
    iconType: "lucid",
  },
];
