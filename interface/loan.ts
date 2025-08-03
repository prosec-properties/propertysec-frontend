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
