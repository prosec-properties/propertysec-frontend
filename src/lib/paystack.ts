import {
  PaymentCredentials,
  PaystackMainConfig,
  PaystackSuccessResponse,
} from "@/interface/payment";

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
    key: credentials?.paystackConfig?.publicKey!,
    onSuccess,
    onCancel,
    onBankTransferConfirmationPending,
  };
};
