import React from "react";
import { MainSideMenuData } from "./MainSideMenuData";
import Link from "next/link";
import LogoutIcon from "../icons/Logout";

const MainSideMenu = () => {
  return (
    <div className="flex h-screen flex-col justify-between border-e  max-w-[250px] stick top-16">
      <div className="px-4 py-6">
        <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          Logo
        </span>

        <ul className="my-6 space-y-1">
          {MainSideMenuData.map((item, index) => (
            <li key={index} className="">
              <Link
                href="#"
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-greyBody"
              >
                <span>{item.icon}</span>
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>

        <hr className="mb-6" />

        <Link
          href="#"
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-700"
        >
          <span>
            <LogoutIcon />
          </span>
          <span>Logout</span>
        </Link>
      </div>
    </div>
  );
};

export default MainSideMenu;
