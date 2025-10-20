import { $requestWithToken } from "@/api/general";
import { IApiResponse, IFetchOptions } from "@/interface/general";
import { IBankInfo, IGuarantorInfo, ILandlordInfo, ILoanDetails, IOfficeInfo, IPersonalInfo } from "@/store/state/loanStore";
import { ILoan } from "@/interface/loan";

// export interface ILoanStep1Data {
//   loanId: string | number;
//   status: string;
//   amount: string;
//   duration: string;
// }

// export interface ILoanStep2Data {
//   bankName: string;
//   averageSalary: string;
//   salaryAccountNumber: string;
//   nin: string;
//   bvn: string;
// }

export interface ILoanStep3Data {
  officeName: string;
  employerName: string;
  positionInOffice: string;
  officeContact: string;
  officeAddress: string;
}




export type LoanStepResponse = {
  "1": IPersonalInfo;
  "2": IBankInfo;    
  "3": IOfficeInfo;
  "4": ILoanDetails;
  "5": ILandlordInfo;
  "6": IGuarantorInfo;
}

export interface IUserLoansResponse {
  loans: {
    data: ILoan[];
    meta: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
      firstPage: number;
      firstPageUrl: string;
      lastPageUrl: string;
      nextPageUrl: string | null;
      previousPageUrl: string | null;
    };
  };
  stats: {
    totalLoans: number;
    totalAmount: number;
    approvedAmount: number;
    pendingAmount: number;
    rejectedAmount: number;
  };
}

export const getUserLoans = async (
  token: string,
  options?: IFetchOptions
): Promise<IApiResponse<IUserLoansResponse> | null> => {
  try {
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set(["user-loans", ...(options.next.tags ?? [])])
          ),
        }
      : undefined;

    const response = await $requestWithToken.get<IUserLoansResponse>(
      `/loans/me`,
      token,
      options?.cache ?? "no-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const takeLoanApi = async ({
  formData,
  token,
  step,
}: {
  formData: FormData;
  token: string;
  step: keyof LoanStepResponse;
}): Promise<IApiResponse<LoanStepResponse[typeof step]> | null> => {
  try {
    const response = await $requestWithToken.postFormData<LoanStepResponse[typeof step]>(
      `/loans/request?step=${step}`,
      token,
      formData
    );

    return response;
  } catch (error) {
    throw error;
  }
};

export const getLoanById = async (
  loanId: string,
  token: string,
  options?: IFetchOptions
): Promise<IApiResponse<ILoan> | null> => {
  try {
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set([`loan-${loanId}`, ...(options.next.tags ?? [])])
          ),
        }
      : undefined;

    const response = await $requestWithToken.get<ILoan>(
      `/loans/${loanId}`,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};
