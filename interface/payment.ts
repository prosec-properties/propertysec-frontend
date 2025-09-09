import { string } from "zod";
import { IApiResponse } from "./general";

export type Status = "ACTIVE" | "INACTIVE" | "PENDING" | "CANCELLED";

export type IPaymentMethod = "paystack" | "transfer";

export type PlanName =
  | "Free"
  | "Premium"
  | "VIP"
  | "Gold"
  | "Pro Sales"
  | "Verified";

export type SubscriptionType = "PROPERTY" | "CARS" | "OTHERS" | "COMBO";

export interface Subscription {
  id: string;
  name: string;
  type: SubscriptionType;
  meta: SubscriptionMeta;
  createdAt: string;
  updatedAt: string;

  plans?: Plan[];
  plan?: Plan;
}

export interface SubscriptionMeta {
  image: string;
  color: string;
  order: number;
  [key: string]: any;
}

export interface Plan {
  id: string;
  features: string[];
  price: number;
  currency: string;
  name: PlanName;
  duration: number;
  meta: null | Record<string, any>;
  // subscriptionId: string;
  // status: Status;
  discountPercentage: number;
  subscription?: Subscription;
  createdAt: string;
  updatedAt: string;
}

export interface Wallet {
  balance: number;
  totalBalance: number;
  totalSpent: number;
  meta: Record<string, any> | null;
  currency: string;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaystackSuccessResponse {
  message?: string;
  redirecturl?: string;
  reference?: string;
  status?: string;
  trans?: string;
  transaction?: string;
  trxref?: string;
  [key: string]: any;
}

export type PaystackMainConfig = Partial<PaystackConfig> & {
  key?: string;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onCancel: () => void;
  onBankTransferConfirmationPending?: () => void;
  // meta?: any;
};

export interface PaymentCredentials {
  isPaid: false;
  amountToPay: number;
  walletAmountToPay: number;
  discountPercentage?: number;
  actualTotalAmount: number;
  paystackConfig?: PaystackConfig;
  reference?: string;
  expiresAt?: string | null;
  bankName?: string;
  acctNumber?: string;
  acctName?: string;
  walletBalance?: number;
  transaction?: Transaction;
  pdfUrl?: string;
  planName?: string;
  planDuration?: string;
}

export interface Transaction {
  id: string;
  userId: string;
  planId?: string;
  amount: number;
  actualAmount: number;
  currency: AcceptedCurrencies;
  status: TransactionStatus;
  provider?: string;
  providerStatus: string;
  sessionId?: string;
  type: TransactionType;
  date: string | null;
  narration?: string;
  reference: string;
  isVerified?: boolean;
  verifyNarration?: string;
  meta?: string | null;
  plan?: Plan;
  createdAt: string;
  updatedAt: string;
}

export interface PaystackConfig {
  publicKey: string;
  email: string;
  firstname?: string;
  lastname?: string;
  phone?: number | string;
  amount: number;
  ref?: string;
  reference?: string;
  metadata?: Partial<PaystackMetadata>;
  currency?: "NGN" | "GHS" | "USD" | "ZAR" | string;
  channels?: PaymentChannels[];
  label?: string;
  plan?: string;
  quantity?: number;
  subaccount?: string;
  transaction_charge?: number;
  bearer?: Bearer;
  split_code?: string;
  split?: Record<string, any>;
  "data-custom-button"?: string;
}

export type AcceptedCurrencies = "NGN" | "GHS" | "ZAR" | "USD";

export type PaymentProviders = "paystack" | "flutterwave";

export type TransactionStatus = "PENDING" | "SUCCESS" | "FAIL" | "INITIALIZE";

export type TransactionType =
  | "subscription"
  | "wallet:credit"
  | "wallet:debit"
  | "inspection"
  | "property_purchase"
  | "loan_repayment";

type PaymentChannels =
  | "bank"
  | "card"
  | "qr"
  | "ussd"
  | "mobile_money"
  | "bank_transfer"
  | string;

export interface PaystackMetadata {
  type?: TransactionType;
  transactionId?: string;
  amount?: number;
  walletAmount?: number;
  fee?: number;
  referrer: string;
  custom_fields?: PaystackCustomFields[];
  cancel_action?: string;
  custom_filters?: PaystackCustomFilter;
  [key: string]: any;
}

interface PaystackCustomFilter {
  recurring?: boolean;
  banks?: string[];
  card_brands?: Array<"visa" | "verve" | "master" | string>;
}

interface PaystackCustomFields {
  display_name?: string;
  variable_name?: string;
  value?: any;
}

type Bearer = "account" | "subaccount" | string;

export type PaymentProvider = "PAYSTACK" | "FLUTTERWAVE";
export type PaymentStatus =
  | "PENDING"
  | "SUCCESS"
  | "FAILED"
  | "CANCELLED"
  | "REFUNDED"
  | "INITIATED";
export type PaymentMethod = "CARD" | "BANK_TRANSFER" | "WALLET";

export interface IPaymentInit {
  id: string;
  userId: string;
  amount: number;
  provider: PaymentProvider;
  status: PaymentStatus;
  reference: string;
  providerResponse: string;
  paymentMethod: PaymentMethod;
  createdAt: string;
  updatedAt: string;
}

export interface IPaystackAuthorizationData {
  access_code: string;
  authorization_url: string;
  reference: string;
}
export interface IPaystackAuthorizationResponse {
  data: IPaystackAuthorizationData;
  message: string;
  status: boolean;
}

export interface ITransactionInitializationPayload {
  type: TransactionType;
  amount: number;
  callbackUrl: string;
  metadata?: Record<string, any>;
}

export interface ITransactionInitializationResponse {
  status: boolean;
  message: string;
  data: {
    authorization_url: string;
    access_code: string;
    reference: string;
  };
}

export interface ITransactionVerificationPayload {
  reference: string;
  paymentReference: string;
}

export interface ITransactionVerificationResponse {
  status: boolean;
  message: string;
  data: {
    id: string;
    reference: string;
    status: string;
    type: TransactionType;
    amount: number;
    metadata?: Record<string, any>;
  };
}
