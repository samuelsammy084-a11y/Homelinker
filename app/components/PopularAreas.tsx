import Link from "next/link";

export default function PopularAreas() {
  const areas = [
    "Florida",
    "Roodepoort",
    "Soweto",
    "Johannesburg CBD",
    "Randburg",
    "Pretoria",
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="text-center">
          <span className="inline-flex items-center rounded-full bg-[#C9A227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#A67C00]">
            Explore
          </span>

          <h2 className="mt-3 text-3xl font-bold text-[#1B1B1B] sm:text-4xl lg:text-5xl">
            Popular areas to discover
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base sm:leading-7">
            Browse the most searched locations and find the right fit for
            your next move.
          </p>
        </div>

        {/* MOBILE: horizontal side-by-side cards */}
        <div className="mt-10 sm:hidden">
          <div className="flex gap-3 overflow-x-auto pb-4 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {areas.map((area) => (
              <Link
                key={area}
                href={`/properties?city=${encodeURIComponent(area)}`}
                className="w-[72%] min-w-[72%] shrink-0 snap-start rounded-[24px] border border-slate-100 bg-white p-6 shadow-sm transition active:scale-[0.98]"
              >
                <h3 className="text-xl font-bold text-[#C9A227]">
                  {area}
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Browse listings →
                </p>
              </Link>
            ))}
          </div>

          {/* Swipe hint */}
          {areas.length > 1 && (
            <div className="mt-2 flex items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
              <span>←</span>
              Swipe to explore
              <span>→</span>
            </div>
          )}
        </div>

        {/* TABLET / DESKTOP */}
        <div className="mt-12 hidden gap-6 sm:grid sm:grid-cols-2 lg:grid-cols-3">
          {areas.map((area) => (
            <Link
              key={area}
              href={`/properties?city=${encodeURIComponent(area)}`}
              className="block rounded-[24px] border border-slate-100 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-xl"
            >
              <h3 className="text-2xl font-bold text-[#C9A227]">
                {area}
              </h3>

              <p className="mt-2 text-slate-500">
                Browse listings →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}