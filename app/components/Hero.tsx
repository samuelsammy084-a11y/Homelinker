"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, MapPin } from "lucide-react";
import PropertySearchBar from "./PropertySearchBar";

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

      <div className="absolute inset-0 bg-slate-950/35" />

      <div className="relative z-10 mx-auto flex min-h-[92vh] max-w-7xl items-center justify-center px-4 py-12 text-center sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="w-full max-w-5xl"
        >
          {/* Trust badge */}
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[#C9A227]/40 bg-[#C9A227]/10 px-3 py-1.5 text-xs font-semibold text-[#F8D36A] shadow-lg backdrop-blur sm:px-4 sm:py-2 sm:text-sm">
            <ShieldCheck size={15} />
            Trusted rental marketplace in South Africa
          </div>

          {/* Heading */}
          <h1 className="mt-5 text-4xl font-black leading-[1.05] tracking-tight text-white sm:mt-8 sm:text-6xl lg:text-7xl">
            Find your next home
            <span className="mt-1 block text-[#F3C94B] sm:mt-3">
              with confidence
            </span>
          </h1>

          {/* Description */}
          <p className="mx-auto mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:mt-6 sm:text-lg sm:leading-8">
            Explore verified homes, rooms, and apartments that suit your budget
            and lifestyle.
          </p>

          {/* Feature pills */}
          <div className="mt-5 flex gap-2 overflow-x-auto px-1 pb-1 sm:mt-8 sm:flex-wrap sm:justify-center sm:overflow-visible">
            <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur sm:px-3 sm:py-2 sm:text-sm">
              Verified listings
            </span>

            <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur sm:px-3 sm:py-2 sm:text-sm">
              Flexible budgets
            </span>

            <span className="shrink-0 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-100 backdrop-blur sm:px-3 sm:py-2 sm:text-sm">
              Fast, simple search
            </span>
          </div>

          {/* Search */}
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/95 p-2.5 shadow-[0_25px_60px_-20px_rgba(0,0,0,0.55)] backdrop-blur sm:mt-10 sm:rounded-[30px] sm:p-4">
            <PropertySearchBar />
          </div>

          {/* Location / trust info */}
          <div className="mt-5 flex gap-2 overflow-x-auto px-1 pb-1 text-xs text-slate-300 sm:mt-8 sm:flex-wrap sm:justify-center sm:overflow-visible sm:text-sm">
            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur sm:py-2">
              <MapPin size={14} />
              Available across South Africa
            </span>

            <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur sm:py-2">
              <Sparkles size={14} />
              Curated by quality and trust
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}