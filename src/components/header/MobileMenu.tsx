import React, { forwardRef } from "react";
import { headerMenu } from "./headerData";
import Link from "next/link";
import { SIGN_IN_ROUTE } from "@/constants/routes";
import { User } from "lucide-react";

const MobileMenu = () => {
  return (
    <ul className="flex flex-col gap-6 text-sm text-black">
      {headerMenu.map((menu, index) => (
        <li key={`${menu.name}${index}`}>
          <Link
            href={menu.url}
            className="flex items-center gap-3 transition hover:text-gray-500/75 text-base"
          >
            {<menu.icon className="w-5 h-5" />}
            <span>{menu.name}</span>
          </Link>
        </li>
      ))}
      <li>
        <Link
          href={SIGN_IN_ROUTE}
          className="flex items-center gap-3 rounded-md py-2.5 font-semibold sm:block"
        >
          <User className="w-5 h-5" />
          <span>Login</span>
        </Link>
      </li>
    </ul>
  );
};

export default MobileMenu;
