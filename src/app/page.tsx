import { authConfig } from "@/authConfig";
import GoogleOneTapLogin from "@/components/auth/GoogleOneTapLogin";
import FooterMenu from "@/components/footer/FooterMenu";
import HeaderMenu from "@/components/header/HeaderMenu";
import ImageSliderWrapper from "@/components/images/ImageSlider";
import ProductCard from "@/components/property/PropertyCard";
import ServicesCard from "@/components/services/ServicesCard";
import { ourServices } from "@/components/services/services";
import { PROPERTIES_ROUTE, MY_LISTING_ROUTE, ADMIN_PROPERTIES_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { fetchAllProperties } from "@/services/properties.service";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await getServerSession(authConfig);

  if (session) {
    const user = session.user;

    console.log('User session:', user);
    
    switch (user.role) {
      case USER_ROLE.LANDLORD:
      case USER_ROLE.DEVELOPER:
      case USER_ROLE.LAWYER:
        redirect(MY_LISTING_ROUTE);
        break;
      case USER_ROLE.ADMIN:
        redirect(ADMIN_PROPERTIES_ROUTE);
        break;
      case USER_ROLE.BUYER:
      case USER_ROLE.AFFILIATE:
      default:
        redirect(PROPERTIES_ROUTE);
        break;
    }
  }

  let properties;
  try {
    properties = await fetchAllProperties();
  } catch (error) {
    console.error('Failed to fetch properties:', error);
    // Continue rendering the page without properties
  }

  const publishedProperties = properties?.data?.data?.filter(property => property.status === 'published') || [];
  const hasPublishedProperties = publishedProperties.length > 0;

  return (
    <main className="relative">
      <GoogleOneTapLogin />
      <HeaderMenu />
      <div className="relative">
        <ImageSliderWrapper />
      </div>
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <section className="mb-10">
          <h2 className="font-medium text-2xl text-grey8 md:text-3xl lg:text-4xl mb-6">
            What We Offer
          </h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:grid-cols-3 md:gap-8">
            {ourServices.map((service, index) => (
              <ServicesCard
                key={index}
                {...service}
                className="mb-8 last:mb-0 md:mb-0"
              />
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-medium text-2xl text-grey8 md:text-3xl lg:text-4xl mb-6">
            Featured Properties
          </h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
            {!properties && (
              <p className="col-span-full text-center text-gray-500">
                Unable to load properties. Please try again later.
              </p>
            )}
            {properties && !hasPublishedProperties && (
              <p className="col-span-full text-center text-gray-500">
                No published properties available at the moment.
              </p>
            )}
            {hasPublishedProperties && 
              publishedProperties.map((property, index) => (
                <ProductCard key={index} property={property} />
              ))
            }
          </div>
        </section>
      </div>
      <FooterMenu />
    </main>
  );
}
