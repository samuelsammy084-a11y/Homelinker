import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | HomeLinker",
  description:
    "Read the HomeLinker Privacy Policy and learn how information, cookies, advertising data and account information are handled on HomeLinker.",
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

        <p className="mt-6 leading-8 text-slate-600">
          HomeLinker respects your privacy and is committed to handling
          personal information responsibly. This Privacy Policy explains the
          types of information we may collect, how that information may be
          used, and the choices available to users of the HomeLinker property
          marketplace.
        </p>

        {/* INFORMATION WE COLLECT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Information We Collect
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          We may collect information that you provide when creating an
          account, posting a property, contacting another user, sending a
          message, submitting a report, making a payment, or using other
          HomeLinker features.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          This information may include your name, email address, telephone
          number, account information, property information, photographs,
          property location details, messages, payment-related information and
          other information that you choose to provide.
        </p>

        {/* PROPERTY LISTINGS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Property Listings and Public Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Information that you choose to include in a property listing may be
          displayed publicly on HomeLinker. This can include the property
          title, description, photographs, price, property features, suburb,
          city and other listing information.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Property owners may also choose whether their phone number is made
          available to visitors. HomeLinker may keep contact information
          private unless the property owner chooses to make it available
          through supported contact features.
        </p>

        {/* HOW WE USE DATA */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          How We Use Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Information may be used to operate and improve HomeLinker, create and
          manage accounts, publish property listings, provide messaging and
          contact features, process transactions, communicate with users,
          prevent fraud or abuse, investigate reports, maintain platform
          security and improve the overall user experience.
        </p>

        {/* COOKIES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Cookies and Similar Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use cookies, local storage and similar technologies to
          provide essential website functionality, maintain sessions, remember
          preferences, understand website usage and support advertising.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Some technologies are necessary for HomeLinker to function. Other
          technologies, such as analytics or advertising cookies, may be
          subject to user consent where required by applicable law.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You can learn more about how HomeLinker uses these technologies in
          our{" "}
          <Link
            href="/cookie-policy"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 hover:text-[#C9A227]"
          >
            Cookie Policy
          </Link>
          .
        </p>

        {/* GOOGLE ADSENSE */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Advertising and Google AdSense
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may display advertising provided by Google AdSense and
          other advertising partners.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          When advertising is enabled, third-party advertising vendors,
          including Google, may use cookies, web beacons, IP addresses and
          other identifiers to provide, measure and improve advertisements.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Google and its advertising partners may use advertising cookies to
          show ads based on a visitor&apos;s activity on HomeLinker or other
          websites, subject to applicable consent requirements and Google&apos;s
          advertising policies.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users can manage how Google uses information for personalized
          advertising through Google&apos;s advertising settings.
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
          HomeLinker may use analytics services to understand how people use
          the website, identify technical problems and improve features and
          performance.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where required, optional analytics technologies are used according to
          the consent choices made through HomeLinker&apos;s cookie or privacy
          controls.
        </p>

        {/* PAYMENTS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Payments
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use third-party payment providers to process payments
          for paid listings, promotions or other services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Payment providers may collect and process payment information
          directly. HomeLinker does not need to store complete payment card
          details when payments are handled by the payment provider.
        </p>

        {/* THIRD PARTIES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Third-Party Services
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use third-party services for hosting, authentication,
          database storage, file storage, maps, analytics, payments,
          advertising, security and other website functionality.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          These providers may process information according to their own
          privacy policies and legal obligations.
        </p>

        {/* SHARING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Sharing of Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker does not sell your personal information to advertisers.
          Information may be shared with service providers when necessary to
          operate HomeLinker, process transactions, provide advertising or
          analytics, protect the platform, comply with legal obligations, or
          provide features requested by users.
        </p>

        {/* SECURITY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Security
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          We take reasonable technical and organisational measures to protect
          information associated with HomeLinker accounts and property
          listings. However, no internet service can guarantee absolute
          security.
        </p>

        {/* RETENTION */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Data Retention
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Information may be retained for as long as reasonably necessary to
          provide HomeLinker services, maintain platform security, resolve
          disputes, prevent abuse and meet applicable legal or operational
          requirements.
        </p>

        {/* RIGHTS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Your Choices and Privacy Rights
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Depending on applicable law, you may have rights relating to personal
          information associated with your account, including requesting
          access, correction or deletion of certain information.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You may also manage cookie and advertising preferences through
          HomeLinker&apos;s available privacy controls and through the settings
          provided by relevant third-party services.
        </p>

        {/* CHILDREN */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Children&apos;s Privacy
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker is intended for people who are legally able to enter into
          property-related transactions or use property marketplace services.
          We do not knowingly design the platform for young children.
        </p>

        {/* CHANGES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Changes to This Policy
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          We may update this Privacy Policy as HomeLinker develops, new
          features are introduced, advertising or analytics services change,
          or legal requirements change. The latest version will be published
          on this page.
        </p>

        {/* CONTACT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Contact Us
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          If you have questions about this Privacy Policy or how HomeLinker
          handles information, please contact us through our{" "}
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