"use client";

import Link from "next/link";
import React from "react";
import SearchInput from "../inputs/SearchInput";
import { MenuIcon } from "lucide-react";
import { headerMenu } from "./headerData";
import { SIGN_IN_ROUTE, UPLOAD_PROPERTY_ROUTE } from "@/constants/routes";
import MobileMenu from "./MobileMenu";
import Logo from "../misc/Logo";
import CustomButton from "../buttons/CustomButton";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";

const HeaderMenu = () => {
  const [openMenu, setOpenMenu] = React.useState(false);
  const mobileMenuRef = React.useRef<HTMLDivElement>(null);
  const { isLoggedIn } = useUser();
  const pathname = usePathname();

  const handleMenu = () => {
    setOpenMenu(!openMenu);
  };

  const closeMobileMenuOnOverlayClick = (event: React.MouseEvent) => {
    if (
      mobileMenuRef.current &&
      !mobileMenuRef.current.contains(event.target as Node)
    ) {
      setOpenMenu(false);
    }
  };

  const handlePostPropertyClick = () => {
    if (!isLoggedIn) {
      return SIGN_IN_ROUTE;
    } else {
      return UPLOAD_PROPERTY_ROUTE;
    }
  };

  return (
    <header className="bg-white text-base sticky top-0 shadow-md z-[999]">
      <div className="mx-auto flex h-16 max-w-screen-xl items-center gap-8 px-4 sm:px-6 lg:px-8">
        <Logo />

        <div className="flex flex-1 items-center justify-end md:justify-between">
          <nav aria-label="Global" className="hidden md:block">
            <ul className="flex items-center gap-6 text-sm">
              {headerMenu.map((menu, index) => (
                <li key={`${menu.name}${index}`}>
                  <Link
                    className={`transition hover:text-gray-500/75 text-base ${
                      pathname === menu.url
                        ? "text-primary font-semibold"
                        : "text-gray-700"
                    }`}
                    href={menu.url}
                    prefetch
                  >
                    {menu.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="hidden flex-grow-2 md:block invisible">
            <SearchInput />
          </div>

          <div className="flex items-center gap-4">
            <div className="sm:flex sm:gap-4">
              <CustomButton
                as="link"
                variant="primary"
                href={handlePostPropertyClick()}
              >
                Post Property
              </CustomButton>

              <CustomButton
                href={SIGN_IN_ROUTE}
                as="link"
                variant="tertiary"
                linkClassName="hidden rounded-md hover:bg-gray-100 px-5 py-2.5 font-semibold sm:block"
              >
                Login
              </CustomButton>
            </div>

            <button
              onClick={handleMenu}
              className="block rounded p-2.5 transition hover:text-gray-600/75 md:hidden"
              aria-expanded={openMenu}
              aria-label="Toggle menu"
            >
              <MenuIcon />
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay and Content */}
        {openMenu && (
          <div
            className="fixed inset-0 top-16 bg-black/30 z-[1000]"
            onClick={closeMobileMenuOnOverlayClick}
          >
            <div
              ref={mobileMenuRef}
              className={`fixed left-0 h-screen w-80 bg-white transform ${
                openMenu ? "translate-x-0" : "-translate-x-full"
              } transition-transform duration-300 ease-in-out shadow-lg`}
            >
              <nav
                aria-label="Global"
                className="pt-8 border-t border-r h-full px-8"
              >
                <MobileMenu />
              </nav>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default HeaderMenu;
