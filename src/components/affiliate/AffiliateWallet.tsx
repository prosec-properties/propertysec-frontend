import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/payment";
import { Wallet, TrendingUp, DollarSign, CreditCard } from "lucide-react";

interface AffiliateWalletProps {
  wallet: {
    id: string;
    balance: string;
    ledgerBalance: string;
    totalBalance: string;
    totalSpent: string;
    meta: null;
    currency: string;
    type: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
  };
}

const AffiliateWallet = ({ wallet }: AffiliateWalletProps) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Wallet className="h-6 w-6" />
        <h2 className="text-2xl font-bold">Wallet Overview</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Available Balance</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatPrice(wallet?.balance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Ready to withdraw</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ledger Balance</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatPrice(wallet?.ledgerBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Pending transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatPrice(wallet?.totalBalance || 0)}
            </div>
            <p className="text-xs text-muted-foreground">All-time earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Withdrawn</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatPrice(wallet?.totalSpent || 0)}
            </div>
            <p className="text-xs text-muted-foreground">Amount withdrawn</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Wallet Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Currency</span>
            <Badge variant="outline">{wallet?.currency || 'NGN'}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Wallet Type</span>
            <Badge variant="secondary">{wallet?.type || 'affiliate'}</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Wallet ID</span>
            <span className="text-sm text-gray-600 font-mono">{wallet?.id}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AffiliateWallet;