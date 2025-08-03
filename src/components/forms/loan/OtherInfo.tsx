import CustomButton from "@/components/buttons/CustomButton";
import NewImagePreview from "@/components/files/NewImagePreview";
import CustomInput from "@/components/inputs/CustomInput";
import TextArea from "@/components/inputs/TextArea";
import TitleWithHR from "@/components/misc/TitleWithHR";
import { useQueryString } from "@/hooks/useQueryString";
import { SelectedImagePreview } from "@/interface/image";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { takeLoanApi } from "@/services/loan.service";
import { useLoanRequestStore, ILoanDetails } from "@/store/state/loanStore";
import { LOANSTEPS_ENUM } from "@/constants/general";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import { cn } from "@/lib/utils";

const OtherInfoSchema = z.object({
  noOfRooms: z.string().min(1, { message: "Number of rooms is required" }),
  noOfYears: z.string().min(1, { message: "Number of years is required" }),
  reasonForLoanRequest: z
    .string()
    .min(1, { message: "Reason for requesting loan is required" }),
});

const OtherInfoForm = ({ token, disabled }: { token: string; disabled?: boolean }) => {
  const { setQueryParam } = useQueryString();
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedImagePreview | null>(null);
  const [fileErrMessage, setFileErrMessage] = useState<string>("");

  const {
    addCompletedStep,
    noOfRooms,
    setNoOfRooms,
    noOfYears,
    setNoOfYears,
    reasonForLoanRequest,
    setReasonForLoanRequest,
  } = useLoanRequestStore();

  const mutation = useMutation({
    mutationFn: takeLoanApi,
    onSuccess: (data) => {
      const stepData = data?.data as ILoanDetails;
      setNoOfRooms(stepData?.noOfRooms);
      setNoOfYears(stepData?.noOfYears);
      setReasonForLoanRequest(stepData?.reasonForLoanRequest);
      addCompletedStep(4);
      setQueryParam("step", LOANSTEPS_ENUM.LANDLORD_STEP_5);
      showToaster("Other information saved successfully", "success");
    },
    onError: (error) => {
      showToaster(extractServerErrorMessage(error), "destructive");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(OtherInfoSchema),
    defaultValues: {
      noOfRooms: noOfRooms || "",
      noOfYears: noOfYears || "",
      reasonForLoanRequest: reasonForLoanRequest || "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof OtherInfoSchema>> = async (payload) => {
    if (disabled) {
      showToaster("Please complete previous steps first", "destructive");
      return;
    }

    if (!files || files.length < 1) {
      setFileErrMessage("Please upload at least one image");
      showToaster("Please upload at least one image", "destructive");
      return;
    }

    const formData = new FormData();
    for (const field in payload) {
      formData.append(field, payload[field]);
    }

    files.forEach((file) => {
      formData.append("files[]", file);
    });


    mutation.mutate({ formData, token, step: "4" });
  };

  const goToNextStep = () => {
    setQueryParam("step", "5");
  };

  const goToPreviousStep = () => {
    setQueryParam("step", "3");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "bg-white rounded-[0.375rem] border-[0.6px] p-6",
        disabled && "opacity-60 pointer-events-none"
      )}
    >
      <TitleWithHR title="Other Info" className="mb-6 text-left" />

      <Controller
        name="noOfRooms"
        control={control}
        render={({ field }) => (
          <NumericFormat
            {...field}
            label="How many rooms are you occupying?"
            name={field.name}
            type="text"
            placeholder="eg 3"
            wrapperClassName="mb-6"
            errorMessage={errors.noOfRooms?.message}
            customInput={CustomInput}
          />
        )}
      />

      <Controller
        name="noOfYears"
        control={control}
        render={({ field }) => (
          <NumericFormat
            {...field}
            label="How many years have you lived in your current residence?"
            name={field.name}
            type="text"
            placeholder="eg 2"
            wrapperClassName="mb-6"
            errorMessage={errors.noOfYears?.message}
            customInput={CustomInput}
          />
        )}
      />

      <Controller
        name="reasonForLoanRequest"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Why are you requesting for a loan?"
            name={field.name}
            placeholder="Enter your reason for requesting a loan"
            wrapperClassName="mb-6"
            errorMessage={errors.noOfYears?.message}
          />
        )}
      />

      <TitleWithHR title="Upload your current apartment" className="mb-6 text-left" />

      <article className="mb-6">
        <span className="mb-2 font-medium text-grey6 text-sm block">
          Upload front, living room, road that leads to your house and landmmark
        </span>
        <NewImagePreview
          existingImages={null}
          format="multiple"
          name="files"
          files={files || []}
          setFiles={setFiles}
          selectedPhoto={selectedPhoto as SelectedImagePreview}
          setSelectedPhoto={setSelectedPhoto}
          fileType="image"
        />
      </article>

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

export default OtherInfoForm;
