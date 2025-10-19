import PrivacyPolicyWrapper from "@/components/privacy/PrivacyPolicyWrapper";
import FooterMenu from "@/components/footer/FooterMenu";
import HeaderMenu from "@/components/header/HeaderMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
};

export default function Page() {
  return (
    <div>
      <HeaderMenu />
      <PrivacyPolicyWrapper />
      <FooterMenu />
    </div>
  );
}
