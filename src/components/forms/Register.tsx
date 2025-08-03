"use client";

import React from "react";
import Divider from "@/components/misc/Divider";
import CustomInput from "@/components/inputs/CustomInput";
import Title from "@/components/misc/Title";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SIGN_IN_ROUTE, VERIFY_EMAIL_ROUTE } from "@/constants/routes";
import { formStyle } from "@/lib/authSharedStyles";
import SelectInput from "@/components/inputs/SelectInput";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RegisterFormSchema } from "@/store/schema/registerSchema";
import { z } from "zod";
import {
  backendValidationError,
  extractServerErrorMessage,
  showToaster,
} from "@/lib/general";
import PasswordInput from "../inputs/PasswordInput";
import { useRouter } from "next/navigation";
import GoogleAuthButton from "../auth/GoogleAuth";
import { userRoles } from "@/store/data/user";
import CustomButton from "../buttons/CustomButton";
import { IUserRole } from "@/interface/user";
import { $requestWithoutToken } from "@/api/general";
import { useMutation } from "@tanstack/react-query";
import { register } from "@/services/auth.service";
import { useUser } from "@/hooks/useUser";
import { USER_ROLE } from "@/constants/user";
import { useLocalSearchParams } from "@/hooks/useLocalSearchParams";

type IRegisterUserField =
  | "email"
  | "password"
  | "phoneNumber"
  | "role"
  | "confirmPassword"
  | "fullName";

const RegisterForm = () => {
  const { push } = useRouter();
  const { user } = useUser();
  const { setSearchParams } = useLocalSearchParams();

  const mutation = useMutation({
    mutationFn: register,
    onSuccess: (data) => {
      // showToaster(data?.message || "Your account has been registered successfully! Confirm your email to complete your registration", "success");
      // console.log("data", data?.data);

      // push(`${VERIFY_EMAIL_ROUTE}?email=${data?.data?.email}`);
      if (user && user.role === USER_ROLE.ADMIN) {
        showToaster(
          "User account has been registered successfully!",
          "success"
        );
        setSearchParams("addedByAdmin", "true");
        return;
      }
      showToaster("Your account has been registered successfully!", "success");
      push(SIGN_IN_ROUTE);
    },
    onError: (error) => {
      console.log("error from component", error);
      showToaster(extractServerErrorMessage(error), "destructive");
    },
  });

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm({
    resolver: zodResolver(RegisterFormSchema),
    defaultValues: {
      email: "",
      password: "",
      phoneNumber: "",
      role: "" as IUserRole,
      confirmPassword: "",
      fullName: "",
    },
  });

  const onSubmit: SubmitHandler<z.infer<typeof RegisterFormSchema>> = async (
    data
  ) => {
    try {
      mutation.mutateAsync(data);
    } catch (error) {
      throw error;
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={formStyle}>
      <Title title="Sign up" className="mb-6" />

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
        name="fullName"
        control={control}
        render={({ field }) => (
          <CustomInput
            {...field}
            label="Full name"
            type="text"
            name={field.name}
            placeholder="Enter your full name"
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
              label="Email"
              name={field.name}
              type="email"
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

      <Controller
        name="password"
        control={control}
        render={({ field }) => (
          <PasswordInput
            {...field}
            name={field.name}
            label="Password"
            placeholder="Enter password"
            wrapperClassName="mb-6"
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
            placeholder="Confirm Password"
            wrapperClassName="mb-6"
            errorMessage={errors.confirmPassword?.message}
          />
        )}
      />

      <CustomButton
        className="w-full"
        type="submit"
        loading={mutation.isPending || isSubmitting}
      >
        Sign up
      </CustomButton>

      {!user && (
        <>
          <div className="my-6 text-center">
            Already have an account? {"  "}
            <Link href={SIGN_IN_ROUTE} className="text-blue-600 underline">
              Login
            </Link>
          </div>

          <Divider />

          <div className="mt-6">
            <GoogleAuthButton buttonText="Sign up with Google" />
          </div>
        </>
      )}
    </form>
  );
};

export default RegisterForm;
