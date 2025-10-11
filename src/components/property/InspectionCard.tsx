"use client";

import React, { useRef } from "react";
import Image from "next/image";
import BathIcon from "../icons/Bath";
import BedIcon from "../icons/Bed";
import ToiletIcon from "../icons/Toilet";
import Link from "next/link";
import { PROPERTIES_ROUTE } from "@/constants/routes";
import { IPropertyInspection } from "@/interface/property";
import { cn } from "@/lib/utils";
import CustomButton from "../buttons/CustomButton";
import InspectionReceiptDownloader, {
  InspectionReceiptDownloaderRef,
} from "../receipts/InspectionReceiptDownloader";
import { formatPrice } from "@/lib/payment";
import { formatDate } from "@/lib/date";

interface Props {
  inspection: IPropertyInspection;
}

const InspectionCard = ({ inspection }: Props) => {
  const receiptDownloaderRef = useRef<InspectionReceiptDownloaderRef>(null);

  const handleDownloadReceipt = async () => {
    if (receiptDownloaderRef.current) {
      await receiptDownloaderRef.current.downloadReceipt();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500";
      case "PENDING":
        return "bg-yellow-500";
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
            getStatusColor(inspection.inspectionStatus)
          )}
        >
          {inspection.inspectionStatus}
        </span>
      </div>

      <Link href={`${PROPERTIES_ROUTE}/${inspection.property.id}`} prefetch>
        <Image
          alt="property image"
          width={400}
          height={224}
          src={inspection.property?.files?.[0]?.fileUrl || ""}
          className="h-56 w-full rounded-[0.675rem] object-cover mb-6"
        />
      </Link>

      <div className="">
        <dl>
          <div className="mb-2 text-grey9">
            <dt className="sr-only">Property description</dt>
            <dd className="font-medium">{inspection.property.title}</dd>
          </div>

          <div>
            <dt className="sr-only">Property address</dt>
            <dd className="font-normal text-sm text-gray-500">
              {inspection.property.state?.name || inspection.property?.address}
            </dd>
          </div>

          <div className="mt-2">
            <dt className="sr-only">Inspection amount</dt>
            <dd className="text-sm font-semibold text-primary">
              {formatPrice(inspection.inspectionAmount)}
            </dd>
          </div>

          <div className="mt-1">
            <dt className="sr-only">Inspection date</dt>
            <dd className="text-xs text-gray-500">
              Inspected on {formatDate(inspection.createdAt)}
            </dd>
          </div>
        </dl>

        <div className="mt-6 flex items-center gap-6 text-xs text-greyBody">
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <BedIcon />
            <p>{inspection.property.bathrooms} baths</p>
          </div>
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <ToiletIcon />
            <p>{inspection.property.toilets} Toilets</p>
          </div>
          <div className="sm:inline-flex sm:shrink-0 sm:items-center sm:gap-2">
            <BathIcon />
            <p>{inspection.property.bedrooms} Beds</p>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          <CustomButton
            variant="outline"
            onClick={handleDownloadReceipt}
            className="w-full"
          >
            Download Receipt
          </CustomButton>
        </div>
      </div>
      <InspectionReceiptDownloader
        ref={receiptDownloaderRef}
        inspection={inspection}
      />
    </div>
  );
};

export default InspectionCard;
