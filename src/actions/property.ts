"use server";

import { $requestWithToken } from "@/api/general";
import { getAuthUserToken } from "./affiliates";
import { revalidateTag } from "next/cache";
import { cleanServerData, formatServerError } from "@/lib/general";

export const updatePropertyStatus = async (
  propertyId: string,
  status: "published" | "rejected",
  reason?: string
) => {
  try {
    const token = await getAuthUserToken();
    const response = await $requestWithToken.patch(
      `/properties/status/admin/${propertyId}`,
      token,
      { status, reason }
    );
    revalidateTag("fetchProductById");
    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};
