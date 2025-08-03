import CustomButton from "@/components/buttons/CustomButton";
import UploadFile from "@/components/files/UploadFile";
import CustomInput from "@/components/inputs/CustomInput";
import Title from "@/components/misc/Title";
import TitleWithHR from "@/components/misc/TitleWithHR";
import UploadedDoc from "@/components/files/UploadedDoc";
import { useQueryString } from "@/hooks/useQueryString";
import { useUser } from "@/hooks/useUser";
import { IProfileFileInterface } from "@/interface/file";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { takeLoanApi } from "@/services/loan.service";
import { useLoanRequestStore, IBankInfo } from "@/store/state/loanStore";
import { cn } from "@/lib/utils";
import { LOANSTEPS_ENUM } from "@/constants/general";
import NewImagePreview from "@/components/files/NewImagePreview";
import type { SelectedImagePreview } from "@/interface/image";

const LoanBankInfoSchema = z.object({
  averageSalary: z.string().min(1, { message: "Salary is required" }),
  bankName: z.string().min(1, { message: "Bank name is required" }),
  salaryAccountNumber: z
    .string()
    .min(10, { message: "Account number is required and must be 10 digits" })
    .max(10, {
      message: "Account number cannot be more than ten digits",
    }),
  nin: z
    .string()
    .min(11, { message: "NIN is required and must be eleven digits" })
    .max(11, {
      message: "NIN cannot be more than eleven digits",
    }),
  bvn: z
    .string()
    .min(11, { message: "BVN is required and must be eleven digits" })
    .max(11, {
      message: "BVN cannot be more than eleven digits",
    }),
});

interface Props {
  token: string;
  disabled?: boolean;
}

const LoanBankInfo = (props: Props) => {
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const [fileErrMessage, setFileErrMessage] = useState<string>("");
  const [selectedPhoto, setSelectedPhoto] =
    useState<SelectedImagePreview | null>(null);

  const { setQueryParam } = useQueryString();
  const { user } = useUser();
  const {
    addCompletedStep,
    bankName,
    setBankName,
    averageSalary,
    setAverageSalary,
    salaryAccountNumber,
    setSalaryAccountNumber,
    nin,
    setNin,
    bvn,
    setBvn,
  } = useLoanRequestStore();

  const mutation = useMutation({
    mutationFn: takeLoanApi,
    onSuccess: (data) => {
      const stepData = data?.data as IBankInfo;
      setSalaryAccountNumber(stepData?.salaryAccountNumber);
      setNin(stepData?.nin);
      setBvn(stepData?.bvn);
      addCompletedStep(2);
      setQueryParam("step", LOANSTEPS_ENUM.OFFICE_STEP_3);
      showToaster("Bank information saved successfully", "success");
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
    resolver: zodResolver(LoanBankInfoSchema),
    defaultValues: {
      averageSalary: user?.monthlySalary?.toString() || averageSalary || "",
      bankName: user?.bankName || bankName || "",
      salaryAccountNumber: user?.bankAccountNumber || salaryAccountNumber || "",
      nin: user?.nin || nin || "",
      bvn: user?.bvn || bvn || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("bankName", user.bankName || bankName || "");
      setValue("salaryAccountNumber", user.bankAccountNumber || salaryAccountNumber || "");
      setValue("nin", user.nin || nin || "");
      setValue("bvn", user.bvn || bvn || "");
      setValue("averageSalary", user.monthlySalary?.toString() || averageSalary || "");
    }
  }, [user, setValue, bankName, salaryAccountNumber, nin, bvn, averageSalary]);

  const onSubmit: SubmitHandler<z.infer<typeof LoanBankInfoSchema>> = async (
    payload
  ) => {
    // Check if previous step is completed
    if (props.disabled) {
      showToaster("Please complete previous steps first", "destructive");
      return;
    }

    if (!files || files.length < 1) {
      setFileErrMessage("Please upload at least one file");
      showToaster("Please upload at least one file", "destructive");
      return;
    }

    const formData = new FormData();
    for (const field in payload) {
      formData.append(field, payload[field]);
    }

    if (files) {
      files.forEach((file) => {
        formData.append("bankStatement[]", file);
      });
    }

    // Save form data to store regardless of submission
    setBankName(payload.bankName);
    setAverageSalary(payload.averageSalary);
    setSalaryAccountNumber(payload.salaryAccountNumber);
    setNin(payload.nin);
    setBvn(payload.bvn);

    mutation.mutate({ formData, token: props.token, step: "2" });
  };

  const goToNextStep = () => {
    setQueryParam("step", "3");
  };

  const goToPreviousStep = () => {
    setQueryParam("step", "1");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className={cn(
        "bg-white rounded-[0.375rem] border-[0.6px] p-6",
        props.disabled && "opacity-60 pointer-events-none"
      )}
    >
      <TitleWithHR title="Bank Info" className="mb-6 text-left" />
      <Controller
        name="averageSalary"
        control={control}
        render={({ field }) => (
          <NumericFormat
            {...field}
            label="Average Monthly Salary"
            name={field.name}
            type="text"
            placeholder="Enter your average monthly salary"
            wrapperClassName="mb-6"
            errorMessage={errors.bankName?.message}
            thousandSeparator
            customInput={CustomInput}
          />
        )}
      />

      <article className="md:flex gap-6">
        <Controller
          name="bankName"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Bank Name"
              name={field.name}
              type="text"
              placeholder="eg G.R.A Phase 1 Ikeja"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.bankName?.message}
            />
          )}
        />
        <Controller
          name="salaryAccountNumber"
          control={control}
          render={({ field }) => (
            <NumericFormat
              {...field}
              label="Salary Account Number"
              name={field.name}
              type="text"
              placeholder="eg. 12, Allen Avenue"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.salaryAccountNumber?.message}
              customInput={CustomInput}
            />
          )}
        />
      </article>
      <article className="md:flex gap-6">
        <Controller
          name="nin"
          control={control}
          render={({ field }) => (
            <NumericFormat
              {...field}
              label="NIN"
              name={field.name}
              type="text"
              placeholder="Enter your NIN"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.nin?.message}
              customInput={CustomInput}
            />
          )}
        />
        <Controller
          name="bvn"
          control={control}
          render={({ field }) => (
            <NumericFormat
              {...field}
              label="BVN"
              name={field.name}
              type="text"
              placeholder="Enter your BVN"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.bvn?.message}
              customInput={CustomInput}
            />
          )}
        />
      </article>

      <Title
        title="Upload Last 6months Bank Statement of Account"
        className="mb-6 text-left"
      />

      <article className="mb-6">
        <span className="mb-2 font-medium text-grey6 text-sm block">
          Please upload your bank statement for the last 6 months
        </span>
        <NewImagePreview
          format="multiple"
          name="files"
          files={files}
          setFiles={setFiles}
          selectedPhoto={selectedPhoto as SelectedImagePreview}
          setSelectedPhoto={setSelectedPhoto}
          fileType="image"
          errorMessage={fileErrMessage}
          existingImages={null}
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

export default LoanBankInfo;
