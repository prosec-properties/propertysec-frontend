import CustomButton from "@/components/buttons/CustomButton";
import CustomInput from "@/components/inputs/CustomInput";
import TextArea from "@/components/inputs/TextArea";
import TitleWithHR from "@/components/misc/TitleWithHR";
import { useQueryString } from "@/hooks/useQueryString";
import { useUser } from "@/hooks/useUser";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import { cn } from "@/lib/utils";
import { takeLoanApi } from "@/services/loan.service";
import { LOANSTEPS_ENUM } from "@/constants/general";
import { useLoanRequestStore, IOfficeInfo } from "@/store/state/loanStore";
import { revalidateCacheTags } from "@/actions/cache";

const OfficeInfoSchema = z.object({
  officeName: z.string().min(1, { message: "Office name is required" }),
  employerName: z.string().min(1, { message: "Employer name is required" }),
  positionInOffice: z
    .string()
    .min(1, { message: "Position in office is required" }),
  officeContact: z.string().min(1, { message: "Office contact is required" }),
  officeAddress: z.string().min(1, { message: "Office address is required" }),
});

interface Props {
  token: string;
  disabled?: boolean;
}

const OfficeInfoForm = (props: Props) => {
  const { setQueryParam } = useQueryString();
  const { user } = useUser();
  const {
    addCompletedStep,
    officeName,
    setOfficeName,
    employerName,
    setEmployerName,
    positionInOffice,
    setPositionInOffice,
    officeContact,
    setOfficeContact,
    officeAddress,
    setOfficeAddress,
  } = useLoanRequestStore();

  const mutation = useMutation({
    mutationFn: takeLoanApi,
    onSuccess: (data) => {
      const stepData = data?.data as IOfficeInfo;
      setOfficeName(stepData?.officeName);
      setEmployerName(stepData?.employerName);
      setPositionInOffice(stepData?.positionInOffice);
      setOfficeContact(stepData?.officeContact);
      setOfficeAddress(stepData?.officeAddress);
      addCompletedStep(3);
      revalidateCacheTags(["user-loans"]).catch((error) => {
        console.error("Failed to revalidate user loan tags:", error);
      });
      setQueryParam("step", LOANSTEPS_ENUM.OTHER_STEP_4);
      showToaster("Office information saved successfully", "success");
    },
    onError: (error) => {
      showToaster(extractServerErrorMessage(error), "destructive");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(OfficeInfoSchema),
    defaultValues: {
      officeName: user?.businessName || officeName || "",
      employerName: employerName || "",
      positionInOffice: positionInOffice || "",
      officeContact: officeContact || "",
      officeAddress: user?.businessAddress || officeAddress || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("officeName", user.businessName || officeName || "");
      setValue("officeAddress", user.businessAddress || officeAddress || "");
    }
  }, [user, setValue, officeName, officeAddress]);

  const onSubmit: SubmitHandler<z.infer<typeof OfficeInfoSchema>> = async (
    payload
  ) => {
    if (props.disabled) {
      showToaster("Please complete previous steps first", "destructive");
      return;
    }

    const formData = new FormData();
    for (const field in payload) {
      formData.append(field, payload[field]);
    }

    setOfficeName(payload.officeName);
    setEmployerName(payload.employerName);
    setPositionInOffice(payload.positionInOffice);
    setOfficeContact(payload.officeContact);
    setOfficeAddress(payload.officeAddress);

    mutation.mutate({ formData, token: props.token, step: "3" });
  };

  // const goToNextStep = () => {
  //   setQueryParam("step", "4");
  // };

  const goToPreviousStep = () => {
    setQueryParam("step", "2");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "bg-white rounded-[0.375rem] border-[0.6px] p-6",
        props.disabled && "opacity-60 pointer-events-none"
      )}
    >
      <TitleWithHR title="Office Info" className="mb-6 text-left" />

      <Controller
        name="officeName"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            label="Office Name"
            name={field.name}
            type="text"
            placeholder="Enter your office name"
            wrapperClassName="mb-6"
            errorMessage={errors.officeName?.message}
          />
        )}
      />

      <Controller
        name="employerName"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            label="Employer Name"
            name={field.name}
            type="text"
            placeholder="Enter your employer's name"
            wrapperClassName="mb-6"
            errorMessage={errors.employerName?.message}
          />
        )}
      />

      <article className="md:flex gap-6">
        <Controller
          name="positionInOffice"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Position in Office"
              name={field.name}
              type="text"
              placeholder="Enter your position in office"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.positionInOffice?.message}
            />
          )}
        />
        <Controller
          name="officeContact"
          control={control}
          render={({ field }) => (
            <NumericFormat
              {...field}
              label="Office Contact Number"
              name={field.name}
              type="text"
              placeholder="Enter your position in office"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.positionInOffice?.message}
              customInput={CustomInput}
            />
          )}
        />
      </article>
      <Controller
        name="officeAddress"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Office Address"
            name={field.name}
            placeholder="eg 123, Main Street, Lagos"
            wrapperClassName="mb-6"
            errorMessage={errors.officeAddress?.message}
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

export default OfficeInfoForm;
