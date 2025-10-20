import { $requestWithoutToken, $requestWithToken } from "@/api/general";
import { IFetchOptions } from "@/interface/general";
import { IUser } from "@/interface/user";

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
  try {
    const response = await $requestWithoutToken.get<IUser>(
      "/users/" + id,
      "no-cache",
      {
        tags: ["fetchUserById"],
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
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
  try {
    const urlParams = new URLSearchParams(params);
    const url = `/users/me/purchased-properties${
      urlParams.toString() ? `?${urlParams.toString()}` : ""
    }`;
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set(["my-purchases", ...(options.next.tags ?? [])])
          ),
        }
      : undefined;

    const response = await $requestWithToken.get<IPurchasedPropertiesResponse>(
      url,
      token,
      options?.cache ?? "no-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
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
  try {
    const urlParams = new URLSearchParams(params);
    const url = `/users/me/inspected-properties${
      urlParams.toString() ? `?${urlParams.toString()}` : ""
    }`;
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set(["my-inspections", ...(options.next.tags ?? [])])
          ),
        }
      : undefined;

    const response = await $requestWithToken.get<IInspectedPropertiesResponse>(
      url,
      token,
      options?.cache ?? "no-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
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
