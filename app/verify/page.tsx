"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Upload,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type VerificationStatus =
  | "unverified"
  | "pending"
  | "verified"
  | "rejected";

export default function VerifyPage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [status, setStatus] =
    useState<VerificationStatus>("unverified");

  const [idFile, setIdFile] = useState<File | null>(null);
  const [selfieFile, setSelfieFile] = useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    async function loadVerification() {
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

        setUserId(user.id);

        const { data: profile, error: profileError } =
          await supabase
            .from("profiles")
            .select(
              "is_verified, verification_status"
            )
            .eq("id", user.id)
            .maybeSingle();

        if (profileError) {
          console.error(profileError);
          toast.error("Could not load verification status.");
          return;
        }

        if (profile?.is_verified) {
          setStatus("verified");
          return;
        }

        const { data: request, error: requestError } =
          await supabase
            .from("verification_requests")
            .select("status")
            .eq("user_id", user.id)
            .order("created_at", {
              ascending: false,
            })
            .limit(1)
            .maybeSingle();

        if (requestError) {
          console.error(requestError);
        }

        if (request?.status) {
          setStatus(
            request.status as VerificationStatus
          );
        } else {
          setStatus(
            (profile?.verification_status as VerificationStatus) ??
              "unverified"
          );
        }
      } catch (error) {
        console.error(
          "Verification loading error:",
          error
        );

        toast.error(
          "Something went wrong loading verification."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadVerification();
  }, [router]);

  function validateFile(
    file: File | null,
    label: string
  ) {
    if (!file) {
      toast.error(`Please upload your ${label}.`);
      return false;
    }

    if (!file.type.startsWith("image/")) {
      toast.error(
        `${label} must be an image file.`
      );
      return false;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error(
        `${label} must be smaller than 5MB.`
      );
      return false;
    }

    return true;
  }

  async function uploadVerificationFile(
    file: File,
    type: "id" | "selfie"
  ) {
    const extension =
      file.name.split(".").pop() || "jpg";

    const filePath = `${userId}/${type}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("verification-documents")
      .upload(filePath, file, {
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      throw new Error(
        `Could not upload ${type}: ${error.message}`
      );
    }

    return filePath;
  }

  async function handleSubmit() {
    if (!userId) return;

    if (!validateFile(idFile, "ID document")) {
      return;
    }

    if (!validateFile(selfieFile, "selfie")) {
      return;
    }

    setSubmitting(true);

    try {
      const { data: existing } = await supabase
        .from("verification_requests")
        .select("id, status")
        .eq("user_id", userId)
        .eq("status", "pending")
        .limit(1)
        .maybeSingle();

      if (existing) {
        toast.info(
          "You already have a verification request waiting for review."
        );

        setStatus("pending");
        return;
      }

      const idPath =
        await uploadVerificationFile(
          idFile!,
          "id"
        );

      const selfiePath =
        await uploadVerificationFile(
          selfieFile!,
          "selfie"
        );

      const { error } = await supabase
        .from("verification_requests")
        .insert({
          user_id: userId,
          id_document_url: idPath,
          selfie_url: selfiePath,
          status: "pending",
        });

      if (error) {
        console.error(error);

        toast.error(
          `Could not submit verification: ${error.message}`
        );

        return;
      }

      const { error: profileError } =
        await supabase
          .from("profiles")
          .update({
            verification_status: "pending",
            is_verified: false,
            updated_at: new Date().toISOString(),
          })
          .eq("id", userId);

      if (profileError) {
        console.error(profileError);
      }

      setStatus("pending");
      setIdFile(null);
      setSelfieFile(null);

      toast.success(
        "Verification submitted successfully!"
      );
    } catch (error) {
      console.error(
        "Verification submission error:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-20">
        <div className="mx-auto max-w-2xl rounded-[32px] bg-white p-10 text-center shadow-xl">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#C9A227]/20 border-t-[#C9A227]" />

          <h1 className="mt-6 text-2xl font-black">
            Loading verification...
          </h1>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-3xl">

        <Link
          href="/profile"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-[#C9A227]"
        >
          <ArrowLeft size={18} />
          Back to Profile
        </Link>

        <section className="overflow-hidden rounded-[32px] bg-[#111111] p-6 text-white shadow-xl sm:p-10">
          <div className="flex items-start gap-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#C9A227]/15 text-[#C9A227]">
              <ShieldCheck size={28} />
            </div>

            <div>
              <h1 className="text-3xl font-black sm:text-4xl">
                Verify Your HomeLinker Account
              </h1>

              <p className="mt-3 text-slate-300">
                Verification helps us build a safer
                marketplace and helps other users know
                who they are dealing with.
              </p>
            </div>
          </div>
        </section>

        {status === "verified" && (
          <section className="mt-8 rounded-[32px] border border-emerald-200 bg-white p-8 text-center shadow-xl">
            <CheckCircle2
              size={64}
              className="mx-auto text-emerald-600"
            />

            <h2 className="mt-5 text-3xl font-black text-[#1B1B1B]">
              Your account is verified
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              Your identity has been reviewed and your
              HomeLinker account has been verified.
            </p>

            <Link
              href="/profile"
              className="mt-7 inline-flex rounded-2xl bg-[#C9A227] px-7 py-3 font-bold text-white hover:bg-[#A67C00]"
            >
              Back to Profile
            </Link>
          </section>
        )}

        {status === "pending" && (
          <section className="mt-8 rounded-[32px] border border-yellow-200 bg-white p-8 text-center shadow-xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-yellow-100">
              <ShieldCheck
                size={32}
                className="text-yellow-600"
              />
            </div>

            <h2 className="mt-5 text-3xl font-black">
              Verification pending
            </h2>

            <p className="mx-auto mt-3 max-w-xl text-slate-600">
              We've received your verification documents.
              HomeLinker will review them and update your
              account once the review is complete.
            </p>

            <Link
              href="/profile"
              className="mt-7 inline-flex rounded-2xl border border-[#C9A227] px-7 py-3 font-bold text-[#A67C00]"
            >
              Back to Profile
            </Link>
          </section>
        )}

        {status === "rejected" && (
          <section className="mt-8 rounded-[32px] border border-red-200 bg-white p-8 text-center shadow-xl">
            <h2 className="text-3xl font-black">
              Verification needs attention
            </h2>

            <p className="mt-3 text-slate-600">
              Your previous verification request was not
              approved. Please submit your documents again.
            </p>

            <VerificationForm
              idFile={idFile}
              selfieFile={selfieFile}
              setIdFile={setIdFile}
              setSelfieFile={setSelfieFile}
              submitting={submitting}
              onSubmit={handleSubmit}
            />
          </section>
        )}

        {status === "unverified" && (
          <VerificationForm
            idFile={idFile}
            selfieFile={selfieFile}
            setIdFile={setIdFile}
            setSelfieFile={setSelfieFile}
            submitting={submitting}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </main>
  );
}

function VerificationForm({
  idFile,
  selfieFile,
  setIdFile,
  setSelfieFile,
  submitting,
  onSubmit,
}: {
  idFile: File | null;
  selfieFile: File | null;
  setIdFile: (file: File | null) => void;
  setSelfieFile: (file: File | null) => void;
  submitting: boolean;
  onSubmit: () => void;
}) {
  return (
    <section className="mt-8 rounded-[32px] border border-[#F0E7CF] bg-white p-6 shadow-xl sm:p-10">

      <div>
        <h2 className="text-2xl font-black text-[#1B1B1B]">
          What you'll need
        </h2>

        <p className="mt-2 text-slate-500">
          Upload clear images so our team can review your
          verification request.
        </p>
      </div>

      {/* ID */}
      <div className="mt-8">
        <label className="mb-3 block text-sm font-black text-[#1B1B1B]">
          1. ID Document
        </label>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E8D9A8] bg-[#FFFDF8] p-8 text-center transition hover:border-[#C9A227] hover:bg-[#FFF9E8]">
          <FileText
            size={34}
            className="text-[#C9A227]"
          />

          <span className="mt-3 font-bold text-[#1B1B1B]">
            {idFile
              ? idFile.name
              : "Upload your ID or passport"}
          </span>

          <span className="mt-1 text-sm text-slate-500">
            Maximum 5MB
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) =>
              setIdFile(
                event.target.files?.[0] ?? null
              )
            }
          />
        </label>
      </div>

      {/* SELFIE */}
      <div className="mt-8">
        <label className="mb-3 block text-sm font-black text-[#1B1B1B]">
          2. Selfie
        </label>

        <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[#E8D9A8] bg-[#FFFDF8] p-8 text-center transition hover:border-[#C9A227] hover:bg-[#FFF9E8]">
          <UserRound
            size={34}
            className="text-[#C9A227]"
          />

          <span className="mt-3 font-bold text-[#1B1B1B]">
            {selfieFile
              ? selfieFile.name
              : "Upload a clear selfie"}
          </span>

          <span className="mt-1 text-sm text-slate-500">
            Make sure your face is clearly visible
          </span>

          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(event) =>
              setSelfieFile(
                event.target.files?.[0] ?? null
              )
            }
          />
        </label>
      </div>

      {/* PRIVACY */}
      <div className="mt-8 rounded-2xl bg-[#F8F6F1] p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck
            size={21}
            className="mt-0.5 shrink-0 text-[#C9A227]"
          />

          <p className="text-sm leading-6 text-slate-600">
            Your verification documents are used only for
            verification purposes and should be stored in
            HomeLinker's private verification storage.
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onSubmit}
        disabled={submitting}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-4 font-bold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? (
          <>
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
            Submitting...
          </>
        ) : (
          <>
            <Upload size={19} />
            Submit for Verification
          </>
        )}
      </button>
    </section>
  );
}