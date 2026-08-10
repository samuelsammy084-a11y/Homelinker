import Link from "next/link";
import {
  MessageCircle,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  BadgeCheck,
  Home,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 bg-[#111111] text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Main footer */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h2 className="text-3xl font-black text-[#C9A227]">
              HomeLinker
            </h2>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-400">
              Helping South Africans find quality rental accommodation
              faster, easier, and with confidence.
            </p>

            <Link
              href="/contact"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#A67C00]"
            >
              <MessageCircle size={18} />
              Contact Us
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Quick Links
            </h3>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-gray-400">
              <Link
                href="/"
                className="transition hover:text-[#C9A227]"
              >
                Home
              </Link>

              <Link
                href="/properties"
                className="transition hover:text-[#C9A227]"
              >
                Browse Properties
              </Link>

              <Link
                href="/post-listing"
                className="transition hover:text-[#C9A227]"
              >
                Post Listing
              </Link>

              <Link
                href="/login"
                className="transition hover:text-[#C9A227]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="transition hover:text-[#C9A227]"
              >
                Register
              </Link>

              <Link
                href="/dashboard"
                className="transition hover:text-[#C9A227]"
              >
                Dashboard
              </Link>

              <Link
                href="/contact"
                className="transition hover:text-[#C9A227]"
              >
                Contact
              </Link>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Company
            </h3>

            <div className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm text-gray-400">
              <Link
                href="/about"
                className="transition hover:text-[#C9A227]"
              >
                About HomeLinker
              </Link>

              <Link
                href="/privacy"
                className="transition hover:text-[#C9A227]"
              >
                Privacy Policy
              </Link>

              <Link
                href="/terms"
                className="transition hover:text-[#C9A227]"
              >
                Terms & Conditions
              </Link>

              <Link
                href="/faq"
                className="transition hover:text-[#C9A227]"
              >
                FAQ
              </Link>

              <Link
                href="/safety"
                className="transition hover:text-[#C9A227]"
              >
                Safety Tips
              </Link>

              <Link
                href="/report"
                className="transition hover:text-[#C9A227]"
              >
                Report Listing
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-bold text-white">
              Contact
            </h3>

            <div className="space-y-3 text-sm text-gray-400">
              <p className="flex items-start gap-3">
                <MapPin
                  size={18}
                  className="mt-0.5 shrink-0 text-[#C9A227]"
                />
                <span>
                  Johannesburg, Gauteng,
                  <br />
                  South Africa
                </span>
              </p>

              <a
                href="tel:+27614445545"
                className="flex items-center gap-3 transition hover:text-[#C9A227]"
              >
                <Phone
                  size={17}
                  className="shrink-0 text-[#C9A227]"
                />
                061 444 5545
              </a>

              <a
                href="mailto:info@homelinker.co.za"
                className="flex items-center gap-3 break-all transition hover:text-[#C9A227]"
              >
                <Mail
                  size={17}
                  className="shrink-0 text-[#C9A227]"
                />
                info@homelinker.co.za
              </a>
            </div>
          </div>
        </div>

        {/* Browse CTA */}
        <div className="mt-10 rounded-[24px] border border-[#C9A227]/20 bg-[#C9A227]/10 p-5 sm:mt-14 sm:flex sm:items-center sm:justify-between sm:gap-6 sm:p-6">
          <div>
            <h4 className="text-lg font-bold text-[#C9A227]">
              Find your next home today
            </h4>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
              Browse rooms, apartments, houses and properties
              across South Africa.
            </p>
          </div>

          <Link
            href="/properties"
            className="mt-5 inline-flex shrink-0 items-center justify-center rounded-xl bg-[#C9A227] px-5 py-3 text-sm font-bold text-black transition hover:bg-[#A67C00] sm:mt-0"
          >
            Browse Properties
          </Link>
        </div>

        {/* Trust Section */}
        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-4">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <BadgeCheck
              size={22}
              className="shrink-0 text-[#C9A227]"
            />
            <span className="text-xs font-semibold sm:text-sm">
              Verified Listings
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <ShieldCheck
              size={22}
              className="shrink-0 text-[#C9A227]"
            />
            <span className="text-xs font-semibold sm:text-sm">
              Secure Accounts
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <Home
              size={22}
              className="shrink-0 text-[#C9A227]"
            />
            <span className="text-xs font-semibold sm:text-sm">
              Free Property Posting
            </span>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <span className="text-xl">🇿🇦</span>
            <span className="text-xs font-semibold sm:text-sm">
              Proudly South African
            </span>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 text-center text-xs text-gray-500 sm:px-6 md:flex-row md:items-center md:justify-between md:text-left">
          <p>© 2026 HomeLinker. All rights reserved.</p>

          <div className="flex items-center justify-center gap-4 sm:gap-6">
            <Link
              href="/privacy"
              className="transition hover:text-[#C9A227]"
            >
              Privacy
            </Link>

            <Link
              href="/terms"
              className="transition hover:text-[#C9A227]"
            >
              Terms
            </Link>

            <Link
              href="/cookies"
              className="transition hover:text-[#C9A227]"
            >
              Cookies
            </Link>
          </div>

          <p>Made with ❤️ in South Africa</p>
        </div>
      </div>
    </footer>
  );
}