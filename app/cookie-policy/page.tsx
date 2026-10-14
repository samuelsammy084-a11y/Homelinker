import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookie Policy | HomeLinker",
  description:
    "Learn how HomeLinker uses cookies and similar technologies for essential functionality, analytics, preferences and advertising.",
  robots: {
    index: true,
    follow: true,
  },
};

export default function CookiePolicyPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A227]">
          HomeLinker
        </p>

        <h1 className="mt-3 text-4xl font-black text-black">
          Cookie Policy
        </h1>

        <p className="mt-6 leading-8 text-slate-600">
          This Cookie Policy explains how HomeLinker may use cookies, local
          storage and similar technologies when you visit or use our property
          marketplace.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Some technologies are necessary for HomeLinker to operate correctly.
          Others may be used for analytics, advertising or improving the
          experience, subject to applicable consent requirements.
        </p>

        {/* WHAT ARE COOKIES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          What Are Cookies?
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Cookies are small pieces of information that websites can store on
          your device. They can help websites remember preferences, maintain
          sessions, provide security, measure website usage and support
          advertising.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may also use technologies such as browser storage and
          similar identifiers that perform functions similar to cookies.
        </p>

        {/* NECESSARY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Necessary Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Necessary technologies help HomeLinker provide essential features
          and keep the platform secure.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          These technologies may be used for account authentication, session
          management, security, fraud prevention, user preferences and other
          functionality required for the website to work correctly.
        </p>

        {/* ANALYTICS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Analytics Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use analytics technologies to understand how visitors
          use the website, which pages are useful, how people navigate the
          platform and whether technical problems occur.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Analytics information can help us improve website performance,
          property discovery, navigation and other HomeLinker features.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where consent is required, optional analytics technologies will be
          used according to the privacy choices available to the visitor.
        </p>

        {/* ADVERTISING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Advertising Cookies and Google AdSense
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use Google AdSense and other advertising services to
          display advertisements and help support the operation of the
          platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          When advertising is enabled, Google and other advertising partners
          may use cookies or similar technologies to provide advertisements,
          limit how often advertisements are shown, measure advertising
          performance, prevent fraud and improve advertising services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Advertising services may process information such as browser or
          device information, IP address, advertising identifiers, website
          activity and information relating to interactions with
          advertisements.
        </p>

        {/* PERSONALIZED ADS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Personalized and Non-Personalized Advertising
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Depending on your location, consent choices and the advertising
          settings used by HomeLinker, advertisements may be personalized or
          non-personalized.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Personalized advertising may use information about activity or
          interests to make advertisements more relevant. Non-personalized
          advertising may still use information such as general location,
          website context or limited identifiers for functions including ad
          delivery, measurement and fraud prevention.
        </p>

        {/* THIRD PARTIES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Third-Party Services
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use third-party providers for services including
          hosting, authentication, storage, payments, maps, analytics and
          advertising.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Some of these providers may set or access cookies and similar
          technologies according to their own privacy policies and legal
          obligations.
        </p>

        {/* CONSENT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Consent and Cookie Preferences
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Where required by applicable law or advertising platform rules,
          HomeLinker may ask for permission before using certain optional
          cookies or similar technologies.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Visitors may be given options to accept, reject or manage applicable
          categories of optional technologies through the privacy or consent
          controls presented on HomeLinker.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Some essential technologies cannot be disabled through these controls
          because they are required for important website features to work.
        </p>

        {/* BROWSER CONTROLS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Browser Controls
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Most web browsers allow you to control, block or delete cookies
          through browser settings. Blocking necessary cookies may cause some
          HomeLinker features, including account or security functions, to stop
          working correctly.
        </p>

        {/* PRIVACY POLICY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          More About Your Privacy
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          For more information about how HomeLinker handles personal
          information and third-party services, please read our{" "}
          <Link
            href="/privacy"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 transition hover:text-[#C9A227]"
          >
            Privacy Policy
          </Link>
          .
        </p>

        {/* CHANGES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Changes to This Cookie Policy
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may update this Cookie Policy as the platform develops,
          advertising or analytics services change, or legal and platform
          requirements change.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          The latest version of this Cookie Policy will be published on this
          page.
        </p>

        {/* CONTACT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Contact Us
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          If you have questions about this Cookie Policy or HomeLinker&apos;s
          use of cookies and similar technologies, please contact us through
          our{" "}
          <Link
            href="/contact"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 transition hover:text-[#C9A227]"
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