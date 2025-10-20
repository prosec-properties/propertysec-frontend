import { $requestWithToken } from "@/api/general";
import { IFetchOptions } from "@/interface/general";
import { buildNextTags } from "@/lib/cacheTags";
import { IProduct } from "@/interface/product";
import { IProperty } from "@/interface/property";

export interface IAffiliateShop {
  properties: IProperty[];
  products: IProduct[];
  totalItems: number;
}
export const fetchAffiliateShop = async (
  token: string,
  options?: IFetchOptions
) => {
  try {
    const nextConfig = buildNextTags(["affiliate-shop"], options);

    const response = await $requestWithToken.get<IAffiliateShop>(
      `/affiliates/myshop`,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const addToAffiliateShop = async (token: string, propertyId: string) => {
  const payload = {
    propertyId,
  };

  try {
    const response = await $requestWithToken.post<IAffiliateShop>(
      `/affiliate/add-to-shop`,
      token,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchAffiliateStats = async (
  token: string,
  options?: IFetchOptions
) => {
  try {
    const nextConfig = buildNextTags(["affiliate-stats"], options);

    const response = await $requestWithToken.get(
      `/affiliates/stats`,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response?.data;
  } catch (error) {
    throw error;
  }
};

export const fetchAffiliateTransactions = async (
  token: string,
  options?: IFetchOptions
) => {
  try {
    const nextConfig = buildNextTags(["affiliate-transactions"], options);

    const response = await $requestWithToken.get(
      `/transactions?type=property_purchase`,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response?.data || [];
  } catch (error) {
    throw error;
  }
};
