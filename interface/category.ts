export interface ICategory {
  id: string;
  name: string;
  description: string;
  status: "active" | "inactive";
  slug: string;
  meta?: string;
  createdAt: string;
  updatedAt: string;
  subcategories: ISubcategory[];
}

export interface ISubcategory {
  id: string;
  name: string;
  categoryId: string;
  createdAt: string;
  updatedAt: string;
}
