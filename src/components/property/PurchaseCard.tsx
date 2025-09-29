"use client";

import React, { useRef } from "react";
import Image from "next/image";
import BathIcon from "../icons/Bath";
import BedIcon from "../icons/Bed";
import ToiletIcon from "../icons/Toilet";
import Link from "next/link";
import { PROPERTIES_ROUTE } from "@/constants/routes";
import { IProperty } from "@/interface/property";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/payment";
import { useUser } from "@/hooks/useUser";
import CustomButton from "../buttons/CustomButton";
import ReceiptDownloader, { ReceiptDownloaderRef } from "./ReceiptDownloader";

interface Purchase {
  id: string;
  purchaseAmount: number;
  currency: string;
  purchaseStatus: "PENDING" | "COMPLETED" | "CANCELLED" | "REFUNDED";
  transactionReference: string;
  buyerName: string;
  buyerEmail: string;
  buyerPhone: string;
  createdAt: string;
  updatedAt: string;
  property: IProperty & {
    user: {
      id: string;
      fullName: string;
      email: string;
      phoneNumber: string;
    };
  };
}

interface Props {
  purchase: Purchase;
}

const PurchaseCard = ({ purchase }: Props) => {
  const { user } = useUser();
  const receiptDownloaderRef = useRef<ReceiptDownloaderRef>(null);

  

  const handleDownloadReceipt = () => {
    console.log("receiptDownloaderRef.current", receiptDownloaderRef.current);
    receiptDownloaderRef.current?.downloadReceipt(
      purchase.transactionReference
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
      case "CANCELLED":
        return "bg-red-500";
      case "REFUNDED":
        return "bg-blue-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="block rounded-[0.675rem] p-4 shadow-sm shadow-indigo-100 bg-white relative">
      <div className="absolute top-2 right-2">
        <span
          className={cn(
            "text-white text-xs px-2 py-1 rounded-full font-medium",
            getStatusColor(purchase.purchaseStatus)
          )}
        >
          {purchase.purchaseStatus}
        </span>
      </div>

      <Link href={`${PROPERTIES_ROUTE}/${purchase.property.id}`}>
        <Image
          alt="property image"
          width={400}
          height={224}
          src={purchase.property?.files?.[0]?.fileUrl || ""}
          className="h-56 w-full rounded-[0.675rem] object-cover mb-6"
        />
      </Link>

      <div className="">
        <dl>
          <div className="mb-2 text-grey9">
            <dt className="sr-only">Property description</dt>
            <dd className="font-medium">{purchase.property.title}</dd>
          </div>

          <div>
            <dt className="sr-only">Property address</dt>
            <dd className="font-normal text-sm text-gray-500">
              {purchase.property.state?.name || purchase.property?.address}
            </dd>
          </div>

          <div className="mt-2">
            <dt className="sr-only">Purchase amount</dt>
            <dd className="text-sm font-semibold text-primary">
              {formatPrice(purchase.purchaseAmount, purchase.currency)}
            </dd>
          </div>

          <div className="mt-1">
            <dt className="sr-only">Purchase date</dt>
            <dd className="text-xs text-gray-500">
              Purchased on {new Date(purchase.createdAt).toLocaleDateString()}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center gap-6 text-xs text-greyBody">
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <BedIcon />
            <p>{purchase.property.bathrooms} baths</p>
          </div>
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <ToiletIcon />
            <p>{purchase.property.toilets} Toilets</p>
          </div>
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <BathIcon />
            <p>{purchase.property.bedrooms} Beds</p>
          </div>
        </div>

        <div className="mt-4">
          <CustomButton
            variant="outline"
            onClick={handleDownloadReceipt}
            className="w-full"
          >
            Download Receipt
          </CustomButton>
        </div>
      </div>

      <ReceiptDownloader
        ref={receiptDownloaderRef}
        property={purchase.property}
        purchases={[purchase]}
      />
    </div>
  );
};

export default PurchaseCard;
