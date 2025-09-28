"use client";

import React, { useRef, useState, useCallback } from "react";
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
import { fetchPropertyPurchases } from "@/services/admin.service";
import CustomButton from "../buttons/CustomButton";
import { showToaster } from "@/lib/general";
import { generateInvoicePdfName, downloadPdf } from "@/lib/files";
import { useQuery } from "@tanstack/react-query";
import { usePDF } from "react-to-pdf";

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
  const [receiptData, setReceiptData] = useState<any>(null);
  const receiptRef = useRef<HTMLDivElement>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const { user, token } = useUser();

  const { toPDF, targetRef } = usePDF({
    filename: `property-receipt-${receiptData?.transactionReference || 'unknown'}.pdf`
  });

  const canViewPurchases =
    user?.id === property.userId ||
    user?.role === "admin" || 
    user?.role === "affiliate"; // Affiliate

  const { data: purchasesData, isLoading: loadingPurchases } = useQuery({
    queryKey: ["property-purchases", property.id],
    queryFn: () => fetchPropertyPurchases(token || "", property.id),
    enabled: !!token && canViewPurchases && property.availability === "sold",
  });

  const purchases = purchasesData?.data?.purchases || [];

  const handleDownloadReceipt = async (transactionReference: string) => {
    try {
      // Find the purchase data for this transaction
      const purchase = purchases.find(p => p.transactionReference === transactionReference);
      if (!purchase) {
        showToaster("Purchase data not found", "destructive");
        return;
      }

      // Set receipt data to trigger PDF generation
      setReceiptData(purchase);

      // Small delay to ensure state update
      setTimeout(async () => {
        try {
          const pdf = await toPDF();
          if (pdf) {
            // Convert blob to base64
            const reader = new FileReader();
            reader.onload = () => {
              const base64 = reader.result as string;
              downloadPdf({
                fileName: `property-receipt-${transactionReference}`,
                url: base64
              });
              setReceiptData(null);
              showToaster("Receipt downloaded successfully", "default");
            };
            reader.readAsDataURL(pdf);
          }
        } catch (error) {
          console.error("Error generating PDF:", error);
          showToaster("Failed to generate receipt", "destructive");
          setReceiptData(null);
        }
      }, 100);
    } catch (error) {
      console.error("Error downloading receipt:", error);
      showToaster("Failed to download receipt", "destructive");
      setReceiptData(null);
    }
  };

  const handleDotClick = (index: number) => {
    setCurrentIndex(index);
    ref.current?.children[index]?.scrollIntoView({ behavior: "smooth" });
  };

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
              <dd className="text-sm text-grey10 font-medium">
                {formatPrice(property?.price)}/
                {property?.category?.name?.toLowerCase() === "shortlet"
                  ? "day"
                  : "year"}
              </dd>
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
            {formatPrice(property?.price)}/
            {property?.category?.name?.toLowerCase() === "shortlet"
              ? "day"
              : "year"}
          </dd>
        </div>

        <div className="mb-4">
          <dt className="sr-only">Property details</dt>
          <dd className="text-sm text-gray-500">
            Type: {property?.type} | Category: {property.category?.name} |
            Availability: {property?.availability}
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

      {/* Seller Information */}
      {property?.user && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-900 mb-2">
            Seller Information
          </h3>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
              {property.user.fullName
                .split(' ')
                .map(name => name[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {property.user.fullName}
            </p>
          </div>
        </div>
      )}

      {/* Buyer Information for Sold Properties */}
      {property.availability === "sold" && purchases.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-3">
            {user?.id === property.userId
              ? "Buyer Information"
              : "Purchase Information"}
          </h3>
          {purchases.map((purchase, index) => (
            <div
              key={purchase.id}
              className="mb-4 last:mb-0 p-3 bg-white rounded border"
            >
              <div className="space-y-2 text-sm text-gray-600">
                <p>
                  <span className="font-medium">Buyer Name:</span>{" "}
                  {purchase.buyerName}
                </p>
                <p>
                  <span className="font-medium">Buyer Email:</span>{" "}
                  {purchase.buyerEmail}
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
                    className={`ml-1 px-2 py-1 text-xs rounded ${
                      purchase.purchaseStatus === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : purchase.purchaseStatus === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {purchase.purchaseStatus}
                  </span>
                </p>
              </div>
              {purchase.purchaseStatus === "COMPLETED" && (
                <div className="mt-3">
                  <CustomButton
                    variant="outline"
                    onClick={() =>
                      handleDownloadReceipt(purchase.transactionReference)
                    }
                    className="text-xs"
                  >
                    Download Receipt
                  </CustomButton>
                </div>
              )}
            </div>
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

      {roleButtons[user?.role as IUserRole]}

      {/* Hidden Receipt Component for PDF Generation */}
      {receiptData && (
        <div
          ref={targetRef}
          className="fixed top-0 left-0 w-full h-full bg-white p-8 text-black"
          style={{
            position: 'absolute',
            left: '-9999px',
            top: '-9999px',
            width: '210mm',
            minHeight: '297mm',
            fontSize: '12px'
          }}
        >
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">PropertySec</h1>
              <p className="text-gray-600">Property Purchase Receipt</p>
            </div>

            {/* Receipt Details */}
            <div className="border border-gray-300 rounded-lg p-6 mb-6">
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Transaction Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><span className="font-medium">Transaction Reference:</span> {receiptData.transactionReference}</p>
                    <p><span className="font-medium">Purchase Date:</span> {new Date(receiptData.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Status:</span> {receiptData.purchaseStatus}</p>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Amount</h3>
                  <div className="text-2xl font-bold text-green-600">
                    {formatPrice(receiptData.purchaseAmount)} {receiptData.currency}
                  </div>
                </div>
              </div>

              {/* Property Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Property Details</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium text-lg mb-1">{property.title}</p>
                  <p className="text-gray-600 mb-2">{property.address}</p>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <p><span className="font-medium">Type:</span> {property.type}</p>
                    <p><span className="font-medium">Category:</span> {property.category?.name}</p>
                  </div>
                </div>
              </div>

              {/* Buyer Details */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Buyer Information</h3>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <p><span className="font-medium">Name:</span> {receiptData.buyerName}</p>
                    <p><span className="font-medium">Email:</span> {receiptData.buyerEmail}</p>
                    {receiptData.buyerPhone && (
                      <p><span className="font-medium">Phone:</span> {receiptData.buyerPhone}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Seller Details */}
              {property.user && (
                <div className="mb-6">
                  <h3 className="font-semibold text-gray-900 mb-2">Seller Information</h3>
                  <div className="bg-gray-50 p-4 rounded">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><span className="font-medium">Name:</span> {property.user.fullName}</p>
                      <p><span className="font-medium">Email:</span> {property.user.email}</p>
                      {property.user.phoneNumber && (
                        <p><span className="font-medium">Phone:</span> {property.user.phoneNumber}</p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="text-center text-sm text-gray-500">
              <p>Thank you for using PropertySec!</p>
              <p className="mt-2">Generated on {new Date().toLocaleDateString()} at {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PropertyDetails;
