import { $requestWithToken } from "@/api/general";
import { IMeta, IApiResponse } from "@/interface/general";
import { InspectionDetail } from "@/interface/user";

interface IInspectionStatistics {
  totalInspections: number;
  completedInspections: number;
  approvedInspections: number;
}

interface IFetchInspectionPaymentsResponse
  extends IApiResponse<InspectionPaymentDetail[]> {
  statistics: IInspectionStatistics;
  meta: IMeta;
}

export interface InspectionPaymentDetail extends InspectionDetail {
  id: string;
  userId: string;
  propertyId: string;
  inspectionAmount: number;
  inspectionStatus: "PENDING" | "COMPLETED";
  inspectionReport: string;
  name: string;
  email: string;
  phoneNumber: string;
  status: string;
  inspectionDate: string;
  approvalStatus?: "approved" | "pending" | "rejected";
  amount?: number;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string;
  };
  property: {
    id: string;
    title: string;
    address: string;
    price: number;
  };
  meta?: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchInspectionPayments = async (
  token: string,
  filters?: {
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  }
) => {
  try {
    const params = new URLSearchParams();

    if (filters?.status) {
      params.append("status", filters.status);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }
    if (filters?.page) {
      params.append("page", filters.page.toString());
    }
    if (filters?.limit) {
      params.append("limit", filters.limit.toString());
    }

    const url = `/inspections${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response =
      await $requestWithToken.get<IFetchInspectionPaymentsResponse>(url, token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchInspectionPaymentById = async (
  token: string,
  inspectionId: string
) => {
  try {
    const response = await $requestWithToken.get<InspectionPaymentDetail>(
      `/inspections/${inspectionId}`,
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateInspectionApprovalStatus = async (
  token: string,
  inspectionId: string,
  approvalStatus: "approved" | "rejected"
) => {
  try {
    const response = await $requestWithToken.patch(
      `/inspections/${inspectionId}/approval`,
      token,
      { approvalStatus }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateInspectionStatus = async (
  token: string,
  inspectionId: string,
  inspectionStatus: "PENDING" | "COMPLETED"
) => {
  try {
    const response = await $requestWithToken.patch(
      `/inspections/${inspectionId}/status`,
      token,
      { inspectionStatus }
    );
    return response;
  } catch (error) {
    throw error;
  }
};
