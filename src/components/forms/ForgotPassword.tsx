"use client";

import React from "react";
import CustomInput from "@/components/inputs/CustomInput";
import Title from "@/components/misc/Title";
import { formStyle } from "@/lib/authSharedStyles";
import CustomButton from "../buttons/CustomButton";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { EmailSchema } from "@/store/schema/emailSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { $requestWithoutToken } from "@/api/general";
import { useMutation } from "@tanstack/react-query";
import { forgotPasswordApi } from "@/services/auth.service";

const ForgotPasswordForm = () => {
  const {
    formState: { errors, isValid, isSubmitting },
    handleSubmit,
    reset,
    control,
  } = useForm({
    resolver: zodResolver(EmailSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: async (data) => {
      reset();
      showToaster(
        "A password reset link has been sent to your email. Please check your inbox and follow the instructions provided to reset your password.",
        "success"
      );
      reset();
    },
    onError: (error) => {
      showToaster(extractServerErrorMessage(error), "destructive");
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof EmailSchema>> = async (data) => {
    try {
      const formData = new FormData();
      formData.append("email", data.email);
      mutation.mutateAsync({ formData });
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formStyle}>
      <Title title="Reset password" className="mb-6" />
      <p className="text-center font-medium mb-8 text-greyBody">
        Enter your email to reset password.
      </p>
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            label="Email"
            placeholder="Enter email"
            type="email"
            name={field.name}
            hideLabel={true}
            errorMessage={errors.email?.message}
            wrapperClassName="mb-8"
          />
        )}
      />

      <CustomButton
        disabled={!isValid}
        loading={isSubmitting}
        className="w-full mb-6"
      >
        Send
      </CustomButton>
    </form>
  );
};

export default ForgotPasswordForm;
