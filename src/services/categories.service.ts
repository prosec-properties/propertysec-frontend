import { $requestWithoutToken } from "@/api/general";
import { ICategory } from "@/interface/category";
import { ICategoryType } from "@/interface/file";
import { safeServiceCall } from "@/lib/safeService";

export const fetchCategories = async (type?: ICategoryType) => {
  return safeServiceCall(async () => {
    const response = await $requestWithoutToken.get<ICategory[]>(
      `/categories?type=${type}`,
      "force-cache"
    );
    return response;
  });
};
