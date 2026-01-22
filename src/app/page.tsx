import { authConfig } from "@/authConfig";
import GoogleOneTapLogin from "@/components/auth/GoogleOneTapLogin";
import FooterMenu from "@/components/footer/FooterMenu";
import HeaderMenu from "@/components/header/HeaderMenu";
import ImageSliderWrapper from "@/components/images/ImageSlider";
import ServicesCard from "@/components/services/ServicesCard";
import { ourServices } from "@/components/services/services";
import { PROPERTIES_ROUTE, MY_LISTING_ROUTE, ADMIN_PROPERTIES_ROUTE } from "@/constants/routes";
import { USER_ROLE } from "@/constants/user";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import Spinner from "@/components/misc/Spinner";

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
          <Suspense fallback={<Spinner fullScreen={false} size="md" message="Loading properties..." />}>
            <FeaturedProperties />
          </Suspense>
        </section>
      </div>
      <FooterMenu />
    </main>
  );
}
