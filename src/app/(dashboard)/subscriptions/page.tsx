import { $requestWithToken } from "@/api/general";
import { authConfig } from "@/authConfig";
import EmptyState from "@/components/misc/Empty";
import Spinner from "@/components/misc/Spinner";
import SubscriptionCard from "@/components/subscription/SubscriptionCard";
import { Plan } from "@/interface/payment";
import { isNotAnEmptyArray } from "@/lib/general";
import { Metadata } from "next";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Subscriptions",
};

interface ISearchParams {
  tab?: string;
}

async function Page(props: { searchParams?: Promise<ISearchParams> }) {
  const searchParams = await props.searchParams;
  const activeTab = searchParams?.tab || "1";
  const session = await getServerSession(authConfig);

  if (!session || !session.user || !session.user?.token) {
    redirect("/");
  }

  const subscriptionPlans = await $requestWithToken.get<Plan[]>(
    `/plans?duration=${activeTab}`,
    session.user?.token
  );

  if (!isNotAnEmptyArray(subscriptionPlans?.data as Plan[])) {
    return <EmptyState title="No subscription plans found" />;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading subscriptions..." />}>
        <SubscriptionCard
          plans={subscriptionPlans?.data as Plan[]}
          activeTab={activeTab}
          token={session.user?.token}
        />
      </Suspense>
    </div>
  );
}

export default Page;
