import { IUserRole } from "./user";

export interface ILoginFormPayload {
  email: string;
  password: string;
}

export interface IRegisterFormPayload {
  fullName: string;
  email: string;
  password: string;
  role: IUserRole;
  phoneNumber: string;
  confirmPassword: string;
}

export interface IAuthResponse {
  success: boolean;
  data: any;
  message: string;
}

export interface IBackendValidationError {
  field: string;
  message: string;
  rule: string;
}

export type AuthType = "google" | "email";

export type AccessToken = {
  identifier: string | number | BigInt;
  tokenableId: string | number | BigInt;
  type: string;
  hash: string;
  createdAt: string;
  updatedAt: string;
  lastUsedAt: string | null;
  expiresAt: string | null;
  name: string | null;
  prefix?: string;
  token: string;
  secret?: string;
  abilities?: string[];
};
