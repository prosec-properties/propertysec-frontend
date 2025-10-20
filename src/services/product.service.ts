import { $requestWithoutToken, $requestWithToken } from "@/api/general";
import { IMeta, IFetchOptions } from "@/interface/general";
import { buildNextTags } from "@/lib/cacheTags";
import {
  IProduct,
  IProductCondition,
  IProductStatus,
} from "@/interface/product";

interface ICreateProductPayload {
  title: string;
  description: string;
  condition?: IProductCondition;
  status?: IProductStatus;
  brand?: string;
  model?: string;
  specifications?: string;
  price: string;
  quantity: string;
  negotiable: boolean;
  categoryId: string;
  subcategoryId: string;
  countryId: string;
  stateId: string;
  cityId: string;
  address: string;
}

export const createProduct = async ({
  formData,
  accessToken,
}: {
  formData: FormData;
  accessToken: string;
}) => {
  try {
    const response = await $requestWithToken.postFormData<IProduct>(
      "/products",
      accessToken,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

interface IFetchAllProductsResponse {
  data: IProduct[];
  meta: IMeta;
}

interface IProductFilters {
  categoryId?: string;
  subcategoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  condition?: string;
  searchQuery?: string;
  page?: number;
  limit?: number;
}

export const fetchAllProducts = async (filters?: IProductFilters) => {
  try {
    const params = new URLSearchParams();

    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, String(value));
        }
      });
    }

    const response = await $requestWithoutToken.get<IFetchAllProductsResponse>(
      `/products?${params.toString()}`
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchMyProducts = async (token: string) => {
  try {
    const response = await $requestWithToken.get<IFetchAllProductsResponse>(
      "/products/me",
      token
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchProductById = async (
  productId: string,
  options?: IFetchOptions
) => {
  try {
    const nextConfig = buildNextTags([`product-${productId}`], options);

    const response = await $requestWithoutToken.get<IProduct>(
      `/products/${productId}`,
      options?.cache ?? "force-cache",
      nextConfig
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateProduct = async ({
  formData,
  accessToken,
  productId,
}: {
  formData: FormData;
  accessToken: string;
  productId: string;
}) => {
  try {
    const response = await $requestWithToken.putFormData<IProduct>(
      `/products/${productId}`,
      accessToken,
      formData
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const deleteProduct = async ({
  productId,
  accessToken,
}: {
  productId: string;
  accessToken: string;
}) => {
  try {
    const response = await $requestWithToken.delete(
      `/products/${productId}`,
      accessToken
    );
    return response;
  } catch (error) {
    throw error;
  }
};
