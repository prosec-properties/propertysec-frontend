import { authConfig } from "@/authConfig";
import ProductForm from "@/components/forms/ProductForm";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { $requestWithoutToken } from "@/api/general";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { isNotAnEmptyArray } from "@/lib/general";
import { ICategory } from "@/interface/category";
import { fetchCategories } from "@/services/categories.service";
import { NIGERIAN_COUNTRY_ID } from "@/constants/general";
import { fetchACountry } from "@/services/location.service";
import { ICountry } from "@/interface/location";

async function Page() {
  const session = await getServerSession(authConfig);

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }

  if (session.user.role === USER_ROLE.BUYER) {
    redirect(HOME_ROUTE);
  }

  // console.log("Hiiii");

  const [categories, country] = await Promise.all([
    fetchCategories("product"),
    fetchACountry(NIGERIAN_COUNTRY_ID),
  ]);

  if (
    !isNotAnEmptyArray<ICategory>(categories?.data as ICategory[]) ||
    !country ||
    !country?.success
  ) {
    return <ErrorDisplay />;
  }

  return (
    <ProductForm
      categories={categories?.data || []}
      country={country?.data as ICountry}
    />
  );
}

export default Page;
