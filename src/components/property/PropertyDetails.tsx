"use client";

import React, { useRef, useState } from "react";
import BathIcon from "../icons/Bath";
import BedIcon from "../icons/Bed";
import ToiletIcon from "../icons/Toilet";
import { USER_ROLE } from "@/constants/user";
import { useUser } from "@/hooks/useUser";
import { IProperty } from "@/interface/property";
import PropertyFeature from "./PropertyFeature";
import { IUserRole } from "@/interface/user";
import BuyerButtons from "./BuyerButtons";
import SellerButtons from "./SellerButtons";
import AdminButtons from "./AdminButtons";
import AffiliateButtons from "./AffiliateButtons";
import PreviewButtons from "./PreviewButtons";
import GuestButtons from "./GuestButtons";
import { formatPrice } from "@/lib/payment";

interface Props {
  property: IProperty;
  role?: IUserRole;
  isInAffiliateShop?: boolean;
}

const PropertyDetails: React.FC<Props> = ({
  property,
  isInAffiliateShop,
  role,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef<HTMLDivElement | null>(null);
  const { user, token } = useUser();

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    ref.current?.children[index]?.scrollIntoView({ behavior: "smooth" });
  };

  // Determine if user should see buyer buttons (buyers or sellers viewing other properties)
  const sellerRoles = [
    USER_ROLE.LANDLORD,
    USER_ROLE.DEVELOPER,
    USER_ROLE.LAWYER,
  ];
  const shouldShowBuyerButtons =
    user?.role === USER_ROLE.BUYER ||
    (user?.role &&
      sellerRoles.includes(user.role as any) &&
      user.id !== property.userId);

  // If user is not logged in, show guest buttons
  if (!user) {
    return (
      <div>
        <dl>
          <div className="mb-2 text-grey9">
            <dt className="sr-only">Property name</dt>
            <dd className="font-medium">{property?.title}</dd>
          </div>

          <div className="mb-4">
            <dt className="sr-only">Property address</dt>
            <dd className="font-normal text-sm text-gray-500">
              {property?.address}
            </dd>
          </div>

          <div>
            <dt className="sr-only">Price</dt>
            <dd className="text-sm text-grey10 font-medium">
              {formatPrice(property?.price)}/{property?.purpose === 'shortlet' ? 'day' : 'year'}
            </dd>
          </div>
        </dl>

        <div className="mt-6 mb-10 flex items-center gap-6 text-xs text-greyBody">
          <PropertyFeature
            icon={<BedIcon />}
            value={`${property?.bedrooms} Beds`}
          />
          <PropertyFeature
            icon={<ToiletIcon />}
            value={`${property?.toilets} Toilets`}
          />
          <PropertyFeature
            icon={<BathIcon />}
            value={`${property?.bathrooms} Baths`}
          />
        </div>

        <div className="mb-6">
          <p>{property?.description}</p>
        </div>

        <GuestButtons property={property} />
      </div>
    );
  }

  const roleButtons = {
    [USER_ROLE.LANDLORD]: shouldShowBuyerButtons ? (
      <BuyerButtons user={user} property={property} />
    ) : (
      <SellerButtons user={user} token={token} property={property} />
    ),
    [USER_ROLE.DEVELOPER]: shouldShowBuyerButtons ? (
      <BuyerButtons user={user} property={property} />
    ) : (
      <SellerButtons user={user} token={token} property={property} />
    ),
    [USER_ROLE.LAWYER]: shouldShowBuyerButtons ? (
      <BuyerButtons user={user} property={property} />
    ) : (
      <SellerButtons user={user} token={token} property={property} />
    ),
    [USER_ROLE.BUYER]: <BuyerButtons user={user} property={property} />,
    [USER_ROLE.AFFILIATE]: (
      <AffiliateButtons
        propertyId={property.id}
        user={user}
        isInAffiliateShop={isInAffiliateShop}
      />
    ),
    [USER_ROLE.ADMIN]: <AdminButtons property={property} />,
    default: <PreviewButtons />,
  };

  return (
    <div>
      <dl>
        <div className="mb-2 text-grey9">
          <dt className="sr-only">Property name</dt>
          <dd className="font-medium">{property?.title}</dd>
        </div>

        <div className="mb-4">
          <dt className="sr-only">Property address</dt>
          <dd className="font-normal text-sm text-gray-500">
            {property?.address}
          </dd>
        </div>

        <div>
          <dt className="sr-only">Price</dt>
          <dd className="text-sm text-grey10 font-medium">
            {formatPrice(property?.price)}/{property?.purpose === 'shortlet' ? 'day' : 'year'}
          </dd>
        </div>

        <div className="mb-4">
          <dt className="sr-only">Property details</dt>
          <dd className="text-sm text-gray-500">
            Type: {property?.type} | Purpose: {property?.purpose} | Category: {property.category?.name} | Availability: {property?.availability}
          </dd>
        </div>
      </dl>

      <div className="mt-6 mb-10 flex items-center gap-6 text-xs text-greyBody">
        <PropertyFeature
          icon={<BedIcon />}
          value={`${property?.bedrooms} Beds`}
        />
        <PropertyFeature
          icon={<ToiletIcon />}
          value={`${property?.toilets} Toilets`}
        />
        <PropertyFeature
          icon={<BathIcon />}
          value={`${property?.bathrooms} Baths`}
        />
      </div>

      {user?.role !== USER_ROLE.BUYER && (
        <div className="mb-6">
          <p>{property?.description}</p>
        </div>
      )}

      {property?.userId === user?.id && (
        <div className="mb-6">
          <p className="text-sm text-greyBody">
            Property Status:{" "}
            <span className="font-bold">{property?.status}</span>
          </p>
        </div>
      )}

      {property?.userId === user?.id &&
        property.status === "rejected" &&
        property?.meta && (
          <div className="mb-6">
            <p className="text-sm text-greyBody">
              Reject Reason:{" "}
              <span className="font-bold">
                {JSON.parse(property?.meta).rejectedReason}
              </span>
            </p>
          </div>
        )}
      {roleButtons[user?.role as IUserRole]}
    </div>
  );
};

export default PropertyDetails;
