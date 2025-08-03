import CustomButton from "@/components/buttons/CustomButton";
import NewImagePreview from "@/components/files/NewImagePreview";
import CustomInput from "@/components/inputs/CustomInput";
import SelectInput from "@/components/inputs/SelectInput";
import TextArea from "@/components/inputs/TextArea";
import TitleWithHR from "@/components/misc/TitleWithHR";
import { useQueryString } from "@/hooks/useQueryString";
import { SelectedImagePreview } from "@/interface/image";
import { ICountry } from "@/interface/location";
import { phoneNumberSchema } from "@/store/schema/phoneNumberSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { NumericFormat } from "react-number-format";
import { z } from "zod";
import { useUser } from "@/hooks/useUser";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import { takeLoanApi } from "@/services/loan.service";
import { useMutation } from "@tanstack/react-query";
import { LOANSTEPS_ENUM } from "@/constants/general";
import { useLoanRequestStore, IPersonalInfo } from "@/store/state/loanStore";

const LoanInfoSchema = z
  .object({
    amount: z.string().min(1, { message: "Amount is required" }),
    duration: z.string().min(1, { message: "Duration is required" }),
    fullName: z.string().min(1, { message: "Full name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    stateOfOrigin: z
      .string()
      .min(1, { message: "State of origin is required" }),
    nationality: z.string().min(1, { message: "National is required" }),
    homeAddress: z.string().min(1, { message: "Home address is required" }),
    religion: z.string().min(1, { message: "Religion is required" }),
    nextOfKinName: z.string().min(1, { message: "Next of kin is required" }),
  })
  .and(phoneNumberSchema());

interface Props {
  countries: ICountry[];
}

const LoanInfoForm = (props: Props) => {
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedImagePreview | null>(null);
  const [files, setFiles] = useState<File[] | undefined>(undefined);
  const [selectedCountry, setSelectedCountry] = useState<ICountry>();
  const [hasSelectedCountry, setHasSelectedCountry] = useState<boolean>(false);
  const [fileErrMessage, setFileErrMessage] = useState<string>("");

  const { setQueryParam } = useQueryString();
  const { user, token } = useUser();
  const { 
    addCompletedStep,
    amount,
    setAmount,
    duration,
    setDuration,
    fullName,
    setFullName,
    email,
    setEmail,
    phoneNumber,
    setPhoneNumber,
    stateOfOrigin,
    setStateOfOrigin,
    nationality,
    setNationality,
    homeAddress,
    setHomeAddress,
    religion,
    setReligion,
    nextOfKin,
    setNextOfKin,
  } = useLoanRequestStore();

  console.log("user", user);

  const mutation = useMutation({
    mutationFn: takeLoanApi,
    onSuccess: (data) => {
      // console.log("data", data?.data);
      const stepData = data?.data as IPersonalInfo;
      
      setAmount(stepData?.amount);
      setDuration(stepData?.duration);
      addCompletedStep(1);
      setQueryParam("step", LOANSTEPS_ENUM.BANK_STEP_2);
    },
    onError: (error) => {
      console.log("error", error);
      showToaster(extractServerErrorMessage(error), "destructive");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(LoanInfoSchema),
    defaultValues: {
      email: user?.email || email || "",
      phoneNumber: user?.phoneNumber || phoneNumber || "",
      fullName: user?.fullName || fullName || "",
      amount: amount || "",
      duration: duration || "",
      nextOfKinName: user?.nextOfKinName || nextOfKin || "",
      nationality: user?.nationality || nationality || "",
      stateOfOrigin: user?.stateOfOrigin || stateOfOrigin || "",
      homeAddress: user?.homeAddress || homeAddress || "",
      religion: user?.religion || religion || "",
    },
  });

  useEffect(() => {
    if (user) {
      setValue("email", user.email || email || "");
      setValue("phoneNumber", user.phoneNumber || phoneNumber || "");
      setValue("fullName", user.fullName || fullName || "");
      setValue("nationality", user.nationality || nationality || "");
      setValue("stateOfOrigin", user.stateOfOrigin || stateOfOrigin || "");
      setValue("homeAddress", user.homeAddress || homeAddress || "");
      setValue("religion", user.religion || religion || "");
      setValue("nextOfKinName", user.nextOfKinName || nextOfKin || "");
    }
    if (amount) setValue("amount", amount);
    if (duration) setValue("duration", duration);
  }, [user, setValue, amount, duration, email, phoneNumber, fullName, nationality, stateOfOrigin, homeAddress, religion, nextOfKin]);

  const onSubmit: SubmitHandler<z.infer<typeof LoanInfoSchema>> = async (
    payload
  ) => {
    if (!files || files.length < 1) {
      setFileErrMessage("Please upload at least one image");
      showToaster("Please upload at least one image", "destructive");
      return;
    }

    if (files.length !== 3) {
      setFileErrMessage("Please upload 3 images");
      showToaster("Please upload 3 images", "destructive");
      return;
    }

    const formData = new FormData();

    for (const field in payload) {
      formData.append(field, payload[field]);
    }
    files.forEach((file) => {
      formData.append("personalImages", file);
    });

    setAmount(payload.amount);
    setDuration(payload.duration);

    mutation.mutate({formData, token, step: "1"});
  };

  const goToPreviousStep = () => {
    setQueryParam("step", "1");
  };

  const getCountry = (countryId: string) => {
    const country = props.countries.find(
      (country) => String(country.id) === countryId
    );

    if (country) {
      setSelectedCountry(country);
    }
    return country;
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white rounded-[0.375rem] border-[0.6px] p-6"
    >
      <TitleWithHR title="Loan Info" className="mb-6 text-left" />
      <Controller
        name="amount"
        control={control}
        render={({ field }) => (
          <SelectInput
            {...field}
            formLabel="Loan Amount"
            name={field.name}
            options={[
              "1000",
              "5000",
              "10000",
              "20000",
              "30000",
              "40000",
              "50000",
              "100000",
            ].map((item) => ({ label: item, value: item }))}
            onValueChange={(value) => {
              field.onChange(value);
            }}
            placeholder="Choose amount"
            wrapperClassName="mb-6"
            errorMessage={errors.amount?.message}
          />
        )}
      />

      <Controller
        name="duration"
        control={control}
        render={({ field }) => (
          <SelectInput
            {...field}
            formLabel="Duration"
            name={field.name}
            placeholder="Choose duration"
            options={["1 month", "3 months", "6 months", "12 months"].map(
              (item) => ({ label: item, value: item })
            )}
            onValueChange={(value) => {
              field.onChange(value);
            }}
            // defaultValue="NGN"
            wrapperClassName="mb-6"
            errorMessage={errors.duration?.message}
          />
        )}
      />

      <TitleWithHR title="Personal Info" className="mb-6 text-left" />

      <Controller
        name="fullName"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            label="Full Name"
            name={field.name}
            value={user?.fullName || ""}
            disabled={!!user?.fullName}
            type="text"
            placeholder="eg John Doe"
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
              value={user?.email || ""}
              disabled={!!user?.email}
              type="text"
              placeholder="eg johndoe@gmail.com"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.email?.message}
            />
          )}
        />
        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <NumericFormat
              {...field}
              label="Phone Number"
              name={field.name}
              value={user?.phoneNumber || ""}
              disabled={!!user?.phoneNumber}
              type="text"
              placeholder="eg 08012345678"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.phoneNumber?.message}
              customInput={CustomInput}
            />
          )}
        />
      </article>

      <article className="md:flex gap-6">
        <Controller
          name="nationality"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              formLabel="Nationality"
              name={field.name}
              value={field.value || ""}
              options={props.countries.map((country) => ({
                label: country.name,
                value: String(country.id),
              }))}
              onValueChange={(value) => {
                field.onChange(value);
                setHasSelectedCountry(true);
                getCountry(value);
              }}
              disabled={!!user?.nationality}
              // defaultValue={NIGERIAN_COUNTRY_ID}
              placeholder="Select your Nationality"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.nationality?.message}
            />
          )}
        />
        <Controller
          name="stateOfOrigin"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              formLabel="State of Origin"
              name={field.name}
              value={field.value || ""}
              options={
                selectedCountry?.states.map((state) => ({
                  label: state.name,
                  value: state.stateCode,
                })) || []
              }
              disabled={!hasSelectedCountry}
              onValueChange={(value) => {
                field.onChange(value);
              }}
              placeholder="Select your state of origin"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.stateOfOrigin?.message}
            />
          )}
        />
      </article>

      <article className="md:flex gap-6">
        <Controller
          name="religion"
          control={control}
          render={({ field }) => (
            <SelectInput
              {...field}
              formLabel="Religion"
              name={field.name}
              value={field.value || ""}
              options={["Christian", "Muslim", "Traditional", "Other"].map(
                (item) => ({
                  label: item,
                  value: item,
                })
              )}
              onValueChange={(value) => {
                field.onChange(value);
              }}
              disabled={!!user?.religion}
              placeholder="Select Religion"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.religion?.message}
            />
          )}
        />
        <Controller
          name="nextOfKinName"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Next of Kin"
              name={field.name}
              value={field.value || ""}
              type="text"
              placeholder="eg Jane Doe"
              wrapperClassName="mb-6 md:w-1/2"
              errorMessage={errors.nextOfKinName?.message}
            />
          )}
        />
      </article>

      <Controller
        name="homeAddress"
        control={control}
        render={({ field }) => (
          <TextArea
            {...field}
            label="Home Address"
            name={field.name}
            // value={user?.homeAddress || ""}
            disabled={!!user?.homeAddress}
            placeholder="eg 123, Main Street, Lagos"
            wrapperClassName="mb-6"
            errorMessage={errors.homeAddress?.message}
          />
        )}
      />

      <TitleWithHR title="Upload Pictures" className="mb-6" />
      <article className="mb-6">
        <span className="mb-2 font-medium text-grey6 text-sm block">
          Please upload up to 3 different pictures of yourself. Any additional
          images will be removed automatically.{" "}
        </span>
        <NewImagePreview
          format="multiple"
          name="files"
          files={files}
          setFiles={setFiles}
          selectedPhoto={selectedPhoto as SelectedImagePreview}
          setSelectedPhoto={setSelectedPhoto}
          fileType="image"
          maxFileNumber={3}
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

export default LoanInfoForm;
