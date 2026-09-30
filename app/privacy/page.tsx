import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the HomeLinker Privacy Policy and learn how information is handled when using the HomeLinker property marketplace.",
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
          HomeLinker respects your privacy and is committed to protecting the
          information you provide when using our platform.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Information We Collect
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          We may collect information you provide when creating an account,
          posting a property, contacting another user, or using features of
          the HomeLinker platform. This may include information such as your
          name, email address, telephone number, property information and
          other information you choose to provide.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Property Listings
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Information that you choose to include in a property listing may be
          displayed publicly on HomeLinker. This can include property
          descriptions, photographs, prices, locations and contact details
          provided as part of the listing.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          How We Use Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Information may be used to provide and improve our services,
          communicate with users, manage listings, maintain account security,
          prevent abuse, process transactions, and improve the overall
          HomeLinker experience.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Cookies and Analytics
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker uses necessary technologies to keep the platform
          functioning correctly. We may also use optional analytics to
          understand how visitors use HomeLinker and improve the website.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Optional analytics are only enabled when you give permission through
          our cookie consent controls. You can change your preference later
          using Cookie Settings.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Third-Party Services
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use third-party services for hosting, authentication,
          storage, maps, analytics, payments and other website functionality.
          These services may process information according to their own
          policies and terms.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Your Information
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          We aim to handle user information responsibly and take reasonable
          steps to protect information associated with your account.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Your Choices
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          You can manage your optional analytics preference through the Cookie
          Settings available on HomeLinker. You can also manage information
          associated with your account through the features available on the
          platform.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Contact Us
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          If you have questions about this Privacy Policy, please contact
          HomeLinker through our Contact page.
        </p>

        <p className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Last updated: September 2026
        </p>
      </div>
    </main>
  );
}