"use client";

import React, { useEffect, useState } from "react";
import CustomButton from "../buttons/CustomButton";
import { Check } from "lucide-react";
import SubscriptionsTabsList from "./SubscriptionsTabsList";
import { usePaystackPayment } from "react-paystack";
import { showToaster } from "@/lib/general";
import {
  PaymentCredentials,
  PaystackSuccessResponse,
  Plan,
} from "@/interface/payment";
import { $requestWithToken } from "@/api/general";
import { formatPrice } from "@/lib/payment";
import PayWithTransfer from "./PayWithTransfer";
import CustomModal from "../modal/CustomModal";
import { initializPaymentApi } from "@/services/payment.service";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

interface Props {
  activeTab: string;
  token: string;
  plans: Plan[];
}

const onClose = () => {
  console.log("Payment Closed");
};

const SubscriptionCard: React.FC<Props> = ({
  activeTab = "1",
  plans,
  token,
}) => {
  const router = useRouter();
  const { user, refetchUser } = useUser();
  const [showPaymentMethodModal, setShowPaymentMethodModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [paymentResponse, setPaymentResponse] = useState<
    Partial<PaymentCredentials> | undefined
  >(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<
    "transfer" | "paystack" | null
  >(null);

  const paystackConfig = {
    reference: "",
    email: "",
    amount: 0,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || "",
  };

  useEffect(() => {
    // refetchUser(token)
    console.log(user)
  }, []);

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
          // console.log("Payment response:", response);
          // console.log("Payment data:", verifyPayment.data);
          await refetchUser(token)
          router.push(`/subscriptions/receipt/${response.reference}`);
        } else {
          // Fallback if reference is somehow not available, though it should be
          showToaster(
            "Transaction reference not found, cannot display receipt.",
            "warning"
          );
          // router.push("/dashboard/subscriptions"); // Or some other appropriate fallback
        }
      } catch (error) {
        console.error("Error during payment verification:", error);
        showToaster("Payment verification failed!", "destructive");
      }
    };

  const initializePayment = usePaystackPayment(paystackConfig);

  const handlePaymentMethodSelection = async () => {
    try {
      if (!selectedPlan || !selectedPaymentMethod) return;

      setShowPaymentMethodModal(false);

      const payload = {
        planId: selectedPlan.id,
        type: selectedPaymentMethod,
      };

      const paymentInit = await initializPaymentApi(token, payload);

      if (!paymentInit?.success) {
        showToaster(
          paymentInit?.message || "Payment initialization failed!",
          "destructive"
        );
        return;
      }

      // For transfer payments
      if (selectedPaymentMethod === "transfer") {
        setPaymentResponse(paymentInit.data);
        // TODO: Redirect to receipt page after bank transfer is confirmed by the user/system.
        // This will likely involve a different flow, perhaps a button in the PayWithTransfer modal
        // or a status check polling mechanism that then calls a function similar to onSuccess.
        // For now, the modal with transfer details will be shown.
        // Example if a reference is available directly from paymentInit.data for transfers:
        // if (paymentInit.data?.reference) {
        //   router.push(`/subscriptions/receipt/${paymentInit.data.reference}`);
        // }
        return;
      }

      if (
        selectedPaymentMethod === "paystack" &&
        paymentInit.data?.paystackConfig
      ) {
        const { paystackConfig: paystackDetails, reference } = paymentInit.data;

        initializePayment({
          onSuccess: onSuccess(selectedPlan.id),
          onClose,
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

  const handlePlanSelection = (plan: Plan) => {
    setSelectedPlan(plan);
    setShowPaymentMethodModal(true);
  };

  React.useEffect(() => {
    console.log("Payment response updated:", paymentResponse);
  }, [paymentResponse]);

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
                  {formatPrice(plan.price, "NGN")}
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
                disabled={!!user?.subscription?.plan?.id}
              >
                {user?.subscription?.plan?.id === plan.id ? "Subscribed" : "Select Plan"}
              </CustomButton>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Method Selection Modal */}
      <CustomModal
        isShown={showPaymentMethodModal}
        setIsShown={setShowPaymentMethodModal}
        title="Select Payment Method"
      >
        <div className="space-y-4">
          <p className="text-gray-700">
            Please choose your preferred payment method:
          </p>
          <div className="flex gap-4">
            <CustomButton
              variant={
                selectedPaymentMethod === "transfer" ? "default" : "outline"
              }
              onClick={() => setSelectedPaymentMethod("transfer")}
              className="flex-1"
            >
              Bank Transfer
            </CustomButton>
            <CustomButton
              variant={
                selectedPaymentMethod === "paystack" ? "default" : "outline"
              }
              onClick={() => setSelectedPaymentMethod("paystack")}
              className="flex-1"
            >
              Pay with Paystack
            </CustomButton>
          </div>
          <div className="flex justify-end gap-2 pt-4">
            <CustomButton
              variant="outline"
              onClick={() => {
                setShowPaymentMethodModal(false);
                setSelectedPaymentMethod(null);
              }}
            >
              Cancel
            </CustomButton>
            <CustomButton
              onClick={handlePaymentMethodSelection}
              disabled={!selectedPaymentMethod}
            >
              Continue
            </CustomButton>
          </div>
        </div>
      </CustomModal>

      {/* Transfer Payment Modal */}
      {selectedPaymentMethod === "transfer" && paymentResponse && (
        <CustomModal
          isShown={!!paymentResponse}
          setIsShown={(show) => {
            if (!show) {
              setPaymentResponse(undefined);
              setSelectedPaymentMethod(null);
            }
          }}
          title="Bank Transfer Details"
        >
          <PayWithTransfer
            paymentResponse={paymentResponse}
            setTransfer={(show) => {
              if (!show) {
                setPaymentResponse(undefined);
                setSelectedPaymentMethod(null);
              }
            }}
          />
        </CustomModal>
      )}
    </div>
  );
};

export default SubscriptionCard;
