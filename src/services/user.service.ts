import { $requestWithoutToken, $requestWithToken } from "@/api/general";
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
