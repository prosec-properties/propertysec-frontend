"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useUser } from "@/hooks/useUser";
import Commission from "@/components/affiliate/Commission";
import AffiliateWallet from "@/components/affiliate/AffiliateWallet";
import AffiliateTransactionHistory from "@/components/affiliate/AffiliateTransactionHistory";
import {
  fetchAffiliateStats,
  fetchAffiliateTransactions,
} from "@/services/affiliate.service";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/use-toast";
import { MY_LISTING_ROUTE, PROPERTIES_ROUTE } from "@/constants/routes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCopyToClipboard } from "usehooks-ts";
import { Badge } from "@/components/ui/badge";

const AffiliateDashboard = () => {
  const { token, user } = useUser();
  const router = useRouter();
  const [copiedText, copyToClipboard] = useCopyToClipboard();

  const handleGenerateAffiliateLink = () => {
    const baseUrl = window.location.origin;
    const affiliateUrl = `${baseUrl}${PROPERTIES_ROUTE}?aff=${user?.id}`;

    copyToClipboard(affiliateUrl)
      .then(() => {
        toast({
          title: "Link Copied!",
          description: "Affiliate link has been copied to your clipboard",
          variant: "success",
          duration: 3000,
        });
      })
      .catch(() => {
        toast({
          title: "Copy Failed",
          description: "Failed to copy link to clipboard",
          variant: "destructive",
          duration: 3000,
        });
      });
  };

  const handleViewMyShop = () => {
    router.push(MY_LISTING_ROUTE);
  };

  const handleBrowseProperties = () => {
    router.push(PROPERTIES_ROUTE);
  };

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["affiliate-stats"],
    queryFn: () =>
      fetchAffiliateStats(token, {
        cache: "force-cache",
        next: { revalidate: 300, tags: ["affiliate-stats"] },
      }),
    enabled: !!token,
  });

  const { data: transactions, isLoading: transactionsLoading } = useQuery({
    queryKey: ["affiliate-transactions"],
    queryFn: () =>
      fetchAffiliateTransactions(token, {
        cache: "force-cache",
        next: { revalidate: 300, tags: ["affiliate-transactions"] },
      }),
    enabled: !!token,
  });

  if (statsLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Affiliate Dashboard
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor your earnings and performance
          </p>
        </div>
      </div>

      {/* Commission Stats */}
      {stats && <Commission stats={stats as any} />}

      {/* Wallet Overview */}
      {(stats as any)?.affiliateWallet && (
        <AffiliateWallet wallet={(stats as any).affiliateWallet} />
      )}

      {/* Recent Transactions */}
      <AffiliateTransactionHistory
        transactions={transactions as any[]}
        isLoading={transactionsLoading}
      />

      {/* Performance Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Commission Rates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between">
              <span>Sale Properties</span>
              <Badge variant="secondary">2%</Badge>
            </div>
            <div className="flex justify-between">
              <span>Rent/Shortlet Properties</span>
              <Badge variant="secondary">5%</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <button
              onClick={handleGenerateAffiliateLink}
              className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">Generate Affiliate Link</p>
              <p className="text-sm text-gray-600">
                Create shareable links for properties
              </p>
            </button>
            <button
              onClick={handleViewMyShop}
              className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">View My Shop</p>
              <p className="text-sm text-gray-600">
                Manage your affiliate products
              </p>
            </button>
            <button
              onClick={handleBrowseProperties}
              className="w-full text-left p-3 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <p className="font-medium">Browse Properties</p>
              <p className="text-sm text-gray-600">
                Find properties to add to your shop
              </p>
            </button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
