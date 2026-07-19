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
    <section className="max-w-7xl mx-auto px-6 py-20">

      <h2 className="text-4xl font-bold text-center text-[#1B1B1B]">
        Popular Areas
      </h2>

      <p className="text-center text-gray-500 mt-3">
        Explore the most searched rental locations.
      </p>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-12">

        {areas.map((area) => (
          <div
            key={area}
            className="bg-white rounded-2xl p-8 shadow hover:shadow-xl hover:-translate-y-1 transition cursor-pointer text-center"
          >
            <h3 className="text-2xl font-bold text-[#C9A227]">
              {area}
            </h3>

            <p className="mt-2 text-gray-500">
              Browse listings
            </p>
          </div>
        ))}

      </div>

    </section>
  );
}