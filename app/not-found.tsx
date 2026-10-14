import Link from "next/link";
import {
  ArrowLeft,
  Home,
  Search,
} from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-[#F8F6F1] px-6 py-16">
      <div className="w-full max-w-2xl text-center">
        <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#FFF7DD] text-5xl shadow-sm">
          🏠
        </div>

        <p className="mt-8 text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">
          Error 404
        </p>

        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#1B1B1B] sm:text-5xl">
          This page could not be found
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-slate-600">
          The page you are looking for may have moved,
          been removed, or the address may be incorrect.
          You can return home or continue browsing
          properties on HomeLinker.
        </p>

        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3.5 font-bold text-white transition hover:bg-[#A67C00]"
          >
            <Home size={18} />
            Go home
          </Link>

          <Link
            href="/properties"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#C9A227] bg-white px-6 py-3.5 font-bold text-[#A67C00] transition hover:bg-[#FFF9E8]"
          >
            <Search size={18} />
            Browse properties
          </Link>
        </div>

        <Link
          href="/"
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-[#C9A227]"
        >
          <ArrowLeft size={16} />
          Back to HomeLinker
        </Link>
      </div>
    </main>
  );
}