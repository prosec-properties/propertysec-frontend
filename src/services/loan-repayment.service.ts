const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3333";

export interface InitializeLoanRepaymentData {
  repaymentAmount: number;
  repaymentType?: "PARTIAL" | "FULL" | "INTEREST" | "PRINCIPAL";
  paymentMethod?: "CARD" | "BANK_TRANSFER" | "WALLET" | "CASH";
}

export interface InitializeLoanRepaymentResponse {
  success: boolean;
  message: string;
  data?: {
    repaymentId: string;
    loanId: string;
    repaymentAmount: number;
    outstandingBalance: number;
    paymentReference: string;
    paystackConfig: {
      publicKey: string;
      amount: number;
      email: string;
      reference: string;
      currency: string;
      metadata: any;
    };
  };
}

export interface VerifyLoanRepaymentData {
  paymentReference: string;
  providerResponse?: any;
}

export interface VerifyLoanRepaymentResponse {
  success: boolean;
  message: string;
  data?: {
    repaymentId: string;
    amount: number;
    status: string;
    outstandingBalance: number;
    loanStatus: string;
    isLoanCompleted: boolean;
  };
}

export interface LoanRepaymentDetailsResponse {
  success: boolean;
  message: string;
  data?: {
    loan: {
      id: string;
      loanAmount: string;
      interestRate: number;
      loanDuration: string;
      loanStatus: string;
    };
    repaymentDetails: {
      totalAmount: number;
      totalPaid: number;
      outstandingBalance: number;
      monthlyPayment: number;
      totalInterest: number;
      principalRemaining: number;
      interestRemaining: number;
      penaltyAmount: number;
    };
    repaymentHistory: Array<{
      id: string;
      amount: number;
      type: string;
      status: string;
      date: string;
      paymentMethod: string;
      reference: string;
    }>;
  };
}

export interface UserLoanRepaymentsResponse {
  success: boolean;
  message: string;
  data?: {
    data: Array<{
      id: string;
      repaymentAmount: number;
      repaymentType: string;
      repaymentStatus: string;
      paymentMethod: string;
      paymentReference: string;
      repaymentDate?: string;
      createdAt: string;
      loan: {
        id: string;
        loanAmount: string;
        loanDuration: string;
        loanStatus: string;
      };
    }>;
    meta: {
      total: number;
      perPage: number;
      currentPage: number;
      lastPage: number;
    };
  };
}

export const initializeLoanRepayment = async (
  loanId: string,
  data: InitializeLoanRepaymentData,
  token: string
): Promise<InitializeLoanRepaymentResponse> => {
  const response = await fetch(`${API_URL}/api/loans/${loanId}/repay`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const verifyLoanRepayment = async (
  repaymentId: string,
  data: VerifyLoanRepaymentData,
  token: string
): Promise<VerifyLoanRepaymentResponse> => {
  const response = await fetch(`${API_URL}/api/loans/repayments/${repaymentId}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  return response.json();
};

export const getLoanRepaymentDetails = async (
  loanId: string,
  token: string
): Promise<LoanRepaymentDetailsResponse> => {
  const response = await fetch(`${API_URL}/api/loans/${loanId}/repayment-details`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};

export const getUserLoanRepayments = async (
  token: string,
  params?: {
    page?: number;
    limit?: number;
    loanId?: string;
  }
): Promise<UserLoanRepaymentsResponse> => {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.append("page", params.page.toString());
  if (params?.limit) searchParams.append("limit", params.limit.toString());
  if (params?.loanId) searchParams.append("loanId", params.loanId);

  const response = await fetch(`${API_URL}/api/loans/repayments/me?${searchParams}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return response.json();
};
