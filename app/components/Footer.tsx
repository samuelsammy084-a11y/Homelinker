export default function Footer() {
  return (
    <footer className="bg-[#1B1B1B] text-white mt-20">
      <div className="max-w-7xl mx-auto px-8 py-16 grid md:grid-cols-4 gap-10">

        <div>
          <h2 className="text-3xl font-bold">
            <span className="text-[#C9A227]">Home</span>Linker
          </h2>

          <p className="text-gray-400 mt-4">
            South Africa's trusted rental marketplace.
          </p>
        </div>

        <div>
          <h3 className="font-bold mb-4">Quick Links</h3>

          <ul className="space-y-2 text-gray-400">
            <li>Home</li>
            <li>Properties</li>
            <li>Contact</li>
            <li>Post Listing</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Contact</h3>

          <ul className="space-y-2 text-gray-400">
            <li>📞 061 444 5545</li>
            <li>📍 South Africa</li>
            <li>Email coming soon</li>
          </ul>
        </div>

        <div>
          <h3 className="font-bold mb-4">Follow Us</h3>

          <ul className="space-y-2 text-gray-400">
            <li>Facebook</li>
            <li>Instagram</li>
            <li>WhatsApp</li>
          </ul>
        </div>

      </div>

      <div className="border-t border-gray-700 py-6 text-center text-gray-500">
        © 2026 HomeLinker. All Rights Reserved.
      </div>
    </footer>
  );
}