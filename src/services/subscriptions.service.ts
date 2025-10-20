import { $requestWithToken } from "@/api/general";
import { IFetchOptions, IMeta } from "@/interface/general";
import { Plan, Subscription } from "@/interface/payment";
import { IUser } from "@/interface/user";
import { buildNextTags } from "@/lib/cacheTags";

export interface ISubscriptionWithUser {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  meta: string;
  createdAt: string;
  updatedAt: string;
  user: IUser;
  plan: Plan;
  status: 'active' | 'expired';
  daysRemaining: number;
  isExpired: boolean;
}

export interface ISubscription {
  id: string;
  userId: string;
  planId: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  meta: string;
  createdAt: string;
  updatedAt: string;
  plan: Plan;
  // Backend calculated fields
  status: 'active' | 'expired';
  daysRemaining: number;
  isExpired: boolean;
}

interface ISubscriptionsResponse {
  data: ISubscriptionWithUser[];
  meta?: IMeta;
  total?: number;
  totalPerPage?: number;
  currentPage?: number;
  lastPage?: number;
  statistics?: {
    totalSubscriptions: number;
    activeSubscriptions: number;
    expiredSubscriptions: number;
  };
}

export const fetchAllSubscriptions = async (
  token: string,
  searchParams?: {
    search?: string;
    page?: number;
    limit?: number;
    status?: string;
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
    if (searchParams?.limit) {
      params.append("limit", searchParams.limit.toString());
    }
    if (searchParams?.status) {
      params.append("status", searchParams.status);
    }

    const url = `/subscriptions/subscribed-users${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const nextConfig = buildNextTags(["subscriptions"], options);

    const response = await $requestWithToken.get<ISubscriptionsResponse>(
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

export const getSubscriptionDetails = async (
  token: string,
  subscriptionId: string,
  options?: IFetchOptions
) => {
  try {
    const nextConfig = buildNextTags([`subscription-${subscriptionId}`], options);

    const response = await $requestWithToken.get<ISubscriptionWithUser>(
      `/subscriptions/${subscriptionId}`,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchSubscriptions = async (
  token: string,
  searchParams?: {
    search?: string;
    page?: number;
    limit?: number;
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
    if (searchParams?.limit) {
      params.append("limit", searchParams.limit.toString());
    }

    const url = `/subscriptions${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const nextConfig = buildNextTags(["subscriptions"], options);

    const response = await $requestWithToken.get<{
      success: boolean;
      message: string;
      data: {
        data: ISubscription[];
        meta?: IMeta;
        total?: number;
        totalPerPage?: number;
        currentPage?: number;
        lastPage?: number;
        statistics?: {
          totalSubscriptions: number;
          activeSubscriptions: number;
          expiredSubscriptions: number;
        };
      };
    }>(
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


