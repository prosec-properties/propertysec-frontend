import { $requestWithToken } from "@/api/general";
import {
  IPaymentMethod,
  IPaystackAuthorizationResponse,
  PaymentCredentials,
  Transaction,
  ITransactionInitializationPayload,
  ITransactionVerificationResponse,
  ITransactionInitializationData,
} from "@/interface/payment";

interface IPaymentPayload {
  type: IPaymentMethod;
  planId: string;
}
export const initializPaymentApi = async (
  token: string,
  payload: IPaymentPayload
) => {
  try {
    const response = await $requestWithToken.post<PaymentCredentials>(
      "/payment/init",
      token,
      payload
    );

    console.log("Payment Init Response", response);

    return response;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export const getTransactionByReferenceApi = async (
  token: string,
  reference: string
) => {
  try {
    const response = await $requestWithToken.get<Transaction>(
      `/transactions/${reference}`,
      token
    );
    return response;
  } catch (error) {
    console.log("error", error);
    throw error;
  }
};

export async function verifyPaymentApi(
  token: string,
  payload: { reference: string; planId: string }
) {
  try {
    await $requestWithToken.post("/transactions", token, payload);
  } catch (error) {
    throw error;
  }
}

export async function getAuthorizationUrlApi({
  token,
  email,
  callbackUrl,
  amount,
}: {
  token: string;
  email: string;
  callbackUrl: string;
  amount: number;
}) {
  const payload = { email, callbackUrl, amount };
  try {
    const response =
      await $requestWithToken.post<IPaystackAuthorizationResponse>(
        "/payment/authorization-url",
        token,
        payload
      );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function verifyTransactionApi({
  token,
  transactionId,
  paymentReference,
}: {
  token: string;
  transactionId: string;
  paymentReference: string;
}) {
  try {
    const response = await $requestWithToken.post<ITransactionVerificationResponse>(
      "/transactions/verify",
      token,
      {
        reference: paymentReference,
        paymentReference,
      }
    );
    return response;
  } catch (error) {
    throw error;
  }
}

export async function initializeTransactionApi(
  token: string,
  payload: ITransactionInitializationPayload
) {
  try {
    const response = await $requestWithToken.post<ITransactionInitializationData>(
      "/transactions/initialize",
      token,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
}
