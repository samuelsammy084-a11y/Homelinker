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
    <footer className="bg-[#0F1115] text-white mt-20">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <h2 className="text-3xl font-bold text-[#C9A227]">
              HomeLinker
            </h2>

            <p className="mt-5 leading-7 text-gray-400">
              Helping South Africans find quality rental accommodation faster,
              easier, and with confidence.
            </p>

            <Link
              href="/contact"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-5 py-3 font-semibold text-black transition hover:scale-105"
            >
              <MessageCircle size={18} />
              Contact Us
            </Link>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Quick Links</h3>

            <ul className="space-y-4 text-gray-400">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/properties">Browse Properties</Link></li>
              <li><Link href="/post-listing">Post Listing</Link></li>
              <li><Link href="/login">Login</Link></li>
              <li><Link href="/register">Register</Link></li>
              <li><Link href="/dashboard">Dashboard</Link></li>
              <li><Link href="/contact">Contact</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Company</h3>

            <ul className="space-y-4 text-gray-400">
              <li><Link href="/about">About HomeLinker</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/terms">Terms & Conditions</Link></li>
              <li><Link href="/faq">FAQ</Link></li>
              <li><Link href="/safety">Safety Tips</Link></li>
              <li><Link href="/report">Report Listing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-5 text-lg font-semibold">Contact</h3>

            <div className="space-y-4 text-gray-400">

              <p className="flex items-center gap-2">
                <MapPin size={16} className="text-[#C9A227]" />
                Johannesburg, Gauteng, South Africa
              </p>

              <a
                href="tel:+27614445545"
                className="flex items-center gap-2 hover:text-[#C9A227]"
              >
                <Phone size={16} className="text-[#C9A227]" />
                061 444 5545
              </a>

              <a
                href="mailto:info@homelinker.co.za"
                className="flex items-center gap-2 hover:text-[#C9A227]"
              >
                <Mail size={16} className="text-[#C9A227]" />
                info@homelinker.co.za
              </a>

              <div className="rounded-2xl border border-[#C9A227]/20 bg-[#C9A227]/10 p-5">

                <h4 className="text-lg font-semibold text-[#C9A227]">
                  Find your next home today
                </h4>

                <p className="mt-3 text-sm text-gray-300">
                  Browse verified rooms, apartments, houses and properties
                  across South Africa.
                </p>

                <Link
                  href="/properties"
                  className="mt-5 inline-flex rounded-xl bg-[#C9A227] px-5 py-3 font-semibold text-black hover:scale-105 transition"
                >
                  Browse Properties
                </Link>

              </div>

            </div>
          </div>

        </div>

        {/* Trust Section */}

        <div className="mt-16 grid gap-6 rounded-2xl border border-white/10 bg-white/5 p-6 md:grid-cols-4">

          <div className="flex items-center gap-3">
            <BadgeCheck className="text-[#C9A227]" />
            <span>Verified Listings</span>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="text-[#C9A227]" />
            <span>Secure Accounts</span>
          </div>

          <div className="flex items-center gap-3">
            <Home className="text-[#C9A227]" />
            <span>Free Property Posting</span>
          </div>

          <div className="flex items-center gap-3">
            🇿🇦 <span>Proudly South African</span>
          </div>

        </div>

      </div>

      <div className="border-t border-white/10">

        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 md:flex-row">

          <p>© 2026 HomeLinker. All rights reserved.</p>

          <div className="flex gap-6">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
          </div>

          <p>Made with ❤️ in South Africa</p>

        </div>

      </div>

    </footer>
  );
}