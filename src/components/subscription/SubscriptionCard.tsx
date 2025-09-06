"use client";

import React from "react";
import CustomButton from "../buttons/CustomButton";
import { Check } from "lucide-react";
import SubscriptionsTabsList from "./SubscriptionsTabsList";
import { usePaystackPayment } from "react-paystack";
import { showToaster } from "@/lib/general";
import {
  IPaymentMethod,
  PaystackSuccessResponse,
  Plan,
} from "@/interface/payment";
import { $requestWithToken } from "@/api/general";
import { formatPrice } from "@/lib/payment";
import { initializPaymentApi } from "@/services/payment.service";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

interface Props {
  activeTab: string;
  token: string;
  plans: Plan[];
}

const SubscriptionCard: React.FC<Props> = ({
  activeTab = "1",
  plans,
  token,
}) => {
  const router = useRouter();
  const { user, refetchUser } = useUser();

  const paystackConfig = {
    reference: "",
    email: "",
    amount: 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  const onSuccess =
    (planId: string) => async (response: PaystackSuccessResponse) => {
      try {
        showToaster("Verifying Payment, please wait!", "success");

        const payload = {
          reference: response.reference,
          planId,
        };

        const verifyPayment = await $requestWithToken.post(
          "/transactions",
          token,
          payload
        );

        if (!verifyPayment?.success) {
          showToaster("Payment verification failed!", "destructive");
          return;
        }

        showToaster("Payment verified successfully!", "success");
        if (response.reference) {
          await refetchUser(token);
          router.push(`/subscriptions/receipt/${response.reference}`);
        } else {
          showToaster(
            "Transaction reference not found, cannot display receipt.",
            "warning"
          );
        }
      } catch (error) {
        showToaster("Payment verification failed!", "destructive");
      }
    };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handlePlanSelection = async (plan: Plan) => {
    const payload = {
      planId: plan.id,
      type: "paystack" as IPaymentMethod,
    };

    try {
      const paymentInit = await initializPaymentApi(token, payload);

      if (!paymentInit?.success) {
        showToaster(
          paymentInit?.message || "Payment initialization failed!",
          "destructive"
        );
        return;
      }

      if (paymentInit.data?.paystackConfig) {
        const { paystackConfig: paystackDetails, reference } = paymentInit.data;

        initializePayment({
          onSuccess: onSuccess(plan.id),
          // onClose,
          config: {
            ...(paystackDetails as any),
            reference,
          },
        });
      }
    } catch (error) {
      console.error("Error during payment method selection:", error);
      showToaster(
        "An error occurred during payment method selection.",
        "destructive"
      );
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 sm:px-6 sm:py-12 lg:px-8 lg:py-16 bg-white rounded-[0.625rem]">
      <div className="mb-8 sm:mb-14">
        <SubscriptionsTabsList isActiveTab={activeTab} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-8">
        {plans.map((plan, index) => (
          <div
            key={index}
            className={`${
              index === 1
                ? "border-primary border-[3px]"
                : "border-gray-200 border"
            } rounded-2xl shadow-sm flex flex-col`}
          >
            <div className="p-4 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 break-words">
                {plan.name}
                <span className="sr-only">Plan</span>
              </h2>

              <p className="mt-2 sm:mt-4 flex items-baseline">
                <strong className="text-3xl font-bold text-gray-900 sm:text-4xl">
                  {formatPrice(plan.price || 0, "NGN")}
                </strong>
                <span className="ml-1 text-sm font-medium text-gray-700">
                  /month
                </span>
              </p>
            </div>

            <div className="p-4 sm:p-6 flex-1 flex flex-col">
              <p className="text-lg font-medium text-gray-900 sm:text-xl break-words">
                {plan.name} covers ...
              </p>

              <ul className="mt-2 space-y-2 sm:mt-4 flex-1 overflow-y-auto max-h-[200px]">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-2">
                    <Check
                      className={`${
                        feature ? "size-4 shrink-0 mt-1" : "invisible"
                      }`}
                    />
                    <span className="text-gray-700 break-words">{feature}</span>
                  </li>
                ))}
              </ul>
              <CustomButton
                className="mt-4 w-full"
                onClick={() => handlePlanSelection(plan)}
                disabled={
                  !!user?.subscription?.plan?.id ||
                  plan.name?.toLowerCase() === "free"
                }
              >
                {user?.subscription?.plan?.id === plan.id
                  ? "Subscribed"
                  : "Select Plan"}
              </CustomButton>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionCard;
