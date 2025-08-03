import { $requestWithoutToken, $requestWithToken } from "@/api/general";
import { IMeta } from "@/interface/general";
import { IProperty } from "@/interface/property";
import { addParamsToUrl } from "@/lib/general";

interface ICreatePropertyPayload {
  title: string;
  categoryId: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  toilets: string;
  stateId: string;
  cityId: string;
  address: string;
  street: string;
  price: string;
  currency: string;
  append: string;
  description: string;
}

// Add interface for search filters
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
}: {
  formData: FormData;
  accessToken: string;
}) => {
  try {
    const response = await $requestWithToken.postFormData<IProperty>(
      "/properties",
      accessToken,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

interface IFetchAllPropertiesResponse {
  data: IProperty[];
  meta: IMeta;
}

// export const fetchAllProperties = async (filters?: ISearchFilters) => {
//   try {
//     const params = new URLSearchParams();

//     if (filters?.categories?.length) {
//       params.append("categories", filters.categories.join(","));
//     }
//     if (filters?.locations?.length) {
//       params.append("locations", filters.locations.join(","));
//     }
//     if (filters?.pricing?.length) {
//       params.append("pricing", filters.pricing.join(","));
//     }
//     if (filters?.page) {
//       params.append("page", filters.page.toString());
//     }
//     if (filters?.limit) {
//       params.append("limit", filters.limit.toString());
//     }

//     const url = `/properties${
//       params.toString() ? `?${params.toString()}` : ""
//     }`;
//     const response =
//       await $requestWithoutToken.get<IFetchAllPropertiesResponse>(url);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// services/properties.service.ts
export const fetchAllProperties = async (filters?: {
  categories?: string[];
  locations?: string[];
  pricing?: string[];
  status?: string;
  search?: string;
}) => {
  try {
    const params = new URLSearchParams();

    if (filters?.categories?.length) {
      params.append("categories", filters.categories.join(","));
    }
    if (filters?.locations?.length) {
      params.append("locations", filters.locations.join(","));
    }
    if (filters?.pricing?.length) {
      params.append("pricing", filters.pricing.join(","));
    }
    if (filters?.status) {
      params.append("status", filters.status);
    }
    if (filters?.search) {
      params.append("search", filters.search);
    }

    const url = `/properties${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response =
      await $requestWithoutToken.get<IFetchAllPropertiesResponse>(url);
    return response;
  } catch (error) {
    throw error;
  }
};
export const searchProperties = async (filters: ISearchFilters) => {
  try {
    const params = new URLSearchParams();

    if (filters.categories?.length) {
      params.append("categories", filters.categories.join(","));
    }
    if (filters.locations?.length) {
      params.append("locations", filters.locations.join(","));
    }
    if (filters.pricing?.length) {
      params.append("pricing", filters.pricing.join(","));
    }
    if (filters.page) {
      params.append("page", filters.page.toString());
    }
    if (filters.limit) {
      params.append("limit", filters.limit.toString());
    }

    const url = `/properties${
      params.toString() ? `?${params.toString()}` : ""
    }`;
    const response =
      await $requestWithoutToken.get<IFetchAllPropertiesResponse>(url);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchMyProperties = async (
  token: string,
  query?: {
    categories?: string[];
    locations?: string[];
    pricing?: string[];
    status?: string;
    search?: string;
  }
) => {
      const params = new URLSearchParams();

  if (query?.status?.length) {
    params.append("status", query.status);}

  try {
    const response = await $requestWithToken.get<IFetchAllPropertiesResponse>(
      addParamsToUrl(`/properties/me`, query || {}),
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
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
  console.log({
    formData,
    accessToken,
    propertyId,
  });
  try {
    const response = await $requestWithToken.putFormData<IProperty>(
      `/properties/${propertyId}`,
      accessToken,
      formData
    );
    console.log("response", response?.data);
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchPropertyById = async (propertyId: string, token?: string) => {
  try {
    let response : any= null;

    if (!token) {
      response = await $requestWithoutToken.get<IProperty>(
        `/properties/${propertyId}`,
        "no-cache",
        {
          tags: ["getAProperty"],
        }
      );
    } else {
      response = await $requestWithToken.get<IProperty>(
        `/properties/${propertyId}`,
        token,
        "no-cache",
        {
          tags: ["getAProperty"],
        }
      );
    }
    return response;
  } catch (error) {
    throw error;
  }
};
