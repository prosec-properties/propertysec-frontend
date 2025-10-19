import React from "react";

const PrivacyPolicyWrapper = () => {
  return (
    <main className="bg-blue100 pb-16">
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold md:text-4xl">Privacy Policy</h1>
          <p className="mt-2 text-lg">Effective June 15, 2024.</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl mt-12 px-6 py-12  sm:px-12 lg:mt-16">
        <div className="space-y-10 text-greyBody">
          <p className="leading-relaxed">
            Propertysec (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) is
            committed to protecting your privacy. This Privacy Policy explains
            how we collect, use, disclose, and safeguard your information when
            you visit our website [URL], use our services, or engage with us in
            other ways. Please read this policy carefully to understand our
            practices regarding your personal data and how we will treat it.
          </p>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              1. Information We Collect
            </h2>
            <p className="leading-relaxed">
              <span className="font-semibold text-grey8">
                Personal Information:
              </span>{" "}
              We may collect personal information such as your name, address,
              email address, phone number, financial information (e.g., credit
              scores, loan applications), and other relevant details when you
              interact with us.
            </p>
            <p className="leading-relaxed">
              <span className="font-semibold text-grey8">
                Non-personal Information:
              </span>{" "}
              We also collect non-personal information such as browser type, IP
              address, pages visited, and demographic data to improve our
              services and user experience.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              2. How We Use Your Information
            </h2>
            <p className="leading-relaxed">
              We may use the information we collect in the following ways:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                To provide and maintain our services, including processing loan
                applications and managing property transactions.
              </li>
              <li>
                To improve customer service and respond to your inquiries and
                requests.
              </li>
              <li>
                To personalize your experience and deliver content and offerings
                relevant to you.
              </li>
              <li>
                To detect, prevent, and address technical issues and fraud.
              </li>
              <li>
                To comply with legal obligations and enforce our policies.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              3. Sharing Your Information
            </h2>
            <p className="leading-relaxed">
              We do not sell, trade, or otherwise transfer your personal
              information to outside parties without your consent, except as
              described below:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                With service providers and partners who assist us in operating
                our business and providing services to you.
              </li>
              <li>
                When required by law or to protect our rights, property, or
                safety, or that of others.
              </li>
              <li>With your consent or at your direction.</li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              4. Security Of Your Information
            </h2>
            <p className="leading-relaxed">
              We implement reasonable security measures to protect your personal
              information from unauthorized access, alteration, disclosure, or
              destruction. However, no method of transmission over the internet
              or electronic storage is completely secure, and we cannot
              guarantee absolute security. Hence, you must avoid sharing your
              details with 3rd party in order to keep your details safe and
              secured.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              5. Your Choices
            </h2>
            <p className="leading-relaxed">
              You have choices regarding the collection, use, and sharing of
              your information:
            </p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                You may choose not to provide certain personal information,
                although it may affect your ability to use our services.
              </li>
              <li>
                You can update or correct your personal information by
                contacting us.
              </li>
              <li>
                You can opt-out of receiving promotional communications from us
                by following the instructions in those communications.
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              6. Children&apos;s Privacy
            </h2>
            <p className="leading-relaxed">
              Our services are not directed to individuals under the age of 18.
              We do not knowingly collect personal information from children
              under 18 without parental consent. If we learn that we have
              collected personal information from a child under 18 without
              parental consent, we will take steps to delete the information.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              7. Changes To This Privacy Policy
            </h2>
            <p className="leading-relaxed">
              We may update this Privacy Policy periodically to reflect changes
              in our practices or legal requirements. We will notify you of any
              material changes by posting the updated policy on our website or
              through other communication methods.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">8. Contact Us</h2>
            <p className="leading-relaxed">
              If you have any questions about this Privacy Policy or our
              practices, please contact us at{" "}
              <a
                className="text-primary underline"
                href="mailto:support@propertysec.com"
              >
                support@propertysec.com
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default PrivacyPolicyWrapper;
