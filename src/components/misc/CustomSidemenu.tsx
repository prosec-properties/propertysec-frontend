"use client";

import { PanelLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IUser } from "@/interface/user";
import { USER_ROLE } from "@/constants/user";
import { cn } from "@/lib/utils";
import { useSidebar } from "./SidebarContext";

type MenuItem = {
  name: string;
  url: string;
  icon: React.ComponentType<{ className?: string; strokeColor?: string }>;
  adminOnly?: boolean;
  iconType?: "custom" | "lucid";
};

type CustomSideMenuProps = {
  menuItems: MenuItem[];
  user?: IUser;
  variant?: "default" | "admin";
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
  children?: React.ReactNode;
};

export function SidebarTrigger({ children }: { children: React.ReactNode }) {
  const { setIsOpen, isOpen } = useSidebar();

  return (
    <button onClick={() => setIsOpen(!isOpen)} className="focus:outline-none">
      {children}
    </button>
  );
}

export function Sidebar({
  variant = "default",
  className,
  children,
}: {
  variant?: "default" | "admin";
  className?: string;
  children: React.ReactNode;
}) {
  const { isOpen, isMobile } = useSidebar();

  return (
    <aside
      className={cn(
        "bg-white shadow-lg transition-all duration-300 ease-in-out",
        isMobile
          ? isOpen
            ? "w-64 translate-x-0"
            : "-translate-x-full w-0"
          : isOpen
          ? "w-64"
          : "w-16",
        className
      )}
    >
      {children}
    </aside>
  );
}

export function SidebarContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const { isOpen } = useSidebar();
  return (
    <div className={`overflow-y-auto px-2 ${className}`}>
      <div
        className={
          isOpen ? "space-y-1" : "flex flex-col items-center space-y-1"
        }
      >
        {children}
      </div>
    </div>
  );
}

export function SidebarGroup({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();
  return (
    <div
      className={isOpen ? "space-y-1" : "flex flex-col items-center space-y-1"}
    >
      {children}
    </div>
  );
}

export function SidebarMenu({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();
  return (
    <nav
      className={
        isOpen
          ? "flex flex-col space-y-1"
          : "flex flex-col items-center space-y-1"
      }
    >
      {children}
    </nav>
  );
}

export function SidebarMenuItem({ children }: { children: React.ReactNode }) {
  const { isOpen } = useSidebar();
  return <div className={isOpen ? "w-full" : "w-10"}>{children}</div>;
}

export function SidebarMenuButton({
  children,
  isActive,
  className,
}: {
  children: React.ReactNode;
  isActive?: boolean;
  className?: string;
}) {
  const { isOpen } = useSidebar();
  const baseClasses =
    "flex items-center rounded-md px-3 py-2 text-sm font-medium transition-colors";
  const activeClasses = isActive
    ? "bg-primary text-white"
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900";

  return (
    <button
      className={`${baseClasses} ${activeClasses} ${className} ${
        isOpen ? "w-full" : "w-10 justify-center"
      } `}
    >
      {children}
    </button>
  );
}

export function SidebarFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`border-t p-4 ${className}`}>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

export function SidebarSeparator({ className }: { className?: string }) {
  return <div className={`my-2 border-t ${className}`} />;
}

const CustomSideMenu = ({
  menuItems,
  user,
  variant = "default",
  className,
}: CustomSideMenuProps) => {
  const pathname = usePathname();
  const isAdmin = user?.role === USER_ROLE.ADMIN;
  const { isOpen } = useSidebar();

  const filteredMenuItems = menuItems.filter(
    (item) => !item.adminOnly || (item.adminOnly && isAdmin)
  );

  return (
    <div
      className={cn(
        "flex items-start z-50 h-screen transition-all duration-300 ease-in-out",
        "absolute md:relative",
        className
      )}
    >
      <Sidebar variant={variant} className={className}>
        <SidebarContent className={`px-2 ${className}`}>
          <SidebarGroup>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <Link href={item.url} prefetch>
                    <SidebarMenuButton isActive={pathname === item.url}>
                      <div className="flex items-center">
                        {item.iconType === "custom" ? (
                          <item.icon
                            className={cn("h-4 w-4")}
                            strokeColor={
                              pathname === item.url ? "white" : "#464646"
                            }
                          />
                        ) : (
                          <item.icon
                            className={cn(
                              "h-4 w-4",
                              pathname === item.url
                                ? "text-white"
                                : "text-gray-600"
                            )}
                          />
                        )}
                        <span className={cn("ml-2", { hidden: !isOpen })}>
                          {item.name}
                        </span>
                      </div>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>

      <div className="mt-4 ml-2 md:ml-0">
        <SidebarTrigger>
          <div className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-gray-100">
            <PanelLeft className="h-4 w-4" />
            <span className="sr-only">Toggle Menu</span>
          </div>
        </SidebarTrigger>
      </div>
    </div>
  );
};

export default CustomSideMenu;
