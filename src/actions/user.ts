"use server";

import { $requestWithToken } from "@/api/general";
import { getAuthUserToken } from "./affiliates";
import { revalidateTag } from "next/cache";
import { cleanServerData, formatServerError, handleServerError } from "@/lib/general";

export const approveBuyerAccount = async (id: string) => {
  try {
    const token = await getAuthUserToken();
    const response = await $requestWithToken.post(
      `/users/buyer/approve/${id}`,
      token,
    );
    revalidateTag("fetchUserById");
    return cleanServerData(response);
  } catch (error) {
    return handleServerError(error);
  }
};

export const unapproveBuyerAccount = async (id: string) => {
    try {
      const token = await getAuthUserToken();
      const response = await $requestWithToken.post(
        `/users/buyer/reject/${id}`,
        token,
      );
      revalidateTag("fetchUserById");
      return cleanServerData(response);
    } catch (error) {
      return formatServerError(error);
    }
  };
