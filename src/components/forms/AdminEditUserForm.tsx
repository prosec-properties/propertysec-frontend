"use client";

import React from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import { adminUpdateUser } from "@/services/user.service";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import type { IUser } from "@/interface/user";

import CustomInput from "../inputs/CustomInput";
import CustomButton from "../buttons/CustomButton";
import TitleWithHR from "../misc/TitleWithHR";

type FormData = {
  fullName: string;
  phoneNumber?: string;
  nin?: string;
  bvn?: string;
  stateOfResidence?: string;
  nationality?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  businessName?: string;
  businessRegNo?: string;
  businessAddress?: string;
  cityOfResidence?: string;
  homeAddress?: string;
  stateOfOrigin?: string;
  nextOfKin?: string;
  religion?: string;
  monthlySalary?: number;
  bankName?: string;
};

interface Props {
  user: IUser;
  token: string;
  onSuccess: () => void;
  onCancel: () => void;
}

const AdminEditUserForm: React.FC<Props> = ({ user, token, onSuccess, onCancel }) => {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      fullName: user.fullName || "",
      phoneNumber: user.phoneNumber || "",
      nin: user.nin || "",
      bvn: user.bvn || "",
      stateOfResidence: user.stateOfResidence || "",
      nationality: user.nationality || "",
      bankAccountNumber: user.bankAccountNumber || "",
      bankAccountName: user.bankAccountName || "",
      businessName: user.businessName || "",
      businessRegNo: user.businessRegNo || "",
      businessAddress: user.businessAddress || "",
      cityOfResidence: user.cityOfResidence || "",
      homeAddress: user.homeAddress || "",
      stateOfOrigin: user.stateOfOrigin || "",
      nextOfKin: user.nextOfKinName || "",
      religion: user.religion || "",
      monthlySalary: user.monthlySalary || undefined,
      bankName: user.bankName || "",
    },
  });

  const mutation = useMutation({
    mutationFn: adminUpdateUser,
    onSuccess: (data) => {
      if (data?.success) {
        showToaster("User updated successfully", "success");
        onSuccess();
      } else {
        showToaster("Failed to update user", "destructive");
      }
    },
    onError: (error: any) => {
      const errorMessage = extractServerErrorMessage(error);
      showToaster(errorMessage || "Failed to update user", "destructive");
    },
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const formData = new FormData();
    
    // Add all non-empty fields to formData
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value.toString());
      }
    });

    mutation.mutate({
      userId: user.id,
      token,
      formData,
    });
  };

  return (
    <div className="p-6 max-h-[80vh] overflow-y-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <TitleWithHR title="Basic Information" className="mb-4" />
        
        <Controller
          name="fullName"
          control={control}
          rules={{ required: "Full name is required" }}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Full Name"
              type="text"
              placeholder="Enter full name"
              wrapperClassName="mb-4"
              errorMessage={errors.fullName?.message}
            />
          )}
        />

        <Controller
          name="phoneNumber"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Phone Number"
              type="text"
              placeholder="Enter phone number"
              wrapperClassName="mb-4"
              errorMessage={errors.phoneNumber?.message}
            />
          )}
        />

        <TitleWithHR title="Personal Information" className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="nin"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="NIN"
                type="text"
                placeholder="Enter NIN"
                wrapperClassName="mb-4"
                errorMessage={errors.nin?.message}
              />
            )}
          />

          <Controller
            name="bvn"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="BVN"
                type="text"
                placeholder="Enter BVN"
                wrapperClassName="mb-4"
                errorMessage={errors.bvn?.message}
              />
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="stateOfResidence"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="State of Residence"
                type="text"
                placeholder="Enter state"
                wrapperClassName="mb-4"
                errorMessage={errors.stateOfResidence?.message}
              />
            )}
          />

          <Controller
            name="nationality"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Nationality"
                type="text"
                placeholder="Enter nationality"
                wrapperClassName="mb-4"
                errorMessage={errors.nationality?.message}
              />
            )}
          />
        </div>

        <TitleWithHR title="Banking Information" className="mb-4" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Controller
            name="bankAccountNumber"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Bank Account Number"
                type="text"
                placeholder="Enter account number"
                wrapperClassName="mb-4"
                errorMessage={errors.bankAccountNumber?.message}
              />
            )}
          />

          <Controller
            name="bankAccountName"
            control={control}
            render={({ field }) => (
              <CustomInput
                {...field}
                label="Bank Account Name"
                type="text"
                placeholder="Enter account name"
                wrapperClassName="mb-4"
                errorMessage={errors.bankAccountName?.message}
              />
            )}
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <CustomButton
            type="button"
            variant="tertiary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </CustomButton>
          <CustomButton
            type="submit"
            loading={isSubmitting}
          >
            Update User
          </CustomButton>
        </div>
      </form>
    </div>
  );
};

export default AdminEditUserForm;