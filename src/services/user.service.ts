import { $requestWithoutToken, $requestWithToken } from "@/api/general";
import { IFetchOptions } from "@/interface/general";
import { buildNextTags } from "@/lib/cacheTags";
import { IUser } from "@/interface/user";
import { safeServiceCall } from "@/lib/safeService";

export const updateUserProfile = async ({
  token,
  formData,
}: {
  token: string;
  formData: FormData;
}) => {
  try {
    const response = await $requestWithToken.putFormData(
      "/users/update-profile",
      token,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async ({
  fileId,
  token,
}: {
  fileId: string;
  token: string;
}) => {
  try {
    const response = await $requestWithToken.delete(
      `/users/delete-file/${fileId}`,
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchUserById = async (id: string) => {
  return safeServiceCall(async () => {
    const response = await $requestWithoutToken.get<IUser>(
      "/users/" + id,
      "no-cache",
      {
        tags: ["fetchUserById"],
      }
    );
    return response;
  });
};

export const adminUpdateUser = async ({
  userId,
  token,
  formData,
}: {
  userId: string;
  token: string;
  formData: FormData;
}) => {
  try {
    const response = await $requestWithToken.putFormData(
      `/users/admin/${userId}`,
      token,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

interface IPurchasedPropertiesResponse {
  purchases: any[];
  meta: any;
}

export const fetchMyPurchasedProperties = async (
  token: string,
  params?: Record<string, string>,
  options?: IFetchOptions
) => {
  return safeServiceCall(async () => {
    const urlParams = new URLSearchParams(params);
    const url = `/users/me/purchased-properties${urlParams.toString() ? `?${urlParams.toString()}` : ""
      }`;
    const nextConfig = options?.next
      ? buildNextTags(["my-purchases"], options)
      : undefined;

    const response = await $requestWithToken.get<IPurchasedPropertiesResponse>(
      url,
      token,
      options?.cache ?? "no-cache",
      nextConfig
    );
    return response;
  });
};

interface IInspectedPropertiesResponse {
  inspections: any[];
  meta: any;
}

export const fetchMyInspectedProperties = async (
  token: string,
  params?: Record<string, string>,
  options?: IFetchOptions
) => {
  return safeServiceCall(async () => {
    const urlParams = new URLSearchParams(params);
    const url = `/users/me/inspected-properties${urlParams.toString() ? `?${urlParams.toString()}` : ""
      }`;
    const nextConfig = options?.next
      ? buildNextTags(["my-inspections"], options)
      : undefined;

    const response = await $requestWithToken.get<IInspectedPropertiesResponse>(
      url,
      token,
      options?.cache ?? "no-cache",
      nextConfig
    );
    return response;
  });
};

// export const downloadPurchaseReceipt = async (
//   purchaseId: string,
//   token: string
// ) => {
//   try {
//     const response = await $requestWithToken.download(
//       `/users/me/purchases/${purchaseId}/receipt`,
//       token
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// export const downloadInspectionReceipt = async (
//   inspectionId: string,
//   token: string
// ) => {
//   try {
//     const response = await $requestWithToken.download(
//       `/users/me/inspections/${inspectionId}/receipt`,
//       token
//     );
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };
