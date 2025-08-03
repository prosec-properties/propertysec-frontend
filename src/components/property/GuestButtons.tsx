"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { IProperty } from "@/interface/property";
import CustomButton from "../buttons/CustomButton";
import ActionButton from "../buttons/ActionButton";
import { SIGN_IN_ROUTE } from "@/constants/routes";

interface GuestButtonsProps {
  property: IProperty;
}

const GuestButtons: React.FC<GuestButtonsProps> = ({ property }) => {
  const router = useRouter();

  const handleRedirectToLogin = () => {
    router.push(SIGN_IN_ROUTE);
  };

  return (
    <div>
      {/* Property Purchase Button */}
      <CustomButton
        className="w-full mb-4"
        onClick={handleRedirectToLogin}
      >
        Buy Property
      </CustomButton>

      {/* Book Inspection Button */}
      <CustomButton
        className="w-full mb-4"
        variant="secondary"
        onClick={handleRedirectToLogin}
      >
        Book Inspection
      </CustomButton>

      <div className="md:flex gap-6 mb-4">
        <ActionButton
          text="Call Seller"
          variant="secondary"
          onClick={handleRedirectToLogin}
        />
        <ActionButton
          text="WhatsApp Seller"
          variant="secondary"
          onClick={handleRedirectToLogin}
        />
      </div>
    </div>
  );
};

export default GuestButtons;
