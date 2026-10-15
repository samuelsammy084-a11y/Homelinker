import type { Metadata } from "next";
import Link from "next/link";

const SITE_URL = "https://www.homelinker.co.za";
const CONTACT_EMAIL = "noreplyhomelinker@gmail.com";

export const metadata: Metadata = {
  title: "Cookie Policy | HomeLinker",
  description:
    "Learn how HomeLinker uses cookies and similar technologies for essential functionality, authentication, analytics, preferences and advertising.",
  alternates: {
    canonical: `${SITE_URL}/cookie-policy`,
  },
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

        <p className="mt-3 text-sm text-slate-500">
          Last updated: October 2026
        </p>

        <p className="mt-6 leading-8 text-slate-600">
          This Cookie Policy explains how HomeLinker uses or may use cookies,
          browser storage and similar technologies when you visit or use the
          HomeLinker property marketplace.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Some technologies are necessary for HomeLinker to operate, maintain
          user sessions and protect the platform. Other technologies may be
          used for purposes such as analytics, preferences or advertising,
          subject to applicable consent requirements.
        </p>

        {/* WHAT ARE COOKIES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          What Are Cookies?
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Cookies are small pieces of information that a website or related
          service can store on your device. Cookies can help websites remember
          information, maintain sessions, provide security, measure website
          usage and support advertising.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may also use browser storage, including local storage,
          session storage and similar technologies that perform related
          functions.
        </p>

        {/* TYPES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Types of Technologies HomeLinker May Use
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Technologies used on HomeLinker may generally fall into categories
          such as necessary technologies, preference technologies, analytics
          technologies and advertising technologies.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          The technologies actually used may change as HomeLinker develops or
          as features and third-party providers change.
        </p>

        {/* NECESSARY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Necessary Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Necessary technologies help HomeLinker provide essential website
          functionality and maintain the security and reliability of the
          platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          These technologies may be used for account authentication, session
          management, security, fraud prevention, load management and other
          functions required for HomeLinker to work correctly.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Because these technologies support essential functions, disabling
          them through your browser may prevent parts of HomeLinker from
          operating correctly.
        </p>

        {/* AUTH */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Authentication and Supabase
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker uses Supabase for services that include account
          authentication, database functionality and storage.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Authentication technologies may be used to keep users signed in,
          maintain secure sessions and help protect account functionality.
        </p>

        {/* STORAGE */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Local Storage and Session Storage
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use browser-based storage such as local storage or
          session storage to temporarily remember information needed for
          website functionality.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          For example, browser storage may be used during parts of a property
          listing, account, checkout or preference flow so that the website
          can maintain relevant state between pages.
        </p>

        {/* PREFERENCES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Preference Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Preference technologies may be used to remember choices you make
          while using HomeLinker, reducing the need to repeat the same
          selections during later visits.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where a preference is not essential to the operation of the website,
          its use may depend on the privacy choices available to you.
        </p>

        {/* ANALYTICS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Analytics and Performance Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use analytics and performance technologies to
          understand how visitors use the website, identify technical
          problems, measure website performance and improve property
          discovery, navigation and other features.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Analytics technologies may collect or generate information such as
          pages visited, approximate technical information, interactions,
          browser or device information and performance information.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where applicable law requires consent for optional analytics
          technologies, HomeLinker will aim to use those technologies
          according to the consent choices provided to the visitor.
        </p>

        {/* ADVERTISING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Advertising Cookies and Google AdSense
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use Google AdSense or other advertising services to
          display advertisements and help support the operation of the
          platform.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          When advertising is enabled, third-party vendors, including Google,
          may place or read cookies on a visitor&apos;s browser or use web
          beacons, IP addresses, device identifiers or similar technologies in
          connection with advertising services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          These technologies may be used to provide advertisements, measure
          advertising performance, limit how often advertisements are shown,
          prevent invalid traffic or fraud and improve advertising services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Advertising providers may process information such as browser or
          device information, IP address, advertising identifiers, website
          activity and interactions with advertisements.
        </p>

        {/* PERSONALIZED */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Personalized and Non-Personalized Advertising
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Depending on your location, consent choices and the advertising
          configuration used by HomeLinker, advertisements may be personalized
          or non-personalized.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Personalized advertising may use information about activity,
          interests or previous interactions to make advertisements more
          relevant.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Non-personalized advertising does not rely on the same level of
          personalization but may still use information such as general
          location, website context, frequency controls and limited
          identifiers for advertising delivery, measurement, security and
          fraud prevention.
        </p>

        {/* GOOGLE */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Google Advertising Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          When Google advertising services are enabled, Google may receive
          information as described in its policies for websites and apps that
          use Google services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users can learn more about how Google uses information from sites
          and apps that use its services and can manage certain advertising
          preferences using Google&apos;s available controls.
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

        {/* PAYMENTS */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Payment Technologies and Stripe
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker uses Stripe to process payments for certain paid
          HomeLinker services.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          When you interact with Stripe&apos;s payment services, Stripe may use
          cookies or similar technologies for purposes including payment
          processing, security and fraud prevention according to Stripe&apos;s
          own policies.
        </p>

        {/* HOSTING */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Hosting and Security Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker uses infrastructure providers, including Vercel, to host
          and deliver the website.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Hosting and security providers may process technical information or
          use technologies necessary to deliver pages, protect services,
          prevent abuse and maintain website reliability.
        </p>

        {/* THIRD PARTIES */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Third-Party Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker relies on third-party providers for functionality that may
          include authentication, databases, storage, hosting, payments, maps,
          analytics, security and advertising.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Providers may include Supabase, Stripe, Vercel, mapping providers and,
          when advertising is enabled, Google and its advertising
          technologies.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Third-party providers may process information and use cookies or
          similar technologies according to their own privacy policies, terms
          and legal obligations.
        </p>

        {/* CONSENT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Consent and Cookie Preferences
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Where required by applicable law or the requirements of advertising
          or technology providers, HomeLinker may request consent before
          optional cookies or similar technologies are used.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Where consent controls are provided, visitors may be able to accept,
          reject or manage applicable categories of optional technologies.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Withdrawing or refusing consent for optional technologies should not
          prevent access to basic HomeLinker content, although certain
          optional functionality may be affected.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Technologies that are strictly necessary for authentication,
          security or other essential website functions may operate without
          optional cookie consent where permitted by applicable law.
        </p>

        {/* BROWSER */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Browser Controls
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Most web browsers allow users to view, block or delete cookies
          through browser settings.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Blocking or deleting necessary cookies or browser storage may cause
          some HomeLinker features, including account, authentication or
          security functions, to stop working correctly.
        </p>

        {/* CHANGING CONSENT */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          Changing Your Privacy Choices
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Where HomeLinker provides cookie or consent controls, users may use
          those controls to change available choices for optional
          technologies.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Users may also use browser controls and relevant third-party
          advertising settings to manage certain technologies and advertising
          preferences.
        </p>

        {/* PRIVACY */}
        <h2 className="mt-10 text-2xl font-bold text-black">
          More About Your Privacy
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          For more information about how HomeLinker handles personal
          information, public property information, payments, service
          providers and advertising, please read our{" "}
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
          technologies change, new providers are introduced or legal and
          advertising requirements change.
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
          If you have questions about this Cookie Policy or HomeLinker&apos;s
          use of cookies and similar technologies, email{" "}
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 transition hover:text-[#C9A227]"
          >
            {CONTACT_EMAIL}
          </a>{" "}
          or visit our{" "}
          <Link
            href="/contact"
            className="font-semibold text-[#A67C00] underline decoration-[#C9A227]/40 underline-offset-4 transition hover:text-[#C9A227]"
          >
            Contact page
          </Link>
          .
        </p>

        {/* RELATED */}
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
              href="/terms"
              className="text-[#A67C00] hover:text-[#C9A227]"
            >
              Terms & Conditions
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