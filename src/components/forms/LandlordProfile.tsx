"use client";

import React, { useEffect, useState, useMemo } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { useUser } from "@/hooks/useUser";
import { updateUserProfile } from "@/services/user.service";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import { LandlordProfileSchema } from "@/store/schema/landlordProfileSchema";

import type { SelectedImagePreview } from "../../../interface/image";
import type { IProfileFileInterface } from "@/interface/file";
import type { ICountry, IState } from "@/interface/location";

import CustomInput from "../inputs/CustomInput";
import SelectInput from "../inputs/SelectInput";
import PasswordInput from "../inputs/PasswordInput";
import CustomButton from "../buttons/CustomButton";
import TitleWithHR from "../misc/TitleWithHR";
import Notifications from "../profiles/Notification";
import UploadWithImageDisplay from "../files/UploadWithImageDisplay";
import Title from "../misc/Title";
import UploadedDocDisplay from "../files/UploadedDocDisplay";
import { appendFiles } from "@/lib/files";

interface LandlordProfileFormProps {
  token: string;
  country: ICountry;
}

type FormData = z.infer<typeof LandlordProfileSchema>;

const LandlordProfileForm: React.FC<LandlordProfileFormProps> = ({
  token,
  country,
}) => {
  const { user, refetchUser } = useUser();

  const [contractApprovalFile, setContractApprovalFile] = useState<File[]>();
  const [idCardFile, setIdCardFile] = useState<File[]>();
  const [passportFile, setPassportFile] = useState<File[]>();
  const [powerOfAttorneyFile, setPowerOfAttorneyFile] = useState<File[]>();
  const [selectedPhoto, setSelectedPhoto] =
    useState<SelectedImagePreview | null>(null);

  const [uploadedPowerOfAttorneyFiles, setUploadedPowerOfAttorneyFiles] =
    useState<IProfileFileInterface[]>([]);
  const [uploadedContractApprovalFiles, setUploadedContractApprovalFiles] =
    useState<IProfileFileInterface[]>([]);
  const [uploadedIdCardFiles, setUploadedIdCardFiles] = useState<
    IProfileFileInterface[]
  >([]);

  const [stateOfResidence, setStateOfResidence] = useState<IState>();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(LandlordProfileSchema),
    defaultValues: {
      email: "",
      password: "",
      oldPassword: "",
      phoneNumber: "",
      confirmPassword: "",
      fullName: "",
      businessName: "",
      businessRegNo: "",
      businessAddress: "",
      stateOfResidence: "",
      cityOfResidence: "",
      homeAddress: "",
      nin: "",
      nationality: "",
      stateOfOrigin: "",
    },
  });

  const nationalityValue = watch("nationality");

  // Mutation for profile update
  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      refetchUser(token);
      showToaster("Profile updated successfully", "success");
    },
    onError: (error) => {
      console.log("error", error);
      const errorMessage =
        extractServerErrorMessage(error) || "An error occurred";

      showToaster(errorMessage, "destructive");
    },
  });

  const statesOfOrigin = useMemo(() => {
    if (!nationalityValue) return [];
    const ctry = [country].find((c) => String(c.id) === nationalityValue);
    return ctry?.states || [];
  }, [nationalityValue, country]);

  const statesOfResidence = useMemo(() => {
    const nigeria = [country].find((c) => c.name.includes("Nigeria"));
    return nigeria?.states || [];
  }, [country]);

  const citiesOfResidence = useMemo(() => {
    if (!stateOfResidence) return [];
    return stateOfResidence.cities || [];
  }, [stateOfResidence]);

  useEffect(() => {
    if (!user) return;

    const setFormValues = () => {
      setValue("email", user.email || "");
      setValue("fullName", user.fullName || "");
      setValue("phoneNumber", user.phoneNumber || "");
      setValue("stateOfResidence", user.stateOfResidence || "");
      setValue("cityOfResidence", user.cityOfResidence || "");
      setValue("homeAddress", user.homeAddress || "");
      setValue("businessName", user.businessName || "");
      setValue("businessRegNo", user.businessRegNo || "");
      setValue("businessAddress", user.businessAddress || "");
      setValue("nin", user.nin || "");
      setValue("nationality", user.nationality || "");
      setValue("stateOfOrigin", user.stateOfOrigin || "");
    };

    setFormValues();
  }, [user, setValue]);

  useEffect(() => {
    if (!user) return;

    const files = user.profileFiles || [];

    setUploadedPowerOfAttorneyFiles(
      files.filter((file) => file.fileCategory === "power_of_attorney")
    );
    setUploadedIdCardFiles(
      files.filter((file) => file.fileCategory === "id_card")
    );
    setUploadedContractApprovalFiles(
      files.filter((file) => file.fileCategory === "approval_agreement")
    );
  }, [user]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    if (!user) return;

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value) formData.append(key, value);
    });

    appendFiles(formData, contractApprovalFile, "approvalAgreement");
    appendFiles(formData, idCardFile, "identificationCard");
    appendFiles(formData, powerOfAttorneyFile, "powerOfAttorney");

    try {
      await mutation.mutateAsync({ token, formData });
    } catch (error) {
      console.error("Profile update error:", error);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-medium text-xl text-black">Profile</h1>

      <div className="p-10 w-full bg-white md:max-w-[1200px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Personal Info Section */}
          <section>
            <TitleWithHR title="Personal Info" className="mb-6 text-left" />

            <div className="md:flex gap-6">
              <Controller
                name="fullName"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    label="Full name"
                    type="text"
                    placeholder="Enter name"
                    wrapperClassName="mb-6 md:w-1/2"
                    errorMessage={errors.fullName?.message}
                  />
                )}
              />
              <Controller
                name="nin"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    label="NIN"
                    type="text"
                    placeholder="Enter National Identity Number"
                    wrapperClassName="mb-6 md:w-1/2"
                    errorMessage={errors.nin?.message}
                  />
                )}
              />
            </div>

            <div className="md:flex gap-6">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <CustomInput
                    {...field}
                    label="Email"
                    type="email"
                    disabled
                    placeholder="Enter email"
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
                    label="Phone number"
                    type="tel"
                    placeholder="Enter phone number"
                    wrapperClassName="mb-6 md:w-1/2"
                    errorMessage={errors.phoneNumber?.message}
                  />
                )}
              />
            </div>

            <div className="md:flex gap-6">
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    formLabel="Nationality"
                    placeholder="Select your country"
                    value={field.value || ""}
                    options={[country].map((country) => ({
                      label: country.name,
                      value: String(country.id),
                    }))}
                    onValueChange={field.onChange}
                    wrapperClassName="mb-6 w-full"
                  />
                )}
              />
              <Controller
                name="stateOfOrigin"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    formLabel="State Of Origin"
                    placeholder="Select your state"
                    value={field.value || ""}
                    options={statesOfOrigin.map((state) => ({
                      label: state.name,
                      value: state.id,
                    }))}
                    disabled={!nationalityValue}
                    onValueChange={field.onChange}
                    wrapperClassName="mb-6 w-full"
                  />
                )}
              />
            </div>
          </section>

          {/* Document Upload Sections */}
          <section>
            <TitleWithHR title="Approval Agreement Upload" className="mb-6" />
            <UploadedDocDisplay
              uploadedFiles={uploadedContractApprovalFiles}
              files={contractApprovalFile}
              setFiles={setContractApprovalFile}
              token={token}
            />

            <TitleWithHR
              title="Upload means of Identification"
              className="mb-6"
            />
            <UploadedDocDisplay
              uploadedFiles={uploadedIdCardFiles}
              files={idCardFile}
              setFiles={setIdCardFile}
              token={token}
            />

            <TitleWithHR title="Upload Power of Attorney" className="mb-6" />
            <UploadedDocDisplay
              uploadedFiles={uploadedPowerOfAttorneyFiles}
              files={powerOfAttorneyFile}
              setFiles={setPowerOfAttorneyFile}
              token={token}
            />

            <Title
              title="Upload a passport or picture of you here"
              className="text-left mb-6"
            />
            <UploadWithImageDisplay
              fileType="image"
              format="single"
              files={passportFile}
              setFiles={setPassportFile}
              wrapperClass="mb-6"
              name="files"
              selectedPhoto={selectedPhoto as SelectedImagePreview}
              setSelectedPhoto={setSelectedPhoto}
              existingImages={null}
            />
          </section>

          {/* Business Info Section */}
          <section>
            <TitleWithHR title="Business Info" className="mb-6" />

            <Controller
              name="businessName"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Business Name"
                  type="text"
                  placeholder="Enter Business Name"
                  wrapperClassName="mb-6"
                  errorMessage={errors.businessName?.message}
                />
              )}
            />

            <Controller
              name="businessRegNo"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Business Registration Number"
                  type="text"
                  placeholder="Enter Business Registration Number"
                  wrapperClassName="mb-6"
                  errorMessage={errors.businessRegNo?.message}
                />
              )}
            />

            <Controller
              name="businessAddress"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Business Address"
                  type="text"
                  placeholder="Enter Business Address"
                  wrapperClassName="mb-6"
                  errorMessage={errors.businessAddress?.message}
                />
              )}
            />
          </section>

          {/* Address Section */}
          <section>
            <TitleWithHR title="Address Details" className="mb-6" />

            <div className="md:flex gap-6">
              <Controller
                name="stateOfResidence"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    formLabel="State"
                    placeholder="Select your state"
                    value={field.value || ""}
                    options={statesOfResidence.map((state) => ({
                      label: state.name,
                      value: state.id,
                    }))}
                    onValueChange={(value) => {
                      const selectedState = statesOfResidence.find(
                        (state) => state.id === value
                      );
                      setStateOfResidence(selectedState);
                      field.onChange(value);
                    }}
                    wrapperClassName="mb-6 md:w-1/2"
                    errorMessage={errors.stateOfResidence?.message}
                  />
                )}
              />
              <Controller
                name="cityOfResidence"
                control={control}
                render={({ field }) => (
                  <SelectInput
                    {...field}
                    formLabel="City"
                    placeholder="Select your city"
                    value={field.value || ""}
                    options={citiesOfResidence.map((city) => ({
                      label: city.name,
                      value: String(city.id),
                    }))}
                    onValueChange={field.onChange}
                    wrapperClassName="mb-6 md:w-1/2"
                    errorMessage={errors.cityOfResidence?.message}
                  />
                )}
              />
            </div>
          </section>

          {/* Password Section */}
          <section>
            <TitleWithHR title="Change Password" className="mb-6" />

            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  label="Old Password"
                  placeholder="Enter old password"
                  wrapperClassName="mb-6"
                  errorMessage={errors.oldPassword?.message}
                />
              )}
            />
            <div className="md:flex gap-6 mb-6">
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="Password"
                    placeholder="Enter password"
                    wrapperClassName="mb-2 md:w-1/2"
                    errorMessage={errors.password?.message}
                  />
                )}
              />
              <Controller
                name="confirmPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="Confirm Password"
                    placeholder="Confirm password"
                    wrapperClassName="mb-2 md:w-1/2"
                    errorMessage={errors.confirmPassword?.message}
                  />
                )}
              />
            </div>
          </section>

          {/* Notifications Section */}
          <section>
            <TitleWithHR title="Notifications" className="mb-6" />
            <Notifications />
          </section>

          {/* Form Actions */}
          <div className="flex justify-end gap-4 mt-10">
            <CustomButton type="reset" variant="tertiary">
              Cancel
            </CustomButton>
            <CustomButton
              type="submit"
              loading={isSubmitting || mutation.isPending}
            >
              Save
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LandlordProfileForm;
