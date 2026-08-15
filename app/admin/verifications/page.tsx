"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  ShieldCheck,
  XCircle,
  User,
  Phone,
  CalendarDays,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type VerificationStatus = "pending" | "verified" | "rejected";

type VerificationRequest = {
  id: number;
  user_id: string;
  id_document_url: string;
  selfie_url: string;
  status: VerificationStatus;
  rejection_reason: string | null;
  created_at: string;
  reviewed_at: string | null;
};

type Profile = {
  id: string;
  full_name: string;
  phone_number: string;
  avatar_url: string;
  is_verified: boolean;
  verification_status: string;
};

type VerificationItem = {
  request: VerificationRequest;
  profile: Profile | null;
};

export default function AdminVerificationsPage() {
  const router = useRouter();

  const [items, setItems] = useState<VerificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [openingFile, setOpeningFile] = useState<string | null>(null);

  useEffect(() => {
    void loadRequests();
  }, []);

  async function loadRequests() {
    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        router.replace("/login");
        return;
      }

      // CHECK ADMIN
      const { data: adminProfile, error: adminError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (adminError || !adminProfile?.is_admin) {
        toast.error("You do not have admin access.");
        router.replace("/dashboard");
        return;
      }

      // LOAD PENDING REQUESTS
      const { data: requests, error: requestError } = await supabase
        .from("verification_requests")
        .select("*")
        .eq("status", "pending")
        .order("created_at", {
          ascending: false,
        });

      if (requestError) {
        console.error(requestError);

        toast.error(
          `Could not load verification requests: ${requestError.message}`
        );

        return;
      }

      const results: VerificationItem[] = [];

      for (const request of requests ?? []) {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select(
            "id, full_name, phone_number, avatar_url, is_verified, verification_status"
          )
          .eq("id", request.user_id)
          .maybeSingle();

        if (profileError) {
          console.error(profileError);
        }

        results.push({
          request,
          profile,
        });
      }

      setItems(results);
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong loading verification requests.");
    } finally {
      setLoading(false);
    }
  }

  async function openVerificationFile(
    path: string,
    type: "id" | "selfie"
  ) {
    if (!path) {
      toast.error(`No ${type === "id" ? "ID document" : "selfie"} found.`);
      return;
    }

    setOpeningFile(type);

    try {
      /*
       * verification-documents is PRIVATE.
       *
       * Therefore we create a temporary signed URL.
       * The file remains private in Supabase.
       */
      const { data, error } = await supabase.storage
        .from("verification-documents")
        .createSignedUrl(path, 10 * 60);

      if (error) {
        console.error("Signed URL error:", error);

        toast.error(
          `Could not open ${
            type === "id" ? "ID document" : "selfie"
          }: ${error.message}`
        );

        return;
      }

      if (!data?.signedUrl) {
        toast.error("Could not create a secure document link.");
        return;
      }

      window.open(data.signedUrl, "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error);
      toast.error("Could not open verification document.");
    } finally {
      setOpeningFile(null);
    }
  }

  async function approveVerification(item: VerificationItem) {
    const request = item.request;
    const name = item.profile?.full_name || "this user";

    const confirmed = window.confirm(
      `Approve verification for ${name}?\n\nMake sure the ID document and selfie belong to the same person.`
    );

    if (!confirmed) return;

    setProcessingId(request.id);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("You are not logged in.");
        return;
      }

      // FIRST: update verification request
      const { error: requestError } = await supabase
        .from("verification_requests")
        .update({
          status: "verified",
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (requestError) {
        throw requestError;
      }

      // SECOND: update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          is_verified: true,
          verification_status: "verified",
          updated_at: new Date().toISOString(),
        })
        .eq("id", request.user_id);

      if (profileError) {
        throw profileError;
      }

      // Remove from pending list
      setItems((current) =>
        current.filter((item) => item.request.id !== request.id)
      );

      toast.success(`${name} is now verified!`);
    } catch (error) {
      console.error("Approve verification error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not approve verification."
      );
    } finally {
      setProcessingId(null);
    }
  }

  async function rejectVerification(item: VerificationItem) {
    const request = item.request;
    const name = item.profile?.full_name || "this user";

    const reason = window.prompt(
      `Why are you rejecting ${name}'s verification?\n\nExample: ID document does not match selfie.`
    );

    if (!reason?.trim()) {
      return;
    }

    setProcessingId(request.id);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("You are not logged in.");
        return;
      }

      // Update request
      const { error: requestError } = await supabase
        .from("verification_requests")
        .update({
          status: "rejected",
          rejection_reason: reason.trim(),
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
        })
        .eq("id", request.id);

      if (requestError) {
        throw requestError;
      }

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          is_verified: false,
          verification_status: "rejected",
          updated_at: new Date().toISOString(),
        })
        .eq("id", request.user_id);

      if (profileError) {
        throw profileError;
      }

      // Remove from pending list
      setItems((current) =>
        current.filter((item) => item.request.id !== request.id)
      );

      toast.success("Verification rejected.");
    } catch (error) {
      console.error("Reject verification error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Could not reject verification."
      );
    } finally {
      setProcessingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-10 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-[32px] border border-[#F0E7CF] bg-white p-12 text-center shadow-xl">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-[#C9A227]/20 border-t-[#C9A227]" />

            <h1 className="mt-6 text-2xl font-black text-[#1B1B1B]">
              Loading verification requests...
            </h1>

            <p className="mt-2 text-slate-500">
              Please wait.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-6xl">

        {/* BACK */}
        <button
          type="button"
          onClick={() => router.push("/dashboard")}
          className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-[#C9A227]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </button>

        {/* HEADER */}
        <section className="overflow-hidden rounded-[32px] bg-[#111111] shadow-xl">
          <div className="p-6 sm:p-10">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C9A227]/15 text-[#C9A227]">
                <ShieldCheck size={28} />
              </div>

              <div>
                <h1 className="text-3xl font-black text-white sm:text-4xl">
                  Verification Requests
                </h1>

                <p className="mt-2 text-sm text-slate-300 sm:text-base">
                  Review users who have submitted their identity documents
                  for HomeLinker verification.
                </p>
              </div>
            </div>

            <div className="mt-6 inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-white">
              {items.length} pending{" "}
              {items.length === 1 ? "request" : "requests"}
            </div>
          </div>
        </section>

        {/* EMPTY */}
        {items.length === 0 ? (
          <section className="mt-8 rounded-[32px] border border-[#F0E7CF] bg-white p-12 text-center shadow-xl">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50">
              <CheckCircle2
                size={42}
                className="text-emerald-500"
              />
            </div>

            <h2 className="mt-6 text-2xl font-black text-[#1B1B1B]">
              No pending verifications
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-500">
              There are currently no users waiting for identity
              verification.
            </p>
          </section>
        ) : (
          <div className="mt-8 space-y-6">

            {items.map((item) => {
              const request = item.request;
              const profile = item.profile;
              const processing = processingId === request.id;

              return (
                <article
                  key={request.id}
                  className="overflow-hidden rounded-[32px] border border-[#F0E7CF] bg-white shadow-xl"
                >
                  {/* USER HEADER */}
                  <div className="border-b border-[#F0E7CF] bg-[#FFFDF8] p-6 sm:p-8">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                      <div className="flex items-center gap-4">

                        {/* PROFILE IMAGE */}
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#C9A227] bg-[#FFF9E8]">
                          {profile?.avatar_url ? (
                            <img
                              src={profile.avatar_url}
                              alt={profile.full_name || "User"}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <User
                              size={26}
                              className="text-[#C9A227]"
                            />
                          )}
                        </div>

                        <div>
                          <h2 className="text-2xl font-black text-[#1B1B1B]">
                            {profile?.full_name || "Unknown User"}
                          </h2>

                          <div className="mt-2 flex flex-wrap gap-3 text-sm text-slate-500">

                            <span className="inline-flex items-center gap-1.5">
                              <Phone size={14} />
                              {profile?.phone_number ||
                                "No phone number"}
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                              <CalendarDays size={14} />
                              {new Date(
                                request.created_at
                              ).toLocaleDateString("en-ZA")}
                            </span>

                          </div>
                        </div>
                      </div>

                      <div className="w-fit rounded-full bg-yellow-100 px-4 py-2 text-sm font-bold text-yellow-700">
                        Pending Review
                      </div>
                    </div>
                  </div>

                  {/* DOCUMENTS */}
                  <div className="p-6 sm:p-8">

                    <div>
                      <h3 className="text-lg font-black text-[#1B1B1B]">
                        Identity Documents
                      </h3>

                      <p className="mt-1 text-sm text-slate-500">
                        Check that the ID document belongs to the same
                        person shown in the selfie.
                      </p>
                    </div>

                    <div className="mt-6 grid gap-4 sm:grid-cols-2">

                      {/* ID */}
                      <button
                        type="button"
                        disabled={openingFile === "id"}
                        onClick={() =>
                          openVerificationFile(
                            request.id_document_url,
                            "id"
                          )
                        }
                        className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:border-[#C9A227] hover:bg-[#FFF9E8] disabled:cursor-wait disabled:opacity-60"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                              Document 1
                            </p>

                            <p className="mt-1 text-lg font-black text-[#1B1B1B]">
                              ID Document
                            </p>
                          </div>

                          <Eye
                            size={22}
                            className="text-[#C9A227] transition group-hover:scale-110"
                          />
                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                          Click to securely view the submitted ID.
                        </p>

                        <div className="mt-5 inline-flex rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-bold text-white">
                          {openingFile === "id"
                            ? "Opening..."
                            : "View ID"}
                        </div>
                      </button>

                      {/* SELFIE */}
                      <button
                        type="button"
                        disabled={openingFile === "selfie"}
                        onClick={() =>
                          openVerificationFile(
                            request.selfie_url,
                            "selfie"
                          )
                        }
                        className="group rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left transition hover:border-[#C9A227] hover:bg-[#FFF9E8] disabled:cursor-wait disabled:opacity-60"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs font-black uppercase tracking-wider text-slate-400">
                              Document 2
                            </p>

                            <p className="mt-1 text-lg font-black text-[#1B1B1B]">
                              Selfie
                            </p>
                          </div>

                          <Eye
                            size={22}
                            className="text-[#C9A227] transition group-hover:scale-110"
                          />
                        </div>

                        <p className="mt-3 text-sm text-slate-500">
                          Click to securely view the submitted selfie.
                        </p>

                        <div className="mt-5 inline-flex rounded-xl bg-[#C9A227] px-4 py-2 text-sm font-bold text-white">
                          {openingFile === "selfie"
                            ? "Opening..."
                            : "View Selfie"}
                        </div>
                      </button>

                    </div>

                    {/* ACTIONS */}
                    <div className="mt-8 grid gap-3 sm:grid-cols-2">

                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => approveVerification(item)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <CheckCircle2 size={19} />

                        {processing
                          ? "Processing..."
                          : "Approve Verification"}
                      </button>

                      <button
                        type="button"
                        disabled={processing}
                        onClick={() => rejectVerification(item)}
                        className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-4 font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <XCircle size={19} />

                        {processing
                          ? "Processing..."
                          : "Reject Verification"}
                      </button>

                    </div>

                    {/* ADMIN NOTE */}
                    <div className="mt-6 rounded-2xl border border-[#E8D9A8] bg-[#FFF9E8] p-5">
                      <p className="text-sm font-bold text-[#1B1B1B]">
                        Verification reminder
                      </p>

                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Only approve the account when the submitted
                        identification and selfie clearly belong to the
                        same person. If something looks suspicious,
                        reject the request and provide a reason.
                      </p>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <div className="pb-10 pt-8 text-center text-sm text-slate-400">
          HomeLinker • Verification Administration
        </div>
      </div>
    </main>
  );
}