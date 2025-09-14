"use client";

import { $requestWithoutToken } from "@/app/api";
import { COMPLETE_PROFILE_ROUTE } from "@/constants/routes";
import { showToaster } from "@/lib/general";
import { CredentialResponse, TokenResponse } from "@react-oauth/google";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAuth } from "./useAuth";
import { useLocalStore } from "@/store/state/localStore";
import { IUser } from "@/interface/user";
import { AccessToken } from "@/interface/auth";

export const useLocalGoogleAuth = () => {
  const { push } = useRouter();
  const { login } = useAuth();
  const pathname = usePathname();
  const { setUser } = useLocalStore();
  const [loading, setLoading] = useState(false);

  const handleError = useCallback(async () => {
    console.log("error");
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

        const data: any = await $requestWithoutToken.get(
          `/auth/google/callback?${params.toString()}`
        );

        console.log("Google callback response data:", data);

        if (!data || !data.success) {
          console.log("Google callback failed or returned unsuccessful response");
          showToaster("Google login failed", "destructive");
          handleError();
          return;
        }

        if (!data.user) {
          console.log("No user in response data");
          showToaster("User not found", "destructive");
          return;
        }

        const user = data.user as IUser;
        console.log("User found:", user);
        console.log("isNew:", data.isNew);
        console.log("hasCompletedRegistration:", user.hasCompletedRegistration);

        const queries = new URLSearchParams({
          email: user.email,
        });

        console.log("Checking condition: data.isNew =", data.isNew, "|| !data.user.hasCompletedRegistration =", !user.hasCompletedRegistration);

        if (data.isNew || !user.hasCompletedRegistration) {
          console.log("Redirecting to complete profile");
          push(`${COMPLETE_PROFILE_ROUTE}?${queries.toString()}`);
          return;
        }

        setUser(user);

        console.log('token at 72', data)

        if (!data.token) {
          showToaster("Token not found", "destructive");
          return;
        }

        console.log("token", data);

        await login(data?.token as AccessToken);
      } catch (error) {
        console.log(error);
        handleError();
      }
    },
    [handleError, login, push, setUser]
  );

  return { handleSuccess, handleError };
};
