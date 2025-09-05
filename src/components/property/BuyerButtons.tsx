"use client";

import React, { useState } from "react";
import { IProperty } from "@/interface/property";
import { IUser } from "@/interface/user";
import CustomButton from "../buttons/CustomButton";
import CustomModal from "../modal/CustomModal";
import InspectionDetails from "./InspectionDetails";
import PropertyPaymentDetails from "./PropertyPaymentDetails";
import ActionButton from "../buttons/ActionButton";
import { handleCallSeller, handleWhatsAppSeller } from "./propertyHelpers";

interface BuyerButtonsProps {
  user?: IUser;
  property: IProperty;
}

const BuyerButtons: React.FC<BuyerButtonsProps> = ({ user, property }) => {
  const [showInspectionModal, setShowInspectionModal] = useState(false);
  const [showPropertyModal, setShowPropertyModal] = useState(false);

  const userHasInspection =
    property?.inspections && property?.inspections.length;

  return (
    <div>
      <CustomButton
        className="w-full mb-4"
        onClick={() => setShowPropertyModal(true)}
      >
        Buy Property
      </CustomButton>

      {/* Inspection Button */}
      {userHasInspection ? (
        <div className="border py-2 px-2 mb-5">Inspection Paid</div>
      ) : (
        <>
          <CustomButton
            className="w-full mb-4"
            variant="secondary"
            onClick={() => setShowInspectionModal(true)}
          >
            Proceed for Inspection
          </CustomButton>
        </>
      )}

      <div className="md:flex gap-6 mb-4">
        <ActionButton
          text="Call Seller"
          variant="secondary"
          onClick={() => handleCallSeller(property?.user?.phoneNumber)}
        />
        <ActionButton
          text="WhatsApp Seller"
          variant="secondary"
          onClick={() => handleWhatsAppSeller(property?.user?.phoneNumber)}
        />
      </div>

      <CustomModal
        title="Property Inspection"
        isShown={showInspectionModal}
        setIsShown={setShowInspectionModal}
      >
        <InspectionDetails
          propertyId={property.id}
          user={user}
          setShowModal={setShowInspectionModal}
        />
      </CustomModal>

      {/* Property Purchase Modal */}
      <CustomModal
        title="Property Purchase"
        isShown={showPropertyModal}
        setIsShown={setShowPropertyModal}
      >
        <PropertyPaymentDetails
          propertyId={property.id}
          user={user}
          property={property}
          setShowModal={setShowPropertyModal}
        />
      </CustomModal>
    </div>
  );
};

export default BuyerButtons;
