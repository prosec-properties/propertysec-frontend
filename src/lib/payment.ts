import {
  PaymentCredentials,
  PaystackMainConfig,
  // PaystackMainConfig,
  PaystackSuccessResponse,
} from "@/interface/payment";

export const getCurrencySymbol = (currency: string) => {
  switch (currency) {
    case "NGN":
      return "₦";
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "EUR":
      return "€";
    case "ZAR":
      return "R";
    case "KES":
      return "KSh";
    case "GHS":
      return "₵";
    case "XOF":
      return "CFA";
    default:
      return "";
  }
};

export const openPaystackModal = (config: PaystackMainConfig) => {
  const paystack = new window.PaystackPop();
  paystack.newTransaction(config);
};

export const createPaystackConfig = ({
  credentials,
  onCancel,
  onBankTransferConfirmationPending,
  onSuccess,
}: {
  credentials: PaymentCredentials;
  onSuccess: (response: PaystackSuccessResponse) => void;
  onCancel: () => void;
  onBankTransferConfirmationPending?: () => void;
}): PaystackMainConfig => {
  return {
    ...credentials.paystackConfig,
    key: credentials?.paystackConfig?.publicKey,
    onSuccess,
    onCancel,
    onBankTransferConfirmationPending,
  };
};

export const formatPrice = (
  price: string | number,
  currency: string = "NGN"
) => {
  const formatted = Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: currency || "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatted.format(Number(price));
};
