import {
  ABOUT_ROUTE,
  CONTACT_ROUTE,
  DASHBOARD_AFFILIATE_ROUTE,
  DASHBOARD_LOAN_ROUTE,
  DASHBOARD_TAKE_LOAN_ROUTE,
  HOME_ROUTE,
  MY_LISTING_ROUTE,
  PROPERTIES_ROUTE,
  SUBSCRIPRION_ROUTE,
} from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import {
  HomeIcon,
  InformationCircleIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import MarketPlaceIcon from "../icons/MarketPlace";
import ListingIcon from "../icons/Listing";
import SubscriptionIcon from "../icons/Subscription";
import LoanIcon from "../icons/Loan";
import { DollarSign } from "lucide-react";
import { IUserRole } from "@/interface/user";

export interface MenuItemData {
  name: string;
  url: string;
  icon: React.ComponentType<any>;
  allowedRoles?: string[];
}

export const headerMenu = [
  {
    name: "Home",
    url: HOME_ROUTE,
    icon: HomeIcon,
  },
  {
    name: "About",
    url: ABOUT_ROUTE,
    icon: InformationCircleIcon,
  },
  {
    name: "Contact",
    url: CONTACT_ROUTE,
    icon: EnvelopeIcon,
  },
];

export const DashboardHeaderData: MenuItemData[] = [
  {
    name: "MarketPlace",
    url: PROPERTIES_ROUTE,
    icon: MarketPlaceIcon,
  },
  {
    name: "My Listing",
    url: MY_LISTING_ROUTE,
    icon: ListingIcon,
    allowedRoles: [USER_ROLE.LANDLORD, USER_ROLE.DEVELOPER, USER_ROLE.LAWYER],
  },
  {
    name: "My Shop",
    url: MY_LISTING_ROUTE,
    icon: ListingIcon,
    allowedRoles: [USER_ROLE.AFFILIATE],
  },
  {
    name: "My Dashboard",
    url: DASHBOARD_AFFILIATE_ROUTE,
    icon: DollarSign,
    allowedRoles: [USER_ROLE.AFFILIATE],
  },
  {
    name: "Subscription",
    url: SUBSCRIPRION_ROUTE,
    icon: SubscriptionIcon,
    allowedRoles: [USER_ROLE.LANDLORD, USER_ROLE.DEVELOPER, USER_ROLE.LAWYER],
  },
  {
    name: "My Loans",
    url: DASHBOARD_LOAN_ROUTE,
    icon: LoanIcon,
  },
  {
    name: "Loan to Rent",
    url: DASHBOARD_TAKE_LOAN_ROUTE,
    icon: LoanIcon,
  },
];

export const getFilteredDashboardMenuItems = (userRole?: IUserRole) => {
  return DashboardHeaderData.filter((item) => {
    // If no allowedRoles specified, show to all users
    if (!item.allowedRoles) {
      return true;
    }
    return userRole && item.allowedRoles.includes(userRole);
  });
};
