import { $requestWithToken } from "@/api/general";
import { IMeta } from "@/interface/general";
import { Plan, Subscription } from "@/interface/payment";
import { IUser } from "@/interface/user";

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
  }
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
    const response = await $requestWithToken.get<ISubscriptionsResponse>(
      url,
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionDetails = async (
  token: string,
  subscriptionId: string
) => {
  try {
    const response = await $requestWithToken.get<ISubscriptionWithUser>(
      `/subscriptions/${subscriptionId}`,
      token,
      "force-cache"
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
  }
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
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};


