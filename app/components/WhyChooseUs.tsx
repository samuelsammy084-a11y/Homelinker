export default function WhyChooseUs() {
  const features = [
    {
      icon: "🏡",
      title: "Trusted Listings",
      description:
        "Every listing is reviewed to help you find genuine rental opportunities.",
    },
    {
      icon: "⚡",
      title: "Fast Search",
      description:
        "Quickly find rooms, apartments and houses that match your budget.",
    },
    {
      icon: "📍",
      title: "Local Focus",
      description:
        "Built for South Africa with locations people actually search for.",
    },
  ];

  return (
    <section className="py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        {/* Heading */}
        <div className="mx-auto mb-10 max-w-3xl text-center sm:mb-12">
          <span className="inline-flex items-center rounded-full bg-[#C9A227]/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-[#A67C00]">
            Why HomeLinker
          </span>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#1B1B1B] sm:text-4xl lg:text-5xl">
            A better way to find
            <span className="block text-[#C9A227]">
              your next home
            </span>
          </h2>
        </div>

        {/* Features */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-[22px] border border-slate-100 bg-white p-4 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#C9A227] hover:shadow-xl sm:rounded-[26px] sm:p-7"
            >
              {/* Icon */}
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#C9A227]/10 text-2xl transition group-hover:scale-105 sm:mb-5 sm:h-14 sm:w-14 sm:text-3xl">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="text-base font-black leading-tight text-[#1B1B1B] sm:text-xl">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mt-2 text-xs leading-5 text-slate-600 sm:mt-3 sm:text-sm sm:leading-6">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}