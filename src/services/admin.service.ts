import { $requestWithToken } from "@/api/general";
import { IMeta } from "@/interface/general";
import { ILoan, ILoanSummary } from "@/interface/loan";
import { IUser } from "@/interface/user";
import { string } from "zod";

interface IResponse {
  users: IUser[];
  meta?: IMeta;
  totalUsers: number | string;
  activeUsers: number | string;
}
export const fetchAllUsers = async (token: string, searchParams?: { search?: string; page?: number; per_page?: number }) => {
  try {
    const params = new URLSearchParams();
    
    if (searchParams?.search) {
      params.append("search", searchParams.search);
    }
    if (searchParams?.page) {
      params.append("page", searchParams.page.toString());
    }
    if (searchParams?.per_page) {
      params.append("per_page", searchParams.per_page.toString());
    }

    const url = `/admin/users${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await $requestWithToken.get<IResponse>(url, token);
    return response;
  } catch (error) {
    throw error;
  }
};

interface ILoanRequestsResponse {
  data: ILoan[];
  meta?: IMeta;
  statistics?: {
    totalLoans: number;
    activeLoans: number;
    completedLoans: number;
  };
}
export const fetchSubscribedUsers = async (token: string) => {
  try {
    const response = await $requestWithToken.get<IUser>(
      "/subscribed-users",
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const loanRequests = async (token: string, searchParams?: { search?: string; page?: number; limit?: number }) => {
  try {
    const params = new URLSearchParams();
    
    if (searchParams?.search) {
      params.append("search", searchParams.search);
    }
    if (searchParams?.page) {
      params.append("page", searchParams.page.toString());
    }
    if (searchParams?.limit) {
      params.append("limit", searchParams.limit.toString());
    }

    const url = `/loans/loan-requests${params.toString() ? `?${params.toString()}` : ""}`;
    const response = await $requestWithToken.get<ILoanRequestsResponse>(url, token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const loanStats = async (token: string) => {
  try {
    const response = await $requestWithToken.get<ILoanSummary>(
      "/loans/loan-stats",
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (token: string, userId: string) => {
  try {
    const response = await $requestWithToken.delete(
      `/users/${userId}`,
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLoanDetails = async (token: string, loanId: string) => {
  try {
    const response = await $requestWithToken.get<ILoan>(
      `/loans/${loanId}`,
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const approveLoan = async (token: string, loanId: string) => {
  try {
    const response = await $requestWithToken.patch(
      `/loans/${loanId}/approve`,
      token,
      {}
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const rejectLoan = async (token: string, loanId: string, reason?: string) => {
  try {
    const response = await $requestWithToken.patch(
      `/loans/${loanId}/reject`,
      token,
      { reason }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const disburseLoan = async (token: string, loanId: string) => {
  try {
    const response = await $requestWithToken.patch(
      `/loans/${loanId}/disburse`,
      token,
      {}
    );
    return response;
  } catch (error) {
    throw error;
  }
};
