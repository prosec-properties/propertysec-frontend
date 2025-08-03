"use server";

import { $requestWithToken } from "@/api/general";
import { authConfig } from "@/authConfig";
import { cleanServerData, formatServerError } from "@/lib/general";
import { getServerSession } from "next-auth";

export const getUserSettings = async () => {
  try {
    const session = await getServerSession(authConfig);

    if (!session || !session.user || !session.user) {
      throw new Error("Unauthorized");
    }

    const user = session.user!;

    const response = await $requestWithToken.get(`/settings`, user.token || "");

    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};

export const updateUserSettings = async (data: any) => {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user || !session.user) {
      throw new Error("Unauthorized");
    }
    const user = session.user!;
    const response = await $requestWithToken.patch(
      `/settings`,
      user.token || "",
      data
    );
    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};
