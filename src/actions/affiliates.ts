"use server";

import { $requestWithToken } from "@/api/general";
import { authConfig } from "@/authConfig";
import { cleanServerData, formatServerError } from "@/lib/general";
import { getServerSession } from "next-auth";
import { revalidateTag } from "next/cache";

export const getAuthUserToken = async () => {
  try {
    const session = await getServerSession(authConfig);
    if (!session || !session.user || !session.user) {
      throw new Error("Unauthorized");
    }
    const user = session.user!;
    return user?.token || "";
  } catch (error) {
    throw error;
  }
};

export const checkIfProductInShop = async (propertyId: string) => {
  try {
    const token = await getAuthUserToken();

    const response = await $requestWithToken.get(
      `/affiliates/property/` + propertyId,
      token,
      "no-cache",
      {
        tags: ["checkIfProductInShop"],
      }
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const addPropertyToShop = async (propertyId: string) => {
  try {
    const token = await getAuthUserToken();
    const response = await $requestWithToken.post(
      `/affiliates/add-to-shop/`,
      token,
      { propertyId }
    );
    revalidateTag("checkIfProductInShop");
    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};

export const removePropertyFromShop = async (propertyId: string) => {
  try {
    const token = await getAuthUserToken();
    const response = await $requestWithToken.post(
      `/affiliates/remove-from-shop/`,
      token,
      { itemId: propertyId, itemType: "property" }
    );
    revalidateTag("checkIfProductInShop");
    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};

export const getAffiliateStats = async () => {
  try {
    const token = await getAuthUserToken();
    const response = await $requestWithToken.get(
      `/affiliates/stats/`,
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};
