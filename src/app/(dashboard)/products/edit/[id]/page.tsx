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
import { IProduct } from "@/interface/product";
import { ICountry } from "@/interface/location";

const NIGERIAN_COUNTRY_ID = "161";

interface IProps {
  params: Promise<{
    id: string;
  }>;
}

async function Page(props: IProps) {
  const session = await getServerSession(authConfig);
  const params = await props.params;

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }
  const user = session.user;

  if (user.role !== USER_ROLE.AFFILIATE && user.role !== USER_ROLE.ADMIN) {
    redirect(HOME_ROUTE);
  }

  const [country, categories, product] = await Promise.all([
    $requestWithoutToken.get<ICountry>(`/countries/${NIGERIAN_COUNTRY_ID}`),
    $requestWithoutToken.get<ICategory[]>("/categories"),
    $requestWithoutToken.get<IProduct>(`/products/${params.id}`),
  ]);

  if (
    !country?.success ||
    !isNotAnEmptyArray<ICategory>(categories?.data as ICategory[]) ||
    !product?.success
  ) {
    return <ErrorDisplay />;
  }

  return (
    <ProductForm
      country={country.data}
      categories={categories?.data || []}
      product={product.data}
      mode="edit"
    />
  );
}

export default Page;
