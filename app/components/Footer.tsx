import Link from "next/link";
import { MessageCircle, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#151515] text-white">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-4 lg:px-8">
        <div>
          <h2 className="text-3xl font-black">
            <span className="text-[#C9A227]">Home</span>Linker
          </h2>
          <p className="mt-5 leading-7 text-gray-400">
            Helping South Africans find quality rental accommodation faster, easier, and with confidence.
          </p>

          <div className="mt-8 flex gap-3">
            {[MessageCircle].map((Icon, index) => (
              <span
                key={index}
                className="flex h-11 w-11 cursor-pointer items-center justify-center rounded-full border border-white/10 bg-white/5 transition hover:scale-110 hover:border-[#C9A227]/40"
              >
                <Icon size={18} className="text-[#C9A227]" />
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">Quick links</h3>
          <ul className="space-y-4 text-gray-400">
            <li><Link href="/" className="transition hover:text-[#C9A227]">Home</Link></li>
            <li><Link href="/properties" className="transition hover:text-[#C9A227]">Browse properties</Link></li>
            <li><Link href="/post-listing" className="transition hover:text-[#C9A227]">Post listing</Link></li>
            <li><Link href="/contact" className="transition hover:text-[#C9A227]">Contact us</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">Company</h3>
          <ul className="space-y-4 text-gray-400">
            <li className="cursor-pointer transition hover:text-[#C9A227]">About HomeLinker</li>
            <li className="cursor-pointer transition hover:text-[#C9A227]">Privacy policy</li>
            <li className="cursor-pointer transition hover:text-[#C9A227]">Terms & conditions</li>
            <li className="cursor-pointer transition hover:text-[#C9A227]">Support</li>
          </ul>
        </div>

        <div>
          <h3 className="mb-5 text-lg font-semibold">Contact</h3>
          <div className="space-y-4 text-gray-400">
            <p className="flex items-center gap-2"><MapPin size={16} className="text-[#C9A227]" /> South Africa</p>
            <p className="flex items-center gap-2"><Phone size={16} className="text-[#C9A227]" /> 061 444 5545</p>
            <p className="flex items-center gap-2 break-all"><Mail size={16} className="text-[#C9A227]" /> info@homelinker.co.za</p>
            <div className="rounded-2xl border border-[#C9A227]/20 bg-[#C9A227]/10 p-4">
              <h4 className="font-semibold text-[#C9A227]">Looking for a place?</h4>
              <p className="mt-2 text-sm text-gray-300">Browse hundreds of verified rental listings across South Africa.</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 text-sm text-gray-500 md:flex-row lg:px-8">
          <p>© 2026 HomeLinker. All rights reserved.</p>
          <p>Built with care in South Africa</p>
        </div>
      </div>
    </footer>
  );
}