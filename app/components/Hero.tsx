"use client";

import PropertySearchBar from "./PropertySearchBar";

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#111111]">
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(201,162,39,0.28),transparent_35%)]" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/75 to-black/55" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-center justify-center px-6 py-24 text-center">
        <div className="w-full max-w-4xl">
          <div className="inline-flex items-center rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 px-4 py-2 text-sm font-semibold text-[#F8D36A] shadow-lg backdrop-blur">
            🏡 Trusted rental marketplace in South Africa
          </div>

          <h1 className="mt-8 text-5xl font-extrabold leading-tight text-white sm:text-6xl lg:text-7xl">
            Find your next home
            <span className="block text-[#F3C94B]">with confidence</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-200 sm:text-xl">
            Search verified homes, rooms, and apartments that suit your budget and lifestyle.
          </p>

          <div className="mt-6 flex flex-wrap justify-center gap-3 text-sm font-medium text-slate-100">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">Verified listings</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">Flexible budgets</span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 backdrop-blur">Fast and simple search</span>
          </div>

          <div className="mt-10 rounded-[28px] border border-white/15 bg-white/95 p-5 shadow-2xl shadow-black/30 backdrop-blur">
            <PropertySearchBar />
          </div>
        </div>
      </div>
    </section>
  );
}