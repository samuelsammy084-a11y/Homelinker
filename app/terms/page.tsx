import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | HomeLinker",
  description:
    "Read the HomeLinker Terms and Conditions governing accounts, property listings, payments, promotions and use of the HomeLinker property marketplace.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A227]">
          HomeLinker
        </p>

        <h1 className="mt-3 text-4xl font-black text-black">
          Terms & Conditions
        </h1>

        <p className="mt-6 leading-8 text-slate-600">
          These Terms & Conditions govern your use of HomeLinker. By accessing
          or using the HomeLinker website, creating an account, publishing a
          property listing, contacting another user, or using paid or free
          platform features, you agree to these terms.
        </p>

        {/* ABOUT HOMELINKER */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          About HomeLinker
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker is a property marketplace that helps people discover,
          advertise and connect around properties available for rent or sale
          in South Africa.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Unless specifically stated otherwise, HomeLinker is not the owner,
          landlord, estate agent, buyer, tenant or seller of properties listed
          by users on the platform.
        </p>

        {/* ACCOUNTS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          User Accounts
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          You are responsible for providing accurate account information and
          keeping your login credentials secure.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You must not use another person&apos;s account without permission,
          impersonate another person, create accounts for fraudulent purposes,
          or attempt to bypass HomeLinker&apos;s security controls.
        </p>

        {/* LISTINGS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Property Listings
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Users who publish properties are responsible for ensuring that their
          listings are accurate, lawful, current and not misleading.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You may only advertise a property if you are authorised to do so.
          You must not post properties that do not exist, properties you are
          not authorised to advertise, fraudulent listings, intentionally
          misleading information, or content designed to deceive other users.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Listing information should accurately describe the property,
          including its price, location, availability, photographs and other
          important details.
        </p>

        {/* DUPLICATES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Duplicate Listings
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Users must not repeatedly post the same property as multiple
          separate listings in an attempt to gain additional visibility or
          manipulate search results.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may automatically detect, reject, merge, hide or remove
          duplicate listings. If you need to update an existing property,
          you should edit the existing listing rather than creating another
          copy.
        </p>

        {/* PHOTOS / CONTENT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Photos and Listing Content
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          You must only upload photographs, descriptions and other content
          that you have the right to use.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          By submitting listing content to HomeLinker, you give HomeLinker
          permission to display, format, resize, distribute and promote that
          content as reasonably necessary to operate and promote the property
          marketplace and your listing.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You continue to retain any ownership rights you may have in content
          that you submit.
        </p>

        {/* CONTACT DETAILS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Contact Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may provide tools that allow property owners and
          interested users to communicate.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Property owners may be given controls over whether certain contact
          information, such as a telephone number, is made publicly available.
          Users should not misuse contact details obtained through HomeLinker
          for spam, harassment, fraud or unrelated marketing.
        </p>

        {/* USER RESPONSIBILITY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Property Transactions and User Responsibility
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Users are responsible for performing their own checks before paying
          deposits, signing agreements, viewing properties or entering into
          rental or purchase transactions.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker does not guarantee that every listing, property owner,
          landlord, tenant, buyer, seller or other user is genuine simply
          because information appears on the platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Verification features, where available, may provide additional
          information but should not be treated as a guarantee of a property,
          person, transaction or outcome.
        </p>

        {/* PAYMENTS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Paid Listings and Promotions
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may offer optional paid services such as featured
          listings, promoted listings, priority placement, subscriptions or
          other advertising and visibility products.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          The price, duration and benefits of a paid service will be shown
          before purchase. Paying for promotion does not guarantee a specific
          number of enquiries, views, tenants, buyers, sales or rental
          agreements.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Promoted or premium listings may receive increased visibility or
          priority placement, but HomeLinker does not guarantee that any paid
          listing will permanently remain in one fixed position.
        </p>

        {/* FREE FEATURES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Free and Promotional Access
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may offer free trials, free listing periods, promotional
          access, advertising-supported features or other limited free
          benefits.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Eligibility, duration and limits for free or promotional features
          may change. HomeLinker may introduce reasonable limits to prevent
          abuse and to maintain the sustainability of the platform.
        </p>

        {/* PAYMENTS / REFUNDS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Payments and Refunds
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Payments may be processed through third-party payment providers.
          Users may also be subject to the terms and privacy policies of those
          providers.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Refund eligibility, where applicable, may depend on the service
          purchased, whether the service has already been activated, and
          applicable consumer protection laws.
        </p>

        {/* PROHIBITED USE */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Prohibited Use
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          You must not use HomeLinker to engage in fraud, scams, harassment,
          unlawful discrimination, spam, malicious activity, security attacks,
          unauthorised data collection, misleading advertising, manipulation
          of listing rankings, or any activity that violates applicable law or
          the rights of another person.
        </p>

        {/* REPORTING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Reporting Listings
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Users may be able to report suspicious, inaccurate or inappropriate
          property listings. HomeLinker may review reports and take action
          where appropriate.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Submitting a report does not guarantee that a listing will be
          removed, and HomeLinker may consider available information before
          taking action.
        </p>

        {/* MODERATION */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Listing Moderation and Account Restrictions
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may reject, hide, remove or restrict listings or accounts
          when reasonably necessary to protect users, enforce these terms,
          prevent fraud or abuse, respond to reports, comply with legal
          obligations or protect the platform.
        </p>

        {/* THIRD PARTIES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Third-Party Services
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use third-party services for payments, maps,
          authentication, hosting, storage, analytics, advertising and other
          functionality.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker is not responsible for the availability, content or
          independent policies of third-party services.
        </p>

        {/* AVAILABILITY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Platform Availability
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          We aim to keep HomeLinker available and reliable, but we cannot
          guarantee uninterrupted or error-free operation at all times.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Features may occasionally be changed, suspended or unavailable for
          maintenance, security, technical or operational reasons.
        </p>

        {/* LIABILITY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Limitation of Responsibility
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker provides a marketplace for connecting users and displaying
          property information. To the extent permitted by applicable law,
          HomeLinker is not responsible for private agreements, negotiations,
          payments, property conditions or disputes between users.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Nothing in these terms is intended to exclude rights or protections
          that cannot legally be excluded under applicable South African law.
        </p>

        {/* PRIVACY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Privacy
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Information associated with your use of HomeLinker is handled in
          accordance with our{" "}
          <Link
            href="/privacy"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {/* CHANGES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Changes to These Terms
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may update these Terms & Conditions as the platform,
          services, pricing, advertising features or legal requirements
          develop.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          The latest version will be published on this page.
        </p>

        {/* LAW */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Applicable Law
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          These terms are intended to operate in accordance with applicable
          laws of South Africa.
        </p>

        {/* CONTACT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Contact Us
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          If you have questions about these Terms & Conditions, please contact
          HomeLinker through our{" "}
          <Link
            href="/contact"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            Contact page
          </Link>
          .
        </p>

        <p className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Last updated: October 2026
        </p>
      </div>
    </main>
  );
}