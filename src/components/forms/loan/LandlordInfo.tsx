import CustomButton from "@/components/buttons/CustomButton";
import CustomInput from "@/components/inputs/CustomInput";
import TextArea from "@/components/inputs/TextArea";
import TitleWithHR from "@/components/misc/TitleWithHR";
import { useQueryString } from "@/hooks/useQueryString";
import { SelectedImagePreview } from "@/interface/image";
import { phoneNumberSchema } from "@/store/schema/phoneNumberSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { ILandlordInfo, useLoanRequestStore } from "@/store/state/loanStore";
import { takeLoanApi } from "@/services/loan.service";
import {
  extractServerErrorMessage,
  validateNigerianPhoneNumber,
} from "@/lib/general";
import { useMutation } from "@tanstack/react-query";
import { showToaster } from "@/lib/general";
import { LOANSTEPS_ENUM } from "@/constants/general";

const LandlordInfoSchema = z.object({
  landlordName: z.string().min(1, { message: "Landlord name is required" }),
  landlordBankName: z.string().min(1, { message: "Bank name is required" }),
  landlordAccountNumber: z
    .string()
    .min(10, { message: "Account number is required" })
    .max(10, { message: "Account number cannot be more than ten digits" }),
  landlordAddress: z
    .string()
    .min(1, { message: "Landlord address is required" }),
  phoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine(validateNigerianPhoneNumber, {
      message:
        "Please enter a valid Nigerian phone number (e.g., 08012345678, +2348012345678, or 2348012345678)",
    }),
});

interface Props {
  token: string;
  disabled?: boolean;
}

const LandlordInfoForm = ({ token, disabled }: Props) => {
  const {
    addCompletedStep,
    landlordName,
    setLandlordName,
    landlordBankName,
    setLandlordBankName,
    landlordAccountNumber,
    setLandlordAccountNumber,
    landlordAddress,
    setLandlordAddress,
    landlordPhoneNumber,
    setLandlordPhoneNumber,
  } = useLoanRequestStore();

  const mutation = useMutation({
    mutationFn: takeLoanApi,
    onSuccess: (data) => {
      const stepData = data?.data as ILandlordInfo;
      setLandlordName(stepData?.landlordName);
      setLandlordBankName(stepData?.landlordBankName);
      setLandlordAccountNumber(stepData?.landlordAccountNumber);
      setLandlordAddress(stepData?.landlordAddress);
      setLandlordPhoneNumber(stepData?.landlordPhoneNumber);
      addCompletedStep(5);
      setQueryParam("step", LOANSTEPS_ENUM.GUARANTOR_STEP_6);
      showToaster("Landlord information saved successfully", "success");
    },
    onError: (error) => {
      showToaster(extractServerErrorMessage(error), "destructive");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(LandlordInfoSchema),
    defaultValues: {
      landlordName: landlordName || "",
      landlordBankName: landlordBankName || "",
      landlordAccountNumber: landlordAccountNumber || "",
      landlordAddress: landlordAddress || "",
      phoneNumber: landlordPhoneNumber || "",
    },
  });

  const [selectedPhoto, setSelectedPhoto] = useState<SelectedImagePreview>();
  const [files, setFiles] = useState<File[]>();

  const { setQueryParam } = useQueryString();

  const onSubmit: SubmitHandler<z.infer<typeof LandlordInfoSchema>> = async (
    payload
  ) => {
    if (disabled) {
      showToaster("Please complete previous steps first", "destructive");
      return;
    }

    const formData = new FormData();
    for (const field in payload) {
      if (field === "phoneNumber") {
        formData.append("landlordPhoneNumber", payload[field]);
      } else {
        formData.append(field, payload[field]);
      }
    }

    // Save form data to store
    setLandlordName(payload.landlordName);
    setLandlordBankName(payload.landlordBankName);
    setLandlordAccountNumber(payload.landlordAccountNumber);
    setLandlordAddress(payload.landlordAddress);
    setLandlordPhoneNumber(payload.phoneNumber);

    mutation.mutate({ formData, token, step: "5" });
  };

  // const goToNextStep = () => {
  //   setQueryParam("step", "2");
  // };

  const goToPreviousStep = () => {
    setQueryParam("step", "1");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "bg-white rounded-[0.375rem] border-[0.6px] p-6",
        disabled && "opacity-60 pointer-events-none"
      )}
    >
      <TitleWithHR
        title="Current Landlord Details"
        className="mb-6 text-left"
      />

      <article className="md:flex gap-6">
        <Controller
          name="landlordName"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Landlord Name"
              name={field.name}
              placeholder="eg Mr. John Doe"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.landlordName?.message}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <NumericFormat
              {...field}
              label="Landlord Phone Number"
              name={field.name}
              placeholder="eg "
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.phoneNumber?.message}
              customInput={CustomInput}
            />
          )}
        />
      </article>
      <article className="md:flex gap-6">
        <Controller
          name="landlordBankName"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Landlord Bank Name"
              name={field.name}
              placeholder="eg First Bank"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.landlordBankName?.message}
            />
          )}
        />
        <Controller
          name="landlordAccountNumber"
          control={control}
          render={({ field }) => (
            <NumericFormat
              {...field}
              label="Landlord Account Number"
              name={field.name}
              placeholder="eg "
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.landlordAccountNumber?.message}
              customInput={CustomInput}
            />
          )}
        />
      </article>
      <Controller
        name="landlordAddress"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Landlord Address"
            name={field.name}
            placeholder="eg 123, Main Street, Lagos"
            wrapperClassName="mb-6"
            errorMessage={errors.landlordAddress?.message}
          />
        )}
      />

      <article className="mb-6 flex flex-col-reverse md:flex-row md:justify-end">
        <CustomButton variant="tertiary" onClick={goToPreviousStep}>
          Back
        </CustomButton>
        <CustomButton
          className="mb-2 md:mb-0"
          type="submit"
          loading={mutation.isPending}
        >
          Next
        </CustomButton>
      </article>
    </form>
  );
};

export default LandlordInfoForm;
