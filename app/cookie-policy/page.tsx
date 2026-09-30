import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Learn how HomeLinker uses necessary and optional analytics technologies on the HomeLinker property marketplace.",
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
          This Cookie Policy explains how HomeLinker uses cookies and similar
          technologies when you use our website.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          What Are Cookies?
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          Cookies are small pieces of information stored by a website on your
          device. They can help websites remember preferences, maintain
          functionality and understand how visitors use a website.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Necessary Technologies
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker uses necessary technologies required for the website and
          its features to function correctly. These technologies may support
          things such as authentication, security and website functionality.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Analytics
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use analytics tools to understand how visitors use
          the website. This information can help us understand website
          traffic, improve pages and improve the overall HomeLinker
          experience.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Your Choice
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          When optional analytics are available, you can choose whether to
          allow them through the HomeLinker cookie consent controls.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          You can change your preference later using the Cookie Settings
          option available on HomeLinker.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Third-Party Services
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          HomeLinker may use third-party services that use cookies or similar
          technologies as part of providing their services. These services may
          have their own privacy and cookie policies.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Changes to This Policy
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          We may update this Cookie Policy from time to time as HomeLinker
          develops or as our use of cookies and similar technologies changes.
        </p>

        <h2 className="mt-10 text-2xl font-bold text-black">
          Contact Us
        </h2>

        <p className="mt-4 leading-8 text-slate-600">
          If you have questions about this Cookie Policy, please contact
          HomeLinker through our Contact page.
        </p>

        <p className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          Last updated: September 2026
        </p>
      </div>
    </main>
  );
}