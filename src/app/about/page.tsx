import AboutWrapper from "@/components/about/AboutWrapper";
import FooterMenu from "@/components/footer/FooterMenu";
import HeaderMenu from "@/components/header/HeaderMenu";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
};

export default function Page() {
  return (
    <div className="">
      <HeaderMenu />

      <AboutWrapper />
      <FooterMenu />
    </div>
  );
}
