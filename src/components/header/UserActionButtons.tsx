import Link from "next/link";
import { LogOut } from "lucide-react";
import { USER_ROLE } from "@/constants/user";
import { IUser } from "@/interface/user";
import {
  PROFILE_SETTING_ROUTE,
  SIGN_OUT_ROUTE,
  UPLOAD_PROPERTY_ROUTE,
} from "@/constants/routes";
import CustomButton from "../buttons/CustomButton";
import UserGearIcon from "../icons/UserGear";

interface UserActionButtonsProps {
  user: IUser;
  isMobile?: boolean;
}

const UserActionButtons = ({ user, isMobile }: UserActionButtonsProps) => (
  <div
    className={`flex items-center ${isMobile ? "flex-col space-y-4" : "gap-4"}`}
  >
    {user?.role === USER_ROLE.LANDLORD && (
      <div className={`${isMobile ? "w-full" : "sm:flex sm:gap-4"}`}>
        <CustomButton
          className="block w-full rounded-md bg-black px-5 py-2.5 font-semibold text-white transition"
          href={UPLOAD_PROPERTY_ROUTE}
          as="link"
          variant="primary"
        >
          Post Property
        </CustomButton>
      </div>
    )}

    <div
      className={`flex items-center ${
        isMobile ? "justify-center  gap-8 w-full" : "gap-4"
      }`}
    >
      <Link href={`${PROFILE_SETTING_ROUTE}/${user?.slug}`}>
        <UserGearIcon />
      </Link>

      <Link href={SIGN_OUT_ROUTE}>
        <LogOut />
      </Link>
    </div>
  </div>
);

export default UserActionButtons;
