import SubscriptionDetails from "@/components/admin/SubscriptionDetails";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { adminGuard } from "@/lib/admin";
import { getSubscriptionDetails } from "@/services/subscriptions.service";
import { notFound } from "next/navigation";
import React from "react";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

const Page = async ({ params }: Props) => {
  const { id } = await params;
  const { user } = await adminGuard();

  if (!id) {
    notFound();
  }

  try {
    const subscriptionResponse = await getSubscriptionDetails(user?.token || "", id);

    console.log("Subscription details:", subscriptionResponse?.data);
    
    if (!subscriptionResponse?.success || !subscriptionResponse?.data) {
      return <ErrorDisplay message="Subscription not found or an error occurred" />;
    }

    const subscriptionData = subscriptionResponse.data;
    
    return (
      <div>
        <SubscriptionDetails subscription={subscriptionData} />
      </div>
    );
  } catch (error) {
    return <ErrorDisplay message="Failed to load subscription details" />;
  }
};

export default Page;
