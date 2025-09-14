import { $requestWithToken } from "@/api/general";
import {
  ILoanRepaymentDetailsResponse,
  IUserLoanRepaymentsResponse,
  ILoanRepaymentDetailsResponseData,
  IUserLoanRepaymentsResponseData,
} from "@/interface/loan";

interface IRepaymentLoanPayload {
  repaymentAmount: number;
  repaymentType?: "PARTIAL" | "FULL" | "INTEREST" | "PRINCIPAL";
  paymentMethod?: "CARD" | "BANK_TRANSFER" | "WALLET" | "CASH";
  email: string;
  callbackUrl: string;
  amount: number;
  loanId: string;
  token: string;
}

export const getLoanRepaymentDetails = async (
  loanId: string,
  token: string
): Promise<ILoanRepaymentDetailsResponse | null> => {
  try {
    const response =
      await $requestWithToken.get<ILoanRepaymentDetailsResponseData>(
        `/loans/${loanId}/repayment-details`,
        token
      );

    return response;
  } catch (error: any) {
    throw error;
  }
};

export const getUserLoanRepayments = async (
  token: string,
  params?: {
    page?: number;
    limit?: number;
    loanId?: string;
  }
): Promise<IUserLoanRepaymentsResponse | null> => {
  try {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.append("page", params.page.toString());
    if (params?.limit) searchParams.append("limit", params.limit.toString());
    if (params?.loanId) searchParams.append("loanId", params.loanId);

    const response =
      await $requestWithToken.get<IUserLoanRepaymentsResponseData>(
        `/loans/repayments/me?${searchParams}`,
        token
      );

    return response;
  } catch (error: any) {
    throw error;
  }
};
