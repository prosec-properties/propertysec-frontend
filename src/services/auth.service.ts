import { $requestWithoutToken, $requestWithToken } from "@/api/general";
import { AccessToken } from "@/interface/auth";
import { IApiResponse } from "@/interface/general";
import { IUser, IUserRole, IUserRoleEnum } from "@/interface/user";

interface IRegisterPayload {
  email: string;
  password: string;
  phoneNumber: string;
  role: IUserRole;
  fullName: string;
}

export const register = async (payload: IRegisterPayload) => {
  try {
    return await $requestWithoutToken.post<IUser>("/auth/register", payload);
  } catch (error) {
    throw error;
  }
};

export const fetchUserInfo = async (token: string) => {
  try {
    return await $requestWithToken.get<IUser>("/users/me", token);
  } catch (error) {
    throw error;
  }
};

interface ICompleteRegPayload {
  phoneNumber: string;
  role: IUserRole;
  email: string;
}

export const completeReg = async (payload: ICompleteRegPayload) => {
  try {
    return await $requestWithoutToken.post<AccessToken>(
      "/auth/complete-registration",
      payload
    );
  } catch (error) {
    throw error;
  }
};

export interface ILoginResponse {
  success: boolean;
  token: AccessToken;
}

export interface IGoogleAuthCallbackResponse {
  success: boolean;
  isNew: boolean;
  user: IUser;
  token: AccessToken | null;
}
export const loginApi = async (payload: {
  email: string;
  password: string;
}) => {
  try {
    const response = await $requestWithoutToken.post<ILoginResponse>(
      "/auth/login",
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const logoutApi = async (token: string) => {
  try {
    const response = await $requestWithToken.get("/auth/logout", token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const completeRegisterionApi = async ({
  formData,
}: {
  formData: FormData;
}) => {
  try {
    const response = await $requestWithoutToken.form<AccessToken>(
      "/auth/complete-registration",
      formData,
      "POST"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const forgotPasswordApi = async ({
  formData,
}: {
  formData: FormData;
}) => {
  try {
    const response = await $requestWithoutToken.form(
      "/auth/forgot-password",
      formData,
      "POST"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const resetPasswordApi = async (payload: {
  email: string;
  token: string;
  password: string;
}) => {
  try {
    const response = await $requestWithoutToken.post(
      "/auth/reset-password",
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const verifyOtpApi = async (payload: { email: string; otp: string }) => {
  try {
    const response = await $requestWithoutToken.post(
      "/auth/verify-otp",
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const resendOtpApi = async (payload: { email: string }) => {
  try {
    const response = await $requestWithoutToken.post(
      "/auth/resend-otp",
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const googleAuthCallbackApi = async (params: string) => {
  try {
    const response =
      await $requestWithoutToken.get<IGoogleAuthCallbackResponse>(
        `/auth/google/callback?${params}`
      );
    return response;
  } catch (error) {
    throw error;
  }
};
