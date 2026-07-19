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
    <section className="max-w-7xl mx-auto px-6 py-24">

      <div className="text-center mb-16">
        <p className="text-[#C9A227] font-semibold uppercase tracking-widest">
          Why HomeLinker
        </p>

        <h2 className="text-4xl font-bold text-[#1B1B1B] mt-3">
          A Better Way To Find Your Next Home
        </h2>
      </div>

      <div className="grid md:grid-cols-3 gap-8">

        {features.map((feature) => (
          <div
            key={feature.title}
            className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition duration-300"
          >
            <div className="text-5xl mb-6">{feature.icon}</div>

            <h3 className="text-2xl font-bold text-[#1B1B1B]">
              {feature.title}
            </h3>

            <p className="text-gray-600 mt-4 leading-7">
              {feature.description}
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}