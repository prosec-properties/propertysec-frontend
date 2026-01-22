import { $requestWithoutToken } from "@/api/general";
import { ICountry } from "@/interface/location";
import { safeServiceCall } from "@/lib/safeService";

export const fetchCountries = async () => {
  return safeServiceCall(async () => {
    const response = await $requestWithoutToken.get<ICountry[]>(
      "/countries",
      "force-cache"
    );
    return response;
  });
};

export const fetchStates = async (countryId: string) => {
  return safeServiceCall(async () => {
    const response = await $requestWithoutToken.get<ICountry[]>(
      `/countries/${countryId}/states`,
      "force-cache"
    );
    return response;
  });
};

export const fetchACountry = async (countryId: string) => {
  return safeServiceCall(async () => {
    const response = await $requestWithoutToken.get<ICountry>(
      `/countries/${countryId}`,
      "force-cache"
    );
    return response;
  });
};
