"use client";

import React from "react";
import Link from "next/link";
import Divider from "@/components/misc/Divider";
import CustomInput from "@/components/inputs/CustomInput";
import Title from "@/components/misc/Title";
import { FORGOT_PASSWORD_ROUTE, SIGN_UP_ROUTE } from "@/constants/routes";
import { formStyle } from "@/lib/authSharedStyles";
import PasswordInput from "@/components/inputs/PasswordInput";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { LoginFormSchema } from "@/store/schema/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { extractServerErrorMessage, showToaster } from "@/lib/general";
import CustomButton from "../buttons/CustomButton";
import GoogleAuthButton from "../auth/GoogleAuth";
import { AccessToken } from "../../../interface/auth";
import { useAuth } from "@/hooks/useAuth";
import { useMutation } from "@tanstack/react-query";
import { loginApi } from "@/services/auth.service";

const LoginForm = () => {
  const { login } = useAuth();

  const mutation = useMutation({
    mutationFn: loginApi,
    onSuccess: async (data) => {
      await login((data as any)?.token as AccessToken);
    },
    onError: (error) => {
      console.log('error', error)
      showToaster(extractServerErrorMessage(error) || "An error occured on login", "destructive");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof LoginFormSchema>> = async (
    data
  ) => {
    try {
      mutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className={formStyle}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Title title="Login" className="mb-6" />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <CustomInput
              {...field}
              label="Email"
              name={field.name}
              type="email"
              placeholder="Enter email"
              wrapperClassName="mb-6"
              errorMessage={errors.email?.message}
            />
          )}
        />

        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              {...field}
              name={field.name}
              label="Password"
              placeholder="Enter password"
              wrapperClassName="mb-2"
              errorMessage={errors.password?.message}
            />
          )}
        />

        <div className="mb-6">
          <Link
            href={FORGOT_PASSWORD_ROUTE}
            className="italic text-grey11 font-medium"
            prefetch
          >
            Forgot password?
          </Link>
        </div>

        <CustomButton className="w-full" loading={mutation.isPending}>
          Login
        </CustomButton>

        <div className="my-6 text-center text-greyBody">
          Don’t have an account yet?{"  "}
          <Link href={SIGN_UP_ROUTE} className="text-grey11 font-medium">
            Sign up
          </Link>
        </div>

        <Divider />
      </form>

      <div className="mt-6">
        <GoogleAuthButton buttonText="Continue with Google" />
      </div>
    </div>
  );
};

export default LoginForm;
