import ContactWrapper from "@/components/contact/ContactWrapper";
import FooterMenu from "@/components/footer/FooterMenu";
import HeaderMenu from "@/components/header/HeaderMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
};

export default function Page() {
  return (
    <div>
      <HeaderMenu />
      <div className="min-h-screen">
        <ContactWrapper />
      </div>
      <FooterMenu />
    </div>
  );
}
