"use client";

import React, { useState } from "react";
import { getFilteredDashboardMenuItems } from "./headerData";
import Logo from "../misc/Logo";
import { Menu, X } from "lucide-react";
import { USER_ROLE } from "@/constants/user";
import { useUser } from "@/hooks/useUser";
import { usePathname } from "next/navigation";
import { IUser } from "@/interface/user";
import { cn } from "@/lib/utils";
import MenuItem from "./MenuItem";
import DashboardMobileMenu from "./DashboardMobileMenu";
import UserActionButtons from "./UserActionButtons";
import SearchInput from "../inputs/SearchInput";

const DashboardHeader = ({ className }: { className?: string }) => {
  const { user } = useUser();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = React.useRef<HTMLDivElement>(null);

  const isAdmin = user?.role === USER_ROLE.ADMIN;

  const getCurrentSection = () => {
    const filteredMenuData = getFilteredDashboardMenuItems(user?.role);
    const currentRoute = filteredMenuData.find((item) => item.url === pathname);

    return currentRoute?.name || "Dashboard";
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  React.useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      console.log("Searching for:", searchQuery);
    }
  };

  const filteredMenuItems = getFilteredDashboardMenuItems(user?.role);
  const menuItems = filteredMenuItems.map((menu, index) => (
    <MenuItem key={`${menu.name}${index}`} menu={menu} pathname={pathname} />
  ));

  return (
    <header
      className={cn(
        "bg-white text-base z-10 sticky top-0 shadow-md",
        className
      )}
    >
      <div className="mx-auto flex h-16 max-w-screen-xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Left side - Logo */}
        <div className="flex items-center gap-4">
          <Logo />
          {/* Show section title on mobile for non-admin users */}
          {!isAdmin && (
            <div className="md:hidden flex items-center">
              <span className="h-6 w-px bg-gray-200 mx-3" aria-hidden="true" />
              <h1 className="text-lg font-semibold text-gray-900">
                {getCurrentSection()}
              </h1>
            </div>
          )}
        </div>

        {/* Middle section - Search for admin, menu for others */}
        <div className="flex flex-1 items-center justify-end md:justify-between ">
          {isAdmin ? (
            <div className="hidden md:flex flex-1 justify-center px-4 invisible">
              <SearchInput
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearch}
                wrapperClass="w-full max-w-md"
                inputClass="border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          ) : (
            <>
              <nav aria-label="Global" className="hidden md:block">
                <ul className="flex items-center gap-4 text-sm">{menuItems}</ul>
              </nav>
            </>
          )}

          {/* Mobile menu toggle (hidden for admin) */}
          {!isAdmin && (
            <div className="md:hidden" ref={menuRef}>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-gray-600 hover:text-gray-700"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>

              <DashboardMobileMenu
                isOpen={isMenuOpen}
                menuItems={menuItems}
                user={user as IUser}
              />
            </div>
          )}

          {/* Right side - User actions (always visible) */}
          <div className="hidden md:block">
            <UserActionButtons user={user as IUser} />
          </div>
        </div>
      </div>

      {/* Mobile search input for admin (shown only on mobile) */}
      {isAdmin && (
        <div className="md:hidden px-4 py-2 border-t invisible">
          <SearchInput
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleSearch}
            inputClass="border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary"
          />
        </div>
      )}
    </header>
  );
};

export default DashboardHeader;
