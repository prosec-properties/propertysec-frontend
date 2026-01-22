import { $requestWithoutToken, $requestWithToken } from "@/api/general";
import { IFetchOptions, IMeta } from "@/interface/general";
import { IProperty } from "@/interface/property";
import { addParamsToUrl, safeJsonParse } from "@/lib/general";
import { buildNextTags } from "@/lib/cacheTags";
import { safeServiceCall } from "@/lib/safeService";

interface ISearchFilters {
  categories?: string[];
  locations?: string[];
  pricing?: string[];
  page?: number;
  limit?: number;
}

export const createProperty = async ({
  formData,
  accessToken,
  userId,
}: {
  formData: FormData;
  accessToken: string;
  userId?: string;
}) => {
  try {
    const url = userId ? `/admin/properties?userId=${userId}` : "/properties";
    const response = await $requestWithToken.postFormData<IProperty>(
      url,
      accessToken,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export interface IFetchAllPropertiesResponse {
  data: IProperty[];
  meta: IMeta;
}

export const fetchAllProperties = async (
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
  return safeServiceCall(async () => {
    const params = new URLSearchParams();

    if (filters?.categories) {
      const categories = Array.isArray(filters.categories)
        ? filters.categories
        : safeJsonParse(filters.categories, []);
      if (categories.length > 0) {
        params.append("categories", JSON.stringify(categories));
      }
    }
    if (filters?.locations) {
      const locations = Array.isArray(filters.locations)
        ? filters.locations
        : safeJsonParse(filters.locations, []);
      if (locations.length > 0) {
        params.append("locations", JSON.stringify(locations));
      }
    }
    if (filters?.pricing) {
      const pricing = Array.isArray(filters.pricing)
        ? filters.pricing
        : safeJsonParse(filters.pricing, []);
      if (pricing.length > 0) {
        params.append("pricing", JSON.stringify(pricing));
      }
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

    const url = `/properties${params.toString() ? `?${params.toString()}` : ""
      }`;
    const nextConfig = buildNextTags(["properties"], options);
    const response =
      await $requestWithoutToken.get<IFetchAllPropertiesResponse>(
        url,
        options?.cache ?? "force-cache",
        nextConfig
      );
    return response;
  });
};
export const searchProperties = async (
  filters: ISearchFilters,
  options?: IFetchOptions
) => {
  return safeServiceCall(async () => {
    const params = new URLSearchParams();

    if (filters.categories?.length) {
      params.append("categories", JSON.stringify(filters.categories));
    }
    if (filters.locations?.length) {
      params.append("locations", JSON.stringify(filters.locations));
    }
    if (filters.pricing?.length) {
      params.append("pricing", JSON.stringify(filters.pricing));
    }
    if (filters.page) {
      params.append("page", filters.page.toString());
    }
    if (filters.limit) {
      params.append("limit", filters.limit.toString());
    }

    const url = `/properties${params.toString() ? `?${params.toString()}` : ""
      }`;
    const nextConfig = buildNextTags(["properties"], options);

    const response = await $requestWithoutToken.get<IFetchAllPropertiesResponse>(
      url,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  });
};

export const fetchMyProperties = async (
  token: string,
  query?: {
    categories?: string[];
    locations?: string[];
    pricing?: string[];
    status?: string;
    search?: string;
    page?: number;
    limit?: number;
  },
  options?: IFetchOptions
) => {
  return safeServiceCall(async () => {
    const params = new URLSearchParams();

    if (query?.status?.length) {
      params.append("status", query.status);
    }

    const nextConfig = buildNextTags(["my-properties"], options);

    const response = await $requestWithToken.get<IFetchAllPropertiesResponse>(
      addParamsToUrl(`/properties/me`, query || {}),
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  });
};

export const updateProperty = async ({
  formData,
  accessToken,
  propertyId,
}: {
  formData: FormData;
  accessToken: string;
  propertyId: string;
}) => {
  try {
    const response = await $requestWithToken.putFormData<IProperty>(
      `/properties/${propertyId}`,
      accessToken,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchPropertyById = async (
  propertyId: string,
  token?: string,
  options?: IFetchOptions
) => {
  return safeServiceCall(async () => {
    const nextConfig = buildNextTags([`property-${propertyId}`], options);

    if (!token) {
      return $requestWithoutToken.get<IProperty>(
        `/properties/${propertyId}`,
        options?.cache ?? "force-cache",
        nextConfig
      );
    }

    return $requestWithToken.get<IProperty>(
      `/properties/${propertyId}`,
      token,
      options?.cache ?? "force-cache",
      nextConfig
    );
  });
};

export const deleteProperty = async ({
  accessToken,
  propertyId,
}: {
  propertyId: string;
  accessToken: string;
}) => {
  try {
    const response = await $requestWithToken.delete(
      `/properties/${propertyId}`,
      accessToken
    );
    return response;
  } catch (error) {
    throw error;
  }
};
