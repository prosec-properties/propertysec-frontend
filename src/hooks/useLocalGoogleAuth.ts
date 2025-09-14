"use client";

import { COMPLETE_PROFILE_ROUTE } from "@/constants/routes";
import { showToaster } from "@/lib/general";
import { CredentialResponse, TokenResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { useLocalStore } from "@/store/state/localStore";
import { IUser } from "@/interface/user";
import { AccessToken } from "@/interface/auth";
import { googleAuthCallbackApi } from "@/services/auth.service";

export const useLocalGoogleAuth = () => {
  const { push } = useRouter();
  const { login } = useAuth();
  const { setUser } = useLocalStore();
  const [loading, setLoading] = useState(false);

  const handleError = useCallback(async () => {
    setLoading(false);
  }, []);

  const handleSuccess = useCallback(
    async (
      response:
        | CredentialResponse
        | Omit<TokenResponse, "error" | "error_description" | "error_uri">
    ) => {
      try {
        setLoading(true);
        const paramObject: any = {};
        if ("credential" in response) {
          paramObject.credential = response.credential;
        }
        if ("access_token" in response) {
          paramObject.accessToken = response.access_token;
        }

        const params = new URLSearchParams(paramObject);

        const data = await googleAuthCallbackApi(params.toString());

        if (!data || !data.success) {
          showToaster("Google login failed", "destructive");
          handleError();
          return;
        }

        if (!data?.data?.user) {
          showToaster("User not found", "destructive");
          return;
        }

        const user = data?.data?.user as IUser;
        const queries = new URLSearchParams({
          email: user.email,
        });

        if (data?.data?.isNew || !user.hasCompletedRegistration) {
          push(`${COMPLETE_PROFILE_ROUTE}?${queries.toString()}`);
          return;
        }

        setUser(user);

        if (!data?.data?.token) {
          showToaster("Token not found", "destructive");
          return;
        }

        await login(data?.data?.token as AccessToken);
        setLoading(false);
      } catch (error) {
        console.log("errorr", error);
        handleError();
      }
    },
    [handleError, login, push, setUser]
  );

  return { handleSuccess, handleError, loading };
};
