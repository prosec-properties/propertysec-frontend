"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import PropertyImage from "./PropertyImage";
import PropertyDetails from "./PropertyDetails";
import Image from "next/image";
import { useUser } from "@/hooks/useUser";
import { USER_ROLE } from "@/constants/user";
import { IProperty } from "@/interface/property";
import { useRouter } from "next/navigation";
import { IUserRole } from "@/interface/user";

interface Props {
  property: IProperty;
  role?: IUserRole
  isInAffiliateShop?: boolean;
}

const PropertyWrapper = (props: Props) => {
  const { user } = useUser();
  const router = useRouter();

  const canViewFullPropertyDetails = () => {
    if (user?.role === USER_ROLE.ADMIN) return true;
  };
  return (
    <div className="bg-white p-6 rounded-[0.625rem] border-[0.6px] border-grey100">
      <div className="border-b-[0.6px] border-b-grey100 mb-6 pb-4">
        <div
          role="button"
          className="flex cursor-pointer items-center gap-2 max-w-max"
          onClick={() => router.back()}
        >
          <ChevronLeft />
          <h2 className="text-sm font-medium text-grey9 capitalize">
            {props.property?.title}
          </h2>
        </div>
      </div>

      <div className="md:grid md:grid-cols-2 gap-6">
        <div className="mb-6 md:mb-0">
          <PropertyImage property={props.property} />
        </div>

        <PropertyDetails {...props} />
      </div>
    </div>
  );
};

export default PropertyWrapper;

interface ChildProps {
  imageSrc: string;
}
const PropertyDetailsBeforeApproval = (props: ChildProps) => {
  return <Image src={props.imageSrc} alt="image" width={350} height={300} />;
};
