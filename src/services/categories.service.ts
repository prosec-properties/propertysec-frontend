import { $requestWithoutToken } from "@/api/general";
import { ICategory } from "@/interface/category";
import { ICategoryType } from "@/interface/file";

export const fetchCategories = async (type?: ICategoryType) => {
  try {
    const response = await $requestWithoutToken.get<ICategory[]>(`/categories?type=${type}`);
    return response;
  } catch (error) {
    throw error;
  }
};

