"use client";

import { useLocalGoogleAuth } from "@/hooks/useLocalGoogleAuth";
import { useAuth } from "@/hooks/useAuth";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import React from "react";
import Spinner from "../misc/Spinner";

const GoogleOneTapLogin = () => {
  const { handleSuccess, loading: localLoading } = useLocalGoogleAuth();
  const { loading: authLoading } = useAuth();

  return (
    <React.Fragment>
      <div className="hidden">
        <GoogleOAuthProvider
          clientId={
            process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
            "371862489277-c0dn1o237h49k6qckj463q41gmgbfv8h.apps.googleusercontent.com"
          }
        >
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => {
              console.log("Login Failed");
            }}
            useOneTap
          />
        </GoogleOAuthProvider>
      </div>
      {(localLoading || authLoading) && <Spinner />}
    </React.Fragment>
  );
};

export default GoogleOneTapLogin;
