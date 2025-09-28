import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/payment";
import { Activity, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { DateTime } from "luxon";

interface Transaction {
  id: string;
  amount: string;
  type: string;
  status: string;
  narration: string;
  date: string;
  currency: string;
  reference: string;
}

interface AffiliateTransactionHistoryProps {
  transactions: Transaction[];
  isLoading?: boolean;
}

const AffiliateTransactionHistory = ({ transactions, isLoading }: AffiliateTransactionHistoryProps) => {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5" />
          Commission Transaction History
        </CardTitle>
      </CardHeader>
      <CardContent>
        {transactions && transactions.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-full">
                    <ArrowUpRight className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">{transaction.narration}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className="text-sm text-gray-600">
                        {DateTime.fromISO(transaction.date).toFormat("DDD")}
                      </p>
                      <Badge
                        variant={transaction.status === 'SUCCESS' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {transaction.status}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600 text-lg">
                    +{formatPrice(transaction.amount)}
                  </p>
                  <p className="text-sm text-gray-600">{transaction.currency}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Activity className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
            <p className="text-gray-600 mb-4">
              You haven&apos;t earned any commissions yet. Start sharing your affiliate links to earn commissions on property transactions!
            </p>
            <div className="text-sm text-gray-500">
              <p>• Sale properties: 2% commission</p>
              <p>• Rent/Shortlet properties: 5% commission</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AffiliateTransactionHistory;