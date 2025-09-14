"use client";

import React from "react";
import GoogleIcon from "@/components/icons/Google";
import { useGoogleLogin } from "@react-oauth/google";
import { useLocalGoogleAuth } from "@/hooks/useLocalGoogleAuth";
import CustomButton from "./CustomButton";
import Spinner from "../misc/Spinner";

interface Props {
  text: string;
}
const GoogleButton = (props: Props) => {
  const { handleError, handleSuccess, loading } = useLocalGoogleAuth();

  const login = useGoogleLogin({
    onSuccess: handleSuccess,
    onError: handleError,
  });

  if (loading) {
    return <Spinner />;
  }

  return (
    <CustomButton
      variant="outline"
      className="w-full border-grey4 border"
      onClick={() => login()}
      type="button"
    >
      <GoogleIcon className="mr-2 h-4 w-4" /> {props.text}
    </CustomButton>
  );
};

export default GoogleButton;
