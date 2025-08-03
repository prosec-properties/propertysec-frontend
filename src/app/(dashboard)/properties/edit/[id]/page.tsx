import { authConfig } from "@/authConfig";
import PropertyForm from "@/components/forms/PropertyForm";
import { HOME_ROUTE, SIGN_IN_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { $requestWithoutToken } from "@/api/general";
import ErrorDisplay from "@/components/misc/ErrorDisplay";
import { isNotAnEmptyArray } from "@/lib/general";
import { ICategory } from "@/interface/category";
import { IProperty } from "@/interface/property";
import { ICountry } from "@/interface/location";

const NIGERIAN_COUNTRY_ID = "161";

interface IProps{
  params: Promise<{
    id: string
  }>
}

async function Page(props: IProps) {
  const session = await getServerSession(authConfig);
  const params = await props.params

  if (!session) {
    redirect(SIGN_IN_ROUTE);
  }

  if (session.user.role === USER_ROLE.BUYER) {
    redirect(HOME_ROUTE);
  }

  const [country, categories, property] = await Promise.all([
    $requestWithoutToken.get<ICountry>(`/countries/${NIGERIAN_COUNTRY_ID}`),
    $requestWithoutToken.get<ICategory[]>("/categories"),
    $requestWithoutToken.get<IProperty>(`/properties/${params.id}`),
  ]);

  if (
    !country?.success ||
    !isNotAnEmptyArray<ICategory>(categories?.data as ICategory[]) ||
    !property?.success
  ) {
    return <ErrorDisplay />;
  }

  return (
    <PropertyForm
      country={country.data}
      categories={categories?.data || []}
      property={property.data}
      mode="edit"
    />
  );
}

export default Page; 