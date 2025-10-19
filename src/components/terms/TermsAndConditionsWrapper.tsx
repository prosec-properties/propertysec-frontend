import React from "react";

const TermsAndConditionsWrapper = () => {
  return (
    <main className="bg-blue100 pb-16">
      <section className="bg-primary text-white">
        <div className="mx-auto max-w-screen-xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="text-3xl font-semibold md:text-4xl">
            Terms &amp; Conditions
          </h1>
          <p className="mt-2 text-lg">Effective June 15, 2024.</p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-4xl mt-12 px-6 py-12 sm:px-12 lg:mt-16">
        <div className="space-y-10 text-greyBody">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              1. General Terms
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-grey8">Buyers</h3>
                <p className="leading-relaxed">
                  By engaging with PropertySec for property purchase or rental,
                  you agree that:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    All transactions involving properties showcased on
                    PropertySec require payment of commission to PropertySec. No
                    purchase or rental can proceed without remitting the agreed
                    commission to PropertySec.
                  </li>
                  <li>
                    Any attempt to bypass PropertySec protocols after showing
                    interest and receiving attention from PropertySec management
                    is strictly prohibited.
                  </li>
                  <li>
                    All payments related to property transactions must be
                    conducted through designated PropertySec accounts.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-grey8">
                  Property Listings
                </h3>
                <p className="leading-relaxed">
                  For individuals or entities listing properties on PropertySec
                  (direct owners, lawyers, developers, affiliates, property
                  managers):
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    You must upload accurate and up-to-date information about
                    properties that are directly under your control or for which
                    you have legal authorization.
                  </li>
                  <li>
                    You agree to provide copies of property ownership documents
                    for verification purposes upon request by PropertySec.
                  </li>
                  <li>
                    By submitting a property listing, you grant PropertySec the
                    exclusive right to market and facilitate the sale or rental
                    of your property. Any buyer introduced through PropertySec,
                    directly or indirectly, is considered PropertySec&apos;s
                    client.
                  </li>
                  <li>
                    PropertySec is entitled to receive commission from property
                    sales or rentals facilitated through its platform,
                    regardless of whether the sale or rental is completed with
                    or without explicit notice to PropertySec.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-grey8">
                  Loan Services
                </h3>
                <p className="leading-relaxed">
                  By applying for a loan through PropertySec, you agree to the
                  following terms:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    PropertySec reserves the right to take possession of your
                    property or possessions if you fail to complete loan
                    repayments within the agreed timeframe. We may lock your
                    apartment two weeks after default and may sell any of your
                    possessions to recover our funds.
                  </li>
                  <li>
                    Failure to repay loans on time will incur additional
                    interest charges of 10% for each day or week beyond the due
                    date.
                  </li>
                  <li>
                    By applying for a loan, you acknowledge and agree that
                    PropertySec has the right to undertake any necessary
                    actions, with or without your knowledge, to recover
                    outstanding loan amounts.
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-grey8">Rentals</h3>
                <p className="leading-relaxed">
                  When renting through PropertySec, you acknowledge and agree
                  that:
                </p>
                <ul className="list-disc space-y-2 pl-5">
                  <li>
                    All information provided to PropertySec regarding rental
                    properties must be truthful and accurate.
                  </li>
                  <li>
                    PropertySec is entitled to receive commission from rental
                    transactions processed through its platform.
                  </li>
                  <li>
                    Failure to remit commission to PropertySec may result in the
                    temporary lockdown of your rented apartment until commission
                    payment is settled. PropertySec reserves the right to
                    recover commission dues by seizing any of your possessions.
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              2. Disclaimer &amp; Limitations
            </h2>
            <p className="leading-relaxed">
              <span className="font-semibold text-grey8">
                Accuracy of Information:
              </span>{" "}
              PropertySec strives to ensure the accuracy and reliability of
              information provided on its platform but does not guarantee the
              completeness or suitability of any property listings, loan terms,
              or rental agreements.
            </p>
            <p className="leading-relaxed">
              <span className="font-semibold text-grey8">Liability:</span>{" "}
              PropertySec shall not be liable for any direct, indirect,
              incidental, special, consequential, or punitive damages arising
              from your use of its services, including but not limited to
              property transactions, loan defaults, or rental disputes.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              3. Privacy &amp; Security
            </h2>
            <p className="leading-relaxed">
              <span className="font-semibold text-grey8">Personal Data:</span>{" "}
              PropertySec respects your privacy and handles personal data in
              accordance with applicable data protection laws. By using our
              services, you consent to the collection, use, and disclosure of
              your personal information as outlined in our Privacy Policy.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">
              4. Governing Law
            </h2>
            <p className="leading-relaxed">
              Federal Republic of Nigeria, Abuja Jurisdiction: These terms and
              conditions shall be governed by and construed in accordance with
              the laws of the Federal Republic of Nigeria, Abuja, without regard
              to its conflict of law provisions.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-grey8">5. Amendments</h2>
            <p className="leading-relaxed">
              <span className="font-semibold text-grey8">Updates:</span>{" "}
              PropertySec reserves the right to update or modify these terms and
              conditions at any time with or without your consent. Changes will
              be effective immediately upon posting on our website or notifying
              you via other means.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TermsAndConditionsWrapper;
