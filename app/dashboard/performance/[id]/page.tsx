"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Week = { starts_on: string; views: number; enquiries: number; new_saves: number };
type Performance = { title: string; current_saves: number; weeks: Week[] };

function weekLabel(date: string) {
  return new Intl.DateTimeFormat("en-ZA", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" })
    .format(new Date(`${date}T00:00:00Z`));
}

export default function ListingPerformancePage() {
  const { id } = useParams<{ id: string }>();
  return <ListingPerformanceReport key={id} id={id} />;
}

function ListingPerformanceReport({ id }: { id: string }) {
  const [performance, setPerformance] = useState<Performance>();
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, error: sessionError } = await supabase.auth.getSession();
        if (!active) return;
        if (sessionError || !data.session) {
          setError("Sign in to view listing performance.");
          return;
        }
        const { data: report, error: reportError } = await supabase.rpc("get_listing_performance", {
          p_property_id: id,
        });
        if (!active) return;
        if (reportError || !report) {
          setError("Listing performance is unavailable. Check that you own this listing and try again.");
          return;
        }
        setPerformance(report as Performance);
      } catch {
        if (active) setError("Listing performance could not be loaded. Please try again.");
      }
    }
    void load();
    return () => { active = false; };
  }, [id]);

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-4 py-10">
      <div className="mx-auto max-w-4xl">
        <Link href="/dashboard" className="font-semibold text-[#795D00]">← Dashboard</Link>
        <h1 className="mt-5 text-3xl font-black text-black">Listing performance</h1>
        {error && <p className="mt-5 rounded-xl bg-white p-4 text-slate-700" role="alert">{error}</p>}
        {!error && !performance && <p className="mt-5 text-slate-700" role="status">Loading performance…</p>}
        {performance && (
          <>
            <h2 className="mt-3 text-xl font-bold text-slate-900">{performance.title}</h2>
            <p className="mt-2 text-slate-700"><strong>{performance.current_saves}</strong> current favourites</p>
            <p className="mt-3 text-sm text-slate-600">
              Views count consenting browsers once per listing per day. Views and new saves begin when tracking is enabled.
              Enquiries count people who opened a HomeLinker conversation that week.
            </p>
            <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full text-left text-sm text-slate-800">
                <thead className="bg-[#FFF9E8]">
                  <tr>
                    <th scope="col" className="p-4">Week starting</th>
                    <th scope="col" className="p-4">Views</th>
                    <th scope="col" className="p-4">Enquiry contacts</th>
                    <th scope="col" className="p-4">New favourites</th>
                  </tr>
                </thead>
                <tbody>
                  {performance.weeks.map((week, index) => (
                    <tr key={week.starts_on} className="border-t border-slate-200">
                      <th scope="row" className="p-4 font-semibold">
                        {weekLabel(week.starts_on)}{index === 0 ? " (this week)" : ""}
                      </th>
                      <td className="p-4">{week.views}</td>
                      <td className="p-4">{week.enquiries}</td>
                      <td className="p-4">{week.new_saves}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
