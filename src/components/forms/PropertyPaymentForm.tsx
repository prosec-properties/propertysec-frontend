"use client";

import { InspectionDetailsSchema } from "@/store/schema/inspectionDetailsSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import CustomInput from "../inputs/CustomInput";
import CustomButton from "../buttons/CustomButton";
import TitleWithHR from "../misc/TitleWithHR";
import { IUser } from "@/interface/user";
import { IProperty } from "@/interface/property";
import { usePaystackPayment } from "react-paystack";
import { PaystackSuccessResponse } from "@/interface/payment";
import { showToaster, verifyServerResponse } from "@/lib/general";
import { verifyTransaction } from "@/actions/transaction";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user?: IUser;
  propertyId: string;
  property: IProperty;
}

const PropertyPaymentForm = ({ setShowModal, user, propertyId, property }: Props) => {
  const affiliateSlug = new URLSearchParams(window.location.search).get("aff");
  
  const paystackConfig = {
    reference: "",
    email: "",
    amount: property.price * 100, // Convert to kobo
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(InspectionDetailsSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      phoneNumber: user?.phoneNumber || "",
      email: user?.email || "",
    },
  });

  const initializePayment = usePaystackPayment(paystackConfig);

  const onSuccess = async (response: PaystackSuccessResponse) => {
    try {
      showToaster("Verifying Payment, please wait!", "success");

      const payload = {
        reference: response.reference!,
      };

      const verifyPayment = await verifyTransaction(payload, "getAProperty");

      verifyServerResponse(verifyPayment);

      showToaster("Property purchase completed successfully!", "success");
      setShowModal(false);
    } catch (error) {
      console.log(error);
      showToaster("Payment verification failed!", "destructive");
    }
  };  const onSubmit: SubmitHandler<
    z.infer<typeof InspectionDetailsSchema>
  > = async (payload) => {
    try {
      // Validate property availability before payment
      if (property.availability === "sold") {
        showToaster("This property is no longer available for purchase", "destructive");
        return;
      }

      initializePayment({
        onSuccess: (response) => {
          console.log(response);
          onSuccess(response);
        },
        onClose: () => {
          showToaster("Payment cancelled", "warning");
        },
        config: {
          metadata: {
            type: "property_purchase",
            fullName: payload.fullName,
            email: payload.email,
            phoneNumber: payload.phoneNumber,
            propertyId,
            propertyTitle: property.title,
            propertyPrice: property.price,
            currency: property.currency,
            ...(affiliateSlug && { affiliateSlug }),
            userId: user?.id,
            custom_fields: [],
          },
          reference: `PROP_${new Date().getTime()}_${Math.random().toString(36).substring(2, 15)}`,
          email: payload.email,
          amount: paystackConfig.amount,
        },
      });
    } catch (error) {
      console.error("Payment initialization error:", error);
      showToaster("Failed to initialize payment. Please try again.", "destructive");
    }
    setShowModal(false);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <TitleWithHR title="Buyer Information" className="mb-6 text-left" />
        <Controller
          name="fullName"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Full Name"
              name={field.name}
              type="text"
              placeholder="Enter your full name"
              wrapperClassName="mb-6"
              errorMessage={errors.fullName?.message}
            />
          )}
        />
        <article className="md:flex gap-6">
          <Controller
            name="email"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Email Address"
                name={field.name}
                type="text"
                placeholder="Enter your email address"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.email?.message}
              />
            )}
          />
          <Controller
            name="phoneNumber"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Phone Number"
                name={field.name}
                type="text"
                placeholder="Enter your phone number"
                wrapperClassName="mb-6 md:w-1/2"
                errorMessage={errors.phoneNumber?.message}
              />
            )}
          />
        </article>
        <div className="flex justify-end gap-4">
          <CustomButton
            variant="secondary"
            type="button"
            onClick={() => setShowModal(false)}
          >
            Cancel
          </CustomButton>
          <CustomButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Processing..." : "Complete Purchase"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default PropertyPaymentForm;
