import { $requestWithToken } from "@/api/general";
import { IUser } from "@/interface/user";
import { useLocalStore } from "@/store/state/localStore";
import { useSession } from "next-auth/react";
import React, { useCallback } from "react";

export const useUser = () => {
  const { data, status, update } = useSession();
  const { user, updateUser } = useLocalStore();

  const handleUpdate = useCallback(
    async (userData: IUser, token?: string) => {
      // @ts-ignore
      let dataToUpdate: SessionData = {};
      if (data && data?.user?.name !== userData.fullName) {
        dataToUpdate = {
          ...data,
          user: {
            ...(data?.user as any),
            name: userData.fullName,
          },
        };
      }

      if (data && data?.user?.role !== userData.role) {
        dataToUpdate = {
          ...data,
          ...dataToUpdate,
          user: {
            ...(data?.user as any),
            ...dataToUpdate,
            role: userData.role,
          },
        };
      }

      if (data && token && data?.accessToken !== token) {
        dataToUpdate = {
          ...(data as any),
          ...dataToUpdate,
          token,
        };
      }

      if (Object.keys(dataToUpdate).length) {
        await update(dataToUpdate);
      }
      updateUser(userData);
    },
    [data, update]
  );

  const refetchUser = useCallback(async (token) => {
    try {
      const resp = await $requestWithToken.get("/users/me", token);
      if (!resp?.data) return;

      console.log("refetchUser", resp.data);
      await handleUpdate(resp.data as any, token);
    } catch (error) {
      console.error("Failed to refetch user:", error);
    }
  }, [update]);

  return {
    user: user || data?.user,
    status,
    updateUser: handleUpdate,
    token: data?.accessToken || "",
    isLoggedIn: status === "authenticated",
    refetchUser,
  };
};
