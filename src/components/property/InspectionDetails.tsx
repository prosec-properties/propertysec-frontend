import React from "react";
import InspectionForm from "../forms/InspectionForm";
import { IUser } from "@/interface/user";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user?: IUser;
  propertyId: string;
}
const InspectionDetails = (props: Props) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-medium mb-[1.62rem]">Inspection Details</h2>
      <p className="text-xl mb-[1.62rem]">
        Fill the details below and make a one time non-refundable payment of
        ₦5,000 for inspection fee
      </p>
      <InspectionForm {...props} />
    </div>
  );
};

export default InspectionDetails;
