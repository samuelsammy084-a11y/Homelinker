import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.homelinker.co.za";
const CONTACT_EMAIL = "noreplyhomelinker@gmail.com";

export const metadata: Metadata = {
  title: "Terms & Conditions | HomeLinker",
  description:
    "Read the HomeLinker Terms and Conditions governing accounts, property listings, payments, promotions and use of the HomeLinker property marketplace.",
  alternates: {
    canonical: `${SITE_URL}/terms`,
  },
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

        <p className="mt-3 text-sm text-slate-500">
          Last updated: October 2026
        </p>

        <p className="mt-6 leading-8 text-slate-600">
          These Terms & Conditions govern your access to and use of
          HomeLinker. By accessing or using the HomeLinker website, creating
          an account, publishing a property listing, contacting another user,
          purchasing a paid service or otherwise using the platform, you agree
          to these Terms.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          If you do not agree to these Terms, you should not use HomeLinker.
        </p>

        {/* ABOUT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          About HomeLinker
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker is an online property marketplace designed to help people
          discover, advertise and connect around properties available for rent
          or sale in South Africa.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Unless specifically stated otherwise, HomeLinker is not the owner,
          landlord, estate agent, property practitioner, buyer, tenant or
          seller of properties advertised by users on the platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker generally provides technology that allows users to
          publish property information and communicate with people interested
          in those properties. Any rental, sale or other property transaction
          is ordinarily entered into between the relevant users or third
          parties.
        </p>

        {/* ELIGIBILITY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Eligibility and Authority
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          You may only use HomeLinker in a manner that is lawful and
          consistent with your legal capacity and authority.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          If you advertise a property on behalf of another person, business,
          agency or organisation, you are responsible for ensuring that you
          have appropriate authority to do so.
        </p>

        {/* ACCOUNTS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          User Accounts
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          You are responsible for providing accurate information when creating
          and using your account and for keeping your login credentials
          secure.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You must not use another person&apos;s account without permission,
          impersonate another person, create accounts for fraudulent or
          misleading purposes, or attempt to bypass HomeLinker&apos;s
          authentication or security controls.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You are responsible for activity carried out through your account
          where that activity results from your actions or your failure to
          reasonably protect your account credentials.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          If you believe your account has been accessed without permission,
          contact HomeLinker as soon as reasonably possible.
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
          You may only advertise a property if you own the property or
          otherwise have appropriate permission or authority to advertise it.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You must not publish properties that do not exist, properties you
          are not authorised to advertise, fake listings, fraudulent
          advertisements or intentionally misleading information.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Listing information should accurately represent important details
          such as the property type, asking price or rental amount, location,
          availability, photographs and relevant property features.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Advertisers should update, deactivate or appropriately mark a
          listing when the property is no longer available, has been rented,
          has been sold or when important information changes.
        </p>

        {/* DUPLICATES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Duplicate and Manipulative Listings
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Users must not repeatedly publish the same property as multiple
          separate listings in an attempt to gain additional visibility,
          manipulate search results or avoid platform limits.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may detect, reject, merge, restrict, hide or remove
          duplicate or manipulative listings.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where possible, users should edit an existing listing when property
          information changes rather than creating unnecessary duplicate
          advertisements.
        </p>

        {/* CONTENT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Photos and User Content
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          You must only upload photographs, descriptions, logos and other
          content that you own or otherwise have permission to use.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You remain responsible for content you submit to HomeLinker,
          including ensuring that it does not unlawfully infringe another
          person&apos;s intellectual property, privacy or other rights.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          By submitting content to HomeLinker, you grant HomeLinker a
          non-exclusive licence to host, store, reproduce, format, resize,
          display and distribute that content as reasonably necessary to
          operate, secure, improve and promote HomeLinker and the relevant
          property listing.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You continue to retain any ownership rights you may have in content
          that you submit.
        </p>

        {/* CONTACT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Contact Information and Communication
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may provide tools that allow property advertisers and
          interested users to communicate directly or through supported
          contact methods.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Certain contact information, such as a telephone number, may become
          available to other users where the advertiser chooses to provide or
          expose that information through a listing or supported contact
          feature.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Contact information obtained through HomeLinker must not be used for
          spam, harassment, fraud, unlawful marketing, intimidation or other
          unrelated abusive purposes.
        </p>

        {/* MARKETPLACE RESPONSIBILITY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Property Transactions and User Responsibility
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker provides a marketplace for discovering and advertising
          property. Users remain responsible for making their own decisions
          about properties, people and transactions encountered through the
          platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Before paying a deposit, transferring money, signing an agreement
          or entering into a property transaction, users should perform
          appropriate checks and satisfy themselves that the property,
          advertiser and transaction are legitimate.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker does not guarantee that every property, landlord,
          advertiser, tenant, buyer, seller or other user is genuine simply
          because information appears on the platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker does not guarantee the condition, legality, ownership,
          availability, price or suitability of a property advertised by a
          user unless HomeLinker expressly states otherwise.
        </p>

        {/* VERIFICATION */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Verification Features
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may provide verification indicators or other trust
          features intended to provide users with additional information.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          A verification indicator does not constitute a guarantee,
          endorsement or warranty that a person, property or transaction is
          free from risk.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users should continue to perform their own reasonable checks before
          entering into a transaction.
        </p>

        {/* PAID LISTINGS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Paid Listings and Promotions
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may offer optional paid services such as featured
          listings, promoted listings, enhanced visibility or other property
          advertising products.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          The price and advertised benefits of a paid service will be
          presented as part of the purchase process. Any applicable duration,
          usage limit or other material condition will be displayed where
          relevant to that service.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Paying for a listing or promotion does not guarantee a particular
          number of views, enquiries, applications, tenants, buyers, sales,
          rental agreements or other results.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Featured or promoted listings may receive increased visibility or
          priority treatment according to the relevant HomeLinker feature, but
          HomeLinker does not guarantee that a listing will permanently remain
          in a particular search position.
        </p>

        {/* FREE */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Free Listings and Promotional Access
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may provide free listing options, free trials,
          promotional access, advertising-supported features or other free
          services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may introduce or change reasonable limits relating to
          free features where necessary to prevent abuse, introduce new
          services or maintain the sustainability and operation of the
          platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Any change will remain subject to applicable law and will not remove
          rights that users are legally entitled to retain.
        </p>

        {/* PAYMENTS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Payments
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Payments for paid HomeLinker services may be processed by
          third-party payment providers such as Stripe.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users may also be subject to the payment provider&apos;s applicable
          terms, security procedures and privacy practices.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You are responsible for providing valid payment information and for
          ensuring that you are authorised to use the payment method selected
          for a purchase.
        </p>

        {/* REFUNDS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Refunds and Payment Issues
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Requests relating to payments, duplicate charges, failed activation
          or refunds may be reviewed according to the circumstances of the
          transaction, the service purchased and applicable South African
          consumer protection laws.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where a paid digital service has already been activated or used,
          refund eligibility may differ from a service that was never
          activated. Nothing in these Terms is intended to remove a refund,
          cancellation or other consumer right that cannot lawfully be
          excluded.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Payment enquiries can be sent to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            {CONTACT_EMAIL}
          </a>
          .
        </p>

        {/* PROHIBITED USE */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Prohibited Use
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          You must not use HomeLinker to engage in fraud, scams, harassment,
          unlawful discrimination, spam, impersonation, malicious activity,
          security attacks, unauthorised access, unauthorised data collection,
          misleading advertising or manipulation of listing rankings.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You must not intentionally interfere with HomeLinker&apos;s
          operation, attempt to gain unauthorised access to accounts, servers,
          databases or APIs, introduce malicious code, abuse automated
          systems, scrape the platform in an unauthorised manner or attempt to
          circumvent technical restrictions.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker must not be used for any purpose that violates applicable
          law or the lawful rights of another person.
        </p>

        {/* REPORTING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Reporting Listings and Users
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may provide features that allow users to report
          suspicious, fraudulent, inaccurate, inappropriate or otherwise
          concerning property listings or activity.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may review reports and take action where reasonably
          appropriate. Submitting a report does not guarantee that a listing
          or account will be removed.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users must not intentionally submit false or abusive reports in
          order to interfere with another legitimate user.
        </p>

        {/* MODERATION */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Moderation, Suspension and Removal
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may review, reject, restrict, hide or remove content and
          may restrict or suspend accounts where reasonably necessary to
          protect users, investigate suspected fraud, enforce these Terms,
          respond to reports, maintain platform security or comply with legal
          obligations.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Serious or repeated violations may result in longer-term account
          restrictions or termination where appropriate.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may preserve information relating to suspected fraud,
          security incidents or Terms violations where reasonably necessary
          for investigation, dispute resolution or legal compliance.
        </p>

        {/* THIRD PARTY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Third-Party Services
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may rely on third-party providers for functionality such
          as hosting, authentication, databases, file storage, maps, payments,
          analytics, security and advertising.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          These services may include providers such as Supabase, Stripe,
          Vercel, mapping providers and advertising or analytics providers.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker does not control every aspect of independent third-party
          services and cannot guarantee their continuous availability.
        </p>

        {/* EXTERNAL LINKS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          External Links
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may contain links to websites, messaging services or
          other resources operated by third parties.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          A link from HomeLinker does not automatically mean that HomeLinker
          endorses or controls the third-party website, service, content or
          transaction.
        </p>

        {/* AVAILABILITY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Platform Availability and Changes
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker aims to provide a reliable service, but uninterrupted,
          error-free or permanent availability cannot be guaranteed.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Features may occasionally be changed, updated, suspended or
          unavailable for maintenance, security, technical, legal or
          operational reasons.
        </p>

        {/* NO GUARANTEE */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          No Guarantee of Property Outcomes
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker does not guarantee that using the platform will result in
          a successful rental, property sale, purchase, tenant placement,
          buyer, landlord response or other transaction.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Search rankings, listing visibility and user interest can change
          based on many factors.
        </p>

        {/* LIABILITY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Limitation of Responsibility
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker provides technology for connecting users and displaying
          property information. To the extent permitted by applicable law,
          HomeLinker is not responsible for private agreements, negotiations,
          deposits, payments made directly between users, property conditions,
          user conduct or disputes between users.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users remain responsible for independently evaluating properties,
          advertisements, people and transactions before making financial or
          legal commitments.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Nothing in these Terms excludes, limits or waives any right,
          protection, warranty or remedy that cannot lawfully be excluded or
          limited under applicable South African law.
        </p>

        {/* PRIVACY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Privacy and Personal Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Information associated with your use of HomeLinker is handled as
          described in our{" "}
          <Link
            href="/privacy"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            Privacy Policy
          </Link>
          .
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Information about cookies and similar technologies can be found in
          our{" "}
          <Link
            href="/cookie-policy"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            Cookie Policy
          </Link>
          .
        </p>

        {/* CHANGES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Changes to These Terms
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may update these Terms as the platform, services,
          features, pricing or applicable requirements develop.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          The latest version will be published on this page. Where appropriate,
          the date shown at the top of these Terms will be updated.
        </p>

        {/* LAW */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Applicable Law
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          These Terms are intended to operate in accordance with applicable
          laws of the Republic of South Africa.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Nothing in these Terms is intended to deprive a consumer of rights
          that apply under South African law and cannot lawfully be waived or
          excluded by agreement.
        </p>

        {/* CONTACT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Contact HomeLinker
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Questions about these Terms, payments or use of HomeLinker can be
          sent to{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          or through our{" "}
          <Link
            href="/contact"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            Contact page
          </Link>
          .
        </p>

        <div className="mt-10 rounded-2xl border border-[#C9A227]/30 bg-[#FFF9E8] p-6">
          <h2 className="text-lg font-bold text-black">
            Related HomeLinker Policies
          </h2>

          <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
            <Link
              href="/privacy"
              className="text-[#A67C00] hover:text-[#C9A227]"
            >
              Privacy Policy
            </Link>

            <Link
              href="/cookie-policy"
              className="text-[#A67C00] hover:text-[#C9A227]"
            >
              Cookie Policy
            </Link>

            <Link
              href="/contact"
              className="text-[#A67C00] hover:text-[#C9A227]"
            >
              Contact Us
            </Link>
          </div>
        </div>

        <p className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Last updated: October 2026
        </p>
      </div>
    </main>
  );
}