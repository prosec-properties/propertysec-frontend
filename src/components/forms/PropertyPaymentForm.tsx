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
import { showToaster } from "@/lib/general";
import { useUser } from "@/hooks/useUser";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { initializeTransactionApi } from "@/services/payment.service";
import { frontendUrl } from "@/constants/env";

interface Props {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  user?: IUser;
  propertyId: string;
  property: IProperty;
}

const PropertyPaymentForm = ({ setShowModal, user, propertyId, property }: Props) => {
  const affiliateSlug = new URLSearchParams(window.location.search).get("aff");
  const { token } = useUser();
  const router = useRouter();

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

  const initializeMutation = useMutation({
    mutationFn: async (data: any) => {
      return await initializeTransactionApi(token, {
        type: "property_purchase",
        amount: property.price, 
        callbackUrl: `${frontendUrl}/verify`,
        metadata: {
          propertyId,
          propertyTitle: property.title,
          currency: property.currency,
          fullName: data.fullName,
          email: data.email,
          phoneNumber: data.phoneNumber,
          ...(affiliateSlug && { affiliateSlug }),
          userId: user?.id,
        },
      });
    },
    onSuccess: (response) => {
      console.log("Payment init response", response);
      if (response?.data && (response.data as any)?.authorization_url) {
        router.push((response.data as any).authorization_url);
      } else {
        showToaster("Failed to initialize payment", "destructive");
      }
    },
    onError: (error) => {
      console.error("Payment initialization error:", error);
      showToaster("Failed to initialize payment. Please try again.", "destructive");
    },
  });

  const onSubmit: SubmitHandler<
    z.infer<typeof InspectionDetailsSchema>
  > = async (payload) => {
    try {
      // Validate property availability before payment
      if (property.availability === "sold") {
        showToaster("This property is no longer available for purchase", "destructive");
        return;
      }

      initializeMutation.mutate(payload);
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
          <CustomButton type="submit" disabled={isSubmitting || initializeMutation.isPending}>
            {initializeMutation.isPending ? "Processing..." : "Complete Purchase"}
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default PropertyPaymentForm;
