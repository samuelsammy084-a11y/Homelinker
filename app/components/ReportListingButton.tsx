"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { supabase } from "@/lib/supabase";

type ReportListingButtonProps = {
  propertyId: number;
};

const reasons = [
  "Fake listing",
  "Wrong price",
  "Wrong contact",
  "Scam",
  "Already rented",
  "Duplicate",
  "Other",
];

export default function ReportListingButton({ propertyId }: ReportListingButtonProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState(reasons[0]);
  const [details, setDetails] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("property_reports").insert({
      property_id: propertyId,
      reporter_id: user?.id ?? null,
      reason,
      details,
      status: "open",
    });

    setSubmitting(false);

    if (!error) {
      setOpen(false);
      setReason(reasons[0]);
      setDetails("");
      alert("Thanks — your report has been submitted for review.");
    } else {
      alert("Unable to submit your report right now.");
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 font-semibold text-amber-700 transition hover:bg-amber-100"
      >
        <AlertTriangle size={16} />
        Report Listing
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
            <h3 className="text-2xl font-bold text-slate-900">Report this listing</h3>
            <p className="mt-2 text-sm text-slate-600">
              Help us keep the marketplace trustworthy.
            </p>

            <label className="mt-5 block text-sm font-semibold text-slate-700">
              Reason
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none"
              >
                {reasons.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="mt-4 block text-sm font-semibold text-slate-700">
              Details
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 text-sm outline-none"
                placeholder="Add any extra context"
              />
            </label>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-700"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="rounded-xl bg-[#C9A227] px-4 py-2 font-semibold text-white"
              >
                {submitting ? "Submitting..." : "Submit Report"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
