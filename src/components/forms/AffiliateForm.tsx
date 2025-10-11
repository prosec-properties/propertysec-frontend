"use client";

import React, { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";

import { useUser } from "@/hooks/useUser";
import {  updateUserProfile } from "@/services/user.service";
import { extractServerErrorMessage, showToaster } from "@/lib/general";

import type { SelectedImagePreview } from "../../../interface/image";
import type { IProfileFileInterface } from "@/interface/file";
import type { ICountry } from "@/interface/location";
import type { IUser } from "@/interface/user";

import CustomInput from "../inputs/CustomInput";
import PasswordInput from "../inputs/PasswordInput";
import CustomButton from "../buttons/CustomButton";
import TitleWithHR from "../misc/TitleWithHR";
import Notifications from "../profiles/Notification";
import UploadWithImageDisplay from "../files/UploadWithImageDisplay";
import Title from "../misc/Title";
import { AffiliateProfileSchema } from "@/store/schema/affiliateProfileSchema";
import UploadedDocDisplay from "../files/UploadedDocDisplay";

interface Props {
  token: string;
  countries: ICountry[];
}

type FormData = z.infer<typeof AffiliateProfileSchema>;

const AffiliateProfileForm: React.FC<Props> = ({ token }) => {
  const { user, updateUser } = useUser();

  const [idCardFile, setIdCardFile] = useState<File[]>();
  const [passportFile, setPassportFile] = useState<File[]>();
  const [selectedPhoto, setSelectedPhoto] =
    useState<SelectedImagePreview | null>(null);

  const [uploadedIdCardFiles, setUploadedIdCardFiles] = useState<
    IProfileFileInterface[]
  >([]);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    resolver: zodResolver(AffiliateProfileSchema),
    defaultValues: {
      email: "",
      password: "",
      oldPassword: "",
      phoneNumber: "",
      confirmPassword: "",
      fullName: "",
      aboutBusiness: "",
      businessAddress: "",
      nin: "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      console.log("user", data?.data);
      if (!data?.data) return;

      const userInfo = {
        ...user,
        ...data?.data,
      };
      updateUser(userInfo as IUser, token);
      showToaster("Profile updated successfully", "success");
    },
    onError: (error) => {
      const errorMessage =
        extractServerErrorMessage(error) || "An error occurred";
      showToaster(errorMessage, "destructive");
    },
  });

  useEffect(() => {
    if (!user) return;

    const setFormValues = () => {
      setValue("email", user.email || "");
      setValue("fullName", user.fullName || "");
      setValue("phoneNumber", user.phoneNumber || "");
      setValue("businessAddress", user.businessAddress || "");
      setValue("nin", user.nin || "");
    };

    setFormValues();
  }, [user, setValue]);

  useEffect(() => {
    if (!user) return;

    const files = user.profileFiles || [];

    setUploadedIdCardFiles(
      files.filter((file) => file.fileCategory === "id_card")
    );
    const passportFiles = files.filter(
      (file) => file.fileCategory === "profile_image"
    );
    if (passportFiles.length > 0) {
      setSelectedPhoto({
        fileName: passportFiles[0].fileName,
        image: {
          url: passportFiles[0].fileUrl,
          name: passportFiles[0].fileName,
          file: new File([new Blob()], passportFiles[0].fileName, {
            type: "image/jpeg",
          }),
        },
      });
    }
  }, [user]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    if (!user) return;

    const formData = new FormData();

    Object.entries(payload).forEach(([key, value]) => {
      if (value) {
        if (key === "aboutBusiness") {
          formData.append("meta", JSON.stringify({ aboutBusiness: value }));
        } else {
          formData.append(key, value);
        }
      }
    });

    const appendFiles = (files: File[] | undefined, fieldName: string) => {
      if (files) {
        files.forEach((file) => formData.append(`${fieldName}[]`, file));
      }
    };

    appendFiles(idCardFile, "identificationCard");
    appendFiles(passportFile, "profileImage");

    try {
      await mutation.mutateAsync({ token, formData });
    } catch (error) {
      console.error("Profile update error:", error);
      throw error;
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
                    wrapperClassName="mb-6 w-full"
                    errorMessage={errors.fullName?.message}
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
          </section>

          {/* Document Upload Sections */}
          <section>
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
              name="nin"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="NIN"
                  type="text"
                  placeholder="Enter National Identity Number"
                  wrapperClassName="mb-6 md:w-full"
                  errorMessage={errors.nin?.message}
                />
              )}
            />

            <Controller
              name="aboutBusiness"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="About Business"
                  type="text"
                  placeholder="Say something about your Business"
                  wrapperClassName="mb-6"
                  errorMessage={errors.aboutBusiness?.message}
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
                  placeholder="Where is your business located?"
                  wrapperClassName="mb-6"
                  errorMessage={errors.businessAddress?.message}
                />
              )}
            />
          </section>

          {/* Password Section */}
          <section>
            <TitleWithHR title="Change Password" className="mb-6" />

            <Controller
              name="oldPassword"
              control={control}
              render={({ field }) => (
                <CustomInput
                  {...field}
                  label="Old Password"
                  type="password"
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

export default AffiliateProfileForm;
