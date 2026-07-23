export default function WhyChooseUs() {
  const features = [
    {
      icon: "🏡",
      title: "Trusted Listings",
      description: "Every listing is reviewed to help you find genuine rental opportunities.",
    },
    {
      icon: "⚡",
      title: "Fast Search",
      description: "Quickly find rooms, apartments and houses that match your budget.",
    },
    {
      icon: "📍",
      title: "Local Focus",
      description: "Built for South Africa with locations people actually search for.",
    },
  ];

  return (
    <section className="mx-auto max-w-7xl px-6 py-24">
      <div className="mb-16 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#C9A227]">
          Why HomeLinker
        </p>

        <h2 className="mt-3 text-4xl font-bold text-[#1B1B1B]">
          A better way to find your next home
        </h2>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        {features.map((feature) => (
          <div
            key={feature.title}
            className="rounded-[24px] border border-slate-100 bg-white p-8 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="mb-6 text-5xl">{feature.icon}</div>

            <h3 className="text-2xl font-bold text-[#1B1B1B]">{feature.title}</h3>

            <p className="mt-4 leading-7 text-slate-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}