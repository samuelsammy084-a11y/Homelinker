export default function TermsPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A227]">
          HomeLinker
        </p>

        <h1 className="mt-3 text-4xl font-black text-black">
          Terms & Conditions
        </h1>

        <p className="mt-6 leading-8 text-slate-600">
          By using HomeLinker, you agree to use the platform responsibly and
          comply with these terms.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-black">
          Listings
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          Users are responsible for ensuring that information submitted in
          property listings is accurate and not misleading.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-black">
          User responsibility
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          Users should exercise appropriate care when communicating with other
          users, viewing properties or entering agreements.
        </p>

        <h2 className="mt-8 text-2xl font-bold text-black">
          Platform use
        </h2>

        <p className="mt-3 leading-7 text-slate-600">
          HomeLinker may update, modify or improve its services as the
          platform develops.
        </p>
      </div>
    </main>
  );
}