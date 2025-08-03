import React from "react";
import AboutService from "./Service";
import HouseIcon from "../icons/House";
import ListBulletsIcon from "../icons/ListBullets";
import CartIcon from "../icons/Cart";
import HandIcon from "../icons/Hand";
import StarIcon from "../icons/Star";
import CustomButton from "../buttons/CustomButton";
import ImageSliderWrapper from "../images/ImageSlider";

const AboutWrapper = () => {
  const aboutServices = [
    {
      title: "Property Search",
      icon: <HouseIcon />,
      description:
        "Property owners and real estate agents can list their properties on our platform, gaining exposure to a large pool of potential buyers and renters. Our robust listing management tools make it simple to showcase your property effectively.",
    },
    {
      title: "Listing Services",
      icon: <ListBulletsIcon />,
      description:
        "Explore a wide range of properties available for sale or rent. Our user-friendly interface allows you to refine your search based on location, price range, amenities, and more, ensuring you find the perfect place to call home.",
    },
    {
      title: "Property Products Marketplace",
      icon: <CartIcon />,
      description:
        "Suppliers of property-related products and services can also leverage PropertySec to reach their target audience. From furniture and decor to renovation services and legal advice, our marketplace connects sellers with interested buyers seamlessly.",
    },
    {
      title: "Loan Services",
      icon: <HandIcon />,
      description:
        "We understand that securing a home sometimes requires financial assistance. We offers competitive loan options tailored to your needs, whether you're looking to finance a home purchase or cover rental costs. Our flexible repayment plans ensure that you can manage your finances comfortably.",
    },
  ];

  const commitments = [
    {
      title: "Transparency",
      description:
        "We uphold clear and honest communication throughout your property journey, from browsing listings to finalizing transactions.",
    },
    {
      title: "Security",
      description:
        "Your personal information and financial data are safeguarded with industry-standard security measures, ensuring your peace of mind.",
    },
    {
      title: "Customer Satisfaction",
      description:
        "Our dedicated support team is always ready to assist you with any questions or concerns you may have. We strive to provide a seamless experience that exceeds your expectations.",
    },
  ];
  return (
    <div>
      <section className="mb-8 mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <h1 className="font-medium text-2xl text-grey8 md:text-3xl lg:text-4xl mb-6">
          About PropertySec
        </h1>
        <p className="text-base font-base text-greyBody row-span-3">
          Welcome to PropertySec, your premier destination for all things
          property-related. Whether you&apos;re searching for your dream home,
          looking to rent a new apartment, or seeking to sell your property,
          PropertySec is here to facilitate your journey with ease and
          efficiency.
        </p>
      </section>
      <section className=" mb-[3.75rem]">
        <ImageSliderWrapper />
      </section>
      <section className="bg-blue-100">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-medium text-2xl text-grey8 md:text-3xl lg:text-4xl mb-6">
            Our Services
          </h2>
          <p className="text-base font-base text-greyBody mb-6">
            At PropertySec, we offer a comprehensive platform that serves the
            needs of both property seekers and sellers:
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:items-stretch md:gap-8">
            {aboutServices.map((el, index) => (
              <AboutService
                icon={el.icon}
                title={el.title}
                description={el.description}
                key={index + el.title}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="">
        <div className="mx-auto max-w-screen-xl spac-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
          <h2 className="font-medium text-2xl text-grey8 md:text-3xl lg:text-4xl mb-6">
            Our Commitments
          </h2>
          <p className="text-base font-base text-greyBody mb-6">
            At PropertySec, we prioritize transparency, security, and customer
            satisfaction:
          </p>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 sm:items-stretch md:gap-8">
            {commitments.map((el, index) => (
              <AboutService
                isIconCentered
                icon={<StarIcon />}
                title={el.title}
                description={el.description}
                key={index + el.title}
              />
            ))}
          </div>
        </div>
      </section>
      <section className="text-center bg-blue-100">
        <div className="mx-auto max-w-screen-xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="font-medium text-2xl text-grey8 md:text-3xl lg:text-4xl mb-6">
            Get Started{" "}
          </h2>
          <div className="flex justify-center">
            <hr className="mb-4 bg-primary h-[0.5px] max-w-[31.25rem] w-full border-none" />
          </div>{" "}
          <p className="text-base font-base text-greyBody mb-6">
            Whether you&apos;re ready to find your next property, list your
            current one, or explore our loan options, PropertySec is here to
            simplify your experience. Join our community of property enthusiasts
            and let us help you achieve your real estate goals. <br /> <br />{" "}
            <br /> Welcome!!!
          </p>
          <CustomButton>Get Started</CustomButton>
        </div>
      </section>
    </div>
  );
};

export default AboutWrapper;
