"use client";

import React from "react";
import CustomButton from "../buttons/CustomButton";
import { Check } from "lucide-react";
import SubscriptionsTabsList from "./SubscriptionsTabsList";
import { showToaster } from "@/lib/general";
import { Plan } from "@/interface/payment";
import { formatPrice } from "@/lib/payment";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useMutation } from "@tanstack/react-query";
import { initializeTransactionApi } from "@/services/payment.service";
import { frontendUrl } from "@/constants/env";

interface SubscriptionPlanData {
  plan: Plan;
  amount: number;
}

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
  const { user } = useUser();

  const initializeMutation = useMutation({
    mutationFn: async (data: SubscriptionPlanData) => {
      return await initializeTransactionApi(token, {
        type: "subscription",
        amount: data.amount,
        callbackUrl: `${frontendUrl}/verify`,
        metadata: {
          planId: data.plan.id,
        },
      });
    },
    onSuccess: (response) => {
      console.log("Payment init response", response);
      if (response?.data?.data && response.data.data.authorization_url) {
        router.push(response.data.data.authorization_url);
      } else {
        showToaster("Failed to initialize payment", "destructive");
      }
    },
    onError: (error) => {
      console.error("Payment initialization error:", error);
      showToaster(
        "Failed to initialize payment. Please try again.",
        "destructive"
      );
    },
  });

  const handlePlanSelection = async (plan: Plan) => {
    const amount = plan.price;
    initializeMutation.mutate({ plan, amount });
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
                  plan.name?.toLowerCase() === "free" ||
                  initializeMutation.isPending
                }
              >
                {initializeMutation.isPending
                  ? "Processing..."
                  : user?.subscription?.plan?.id === plan.id
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
