"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ArrowLeft, FileText, Download, Calendar, DollarSign, Clock, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ILoan } from "@/interface/loan";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/payment";
import { getLoanById } from "@/services/loan.service";
import LoanRepayment from "./LoanRepayment";

interface LoanDetailProps {
  loanId: string;
}

const badgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "secondary";
    case "approved":
      return "default";
    case "rejected":
      return "destructive";
    case "disbursed":
      return "default";
    default:
      return "secondary";
  }
};

export default function LoanDetail({ loanId }: LoanDetailProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [loan, setLoan] = useState<ILoan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLoan = async () => {
      if (!session?.user?.token) return;
      
      try {
        setLoading(true);
        const response = await getLoanById(loanId, session.user.token);
        if (response?.success && response.data) {
          setLoan(response.data);
        } else {
          setError("Loan not found");
        }
      } catch (err) {
        setError("Failed to fetch loan details");
      } finally {
        setLoading(false);
      }
    };

    fetchLoan();
  }, [loanId, session?.user?.token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="h-20 bg-gray-200 rounded"></div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !loan) {
    return (
      <div className="min-h-screen bg-gray-50 py-6 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            variant="ghost"
            onClick={() => router.push("/loans")}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Loans
          </Button>
          <div className="bg-white rounded-lg p-8 text-center">
            <div className="text-gray-500">
              <h3 className="text-lg font-medium mb-2">Loan Not Found</h3>
              <p>{error || "The requested loan could not be found."}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => router.push("/loans")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Loans
          </Button>
          <Badge variant={badgeVariant(loan.loanStatus)} className="text-sm">
            {loan.loanStatus.toUpperCase()}
          </Badge>
        </div>

        {/* Loan Summary */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-blue-600" />
            <h1 className="text-2xl font-bold">Loan Details</h1>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Loan Amount</p>
              <p className="text-xl font-bold text-blue-600">
                {formatPrice(Number(loan.loanAmount))}
              </p>
            </div>
            <div className="p-4 bg-green-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Duration</p>
              <p className="text-lg font-semibold text-green-600">{loan.loanDuration}</p>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Interest Rate</p>
              <p className="text-lg font-semibold text-purple-600">{loan.interestRate}%</p>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Application Date</p>
              <p className="text-sm font-medium text-orange-600">{formatDate(loan.createdAt)}</p>
            </div>
          </div>

          {loan.reasonForFunds && (
            <div>
              <p className="text-sm text-gray-600 mb-2 font-medium">Reason for Funds</p>
              <div className="p-4 bg-gray-50 rounded-lg border-l-4 border-blue-400">
                <p className="text-gray-700">{loan.reasonForFunds}</p>
              </div>
            </div>
          )}
        </div>

        {/* Application Timeline */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Application Timeline</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div>
                <p className="font-medium">Application Submitted</p>
                <p className="text-sm text-gray-600">{formatDate(loan.createdAt)}</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                loan.loanStatus === "pending" ? "bg-yellow-500" :
                loan.loanStatus === "approved" || loan.loanStatus === "disbursed" ? "bg-green-500" :
                "bg-red-500"
              }`}></div>
              <div>
                <p className="font-medium">
                  {loan.loanStatus === "pending" ? "Under Review" :
                   loan.loanStatus === "approved" ? "Approved" :
                   loan.loanStatus === "rejected" ? "Rejected" :
                   "Disbursed"}
                </p>
                <p className="text-sm text-gray-600">
                  {loan.loanStatus === "pending" ? "Awaiting review" : formatDate(loan.updatedAt)}
                </p>
              </div>
            </div>

            {loan.loanStatus === "approved" && (
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div>
                  <p className="font-medium text-gray-500">Disbursement</p>
                  <p className="text-sm text-gray-600">Pending</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Supporting Documents */}
        {loan.files && loan.files.length > 0 && (
          <div className="bg-white rounded-lg border shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Supporting Documents</h2>
              <Badge variant="outline">{loan.files.length} files</Badge>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {loan.files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <FileText className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="font-medium capitalize truncate">
                        {file.fileType.replace("_", " ")}
                      </p>
                      <p className="text-sm text-gray-600 truncate">
                        {file.fileName || "Document"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(file.fileUrl, "_blank")}
                    className="flex items-center gap-1 flex-shrink-0"
                  >
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">View</span>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Application Information */}
        <div className="bg-white rounded-lg border shadow-sm p-6">
          <div className="flex items-center gap-2 mb-4">
            <User className="w-5 h-5 text-gray-600" />
            <h2 className="text-lg font-semibold">Application Information</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Application ID</p>
              <p className="font-medium font-mono">{loan.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Form Status</p>
              <Badge variant={loan.hasCompletedForm ? "default" : "secondary"}>
                {loan.hasCompletedForm ? "Complete" : "Incomplete"}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Last Updated</p>
              <p className="font-medium">{formatDate(loan.updatedAt)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Documents</p>
              <p className="font-medium">{loan.files?.length || 0} files uploaded</p>
            </div>
          </div>
        </div>

        {/* Loan Repayment Section */}
        {(loan.loanStatus === "disbursed" || loan.loanStatus === "overdue" || loan.loanStatus === "completed") && (
          <LoanRepayment loanId={loan.id} loanStatus={loan.loanStatus} />
        )}
      </div>
    </div>
  );
}
