import { $requestWithToken } from "@/api/general";
import { IProduct } from "@/interface/product";
import { IProperty } from "@/interface/property";

interface IAffiliateShop {
  properties: IProperty[];
  products: IProduct[];
  totalItems: number;
}
export const fetchAffiliateShop = async (token: string) => {
  try {
    const response = await $requestWithToken.get<IAffiliateShop>(`/affiliates/myshop`, token);
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

export const removeFromAffiliateShop = async (
  token: string,
  propertyId: string
) => {
  const payload = {
    propertyId,
  };

  try {
    const response = await $requestWithToken.post<IAffiliateShop>(
      `/affiliate/remove-from-shop`,
      token,
      payload
    );
    return response;
  } catch (error) {
    throw error;
  }
};
