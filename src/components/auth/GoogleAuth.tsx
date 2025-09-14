"use client";

import { GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import GoogleButton from "../buttons/GoogleButton";

interface Props {
  buttonText: string;
}
const GoogleAuthProvider = (props: Props) => {
  // console.log("env", process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID);
  return (
    <GoogleOAuthProvider
      clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "371862489277-c0dn1o237h49k6qckj463q41gmgbfv8h.apps.googleusercontent.com"}
    >
      <GoogleButton text={props.buttonText} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuthProvider;
