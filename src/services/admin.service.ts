import { $requestWithToken } from "@/api/general";
import { IFetchOptions, IMeta } from "@/interface/general";
import { ILoan, ILoanSummary } from "@/interface/loan";
import { IUser, IUserRole } from "@/interface/user";
import { IFetchAllPropertiesResponse } from "./properties.service";

interface IResponse {
  users: IUser[];
  meta?: IMeta;
  totalUsers: number | string;
  subscribedUsers: number | string;
}
export const fetchAllUsers = async (
  token: string,
  searchParams?: {
    search?: string;
    page?: number;
    per_page?: number;
    role?: IUserRole | "all";
  },
  options?: IFetchOptions
) => {
  try {
    const params = new URLSearchParams();

    if (searchParams?.search) {
      params.append("search", searchParams.search);
    }
    if (searchParams?.page) {
      params.append("page", searchParams.page.toString());
    }
    if (searchParams?.per_page) {
      params.append("per_page", searchParams.per_page.toString());
    }
    if (searchParams?.role && searchParams.role !== "all") {
      params.append("role", searchParams.role);
    }

    const url = `/admin/users${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set(["admin-users", ...(options.next.tags ?? [])])
          ),
        }
      : { tags: ["admin-users"] };

    const response = await $requestWithToken.get<IResponse>(
      url,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

interface ILoanRequestsResponse {
  data: ILoan[];
  meta?: IMeta;
  statistics?: {
    totalLoans: number;
    activeLoans: number;
    completedLoans: number;
  };
}
export const fetchSubscribedUsers = async (
  token: string,
  options?: IFetchOptions
) => {
  try {
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set(["admin-subscribed-users", ...(options.next.tags ?? [])])
          ),
        }
      : { tags: ["admin-subscribed-users"] };

    const response = await $requestWithToken.get<IUser>(
      "/subscribed-users",
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const loanRequests = async (
  token: string,
  searchParams?: { search?: string; page?: number; limit?: number },
  options?: IFetchOptions
) => {
  try {
    const params = new URLSearchParams();

    if (searchParams?.search) {
      params.append("search", searchParams.search);
    }
    if (searchParams?.page) {
      params.append("page", searchParams.page.toString());
    }
    if (searchParams?.limit) {
      params.append("limit", searchParams.limit.toString());
    }

    const url = `/loans/loan-requests${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set(["admin-loan-requests", ...(options.next.tags ?? [])])
          ),
        }
      : { tags: ["admin-loan-requests"] };

    const response = await $requestWithToken.get<ILoanRequestsResponse>(
      url,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const loanStats = async (token: string, options?: IFetchOptions) => {
  try {
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set(["admin-loan-stats", ...(options.next.tags ?? [])])
          ),
        }
      : { tags: ["admin-loan-stats"] };

    const response = await $requestWithToken.get<ILoanSummary>(
      "/loans/loan-stats",
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteAccount = async (token: string, userId: string) => {
  try {
    const response = await $requestWithToken.delete(`/users/${userId}`, token);
    return response;
  } catch (error) {
    throw error;
  }
};

export const getLoanDetails = async (
  token: string,
  loanId: string,
  options?: IFetchOptions
) => {
  try {
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set([
              `admin-loan-${loanId}`,
              ...(options.next.tags ?? []),
            ])
          ),
        }
      : { tags: [`admin-loan-${loanId}`] };

    const response = await $requestWithToken.get<ILoan>(
      `/loans/${loanId}`,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const approveLoan = async (token: string, loanId: string) => {
  try {
    const response = await $requestWithToken.patch(
      `/loans/${loanId}/approve`,
      token,
      {}
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const rejectLoan = async (
  token: string,
  loanId: string,
  reason?: string
) => {
  try {
    const response = await $requestWithToken.patch(
      `/loans/${loanId}/reject`,
      token,
      { reason }
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const disburseLoan = async (token: string, loanId: string) => {
  try {
    const response = await $requestWithToken.patch(
      `/loans/${loanId}/disburse`,
      token,
      {}
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const impersonateUser = async (token: string, userId: string) => {
  try {
    const response = await $requestWithToken.post(
      `/admin/impersonate/${userId}`,
      token,
      {}
    );
    return response;
  } catch (error) {
    throw error;
  }
};

interface IUserPropertiesResponse {
  properties: any[];
  meta?: IMeta;
  user: IUser;
}

export const fetchUserProperties = async (
  token: string,
  userId: string,
  searchParams?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    order?: string;
    status?: string;
  },
  options?: IFetchOptions
) => {
  try {
    const params = new URLSearchParams();

    if (searchParams?.page) {
      params.append("page", searchParams.page.toString());
    }
    if (searchParams?.per_page) {
      params.append("per_page", searchParams.per_page.toString());
    }
    if (searchParams?.sort_by) {
      params.append("sort_by", searchParams.sort_by);
    }
    if (searchParams?.order) {
      params.append("order", searchParams.order);
    }

    if (searchParams?.status) {
      params.append("status", searchParams.status);
    }

    const url = `/admin/users/${userId}/properties${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set([
              "admin-user-properties",
              `admin-user-${userId}-properties`,
              ...(options.next.tags ?? []),
            ])
          ),
        }
      : {
          tags: ["admin-user-properties", `admin-user-${userId}-properties`],
        };

    const response = await $requestWithToken.get<IUserPropertiesResponse>(
      url,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateUserProperty = async (
  token: string,
  userId: string,
  propertyId: string,
  updateData: any
) => {
  try {
    const response = await $requestWithToken.patch(
      `/admin/users/${userId}/properties/${propertyId}`,
      token,
      updateData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

interface IAffiliatePropertiesResponse {
  properties: any[];
  meta?: IMeta;
  affiliate: IUser;
}

export const fetchAffiliateProperties = async (
  token: string,
  affiliateId: string,
  searchParams?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    order?: string;
  },
  options?: IFetchOptions
) => {
  try {
    const params = new URLSearchParams();

    if (searchParams?.page) {
      params.append("page", searchParams.page.toString());
    }
    if (searchParams?.per_page) {
      params.append("per_page", searchParams.per_page.toString());
    }
    if (searchParams?.sort_by) {
      params.append("sort_by", searchParams.sort_by);
    }
    if (searchParams?.order) {
      params.append("order", searchParams.order);
    }

    const url = `/admin/affiliates/${affiliateId}/properties${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set([
              "admin-affiliate-properties",
              `admin-affiliate-${affiliateId}-properties`,
              ...(options.next.tags ?? []),
            ])
          ),
        }
      : {
          tags: [
            "admin-affiliate-properties",
            `admin-affiliate-${affiliateId}-properties`,
          ],
        };

    const response = await $requestWithToken.get<IAffiliatePropertiesResponse>(
      url,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

interface IBuyerInspectedPropertiesResponse {
  inspections: any[];
  meta?: IMeta;
  buyer: IUser;
}

export const fetchBuyerInspectedProperties = async (
  token: string,
  buyerId: string,
  searchParams?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    order?: string;
  },
  options?: IFetchOptions
) => {
  try {
    const params = new URLSearchParams();

    if (searchParams?.page) {
      params.append("page", searchParams.page.toString());
    }
    if (searchParams?.per_page) {
      params.append("per_page", searchParams.per_page.toString());
    }
    if (searchParams?.sort_by) {
      params.append("sort_by", searchParams.sort_by);
    }
    if (searchParams?.order) {
      params.append("order", searchParams.order);
    }

    const url = `/admin/buyers/${buyerId}/inspected-properties${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set([
              "admin-buyer-inspections",
              `admin-buyer-${buyerId}-inspections`,
              ...(options.next.tags ?? []),
            ])
          ),
        }
      : {
          tags: [
            "admin-buyer-inspections",
            `admin-buyer-${buyerId}-inspections`,
          ],
        };

    const response =
      await $requestWithToken.get<IBuyerInspectedPropertiesResponse>(
        url,
        token,
        options?.cache ?? "force-cache",
        nextConfig
      );
    return response;
  } catch (error) {
    throw error;
  }
};

interface IBuyerPurchasedPropertiesResponse {
  purchases: any[];
  meta?: IMeta;
  buyer: IUser;
}

export const fetchBuyerPurchasedProperties = async (
  token: string,
  buyerId: string,
  searchParams?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    order?: string;
  },
  options?: IFetchOptions
) => {
  try {
    const params = new URLSearchParams();

    if (searchParams?.page) {
      params.append("page", searchParams.page.toString());
    }
    if (searchParams?.per_page) {
      params.append("per_page", searchParams.per_page.toString());
    }
    if (searchParams?.sort_by) {
      params.append("sort_by", searchParams.sort_by);
    }
    if (searchParams?.order) {
      params.append("order", searchParams.order);
    }

    const url = `/admin/buyers/${buyerId}/purchased-properties${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set([
              "admin-buyer-purchases",
              `admin-buyer-${buyerId}-purchases`,
              ...(options.next.tags ?? []),
            ])
          ),
        }
      : {
          tags: [
            "admin-buyer-purchases",
            `admin-buyer-${buyerId}-purchases`,
          ],
        };

    const response =
      await $requestWithToken.get<IBuyerPurchasedPropertiesResponse>(
        url,
        token,
        options?.cache ?? "force-cache",
        nextConfig
      );
    return response;
  } catch (error) {
    throw error;
  }
};

interface IPropertyPurchasesResponse {
  purchases: any[];
  meta?: IMeta;
}

export const fetchPropertyPurchases = async (
  token: string,
  propertyId: string,
  searchParams?: {
    page?: number;
    per_page?: number;
    sort_by?: string;
    order?: string;
    status?: string;
  },
  options?: IFetchOptions
) => {
  try {
    const params = new URLSearchParams();

    if (searchParams?.page) {
      params.append("page", searchParams.page.toString());
    }
    if (searchParams?.per_page) {
      params.append("per_page", searchParams.per_page.toString());
    }
    if (searchParams?.sort_by) {
      params.append("sort_by", searchParams.sort_by);
    }
    if (searchParams?.order) {
      params.append("order", searchParams.order);
    }
    if (searchParams?.status) {
      params.append("status", searchParams.status);
    }

    const url = `/admin/properties/${propertyId}/purchases${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set([
              "admin-property-purchases",
              `admin-property-${propertyId}-purchases`,
              ...(options.next.tags ?? []),
            ])
          ),
        }
      : {
          tags: [
            "admin-property-purchases",
            `admin-property-${propertyId}-purchases`,
          ],
        };

    const response = await $requestWithToken.get<IPropertyPurchasesResponse>(
      url,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchAllPropertiesAdmin = async (
  token: string,
  filters?: {
    categories?: string[] | string;
    locations?: string[] | string;
    pricing?: string[] | string;
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  },
  options?: IFetchOptions
) => {
  try {
    const params = new URLSearchParams();

    if (filters?.categories) {
      const categories = Array.isArray(filters.categories)
        ? filters.categories
        : JSON.parse(filters.categories);
      params.append("categories", JSON.stringify(categories));
    }
    if (filters?.locations) {
      const locations = Array.isArray(filters.locations)
        ? filters.locations
        : JSON.parse(filters.locations);
      params.append("locations", JSON.stringify(locations));
    }
    if (filters?.pricing) {
      const pricing = Array.isArray(filters.pricing)
        ? filters.pricing
        : JSON.parse(filters.pricing);
      params.append("pricing", JSON.stringify(pricing));
    }
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

    const url = `/admin/properties${
      params.toString() ? `?${params.toString()}` : ""
    }`;

    const nextConfig = options?.next
      ? {
          ...options.next,
          tags: Array.from(
            new Set(["admin-properties", ...(options.next.tags ?? [])])
          ),
        }
      : { tags: ["admin-properties"] };

    const response = await $requestWithToken.get<IFetchAllPropertiesResponse>(
      url,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};
