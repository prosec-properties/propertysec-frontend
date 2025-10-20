"use client";

import React, { useState } from "react";
import { ILoanWithDetails } from "@/interface/loan";
import { formatDate } from "@/lib/date";
import { formatPrice } from "@/lib/payment";
import Status from "../misc/Status";
import CustomButton from "../buttons/CustomButton";
import { approveLoan, rejectLoan } from "@/services/admin.service";
import { useRouter } from "next/navigation";
import { ADMIN_LOANS_ROUTE } from "@/constants/routes";
import { Badge } from "../ui/badge";
import { Separator } from "../ui/separator";
import { Button } from "../ui/button";
import { useSession } from "next-auth/react";
import { useToast } from "../ui/use-toast";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  DollarSign, 
  FileText, 
  CheckCircle,
  XCircle,
  ArrowLeft,
  Download,
  AlertCircle,
  Clock,
  Building,
  CreditCard,
  Shield,
  Home,
  Users,
  Briefcase,
  Target,
  ChevronDown,
  ChevronUp,
  Eye,
  EyeOff
} from "lucide-react";
import { revalidateCacheTags } from "@/actions/cache";

interface Props {
  loan: ILoanWithDetails;
}

const LoanDetail = ({ loan }: Props) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { toast } = useToast();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loanStatus, setLoanStatus] = useState(loan.loanStatus);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    personal: true,
    bank: false,
    employment: false,
    guarantor: false,
    landlord: false,
  });
  const [actionFeedback, setActionFeedback] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const revalidateLoanData = () => {
    revalidateCacheTags([
      "admin-loan-requests",
      "admin-loan-stats",
      `admin-loan-${loan.id}`,
      `loan-${loan.id}`,
      "user-loans",
    ]).catch((error) => {
      console.error("Failed to revalidate loan tags:", error);
    });
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleApproveLoan = async () => {
    if (!session?.accessToken) {
      toast({
        title: "Authentication Error",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }

    setIsApproving(true);
    setActionFeedback({ type: null, message: '' });
    
    try {
      const response = await approveLoan(session.accessToken, loan.id);
      if (response?.success) {
        setLoanStatus("approved");
        setActionFeedback({
          type: 'success',
          message: `Loan application for ${formatPrice(Number(loan.loanAmount))} has been approved successfully. The applicant will be notified.`
        });
        
        toast({
          title: "Loan Approved",
          description: "The loan application has been approved successfully.",
          variant: "default",
        });

        revalidateLoanData();
        
        setTimeout(() => {
          router.push(ADMIN_LOANS_ROUTE);
        }, 2000);
      } else {
        throw new Error("Failed to approve loan");
      }
    } catch (error) {
      setActionFeedback({
        type: 'error',
        message: 'Failed to approve loan. Please try again.'
      });
      
      toast({
        title: "Approval Failed",
        description: "Failed to approve loan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsApproving(false);
    }
  };

  const handleRejectLoan = async () => {
    if (!session?.accessToken) {
      toast({
        title: "Authentication Error",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejecting this loan application.",
        variant: "destructive",
      });
      return;
    }
    
    setIsRejecting(true);
    setActionFeedback({ type: null, message: '' });
    
    try {
      const response = await rejectLoan(session.accessToken, loan.id, rejectionReason);
      if (response?.success) {
        setLoanStatus("rejected");
        setActionFeedback({
          type: 'success',
          message: `Loan application for ${formatPrice(Number(loan.loanAmount))} has been rejected. The applicant has been notified with the provided reason.`
        });
        
        toast({
          title: "Loan Rejected",
          description: "The loan application has been rejected and the applicant has been notified.",
          variant: "default",
        });

        revalidateLoanData();
        
        setTimeout(() => {
          router.push(ADMIN_LOANS_ROUTE);
        }, 2000);
      } else {
        throw new Error("Failed to reject loan");
      }
    } catch (error) {
      setActionFeedback({
        type: 'error',
        message: 'Failed to reject loan. Please try again.'
      });
      
      toast({
        title: "Rejection Failed",
        description: "Failed to reject loan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsRejecting(false);
      setShowRejectDialog(false);
    }
  };

  const getLoanStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "pending";
      case "approved":
        return "active";
      case "rejected":
        return "inactive";
      case "disbursed":
        return "active";
      default:
        return "inactive";
    }
  };

  const getLoanStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "pending":
        return "secondary";
      case "approved":
        return "default";
      case "rejected":
        return "destructive";
      case "disbursed":
        return "outline";
      default:
        return "secondary";
    }
  };

  const getLoanStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "disbursed":
        return <CheckCircle className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Action Feedback Banner */}
        {actionFeedback.type && (
          <div className={`p-4 rounded-lg border-l-4 transition-all duration-500 ease-in-out ${
            actionFeedback.type === 'success' 
              ? 'bg-green-50 border-green-400 text-green-800' 
              : 'bg-red-50 border-red-400 text-red-800'
          }`}>
            <div className="flex items-center gap-3">
              {actionFeedback.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 animate-bounce" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 animate-pulse" />
              )}
              <div>
                <h4 className="font-medium">
                  {actionFeedback.type === 'success' ? 'Action Completed Successfully' : 'Action Failed'}
                </h4>
                <p className="text-sm mt-1">{actionFeedback.message}</p>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push(ADMIN_LOANS_ROUTE)}
                className="flex items-center gap-2 hover:bg-gray-100"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Back to Loans</span>
              </Button>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Loan Application Details</h1>
                <p className="text-sm text-gray-600 mt-1">
                  Application ID: {loan.id.slice(-8).toUpperCase()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getLoanStatusBadgeVariant(loanStatus)} className="text-sm flex items-center gap-1">
                {getLoanStatusIcon(loanStatus)}
                {loanStatus.toUpperCase()}
              </Badge>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="xl:col-span-3 space-y-6">
            {/* Loan Summary */}
            <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
              <div className="flex items-center gap-2 mb-6">
                <DollarSign className="w-5 h-5 text-blue-600" />
                <h2 className="text-lg font-semibold">Loan Summary</h2>
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

              {loan.loanRequest && (
                <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {loan.loanRequest.noOfRooms && (
                    <div>
                      <p className="text-sm text-gray-600">Number of Rooms</p>
                      <p className="font-semibold">{loan.loanRequest.noOfRooms}</p>
                    </div>
                  )}
                  {loan.loanRequest.noOfYears && (
                    <div>
                      <p className="text-sm text-gray-600">Number of Years</p>
                      <p className="font-semibold">{loan.loanRequest.noOfYears}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Request Status</p>
                    <Badge variant="outline">{loan.loanRequest.status}</Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Applicant Information - Collapsible */}
            <div className="bg-white rounded-lg border shadow-sm">
              <button
                onClick={() => toggleSection('personal')}
                className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold">Personal Information</h2>
                </div>
                {expandedSections.personal ? (
                  <ChevronUp className="w-5 h-5 text-gray-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400" />
                )}
              </button>
              {expandedSections.personal && (
                <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                    <div className="flex items-start gap-3">
                      <User className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{loan.user?.fullName || 'N/A'}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Mail className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium break-all">{loan.user?.email || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">{loan.user?.phoneNumber || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Home Address</p>
                        <p className="font-medium">{(loan.user as any)?.homeAddress || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">State of Origin</p>
                        <p className="font-medium">{(loan.user as any)?.stateOfOrigin || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Nationality</p>
                        <p className="font-medium">{(loan.user as any)?.nationality || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Users className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Religion</p>
                        <p className="font-medium">{(loan.user as any)?.religion || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Shield className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Next of Kin</p>
                        <p className="font-medium">{(loan.user as any)?.nextOfKin || 'N/A'}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <Calendar className="w-4 h-4 text-gray-500 mt-1" />
                      <div>
                        <p className="text-sm text-gray-600">Member Since</p>
                        <p className="font-medium">{formatDate(loan.user?.createdAt || "")}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bank Information */}
            {loan.bank && (
              <div className="bg-white rounded-lg border shadow-sm">
                <button
                  onClick={() => toggleSection('bank')}
                  className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-5 h-5 text-green-600" />
                    <h2 className="text-lg font-semibold">Banking Information</h2>
                  </div>
                  {expandedSections.bank ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.bank && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-medium">{loan.bank.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-medium font-mono">{loan.bank.salaryAccountNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Average Salary</p>
                        <p className="font-medium text-green-600">{formatPrice(loan.bank.averageSalary || 0)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">NIN</p>
                        <p className="font-medium font-mono">{loan.bank.nin}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">BVN</p>
                        <p className="font-medium font-mono">{loan.bank.bvn}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Employment Information */}
            {loan.employment && (
              <div className="bg-white rounded-lg border shadow-sm">
                <button
                  onClick={() => toggleSection('employment')}
                  className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-purple-600" />
                    <h2 className="text-lg font-semibold">Employment Information</h2>
                  </div>
                  {expandedSections.employment ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.employment && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Office Name</p>
                        <p className="font-medium">{loan.employment.officeName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Employer Name</p>
                        <p className="font-medium">{loan.employment.employerName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Position</p>
                        <p className="font-medium">{loan.employment.positionInOffice}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Office Contact</p>
                        <p className="font-medium">{loan.employment.officeContact}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Office Address</p>
                        <p className="font-medium">{loan.employment.officeAddress}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Guarantor Information */}
            {loan.guarantor && (
              <div className="bg-white rounded-lg border shadow-sm">
                <button
                  onClick={() => toggleSection('guarantor')}
                  className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-orange-600" />
                    <h2 className="text-lg font-semibold">Guarantor Information</h2>
                  </div>
                  {expandedSections.guarantor ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.guarantor && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{loan.guarantor.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Email</p>
                        <p className="font-medium break-all">{loan.guarantor.email}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">{loan.guarantor.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Home Address</p>
                        <p className="font-medium">{loan.guarantor.homeAddress}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Office Address</p>
                        <p className="font-medium">{loan.guarantor.officeAddress}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Landlord Information */}
            {loan.landlord && (
              <div className="bg-white rounded-lg border shadow-sm">
                <button
                  onClick={() => toggleSection('landlord')}
                  className="w-full p-4 sm:p-6 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-red-600" />
                    <h2 className="text-lg font-semibold">Landlord Information</h2>
                  </div>
                  {expandedSections.landlord ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.landlord && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-gray-600">Name</p>
                        <p className="font-medium">{loan.landlord.name}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">{loan.landlord.phoneNumber}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Bank Name</p>
                        <p className="font-medium">{loan.landlord.bankName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Account Number</p>
                        <p className="font-medium font-mono">{loan.landlord.accountNumber}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Address</p>
                        <p className="font-medium">{loan.landlord.address}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Supporting Documents */}
            {loan.files && loan.files.length > 0 && (
              <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
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
          </div>

          {/* Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            {/* Quick Actions */}
            {loanStatus === "pending" && (
              <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <CustomButton
                    className="w-full flex items-center gap-2 justify-center"
                    onClick={handleApproveLoan}
                    disabled={isApproving || isRejecting}
                  >
                    {isApproving ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-4 h-4" />
                        Approve Loan
                      </>
                    )}
                  </CustomButton>

                  <div>
                    {!showRejectDialog ? (
                      <CustomButton
                        variant="destructive"
                        className="w-full flex items-center gap-2 justify-center"
                        onClick={() => setShowRejectDialog(true)}
                        disabled={isApproving || isRejecting}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject Loan
                      </CustomButton>
                    ) : (
                      <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
                        <h4 className="font-medium">Reject Loan Application</h4>
                        <p className="text-sm text-gray-600">
                          Please provide a reason for rejecting this loan application.
                          This will be sent to the applicant.
                        </p>
                        <textarea
                          placeholder="Enter reason for rejection..."
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full p-3 border rounded-md resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          rows={3}
                        />
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setShowRejectDialog(false);
                              setRejectionReason("");
                            }}
                            className="flex-1"
                            disabled={isRejecting}
                          >
                            Cancel
                          </Button>
                          <CustomButton
                            variant="destructive"
                            onClick={handleRejectLoan}
                            disabled={!rejectionReason.trim() || isRejecting}
                            className="flex-1 flex items-center gap-2 justify-center"
                          >
                            {isRejecting ? (
                              <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <XCircle className="w-4 h-4" />
                                Reject Loan
                              </>
                            )}
                          </CustomButton>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Status-based Action Results */}
            {(loanStatus === "approved" || loanStatus === "rejected") && (
              <div className={`bg-white rounded-lg border shadow-sm p-4 sm:p-6 ${
                loanStatus === "approved" ? "border-green-200" : "border-red-200"
              }`}>
                <div className="flex items-center gap-2 mb-3">
                  {loanStatus === "approved" ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <XCircle className="w-5 h-5 text-red-600" />
                  )}
                  <h3 className={`text-lg font-semibold ${
                    loanStatus === "approved" ? "text-green-800" : "text-red-800"
                  }`}>
                    Loan {loanStatus === "approved" ? "Approved" : "Rejected"}
                  </h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {loanStatus === "approved" 
                    ? "This loan application has been approved and the applicant has been notified. The next step is loan disbursement."
                    : "This loan application has been rejected and the applicant has been notified with the rejection reason."
                  }
                </p>
                {loanStatus === "approved" && (
                  <div className="p-3 bg-blue-50 rounded-md">
                    <p className="text-sm text-blue-800">
                      <strong>Next Steps:</strong> The loan will be processed for disbursement according to your institution&apos;s procedures.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Application Status Timeline */}
            <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Application Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p className="font-medium">Application Submitted</p>
                    <p className="text-sm text-gray-600">
                      {formatDate(loan.createdAt)}
                    </p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${
                    loanStatus === "pending" ? "bg-yellow-500" :
                    loanStatus === "approved" || loanStatus === "disbursed" ? "bg-green-500" :
                    "bg-red-500"
                  }`}></div>
                  <div>
                    <p className="font-medium">
                      {loanStatus === "pending" ? "Under Review" :
                       loanStatus === "approved" ? "Approved" :
                       loanStatus === "rejected" ? "Rejected" :
                       "Disbursed"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {loanStatus === "pending" ? "Awaiting admin review" :
                       formatDate(loan.updatedAt)}
                    </p>
                  </div>
                </div>

                {loanStatus === "approved" && (
                  <>
                    <Separator />
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                      <div>
                        <p className="font-medium text-gray-500">Disbursement</p>
                        <p className="text-sm text-gray-600">Pending</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-white rounded-lg border shadow-sm p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4">Application Summary</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Status</span>
                  <Status status={getLoanStatusColor(loanStatus)} />
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Profile Complete</span>
                  <Badge variant={loan.user?.hasCompletedProfile ? "default" : "secondary"}>
                    {loan.user?.hasCompletedProfile ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Form Complete</span>
                  <Badge variant={loan.hasCompletedForm ? "default" : "secondary"}>
                    {loan.hasCompletedForm ? "Yes" : "No"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Documents</span>
                  <Badge variant={(loan.files?.length || 0) > 0 ? "default" : "secondary"}>
                    {loan.files?.length || 0} files
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Bank Info</span>
                  <Badge variant={loan.bank ? "default" : "secondary"}>
                    {loan.bank ? "Complete" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Employment Info</span>
                  <Badge variant={loan.employment ? "default" : "secondary"}>
                    {loan.employment ? "Complete" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Guarantor Info</span>
                  <Badge variant={loan.guarantor ? "default" : "secondary"}>
                    {loan.guarantor ? "Complete" : "Missing"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Landlord Info</span>
                  <Badge variant={loan.landlord ? "default" : "secondary"}>
                    {loan.landlord ? "Complete" : "Missing"}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanDetail;
