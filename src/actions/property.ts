"use server";

import { $requestWithToken } from "@/api/general";
import { getAuthUserToken } from "./affiliates";
import { revalidateTag } from "next/cache";
import { cleanServerData, formatServerError } from "@/lib/general";

interface RevalidatePropertyParams {
  propertyId?: string;
  includeList?: boolean;
  includeMyProperties?: boolean;
}

export const revalidatePropertyData = async ({
  propertyId,
  includeList = true,
  includeMyProperties = true,
}: RevalidatePropertyParams = {}) => {
  if (includeList) {
    revalidateTag("properties");
  }

  if (includeMyProperties) {
    revalidateTag("my-properties");
  }

  if (propertyId) {
    revalidateTag(`property-${propertyId}`);
    revalidateTag(`product-${propertyId}`);
  }
};

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
    await revalidatePropertyData({ propertyId });
    return cleanServerData(response);
  } catch (error) {
    return formatServerError(error);
  }
};
