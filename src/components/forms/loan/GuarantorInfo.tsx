import CustomButton from "@/components/buttons/CustomButton";
import CustomInput from "@/components/inputs/CustomInput";
import TextArea from "@/components/inputs/TextArea";
import TitleWithHR from "@/components/misc/TitleWithHR";
import { useQueryString } from "@/hooks/useQueryString";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useLoanRequestStore } from "@/store/state/loanStore";
import { useMutation } from "@tanstack/react-query";
import { takeLoanApi } from "@/services/loan.service";
import { IGuarantorInfo } from "@/store/state/loanStore";
import { extractServerErrorMessage, showToaster, validateNigerianPhoneNumber } from "@/lib/general";
import { useRouter } from "next/navigation";
import { DASHBOARD_LOAN_ROUTE } from "@/constants/routes";

const GuarantorInfoSchema = z.object({
  guarantorName: z.string().min(1, { message: "Name is required" }),
  guarantorEmail: z.string().email({ message: "Invalid email address" }),
  guarantorHomeAddress: z
    .string()
    .min(1, { message: "Home address is required" }),
  guarantorOfficeAddress: z
    .string()
    .min(1, { message: "Office address is required" }),
  guarantorPhoneNumber: z
    .string()
    .min(1, { message: "Phone number is required" })
    .refine(validateNigerianPhoneNumber, {
      message: "Please enter a valid Nigerian phone number (e.g., 08012345678, +2348012345678, or 2348012345678)"
    }),
});

interface Props {
  token: string;
  disabled?: boolean;
}

const GuarantorInfoForm = ({ token, disabled }: Props) => {
  const { setQueryParam } = useQueryString();
  const router = useRouter();

  const {
    addCompletedStep,
    guarantorName,
    setGuarantorName,
    guarantorEmail,
    setGuarantorEmail,
    guarantorHomeAddress,
    setGuarantorHomeAddress,
    guarantorOfficeAddress,
    setGuarantorOfficeAddress,
    guarantorPhoneNumber,
    setGuarantorPhoneNumber,
    resetAllForms,
  } = useLoanRequestStore();

  const mutation = useMutation({
    mutationFn: takeLoanApi,
    onSuccess: (data) => {
      const stepData = data?.data as IGuarantorInfo;
      setGuarantorName(stepData?.guarantorName);
      setGuarantorEmail(stepData?.guarantorEmail);
      setGuarantorHomeAddress(stepData?.guarantorHomeAddress);
      setGuarantorOfficeAddress(stepData?.guarantorOfficeAddress);
      setGuarantorPhoneNumber(stepData?.guarantorPhoneNumber);
      addCompletedStep(6);
      showToaster("Guarantor information saved successfully", "success");
      resetAllForms();
      router.push(DASHBOARD_LOAN_ROUTE);
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
    resolver: zodResolver(GuarantorInfoSchema),
    defaultValues: {
      guarantorName: guarantorName || "",
      guarantorEmail: guarantorEmail || "",
      guarantorHomeAddress: guarantorHomeAddress || "",
      guarantorOfficeAddress: guarantorOfficeAddress || "",
      guarantorPhoneNumber: guarantorPhoneNumber || "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof GuarantorInfoSchema>> = async (
    payload
  ) => {
    if (disabled) {
      showToaster("Please complete previous steps first", "destructive");
      return;
    }

    const formData = new FormData();
    for (const field in payload) {
      formData.append(field, payload[field]);
    }

    // Save form data to store
    setGuarantorName(payload.guarantorName);
    setGuarantorEmail(payload.guarantorEmail);
    setGuarantorHomeAddress(payload.guarantorHomeAddress);
    setGuarantorOfficeAddress(payload.guarantorOfficeAddress);
    setGuarantorPhoneNumber(payload.guarantorPhoneNumber);

    mutation.mutate({ formData, token, step: "6" });
  };

  const goToPreviousStep = () => {
    setQueryParam("step", "2");
  };
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "bg-white rounded-[0.375rem] border-[0.6px] p-6",
        disabled && "opacity-60 pointer-events-none"
      )}
    >
      <TitleWithHR title="Guarantors Details" className="mb-6 text-left" />
      <Controller
        name="guarantorName"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            label="Guarantor's Name"
            name={field.name}
            placeholder="eg John Doe"
            wrapperClassName="mb-6"
            errorMessage={errors.guarantorName?.message}
          />
        )}
      />

      <article className="md:flex gap-6">
        <Controller
          name="guarantorEmail"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Email Address"
              name={field.name}
              type="email"
              placeholder="eg"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.guarantorEmail?.message}
            />
          )}
        />

        <Controller
          name="guarantorPhoneNumber"
          control={control}
          render={({ field }) => (
            <NumericFormat
              {...field}
              label="Guarantor's Phone Number"
              name={field.name}
              placeholder="eg 08012345678"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.guarantorPhoneNumber?.message}
              customInput={CustomInput}
            />
          )}
        />
      </article>

      <Controller
        name="guarantorHomeAddress"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Guarantor's Home Address"
            name={field.name}
            placeholder="eg 123, Main Street, Lagos"
            wrapperClassName="mb-6"
            errorMessage={errors.guarantorHomeAddress?.message}
          />
        )}
      />
      <Controller
        name="guarantorOfficeAddress"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Guarantor's Office Address"
            name={field.name}
            placeholder="eg 123, Main Street, Lagos"
            wrapperClassName="mb-6"
            errorMessage={errors.guarantorOfficeAddress?.message}
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
          Submit
        </CustomButton>
      </article>
    </form>
  );
};

export default GuarantorInfoForm;
