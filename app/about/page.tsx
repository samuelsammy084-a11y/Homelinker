export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
      <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-lg sm:p-12">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#C9A227]">
          About HomeLinker
        </p>

        <h1 className="mt-3 text-4xl font-black text-black">
          Find your next home with confidence.
        </h1>

        <p className="mt-6 leading-8 text-slate-600">
          HomeLinker is a South African property marketplace designed to make
          finding rooms, apartments and homes simpler, faster and more
          accessible.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          Our goal is to connect people looking for a place to live with
          property owners and trusted listings across South Africa.
        </p>

        <p className="mt-4 leading-8 text-slate-600">
          We are building HomeLinker with simplicity, trust and accessibility
          at the centre of the experience.
        </p>
      </div>
    </main>
  );
}