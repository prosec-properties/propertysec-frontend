import { $requestWithoutToken } from "@/api/general";
import { ICountry } from "@/interface/location";

export const fetchCountries = async () => {
  try {
    const response = await $requestWithoutToken.get<ICountry[]>(
      "/countries",
      "force-cache"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchStates = async (countryId: string) => {
  try {
    const response = await $requestWithoutToken.get<ICountry[]>(
      `/countries/${countryId}/states`,
      "force-cache"
    );
    return response;
  } catch (error) {
    throw error;
  }
};

export const fetchACountry = async (countryId: string) => {
  try {
    const response = await $requestWithoutToken.get<ICountry>(
      `/countries/${countryId}`,
      "force-cache"
    );
    return response;
  } catch (error) {
    throw error;
  }
};
