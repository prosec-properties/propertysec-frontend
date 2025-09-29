import { DASHBOARD_LISTING_ROUTE, DASHBOARD_LOAN_ROUTE, DASHBOARD_MARKETPLACE_ROUTE, DASHBOARD_PROFILE_ROUTE, SUBSCRIPTION_ROUTE } from "@/constants/routes";
import ListingIcon from "../icons/Listing";
import LoanIcon from "../icons/Loan";
import MarketPlaceIcon from "../icons/MarketPlace";
import ProfileIcon from "../icons/Profile";
import { SubscriptIcon } from "lucide-react";

export const MainSideMenuData = [
  {
    title: "MarketPlace",
    icon: <MarketPlaceIcon />,
    href: DASHBOARD_MARKETPLACE_ROUTE,
  },
  {
    title: "Listing",
    icon: <ListingIcon/>,
    href: DASHBOARD_LISTING_ROUTE,
  },
  {
    title: "Loan",
    icon: <LoanIcon />,
    href: DASHBOARD_LOAN_ROUTE,
  },
  {
    title: "Subscription",
    icon: <SubscriptIcon />,
    href: SUBSCRIPTION_ROUTE,
  },
  {
    title: "Profile",
    icon: <ProfileIcon />,
    href: DASHBOARD_PROFILE_ROUTE,
  },
 
];
