import TermsAndConditionsWrapper from "@/components/terms/TermsAndConditionsWrapper";
import FooterMenu from "@/components/footer/FooterMenu";
import HeaderMenu from "@/components/header/HeaderMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions",
};

export default function Page() {
  return (
    <div>
      <HeaderMenu />
      <TermsAndConditionsWrapper />
      <FooterMenu />
    </div>
  );
}
