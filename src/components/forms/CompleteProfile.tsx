"use client";

import React from "react";
import CustomButton from "../buttons/CustomButton";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import Title from "../misc/Title";
import SelectInput from "../inputs/SelectInput";
import { formStyle } from "@/lib/authSharedStyles";
import {
  backendValidationError,
  extractServerErrorMessage,
  showToaster,
} from "@/lib/general";
import { CompleteProfileSchema } from "@/store/schema/auth";
import { z } from "zod";
import CustomInput from "../inputs/CustomInput";
import { userRoles } from "@/store/data/user";
import { useAuth } from "@/hooks/useAuth";
import { IUserRole } from "@/interface/user";
import { useMutation } from "@tanstack/react-query";
import { completeRegisterionApi } from "@/services/auth.service";
import { AccessToken } from "@/interface/auth";

interface Props {
  email: string;
}
const CompleteProfile = (props: Props) => {
  const { login } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(CompleteProfileSchema),
    defaultValues: {
      phoneNumber: "",
      role: "" as IUserRole,
    },
  });

  const mutation = useMutation({
    mutationFn: completeRegisterionApi,
    onSuccess: (data) => {
      console.log("data", data);
      login(data?.data as AccessToken);
    },
    onError: (error) => {
      console.log("error", error);
      showToaster(extractServerErrorMessage(error), "destructive");
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof CompleteProfileSchema>> = async (
    data
  ) => {
    try {
      const formData = new FormData();
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("role", data.role);
      formData.append("email", props.email);
      mutation.mutateAsync({ formData });
    } catch (error) {
      console.log("error", error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formStyle}>
      <Title title="Please Fill the Required Fields" className="mb-6" />

      <Controller
        name="role"
        control={control}
        render={({ field }) => (
          <SelectInput
            inputProps={{ ...field }}
            name={field.name}
            formLabel="Role"
            placeholder="Select your role"
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
            wrapperClassName="mb-6"
            errorMessage={errors.phoneNumber?.message}
          />
        )}
      />

      <CustomButton
        className="w-full"
        type="submit"
        loading={mutation.isPending || isSubmitting}
      >
        Continue
      </CustomButton>
    </form>
  );
};

export default CompleteProfile;
