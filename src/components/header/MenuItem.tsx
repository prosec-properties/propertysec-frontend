import Link from "next/link";

interface MenuItemProps {
  menu: {
    name: string;
    url: string;
    icon?: React.ComponentType<{ className?: string; "aria-hidden"?: boolean }>;
  };
  pathname: string;
}

const MenuItem = ({ menu, pathname }: MenuItemProps) => {
  const Icon = menu.icon;
  const isActive = pathname === menu.url;

  return (
    <li className="transition hover:text-gray-500/75 text-base">
      <Link
        className={`flex items-center gap-3 whitespace-nowrap ${
          isActive ? "text-primary" : ""
        }`}
        href={menu.url}
        prefetch
      >
        <span className="md:hidden">
          {Icon && (
            <Icon
              className={`h-5 w-5 ${isActive ? "stroke-primary" : ""}`}
              aria-hidden={true}
            />
          )}
        </span>
        <span>{menu.name}</span>
      </Link>
    </li>
  );
};

export default MenuItem;
