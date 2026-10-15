import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.homelinker.co.za";
const PRIVACY_EMAIL = "noreplyhomelinker@gmail.com";

export const metadata: Metadata = {
  title: "Privacy Policy | HomeLinker",
  description:
    "Read the HomeLinker Privacy Policy and learn how personal information, property listing data, cookies, payments, advertising data and account information are handled.",
  alternates: {
    canonical: `${SITE_URL}/privacy`,
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A227]">
          HomeLinker
        </p>

        <h1 className="mt-3 text-4xl font-black text-black">
          Privacy Policy
        </h1>

        <p className="mt-3 text-sm text-slate-500">
          Last updated: October 2026
        </p>

        <p className="mt-6 leading-8 text-slate-600">
          HomeLinker respects your privacy and is committed to handling
          personal information responsibly. This Privacy Policy explains what
          information HomeLinker may collect, why we use it, when information
          may be shared, how cookies and third-party services may be used, and
          the choices available to users of the HomeLinker property
          marketplace.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker operates primarily for users searching for, advertising
          or managing property in South Africa. We aim to handle personal
          information in accordance with applicable South African privacy
          requirements, including the Protection of Personal Information Act,
          2013 (POPIA), where applicable.
        </p>

        {/* RESPONSIBLE PARTY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Who Is Responsible for Your Information?
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker is responsible for determining how personal information
          collected through the HomeLinker platform is used for the purposes
          described in this Privacy Policy, except where another service
          provider independently determines how it processes information.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Privacy enquiries and requests can be sent to{" "}
          <a
            href={`mailto:${PRIVACY_EMAIL}`}
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            {PRIVACY_EMAIL}
          </a>
          .
        </p>

        {/* INFORMATION WE COLLECT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Information We Collect
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          We may collect information that you provide when creating or
          managing an account, posting or editing a property, contacting
          another user, sending a message, submitting a report, requesting
          verification, making a payment, contacting HomeLinker or using other
          platform features.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Depending on how you use HomeLinker, this information may include
          your name, email address, telephone number, account information,
          profile information, property details, photographs, property
          location information, messages, reports, verification information
          and other information that you choose to provide.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Certain technical information may also be generated when you use the
          website, such as browser or device information, IP address, session
          information, security logs and information about how the website is
          accessed or used.
        </p>

        {/* PROPERTY LISTINGS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Property Listings and Public Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker is a property marketplace. Information that you choose to
          include in a published property listing may therefore be visible to
          members of the public and may be discoverable through search engines.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Public listing information may include the property title,
          description, photographs, price, property type, features, suburb,
          city, approximate or supplied location information and other details
          included in the listing.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where HomeLinker provides contact features, information such as a
          property owner&apos;s or advertiser&apos;s telephone number may become
          available to other users when the advertiser chooses to provide or
          expose that information through the platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users should avoid placing unnecessary sensitive personal
          information inside public property descriptions, photographs or
          other publicly visible fields.
        </p>

        {/* HOW WE USE INFORMATION */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          How We Use Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use personal information where reasonably necessary
          to provide and operate the platform, manage accounts, publish and
          manage property listings, enable communication features, process
          transactions, respond to enquiries, investigate reports and maintain
          the security and reliability of the service.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Information may also be used to prevent fraud and abuse, enforce our
          Terms of Use, troubleshoot technical problems, understand platform
          usage, improve features and comply with applicable legal
          obligations.
        </p>

        {/* LEGAL / PROCESSING BASIS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Why We Process Personal Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Depending on the circumstances, HomeLinker may process information
          because it is necessary to provide a service requested by you,
          perform or prepare for an agreement, comply with a legal obligation,
          protect legitimate interests such as platform security and fraud
          prevention, or because you have provided consent where consent is
          required.
        </p>

        {/* AUTHENTICATION / DATABASE */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Accounts, Authentication and Data Storage
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker uses Supabase to support services including account
          authentication, database functionality and file or image storage.
          Information necessary to provide these features may therefore be
          processed using Supabase infrastructure.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users are responsible for protecting their account credentials and
          should not intentionally share passwords or authentication
          information with other people.
        </p>

        {/* PAYMENTS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Payments and Stripe
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker uses Stripe to process payments for certain paid listing,
          promotion or platform services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          When you make a payment, payment information is processed through
          Stripe. HomeLinker may receive information about the transaction,
          such as whether payment was successful, the selected service and a
          payment or checkout reference.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker does not need to store complete payment card details when
          card information is collected and processed directly by the payment
          provider.
        </p>

        {/* HOSTING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Website Hosting and Infrastructure
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker uses third-party infrastructure providers, including
          Vercel, to host and deliver the website. Technical information may be
          processed as necessary to deliver pages, maintain security, diagnose
          errors and operate the service.
        </p>

        {/* MAPS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Maps and Location Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use mapping and geolocation-related services to help
          users identify or display property locations. Property advertisers
          should consider what level of location detail they are comfortable
          making available through a public listing.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Location-related information may be processed by third-party mapping
          providers when map features are used.
        </p>

        {/* COOKIES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Cookies and Similar Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use cookies, local storage and similar technologies
          to provide essential website functionality, maintain authenticated
          sessions, remember preferences, protect the platform, understand
          website usage and support advertising.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Some technologies are necessary for HomeLinker to function. Other
          technologies, including certain analytics or advertising
          technologies, may require consent depending on the visitor&apos;s
          location and applicable law.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You can learn more in our{" "}
          <Link
            href="/cookie-policy"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            Cookie Policy
          </Link>
          .
        </p>

        {/* ADVERTISING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Advertising and Google AdSense
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may display advertisements provided by Google AdSense or
          other advertising partners.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          If advertising is enabled, third-party vendors, including Google,
          may place or read cookies on a user&apos;s browser or use web beacons,
          IP addresses, device identifiers or similar technologies in
          connection with advertising, measurement, fraud prevention and
          related services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Google and its advertising partners may use advertising cookies or
          similar technologies to serve, personalise or measure advertising,
          subject to applicable consent requirements, user settings and
          Google&apos;s policies.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where required, HomeLinker will seek appropriate consent before
          optional advertising technologies are used.
        </p>

        <div className="mt-5 flex flex-col gap-3 sm:flex-row">
          <a
            href="https://adssettings.google.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-[#C9A227] px-5 py-3 text-sm font-bold text-[#A67C00] transition hover:bg-[#FFF9E8]"
          >
            Google Ads Settings
          </a>

          <a
            href="https://policies.google.com/technologies/partner-sites"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-5 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            How Google Uses Partner Data
          </a>
        </div>

        {/* ANALYTICS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Analytics
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use analytics or performance tools to understand how
          visitors use the website, identify technical problems, measure
          performance and improve the platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where required by applicable law, optional analytics technologies
          will be used according to the consent choices available to the
          visitor.
        </p>

        {/* THIRD PARTIES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Third-Party Service Providers
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker relies on third-party services to provide parts of the
          platform. These may include services for hosting, authentication,
          databases, file storage, mapping, payments, analytics, security and
          advertising.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Providers used by HomeLinker may include Supabase, Stripe, Vercel,
          mapping providers and, when advertising is enabled, Google and its
          advertising technologies.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          These providers may process information according to their own
          privacy policies, contractual responsibilities and legal
          obligations.
        </p>

        {/* SHARING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          When Information May Be Shared
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker does not sell personal information to advertisers.
          Information may be disclosed to service providers where reasonably
          necessary to operate HomeLinker, process transactions, provide
          requested functionality, protect the platform, investigate fraud or
          abuse, comply with legal obligations or provide analytics and
          advertising services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Information that a user intentionally publishes through a public
          property listing may also be accessible to visitors and other users
          of the platform.
        </p>

        {/* INTERNATIONAL PROCESSING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          International Processing
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Some of HomeLinker&apos;s service providers may operate infrastructure
          or process information outside South Africa. Where applicable,
          HomeLinker aims to use service providers and arrangements that
          provide appropriate safeguards for personal information.
        </p>

        {/* SECURITY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Security
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker takes reasonable technical and organisational measures
          designed to protect information associated with accounts,
          transactions and property listings against unauthorised access,
          loss, misuse or alteration.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          However, no website, database or internet transmission can guarantee
          absolute security. Users should also take reasonable steps to
          protect their accounts and devices.
        </p>

        {/* RETENTION */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Data Retention
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may retain personal information for as long as reasonably
          necessary for the purposes for which it was collected, including
          providing services, maintaining account and transaction records,
          preventing fraud or abuse, resolving disputes and meeting legal,
          security or operational requirements.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Information may be deleted, anonymised or retained for a longer
          period where reasonably necessary or legally required.
        </p>

        {/* USER RIGHTS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Your Privacy Rights
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Subject to applicable law and appropriate identity verification, you
          may have rights relating to personal information HomeLinker holds
          about you.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          These rights may include requesting access to certain personal
          information, asking for inaccurate information to be corrected,
          requesting deletion where applicable, objecting to certain
          processing, or withdrawing consent where processing is based on
          consent.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Privacy requests can be sent to{" "}
          <a
            href={`mailto:${PRIVACY_EMAIL}`}
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            {PRIVACY_EMAIL}
          </a>
          . We may need to verify your identity before completing certain
          requests.
        </p>

        {/* ACCOUNT DELETION */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Account and Data Deletion Requests
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Users who want to request deletion of their HomeLinker account or
          associated personal information may contact us at{" "}
          <a
            href={`mailto:${PRIVACY_EMAIL}`}
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            {PRIVACY_EMAIL}
          </a>
          .
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Some information may need to be retained after an account deletion
          request where reasonably necessary for security, fraud prevention,
          transaction records, dispute resolution or compliance with
          applicable legal obligations.
        </p>

        {/* CHILDREN */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Children&apos;s Privacy
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker is a property marketplace intended primarily for people
          who are able to participate in property-related transactions or
          property searches. The platform is not designed as a service
          directed at young children.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          If you believe a child has provided personal information to
          HomeLinker in circumstances where it should not have been collected,
          please contact us so the matter can be reviewed.
        </p>

        {/* EXTERNAL LINKS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          External Links
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may contain links to third-party websites or services.
          HomeLinker is not responsible for the privacy practices of
          independent third-party websites. Users should review the privacy
          information provided by those services when leaving HomeLinker.
        </p>

        {/* CHANGES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Changes to This Privacy Policy
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may update this Privacy Policy as the platform develops,
          new features or service providers are introduced, advertising or
          analytics services change, or legal requirements change.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          The current version will be published on this page together with an
          updated revision date where appropriate.
        </p>

        {/* CONTACT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Contact HomeLinker
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          If you have questions about this Privacy Policy, want to exercise a
          privacy right or have concerns about how personal information is
          handled, email{" "}
          <a
            href={`mailto:${PRIVACY_EMAIL}`}
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            {PRIVACY_EMAIL}
          </a>{" "}
          or visit our{" "}
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
              href="/terms"
              className="text-[#A67C00] hover:text-[#C9A227]"
            >
              Terms of Use
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