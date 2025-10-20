"use client";

import React, { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { useUser } from "@/hooks/useUser";
import { revalidateCurrentUser } from "@/actions/user";
import { updateUserProfile } from "@/services/user.service";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import type { IUser } from "@/interface/user";

import CustomInput from "../inputs/CustomInput";
import PasswordInput from "../inputs/PasswordInput";
import CustomButton from "../buttons/CustomButton";
import TitleWithHR from "../misc/TitleWithHR";

type FormData = {
  fullName: string;
  email: string;
  phoneNumber?: string;
  oldPassword?: string;
  password?: string;
  confirmPassword?: string;
};

interface Props {
  token: string;
}

const AdminProfileForm: React.FC<Props> = ({ token }) => {
  const { user, updateUser } = useUser();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
  } = useForm<FormData>({
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      oldPassword: "",
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: updateUserProfile,
    onSuccess: (data) => {
      if (!data?.data) return;
      const userInfo = {
        ...user,
        ...data?.data,
      } as IUser;
      updateUser(userInfo, token);
      revalidateCurrentUser().catch((error) => {
        console.error("Failed to revalidate user-info tag:", error);
      });
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
    setValue("email", user.email || "");
    setValue("fullName", user.fullName || "");
    setValue("phoneNumber", user.phoneNumber || "");
  }, [user, setValue]);

  const onSubmit: SubmitHandler<FormData> = async (payload) => {
    if (!user) return;

    if (payload.password && payload.password !== payload.confirmPassword) {
      showToaster("Passwords do not match", "destructive");
      return;
    }

    const formData = new FormData();
    Object.entries(payload).forEach(([key, value]) => {
      if (value) {
        formData.append(key, value as string);
      }
    });

    try {
      await mutation.mutateAsync({ token, formData });
    } catch (error) {
      // handled in mutation
      
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="font-medium text-xl text-black">Profile</h1>
      <div className="p-10 w-full bg-white md:max-w-[900px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          <section>
            <TitleWithHR title="Personal Info" className="mb-6 text-left" />

            <div className="md:flex gap-6">
              <Controller
                name="fullName"
                control={control}
                rules={{ required: "Full name is required" }}
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

          <section>
            <TitleWithHR title="Change Password (optional)" className="mb-6" />

            <div className="md:flex gap-6">
              <Controller
                name="oldPassword"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="Old Password"
                    placeholder="Enter old password"
                    wrapperClassName="mb-6 md:w-1/3"
                  />
                )}
              />
              <Controller
                name="password"
                control={control}
                render={({ field }) => (
                  <PasswordInput
                    {...field}
                    label="New Password"
                    placeholder="Enter new password"
                    wrapperClassName="mb-6 md:w-1/3"
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
                    placeholder="Confirm new password"
                    wrapperClassName="mb-6 md:w-1/3"
                  />
                )}
              />
            </div>
          </section>

          <div className="flex justify-end">
            <CustomButton
              as="button"
              type="submit"
              variant="primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Saving..." : "Save changes"}
            </CustomButton>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminProfileForm;
