import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-24 bg-[#151515] text-white">

      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid gap-12 md:grid-cols-4">

        {/* Brand */}
        <div>

          <h2 className="text-4xl font-extrabold">
            <span className="text-[#C9A227]">Home</span>Linker
          </h2>

          <p className="mt-5 text-gray-400 leading-7">
            Helping South Africans find quality rental accommodation
            faster, easier and with confidence.
          </p>

          <div className="mt-8 flex gap-3">

            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A227] text-lg shadow-lg transition hover:scale-110 cursor-pointer">
              📘
            </span>

            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A227] text-lg shadow-lg transition hover:scale-110 cursor-pointer">
              📸
            </span>

            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-[#C9A227] text-lg shadow-lg transition hover:scale-110 cursor-pointer">
              💬
            </span>

          </div>

        </div>

        {/* Quick Links */}

        <div>

          <h3 className="text-xl font-bold mb-5">
            Quick Links
          </h3>

          <ul className="space-y-4 text-gray-400">

            <li>
              <Link href="/" className="hover:text-[#C9A227] transition">
                Home
              </Link>
            </li>

            <li>
              <Link
                href="/properties"
                className="hover:text-[#C9A227] transition"
              >
                Browse Properties
              </Link>
            </li>

            <li>
              <Link
                href="/post-listing"
                className="hover:text-[#C9A227] transition"
              >
                Post Listing
              </Link>
            </li>

            <li>
              <Link
                href="/contact"
                className="hover:text-[#C9A227] transition"
              >
                Contact Us
              </Link>
            </li>

          </ul>

        </div>

        {/* Company */}

        <div>

          <h3 className="text-xl font-bold mb-5">
            Company
          </h3>

          <ul className="space-y-4 text-gray-400">

            <li className="hover:text-[#C9A227] transition cursor-pointer">
              About HomeLinker
            </li>

            <li className="hover:text-[#C9A227] transition cursor-pointer">
              Privacy Policy
            </li>

            <li className="hover:text-[#C9A227] transition cursor-pointer">
              Terms & Conditions
            </li>

            <li className="hover:text-[#C9A227] transition cursor-pointer">
              Support
            </li>

          </ul>

        </div>

        {/* Contact */}

        <div>

          <h3 className="text-xl font-bold mb-5">
            Contact
          </h3>

          <div className="space-y-5 text-gray-400">

            <p>
              📍 South Africa
            </p>

            <p>
              📞 061 444 5545
            </p>

            <p className="break-all">
              ✉️ info@homelinker.co.za
            </p>

            <div className="rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 p-4">

              <h4 className="font-bold text-[#C9A227]">
                Looking for a place?
              </h4>

              <p className="text-sm text-gray-300 mt-2">
                Browse hundreds of verified rental listings across South Africa.
              </p>

            </div>

          </div>

        </div>

      </div>

      {/* Bottom */}

      <div className="border-t border-white/10">

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">

          <p className="text-gray-500 text-sm">
            © 2026 HomeLinker. All rights reserved.
          </p>

          <p className="text-gray-500 text-sm">
            Built with ❤️ in South Africa
          </p>

        </div>

      </div>

    </footer>
  );
}