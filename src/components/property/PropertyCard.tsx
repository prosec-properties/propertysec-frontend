"use client";

import React from "react";
import Image from "next/image";
import BathIcon from "../icons/Bath";
import BedIcon from "../icons/Bed";
import ToiletIcon from "../icons/Toilet";
import Link from "next/link";
import { PROPERTIES_ROUTE } from "@/constants/routes";
import { IProperty } from "@/interface/property";
import { cn } from "@/lib/utils";
import { useUser } from "@/hooks/useUser";
import { formatPrice } from "@/lib/payment";

interface Props {
  property: IProperty;
}
const PropertyCard = (props: Props) => {
  const { user } = useUser();
  return (
    <Link
      href={`${PROPERTIES_ROUTE}/${props.property.id}`}
      className="block rounded-[0.675rem] p-4 shadow-sm shadow-indigo-100 bg-white relative"
    >
      {props.property.availability === "sold" && (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-medium">
          SOLD
        </div>
      )}
      {props.property.user?.subscriptionStatus === "active" && (
        <div className="absolute top-2 left-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white text-xs px-2 py-1 rounded-full font-medium">
          PREMIUM
        </div>
      )}
      {props.property.defaultImageUrl && (
        <Image
          alt="property image"
          width={400}
          height={224}
          src={props.property.defaultImageUrl}
          className="h-56 w-full rounded-[0.675rem] object-cover mb-6"
        />
      )}

      <div className="">
        <dl>
          <div className="mb-2 text-grey9">
            <dt className="sr-only">Property description</dt>

            <dd className="font-medium">{props.property.title}</dd>
          </div>

          <div>
            <dt className="sr-only">Property address</dt>

            <dd className="font-normal text-sm text-gray-500">
              {props.property.state?.name || props.property?.address}
            </dd>
          </div>

          <div>
            <dt className="sr-only">Price</dt>

            <dd className="text-sm ">
              {formatPrice(props.property.price, props.property.currency)}/
              {props.property.category?.name?.toLowerCase() === "shortlet"
                ? "day"
                : "year"}
            </dd>
          </div>
        </dl>

        <div
          className={cn(
            {
              "mb-6": user?.role === "affiliate",
            },
            "mt-6 flex items-center gap-6 text-xs text-greyBody"
          )}
        >
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <BedIcon />

            <p className="">{props.property.bathrooms} baths</p>
          </div>
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <ToiletIcon />

            <p className="">{props.property.toilets} Toilets</p>
          </div>
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <BathIcon />

            <p className="">{props.property.bedrooms} Beds</p>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
