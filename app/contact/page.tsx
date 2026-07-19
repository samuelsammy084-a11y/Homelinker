export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] py-16">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-slate-900">
            Contact HomeLinker
          </h1>

          <p className="text-slate-600 mt-4 text-lg">
            We'd love to hear from you. Get in touch with our team.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">

          {/* Contact Info */}
          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-8 text-slate-900">
              Contact Information
            </h2>

            <div className="space-y-6">

              <div>
                <h3 className="font-bold text-slate-900">📞 Phone</h3>
                <p className="text-slate-600">061 444 5545</p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">📧 Email</h3>
                <p className="text-slate-600">
                  contact@homelinker.co.za
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">🌍 Service Area</h3>
                <p className="text-slate-600">
                  All 9 Provinces of South Africa
                </p>
              </div>

              <div>
                <h3 className="font-bold text-slate-900">💬 WhatsApp</h3>

                <a
                  href="https://wa.me/27614445545"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-3 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-semibold transition"
                >
                  Chat on WhatsApp
                </a>
              </div>

            </div>

          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-3xl shadow-xl p-8">

            <h2 className="text-3xl font-bold mb-8 text-slate-900">
              Send Us a Message
            </h2>

            <form className="space-y-5">

              <input
                type="text"
                placeholder="Full Name"
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-900 placeholder:text-slate-500"
              />

              <input
                type="email"
                placeholder="Email Address"
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-900 placeholder:text-slate-500"
              />

              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-900 placeholder:text-slate-500"
              />

              <textarea
                rows={6}
                placeholder="Your Message"
                className="w-full border border-slate-300 rounded-xl p-4 text-slate-900 placeholder:text-slate-500"
              />

              <button
                type="submit"
                className="w-full bg-[#C9A227] hover:bg-[#A67C00] text-white py-4 rounded-xl font-bold transition"
              >
                Send Message
              </button>

            </form>

          </div>

        </div>

      </div>
    </main>
  );
}