"use client";

import React, { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import { USER_ROLE } from "@/constants/user";
import { IProperty } from "@/interface/property";
import { IUserRole } from "@/interface/user";
import { formatPrice } from "@/lib/payment";
import { fetchPropertyPurchases } from "@/services/admin.service";
import BathIcon from "../icons/Bath";
import BedIcon from "../icons/Bed";
import ToiletIcon from "../icons/Toilet";
import PropertyFeature from "./PropertyFeature";
import BuyerButtons from "./BuyerButtons";
import SellerButtons from "./SellerButtons";
import AdminButtons from "./AdminButtons";
import AffiliateButtons from "./AffiliateButtons";
import PreviewButtons from "./PreviewButtons";
import GuestButtons from "./GuestButtons";
import CustomButton from "../buttons/CustomButton";
import ReceiptDownloader, { ReceiptDownloaderRef } from "./ReceiptDownloader";
import { getInitials } from "@/lib/user";

interface Props {
  property: IProperty;
  role?: IUserRole;
  isInAffiliateShop?: boolean;
}

// Constants
const SELLER_ROLES = [
  USER_ROLE.LANDLORD,
  USER_ROLE.DEVELOPER,
  USER_ROLE.LAWYER,
];


// Helper functions
const getPricePeriod = (categoryName?: string) =>
  categoryName?.toLowerCase() === "shortlet" ? "day" : "year";

const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case "COMPLETED":
      return "bg-green-100 text-green-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-red-100 text-red-800";
  }
};

const PropertyHeader: React.FC<{ property: IProperty }> = ({ property }) => (
  <dl>
    <div className="mb-2 text-grey9">
      <dt className="sr-only">Property name</dt>
      <dd className="font-medium">{property.title}</dd>
    </div>

    <div className="mb-4">
      <dt className="sr-only">Property address</dt>
      <dd className="font-normal text-sm text-gray-500">
        {property?.state?.name || property.address}
      </dd>
    </div>

    <div>
      <dt className="sr-only">Price</dt>
      <dd className="text-sm text-grey10 font-medium">
        {formatPrice(property.price)}/{getPricePeriod(property.category?.name)}
      </dd>
    </div>

    <div className="mb-4">
      <dt className="sr-only">Property details</dt>
      <dd className="text-sm text-gray-500">
        Type: {property.type} | Category: {property.category?.name} |
        Availability: {property.availability}
      </dd>
    </div>
  </dl>
);

const PropertyFeatures: React.FC<{ property: IProperty }> = ({ property }) => (
  <div className="mt-6 mb-10 flex items-center gap-6 text-xs text-greyBody">
    <PropertyFeature icon={<BedIcon />} value={`${property.bedrooms} Beds`} />
    <PropertyFeature
      icon={<ToiletIcon />}
      value={`${property.toilets} Toilets`}
    />
    <PropertyFeature
      icon={<BathIcon />}
      value={`${property.bathrooms} Baths`}
    />
  </div>
);

const SellerInfo: React.FC<{ property: IProperty }> = ({ property }) => (
  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
    <h3 className="text-sm font-medium text-gray-900 mb-2">
      Seller Information
    </h3>
    <div className="flex items-center space-x-3">
      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
        {getInitials(property.user.fullName)}
      </div>
      <p className="text-sm text-gray-600 font-medium">
        {property.user.fullName}
      </p>
    </div>
  </div>
);

const PurchaseInfo: React.FC<{
  purchase: any;
  onDownloadReceipt: (reference: string) => void;
  isOwner: boolean;
}> = ({ purchase, onDownloadReceipt, isOwner }) => (
  <div className="mb-4 last:mb-0 p-3 bg-white rounded border">
    <div className="space-y-2 text-sm text-gray-600">
      <p>
        <span className="font-medium">Buyer Name:</span> {purchase.buyerName}
      </p>
      <p>
        <span className="font-medium">Buyer Email:</span> {purchase.buyerEmail}
      </p>
      {purchase.buyerPhone && (
        <p>
          <span className="font-medium">Buyer Phone:</span>{" "}
          {purchase.buyerPhone}
        </p>
      )}
      <p>
        <span className="font-medium">Purchase Amount:</span>{" "}
        {formatPrice(purchase.purchaseAmount)} {purchase.currency}
      </p>
      <p>
        <span className="font-medium">Purchase Date:</span>{" "}
        {new Date(purchase.createdAt).toLocaleDateString()}
      </p>
      <p>
        <span className="font-medium">Status:</span>
        <span
          className={`ml-1 px-2 py-1 text-xs rounded ${getStatusBadgeClass(
            purchase.purchaseStatus
          )}`}
        >
          {purchase.purchaseStatus}
        </span>
      </p>
    </div>
    {purchase.purchaseStatus === "COMPLETED" && (
      <div className="mt-3">
        <CustomButton
          variant="outline"
          onClick={() => onDownloadReceipt(purchase.transactionReference)}
          className="text-xs"
        >
          Download Receipt
        </CustomButton>
      </div>
    )}
  </div>
);

const PropertyDetails: React.FC<Props> = ({
  property,
  isInAffiliateShop,
  role,
}) => {
  const receiptDownloaderRef = useRef<ReceiptDownloaderRef>(null);
  const { user, token } = useUser();
  console.log('property details file loaded', property);


  // Derived state
  const canViewPurchases =
    user?.id === property.userId ||
    user?.role === "admin" ||
    user?.role === "affiliate";

  const shouldShowBuyerButtons =
    user?.role === USER_ROLE.BUYER ||
    (user?.role &&
      SELLER_ROLES.includes(user.role as any) &&
      user.id !== property.userId);

  const { data: purchasesData, isLoading: loadingPurchases } = useQuery({
    queryKey: ["property-purchases", property.id],
    queryFn: () => fetchPropertyPurchases(token || "", property.id),
    enabled: !!token && canViewPurchases && property.availability === "sold",
  });

  console.log('purchasesData', purchasesData);

  const purchases = purchasesData?.data?.purchases || [];

  const handleDownloadReceipt = (transactionReference: string) => {
    receiptDownloaderRef.current?.downloadReceipt(transactionReference);
  };

  const getRoleButtons = () => {
    const baseProps = { user, token, property };

    const buttonConfig = {
      [USER_ROLE.LANDLORD]: shouldShowBuyerButtons ? (
        <BuyerButtons {...baseProps} />
      ) : (
        <SellerButtons {...baseProps} />
      ),
      [USER_ROLE.DEVELOPER]: shouldShowBuyerButtons ? (
        <BuyerButtons {...baseProps} />
      ) : (
        <SellerButtons {...baseProps} />
      ),
      [USER_ROLE.LAWYER]: shouldShowBuyerButtons ? (
        <BuyerButtons {...baseProps} />
      ) : (
        <SellerButtons {...baseProps} />
      ),
      [USER_ROLE.BUYER]: <BuyerButtons {...baseProps} />,
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

    return buttonConfig[user?.role as IUserRole] || buttonConfig.default;
  };

  // Guest view
  if (!user) {
    return (
      <div>
        <PropertyHeader property={property} />
        <PropertyFeatures property={property} />
        <div className="mb-6">
          <p>{property.description}</p>
        </div>
        <GuestButtons property={property} />
      </div>
    );
  }

  return (
    <div>
      <PropertyHeader property={property} />
      <PropertyFeatures property={property} />

      {/* Property Description */}
      {user.role !== USER_ROLE.BUYER && (
        <div className="mb-6">
          <p>{property.description}</p>
        </div>
      )}

      {/* Property Status */}
      {property.userId === user.id && (
        <div className="mb-6">
          <p className="text-sm text-greyBody">
            Property Status:{" "}
            <span className="font-bold">{property.status}</span>
          </p>
        </div>
      )}

      {/* Rejection Reason */}
      {property.userId === user.id &&
        property.status === "rejected" &&
        property.meta && (
          <div className="mb-6">
            <p className="text-sm text-greyBody">
              Reject Reason:{" "}
              <span className="font-bold">
                {JSON.parse(property.meta).rejectedReason}
              </span>
            </p>
          </div>
        )}

      {/* Seller Information */}
      {property.user && <SellerInfo property={property} />}

      {/* Purchase Information */}
      {property.availability === "sold" && purchases.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-3">
            {user.id === property.userId
              ? "Buyer Information"
              : "Purchase Information"}
          </h3>
          {purchases.map((purchase) => (
            <PurchaseInfo
              key={purchase.id}
              purchase={purchase}
              onDownloadReceipt={handleDownloadReceipt}
              isOwner={user.id === property.userId}
            />
          ))}
          {loadingPurchases && (
            <div className="text-center py-4">
              <p className="text-sm text-gray-500">
                Loading purchase information...
              </p>
            </div>
          )}
        </div>
      )}

      {/* Role-specific buttons */}
      {getRoleButtons()}

      {/* Receipt Downloader */}
      <ReceiptDownloader
        ref={receiptDownloaderRef}
        property={property}
        purchase={purchases?.[0]}
      />
    </div>
  );
};

export default PropertyDetails;
