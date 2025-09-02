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
import {
  Dialog,
  DialogHeader,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";

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
      {/* Property Purchase Button */}
      {/* {user?.buyerApproved ? ( */}
        <CustomButton
          className="w-full mb-4"
          onClick={() => setShowPropertyModal(true)}
        >
          Buy Property
        </CustomButton>
      {/* // ) : (
      //   <Dialog>
      //     <DialogTrigger asChild>
      //       <CustomButton className="w-full mb-4">Buy Property</CustomButton>
      //     </DialogTrigger>
      //     <DialogContent>
      //       <DialogHeader>
      //         <DialogTitle>Account Verification</DialogTitle>
      //         <DialogDescription>
      //           Your account is not yet verified. Please contact us for details
      //           on how to get verified. Only verified accounts can purchase
      //           properties.
      //         </DialogDescription>
      //       </DialogHeader>
      //       <DialogFooter>
      //         <DialogClose>
      //           <CustomButton variant="secondary">Okay</CustomButton>
      //         </DialogClose>
      //       </DialogFooter>
      //     </DialogContent>
      //   </Dialog>
      // )} */}

      {/* Inspection Button */}
      {userHasInspection ? (
        <div className="border py-2 px-2 mb-5">Inspection Paid</div>
      ) : (
        <>
          {user?.buyerApproved ? (
            <CustomButton
              className="w-full mb-4"
              variant="secondary"
              onClick={() => setShowInspectionModal(true)}
            >
              Proceed for Inspection
            </CustomButton>
          ) : (
            <Dialog>
              <DialogTrigger asChild>
                <CustomButton className="w-full mb-4" variant="secondary">
                  Proceed for Inspection
                </CustomButton>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Account Verification</DialogTitle>
                  <DialogDescription>
                    Your account is not yet verified. Please contact us for
                    details on how to get verified. Only verified accounts can
                    proceed for inspection.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <DialogClose>
                    <CustomButton variant="secondary">Okay</CustomButton>
                  </DialogClose>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )}
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
