import { IUser } from "./user";

export interface ILoan {
  id: string;
  userId: string;
  loanAmount: ILoanAmount;
  interestRate: number;
  loanDuration: ILoanDuration;
  loanStatus: ILoanStatus;
  reasonForFunds: string;
  hasCompletedForm: boolean;
  meta?: string;
  createdAt: string;
  updatedAt: string;
  user?: IUser;
  files?: ILoanFile[];
}

export type ILoanAmount =
  | "1000"
  | "5000"
  | "10000"
  | "20000"
  | "30000"
  | "40000"
  | "50000"
  | "100000";

export type ILoanDuration = "1 month" | "3 months" | "6 months" | "12 months";

export type ILoanStatus = "pending" | "approved" | "rejected" | "disbursed" | "overdue" | "completed";

export type ILoanReasonForFunds =
  | "business_expansion"
  | "personal_use"
  | "emergency_fund"
  | "other";

export type ILoanContextType = "loan" | "other";

export type ILoanFileType =
  | "passport"
  | "utility_bill"
  | "bank_statement"
  | "nin"
  | "bvn"
  | "salary_slip"
  | "personal_photo"
  | "other";

export type ILoanRequestStatus = "completed" | "ongoing";

export interface ILoanFile {
  id: string;
  loanId?: string;
  userId?: string;
  fileType: ILoanFileType;
  mediaType: "image" | "other";
  fileUrl: string;
  fileName?: string;
  meta?: string;
  createdAt: string;
  updatedAt: string;
  loan?: ILoan;
}

export interface ILoanStatusCount {
  loan_status: string;
  count: string;
  totalamount: string;
}

export interface ILoanSummary {
  totalLoans: string;
  statusCounts: ILoanStatusCount[];
  approvedLoans: string;
  disbursedLoans: string;
  totalAmount: string;
  totalRepaid: string;
}

// Additional interfaces for complete loan data
export interface IBankInfo {
  id: string;
  userId: string;
  averageSalary: number;
  bankName: string;
  salaryAccountNumber: string;
  nin: string;
  bvn: string;
  contextId: string;
  contextType: ILoanContextType;
  createdAt: string;
  updatedAt: string;
}

export interface IEmployment {
  id: string;
  userId: string;
  officeName: string;
  employerName: string;
  positionInOffice: string;
  officeContact: string;
  officeAddress: string;
  contextId: string;
  contextType: ILoanContextType;
  createdAt: string;
  updatedAt: string;
}

export interface IGuarantor {
  id: string;
  userId: string;
  name: string;
  email: string;
  homeAddress: string;
  officeAddress: string;
  phoneNumber: string;
  contextId: string;
  contextType: ILoanContextType;
  createdAt: string;
  updatedAt: string;
}

export interface ILandlord {
  id: string;
  userId: string;
  name: string;
  bankName: string;
  accountNumber: string;
  address: string;
  phoneNumber: string;
  contextId: string;
  contextType: ILoanContextType;
  createdAt: string;
  updatedAt: string;
}

export interface ILoanRequest {
  id: string;
  userId: string;
  amount: ILoanAmount;
  duration: ILoanDuration;
  status: ILoanRequestStatus;
  noOfRooms?: string;
  noOfYears?: string;
  reasonForLoanRequest?: string;
  createdAt: string;
  updatedAt: string;
}

// Extended loan interface with all related data
export interface ILoanWithDetails extends ILoan {
  bank?: IBankInfo;
  employment?: IEmployment;
  guarantor?: IGuarantor;
  landlord?: ILandlord;
  loanRequest?: ILoanRequest;
}

// Loan Repayment Interfaces
export type IRepaymentType = "PARTIAL" | "FULL" | "INTEREST" | "PRINCIPAL";
export type IPaymentMethod = "CARD" | "BANK_TRANSFER" | "WALLET" | "CASH";

export interface IInitializeLoanRepaymentData {
  repaymentAmount: number;
  repaymentType?: IRepaymentType;
  paymentMethod?: IPaymentMethod;
}

export interface IPaystackConfig {
  publicKey: string;
  amount: number;
  email: string;
  reference: string;
  currency: string;
  metadata: any;
}

export interface IInitializeLoanRepaymentResponseData {
  repaymentId: string;
  loanId: string;
  repaymentAmount: number;
  outstandingBalance: number;
  paymentReference: string;
  paystackConfig: IPaystackConfig;
}

export interface IInitializeLoanRepaymentResponse {
  success: boolean;
  message: string;
  data?: IInitializeLoanRepaymentResponseData;
}

export interface IVerifyLoanRepaymentData {
  paymentReference: string;
  providerResponse?: any;
}

export interface IVerifyLoanRepaymentResponseData {
  repaymentId: string;
  amount: number;
  status: string;
  outstandingBalance: number;
  loanStatus: string;
  isLoanCompleted: boolean;
}

export interface IVerifyLoanRepaymentResponse {
  success: boolean;
  message: string;
  data?: IVerifyLoanRepaymentResponseData;
}

export interface IRepaymentLoan {
  id: string;
  loanAmount: string;
  interestRate: number;
  loanDuration: string;
  loanStatus: string;
}

export interface IRepaymentDetails {
  totalAmount: number;
  totalPaid: number;
  outstandingBalance: number;
  monthlyPayment: number;
  totalInterest: number;
  principalRemaining: number;
  interestRemaining: number;
  penaltyAmount: number;
}

export interface IRepaymentHistory {
  id: string;
  amount: number;
  type: string;
  status: string;
  date: string;
  paymentMethod: string;
  reference: string;
}

export interface ILoanRepaymentDetailsResponseData {
  loan: IRepaymentLoan;
  repaymentDetails: IRepaymentDetails;
  repaymentHistory: IRepaymentHistory[];
}

export interface ILoanRepaymentDetailsResponse {
  success: boolean;
  message: string;
  data?: ILoanRepaymentDetailsResponseData;
}

export interface IUserLoanRepayment {
  id: string;
  repaymentAmount: number;
  repaymentType: string;
  repaymentStatus: string;
  paymentMethod: string;
  paymentReference: string;
  repaymentDate?: string;
  createdAt: string;
  loan: IRepaymentLoan;
}

export interface IUserLoanRepaymentsMeta {
  total: number;
  perPage: number;
  currentPage: number;
  lastPage: number;
}

export interface IUserLoanRepaymentsResponseData {
  data: IUserLoanRepayment[];
  meta: IUserLoanRepaymentsMeta;
}

export interface IUserLoanRepaymentsResponse {
  success: boolean;
  message: string;
  data?: IUserLoanRepaymentsResponseData;
}
