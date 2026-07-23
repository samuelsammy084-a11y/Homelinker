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
    <section className="mx-auto max-w-7xl px-6 py-20">
      <div className="text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C9A227]">
          Explore
        </p>
        <h2 className="mt-2 text-4xl font-bold text-[#1B1B1B]">
          Popular areas to discover
        </h2>
        <p className="mx-auto mt-3 max-w-2xl text-lg text-slate-600">
          Browse the most searched locations and find the right fit for your next move.
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {areas.map((area) => (
          <div
            key={area}
            className="cursor-pointer rounded-[24px] border border-slate-100 bg-white p-8 text-center shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <h3 className="text-2xl font-bold text-[#C9A227]">{area}</h3>
            <p className="mt-2 text-slate-500">Browse listings</p>
          </div>
        ))}
      </div>
    </section>
  );
}