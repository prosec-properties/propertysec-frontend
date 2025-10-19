import React from "react";
import { footerData, socials } from "./footerData";
import Link from "next/link";
import NewsLetterInput from "./NewsLetterInput";
import Logo from "../misc/Logo";

const FooterMenu = () => {
  return (
    <footer className="bg-grey9 text-offWhite">
      <div className="mx-auto max-w-screen-xl space-y-8 px-4 py-16 sm:px-6 lg:space-y-16 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="p-2 md:py-3 md:px-4 bg-white rounded-[0.3125rem] max-w-[6rem] flex justify-center w-max md:w-full">
              <Logo />
            </div>
            <h2 className="mt-4">PROPERTY SEC</h2>

            <p className="mt-4 max-w-xs mb-8">
              Subscribe to our newsletter to receive updates about our latest
              products
            </p>

            <NewsLetterInput />
          </div>

          <div className="grid  grid-cols-1 gap-8 sm:grid-cols-2 lg:col-span-2 lg:grid-cols-4">
            {footerData.map((data, index) => (
              <div key={`${data.title}${index}`}>
                <p className="font-medium text-grey3">{data.title}</p>

                {data.title === "Contact Us" ? (
                  <div>
                    <ul className="mt-6 space-y-4 text-sm">
                      {data.links.map((link, index) => (
                        <li key={`${link} ${index}`}>
                          <p className="">{link.name}</p>
                        </li>
                      ))}
                    </ul>
                    <ul className="mt-8 flex gap-6 ">
                      {socials.map((social, index) => (
                        <li key={`${social.name}${index}`}>
                          <Link
                            href="#"
                            rel="noreferrer"
                            target="_blank"
                            className="text-gray-70 transition hover:opacity-75"
                            prefetch
                          >
                            <span className="sr-only">{social.name}</span>

                            <social.icon className="" />
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <ul className="mt-6 space-y-4 text-sm">
                    {data.links.map((link, index) => (
                      <li key={`${link} ${index}`}>
                        <Link
                          href={link.url}
                          className="transition hover:opacity-75 "
                          prefetch
                        >
                          {link.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-center">
          &copy; {new Date().getFullYear()} | Property Sec
        </p>
      </div>
    </footer>
  );
};

export default FooterMenu;
