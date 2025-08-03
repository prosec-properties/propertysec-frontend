import { IProfileFileInterface } from "./file";
import { Subscription } from "./payment";
import { IProperty } from "./property";

export type IUserRole =
  | "landlord"
  | "buyer"
  | "affiliate"
  | "developer"
  | "lawyer"
  | "admin"

export const IUserRoleEnum = [
  "landlord",
  "buyer",
  "affiliate",
  "developer",
  "lawyer",
  "admin",
] as const;

export interface AuthorizeResponse {
  authorized: boolean;
  isEmailVerified: boolean;
  message?: string;
  email?: string;
  name?: string;
  role?: string;
  avatar?: string;
  token?: string;
  shouldCompleteProfile?: boolean;
  referrerCode?: string;
}

type IAuthProvider = "email" | "google" | "facebook" | "twitter" | "other";

export interface IUser {
  id: string;
  stateOfResidence: string;
  cityOfResidence: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  hasCompletedProfile: boolean;
  hasCompletedRegistration: boolean;
  authProvider: IAuthProvider;
  role: IUserRole;
  avatarUrl?: string;
  homeAddress?: string;
  password: string;
  emailVerified: boolean;
  slug: string;
  religion?: string;
  nextOfKinName?: string;

  stateOfOrigin?: string;
  nationality?: string;

  businessName?: string;
  businessAddress?: string;
  businessRegNo?: string;

  bankName?: string;
  bankAccountNumber?: string;
  bankAccountName?: string;
  monthlySalary?: number;

  bvn?: string;
  nin?: string;

  properties?: IProperty[];
  propertyAccessRequests: IProperty[];

  profileFiles: IProfileFileInterface[];

  token?: string;
  buyerApproved: boolean;

  subscriptionId: string | null;
  subscriptionStatus: IStatus | null;
  subscriptionStartDate: string | null;
  subscriptionEndDate: string | null;

  meta?: string;
  createdAt: string;
  updatedAt: string;

  subscription?: Subscription
}

export interface InspectionDetail {
  id: string
  userId: string
  propertyId: string
  inspectionAmount: number
  inspectionStatus: 'PENDING' | 'COMPLETED'
  inspectionReport: string
  name: string
  email: string
  phoneNumber: string
  inspectionDate: string
  meta?: string
  createdAt: string
  updatedAt: string
}

export type IStatus = "active" | "inactive"