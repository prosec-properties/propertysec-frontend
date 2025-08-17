"use client";

import React, { useState } from "react";
import PasswordInput from "../inputs/PasswordInput";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import CustomInput from "../inputs/CustomInput";
import TitleWithHR from "../misc/TitleWithHR";
import UploadFile from "../files/UploadFile";
import SelectInput from "../inputs/SelectInput";
import { userRoles } from "@/store/data/user";
import { zodResolver } from "@hookform/resolvers/zod";
import { BuyerProfileSchema } from "@/store/schema/buyerProfileSchema";
import TextArea from "../inputs/TextArea";
import Title from "../misc/Title";
import Notifications from "../profiles/Notification";
import CustomButton from "../buttons/CustomButton";
import UploadWithImageDisplay from "../files/UploadWithImageDisplay";
import { $requestWithToken } from "@/api/general";
import { useSession } from "next-auth/react";
import { showToaster } from "@/lib/general";
import { z } from "zod";
import { SelectedImagePreview } from "../../../interface/image";

const BuyerProfileForm = () => {
  const { data, update: updateSession } = useSession();
  const [files, setFiles] = useState<File[]>();
  const [IdCardFile, setIdCardFile] = useState<File[]>();
  const [selectedPhoto, setSelectedPhoto] = useState<SelectedImagePreview | null>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm({
    resolver: zodResolver(BuyerProfileSchema),
    defaultValues: {
      email: "",
      password: "",
      oldPassword: "",
      phoneNumber: "",
      confirmPassword: "",
      fullName: "",

      nationality: "",
      stateOfResidence: "",
      cityOfResidence: "",
      homeAddress: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof BuyerProfileSchema>> = async (
    payload
  ) => {
    if (!data || !data?.user || !data?.accessToken) return;

    if (!files || files.length === 0) {
      showToaster(
        "Please add at least one image of the property",
        "destructive"
      );
      return;
    }

    const formData = new FormData();

    // Append other form fields
    Object.keys(payload).forEach((key) => {
      formData.append(key, payload[key]);
    });

    // Append files to the FormData as an array
    files.forEach((file) => {
      formData.append("files[]", file);
    });

    console.log("formData", formData.getAll("files[]"));

    try {
      const response = await $requestWithToken.postFormData(
        "/properties",
        data.accessToken,
        formData
      );

      console.log("response", response);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <>
      <h1 className="font-medium text-xl text-black mb-6">Profile</h1>

      <div
        className={`p-10 w-full bg-white  md:basis-[80%]"md:max-w-[1200px] `}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <TitleWithHR title="Personal Info" className="mb-6 text-left" />

          <Controller
            name="fullName"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Full name"
                name={field.name}
                type="text"
                placeholder="Enter name"
                wrapperClassName="mb-6"
                errorMessage={errors.fullName?.message}
              />
            )}
          />

          <Controller
            name="nationality"
            control={control}
            render={({ field }) => (
              <SelectInput
                inputProps={{ ...field }}
                name={field.name}
                formLabel="Nationality"
                placeholder="Select your country"
                value={field.value || ""}
                options={userRoles}
                onValueChange={(value) => {
                  console.log("value", value);
                  field.onChange(value);
                }}
                wrapperClassName="mb-6 w-full"
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
                  label="Email"
                  name={field.name}
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
                  name={field.name}
                  type="tel"
                  placeholder="Enter phone number"
                  wrapperClassName="mb-6 md:w-1/2"
                  errorMessage={errors.phoneNumber?.message}
                />
              )}
            />
          </article>

          <TitleWithHR title="Address Details" className="mb-6" />

          <article className="md:flex gap-6">
            <Controller
              name="stateOfResidence"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="State"
                  name={field.name}
                  type="text"
                  placeholder="Enter State"
                  wrapperClassName="mb-6 md:w-1/2"
                  errorMessage={errors.stateOfResidence?.message}
                />
              )}
            />
            <Controller
              name="cityOfResidence"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="City"
                  name={field.name}
                  type="text"
                  placeholder="Enter City"
                  wrapperClassName="mb-6 md:w-1/2"
                  errorMessage={errors.cityOfResidence?.message}
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
                label="Full Address"
                name={field.name}
                placeholder="Enter your full address"
                wrapperClassName="mb-6"
                errorMessage={errors.homeAddress?.message}
              />
            )}
          />

          <TitleWithHR
            title="Upload means of Identification"
            className="mb-6"
          />
          <UploadFile
            wrapperClass="mb-6"
            files={IdCardFile}
            setFiles={setIdCardFile}
          />

          <Title
            title="Upload a passport or picture of you here"
            className="text-left mb-6"
          />
          <UploadWithImageDisplay
            fileType="image"
            format="single"
            files={files}
            setFiles={setFiles}
            wrapperClass="mb-6"
            name="files"
            selectedPhoto={selectedPhoto as SelectedImagePreview}
            setSelectedPhoto={setSelectedPhoto}
            existingImages={null}
          />

          <TitleWithHR title="Change Password" className="mb-6" />

          <Controller
            name="oldPassword"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Old Password"
                name={field.name}
                type="password"
                placeholder="Enter old password"
                wrapperClassName="mb-6"
                errorMessage={errors.oldPassword?.message}
              />
            )}
          />
          <article className="md:flex gap-6 mb-6">
            <Controller
              name="password"
              control={control}
              render={({ field }) => (
                <PasswordInput
                  {...field}
                  name={field.name}
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
                  name={field.name}
                  label="Confirm Password"
                  placeholder="Confirm password"
                  wrapperClassName="mb-2 md:w-1/2"
                  errorMessage={errors.confirmPassword?.message}
                />
              )}
            />
          </article>

          <TitleWithHR title="Notifications" className="mb-6" />
          <Notifications />

          <article className="flex justify-end gap-4 mt-10">
            <CustomButton type="reset" variant="tertiary">
              Cancel
            </CustomButton>

            <CustomButton type="submit" loading={isSubmitting}>
              Save
            </CustomButton>
          </article>
        </form>
      </div>
    </>
  );
};

export default BuyerProfileForm;
