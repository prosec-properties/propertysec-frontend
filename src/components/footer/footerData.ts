import InstagramIcon from "@/components/icons/Instagram";
import FacebookIcon from "@/components/icons/Facebook";
import TwitterIcon from "@/components/icons/Twitter";
import LinkedInIcon from "@/components/icons/LinkedIn";

type Icon = React.ComponentType<React.SVGProps<SVGSVGElement>>;

export const footerData = [
  {
    title: "Quicklinks",
    links: [
      {
        name: "Properties",
        url: "#",
      },
      {
        name: "Loan to Rent",
        url: "#",
      },
      {
        name: "Other Products",
        url: "#",
      },
    ],
  },
  {
    title: "Company",
    links: [
      {
        name: "Privacy Policy",
        url: "#",
      },
      {
        name: "Terms &  Conditions",
        url: "#",
      },
      {
        name: "About Us",
        url: "#",
      },
      {
        name: "Contact  Us",
        url: "#",
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
