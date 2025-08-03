"use client";

import React from "react";
import Title from "@/components/misc/Title";
import { formStyle } from "@/lib/authSharedStyles";
import CustomButton from "../buttons/CustomButton";
import { FORGOT_PASSWORD_ROUTE, SIGN_IN_ROUTE } from "@/constants/routes";
import { showToaster, extractServerErrorMessage } from "@/lib/general";
import { useRouter } from "next/navigation";
import PasswordInput from "../inputs/PasswordInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { PasswordSchema } from "@/store/schema/passwordSchema";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { resetPasswordApi } from "@/services/auth.service";

interface Props {
  token: string;
  email: string;
}

const ResetPasswordForm = (props: Props) => {
  const { push } = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(PasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const mutation = useMutation({
    mutationFn: resetPasswordApi,
    onSuccess: (api) => {
      showToaster(
        "Your password has been reset successfully! You can now log in with your new password.",
        "success"
      );

      push(SIGN_IN_ROUTE);
    },
    onError: (error) => {
      const errorMsg = extractServerErrorMessage(error);

      if (errorMsg?.includes("expired")) {
        showToaster(
          "The link has expired. Please request a new password reset link.",
          "destructive"
        );
        push(FORGOT_PASSWORD_ROUTE);
        return;
      }

      showToaster(extractServerErrorMessage(error), "destructive");
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof PasswordSchema>> = (data) => {
    mutation.mutate({
      email: props.email,
      token: props.token,
      password: data.password,
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formStyle}>
      <Title title="Reset password" className="mb-6" />
      <p className="text-center font-medium mb-8 text-greyBody">
        Please note, this link will expire in 20 minutes if you do not reset
        your password.{" "}
      </p>

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordInput
            {...field}
            label="New password"
            placeholder="Enter new password"
            errorMessage={errors.password?.message}
            wrapperClassName="mb-8"
          />
        )}
      />

      <Controller
        name="confirmPassword"
        control={control}
        render={({ field }) => (
          <PasswordInput
            {...field}
            label="Re-enter password"
            placeholder="Re-enter new password"
            errorMessage={errors.confirmPassword?.message}
            wrapperClassName="mb-8"
          />
        )}
      />

      <CustomButton className="w-full mb-6" loading={mutation.isPending}>
        Send
      </CustomButton>
    </form>
  );
};

export default ResetPasswordForm;
