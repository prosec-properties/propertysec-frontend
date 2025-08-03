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

        const res = await $requestWithoutToken.get(
          `/auth/google/callback?${params.toString()}`
        );

        if (!res.ok) {
          handleError();
          return;
        }
        const data = await res.json();

        if (!data.user) {
          showToaster("User not found", "destructive");
          return;
        }

        const user = data.user as IUser;

        const queries = new URLSearchParams({
          email: user.email,
        });

        if (data.isNew || !data.user.hasCompletedRegistration) {
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
    [handleError]
  );

  return { handleSuccess, handleError };
};
