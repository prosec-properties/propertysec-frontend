import { $requestWithoutToken } from "@/api/general";
import { ICountry } from "@/interface/location";

export const fetchCountries = async () => {
    try {
      const response = await $requestWithoutToken.get<ICountry[]>("/countries");
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  export const fetchStates = async (countryId: string) => {
    try {
      const response = await $requestWithoutToken.get<ICountry[]>(`/countries/${countryId}/states`);
      return response;
    } catch (error) {
      throw error;
    }
  };
  
  
  export const fetchACountry = async (countryId: string) => {
    try {
      const response = await $requestWithoutToken.get<ICountry>(`/countries/${countryId}`);
      return response;
    } catch (error) {
      throw error;
    }
  };