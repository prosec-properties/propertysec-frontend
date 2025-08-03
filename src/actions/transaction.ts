"use server";

import { $requestWithToken } from "@/api/general";
import { getAuthUserToken } from "./affiliates";
import { revalidateTag } from "next/cache";
import { cleanServerData, formatServerError } from "@/lib/general";

export const verifyTransaction = async (
  payload: {
    reference: string;
    planId?: string;
  },
  tag?: string
) => {
  try {
    const token = await getAuthUserToken();
    const response = await $requestWithToken.post(
      `/transactions`,
      token,
      payload
    );

    if (tag) {
      revalidateTag(tag);
    }

    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};
