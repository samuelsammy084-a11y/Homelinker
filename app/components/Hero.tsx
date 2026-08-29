"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, MapPin } from "lucide-react";
import PropertySearchBar from "./PropertySearchBar";
import FloatingHouses from "./FloatingHouses";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-slate-950">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-40"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2073&auto=format&fit=crop')",
        }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-slate-950/45" />

      {/* Extra mobile readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/45 to-slate-950/80" />

      {/* Floating 3D house shapes — quiet atmospheric layer, sits above the
          background/overlays but behind the text and search bar below */}
      <FloatingHouses />

      <div className="relative z-10 mx-auto flex min-h-[78vh] max-w-7xl items-center justify-center px-4 py-10 text-center sm:min-h-[92vh] sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-5xl"
        >
          {/* Trust badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-black/25 px-3 py-1.5 text-[11px] font-semibold text-[#F8D36A] shadow-lg backdrop-blur-md sm:px-4 sm:py-2 sm:text-sm">
            <ShieldCheck size={14} />
            Trusted rental marketplace in South Africa
          </div>

          {/* Heading */}
          <h1 className="mx-auto mt-5 max-w-[360px] text-[2.45rem] font-black leading-[0.98] tracking-[-0.04em] text-white sm:mt-8 sm:max-w-4xl sm:text-6xl lg:text-7xl">
            Find your next home
            <span className="mt-2 block text-[#F3C94B] sm:mt-3">
              with confidence
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-[340px] text-sm leading-6 text-slate-200 sm:mt-6 sm:max-w-2xl sm:text-lg sm:leading-8">
            Find rooms, apartments and houses that match your budget and
            lifestyle.
          </p>

          {/* Mobile trust points */}
          <div className="mx-auto mt-5 grid max-w-[360px] grid-cols-3 gap-2 sm:hidden">
            <div className="rounded-2xl border border-white/10 bg-white/10 px-2 py-2.5 backdrop-blur-md">
              <ShieldCheck className="mx-auto mb-1.5 h-4 w-4 text-[#F3C94B]" />
              <p className="text-[9px] font-semibold leading-3 text-white">
                Trusted
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-2 py-2.5 backdrop-blur-md">
              <MapPin className="mx-auto mb-1.5 h-4 w-4 text-[#F3C94B]" />
              <p className="text-[9px] font-semibold leading-3 text-white">
                South Africa
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/10 px-2 py-2.5 backdrop-blur-md">
              <Sparkles className="mx-auto mb-1.5 h-4 w-4 text-[#F3C94B]" />
              <p className="text-[9px] font-semibold leading-3 text-white">
                Quality
              </p>
            </div>
          </div>

          {/* Desktop feature pills */}
          <div className="mt-5 hidden gap-2 sm:mt-8 sm:flex sm:flex-wrap sm:justify-center">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100 backdrop-blur">
              Verified listings
            </span>

            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100 backdrop-blur">
              Flexible budgets
            </span>

            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-2 text-sm font-medium text-slate-100 backdrop-blur">
              Fast, simple search
            </span>
          </div>

          {/* Search */}
          <div className="mx-auto mt-6 max-w-4xl rounded-[22px] border border-white/20 bg-white p-2 shadow-[0_25px_70px_-20px_rgba(0,0,0,0.65)] sm:mt-10 sm:rounded-[30px] sm:bg-white/95 sm:p-4">
            <PropertySearchBar />
          </div>

          {/* Desktop location / trust information */}
          <div className="mt-5 hidden gap-2 text-sm text-slate-300 sm:mt-8 sm:flex sm:flex-wrap sm:justify-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
              <MapPin size={14} />
              Available across South Africa
            </span>

            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
              <Sparkles size={14} />
              Curated by quality and trust
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}