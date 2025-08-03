import React from "react";
import PropertyPaymentForm from "@/components/forms/PropertyPaymentForm";
import { IUser } from "@/interface/user";
import { IProperty } from "@/interface/property";
import { formatPrice } from "@/lib/payment";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user?: IUser;
  propertyId: string;
  property: IProperty;
}

const PropertyPaymentDetails = (props: Props) => {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-medium mb-[1.62rem]">Property Purchase</h2>
      <div className="mb-[1.62rem]">
        <h3 className="text-lg font-medium mb-2">{props.property.title}</h3>
        <p className="text-gray-600 mb-2">{props.property.address}</p>
        <p className="text-xl font-semibold text-primary mb-4">
          {formatPrice(props.property.price, props.property.currency)}
        </p>
        <p className="text-sm text-gray-500">
          Complete the payment below to purchase this property. This is a secure transaction processed through our payment gateway.
        </p>
      </div>
      <PropertyPaymentForm {...props} />
    </div>
  );
};

export default PropertyPaymentDetails;
