import InstagramIcon from "@/components/icons/Instagram";
import FacebookIcon from "@/components/icons/Facebook";
import TwitterIcon from "@/components/icons/Twitter";
import LinkedInIcon from "@/components/icons/LinkedIn";
import {
  ABOUT_ROUTE,
  CONTACT_ROUTE,
  DASHBOARD_TAKE_LOAN_ROUTE,
  PRIVACY_POLICY_ROUTE,
  PRODUCTS_ROUTE,
  PROPERTIES_ROUTE,
  TERMS_ROUTE,
} from "@/constants/routes";

type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const footerData = [
  {
    title: "Quicklinks",
    links: [
      {
        name: "Properties",
        url: PROPERTIES_ROUTE,
      },
      {
        name: "Loan to Rent",
        url: DASHBOARD_TAKE_LOAN_ROUTE,
      },
      // {
      //   name: "Other Products",
      //   url: PROPERTIES_ROUTE,
      // },
    ],
  },
  {
    title: "Company",
    links: [
      {
        name: "Privacy Policy",
        url: PRIVACY_POLICY_ROUTE,
      },
      {
        name: "Terms & Conditions",
        url: TERMS_ROUTE,
      },
      {
        name: "About Us",
        url: ABOUT_ROUTE,
      },
      {
        name: "Contact Us",
        url: CONTACT_ROUTE,
      },
    ],
  },
  {
    title: "Contact Us",
    links: [
      {
        name: "N0 47, Eastland Abuja, NIigeria.",
        url: "#",
      },
      {
        name: "Support@propertysec.com",
        url: "#",
      },
    ],
  },
];

export const socials: { name: string; icon: Icon }[] = [
  {
    name: "Instagram",
    icon: InstagramIcon,
  },
  {
    name: "Facebook",
    icon: FacebookIcon,
  },
  {
    name: "Twitter",
    icon: TwitterIcon,
  },
  {
    name: "LinkedIn",
    icon: LinkedInIcon,
  },
];
