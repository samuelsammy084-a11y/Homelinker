"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  FileCheck2,
  House,
  LogOut,
  Mail,
  Phone,
  Save,
  ShieldCheck,
  Upload,
  User,
  Clock3,
  XCircle,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Role = "home_seeker" | "property_owner" | "estate_agent";

type Profile = {
  full_name: string;
  phone_number: string;
  avatar_url: string;
  bio: string;
  role: Role;
  is_verified: boolean;
  verification_status: string;
};

type VerificationRequest = {
  id: number;
  status: "pending" | "verified" | "rejected";
  rejection_reason: string | null;
  created_at: string;
};

export default function ProfilePage() {
  const router = useRouter();

  const [userId, setUserId] = useState("");
  const [email, setEmail] = useState("");

  const [profile, setProfile] = useState<Profile>({
    full_name: "",
    phone_number: "",
    avatar_url: "",
    bio: "",
    role: "home_seeker",
    is_verified: false,
    verification_status: "unverified",
  });

  const [verificationRequest, setVerificationRequest] =
    useState<VerificationRequest | null>(null);

  const [verificationFile, setVerificationFile] =
    useState<File | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [submittingVerification, setSubmittingVerification] =
    useState(false);

  useEffect(() => {
    async function loadProfile() {
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
        setEmail(user.email ?? "");

        const { data, error } = await supabase
          .from("profiles")
          .select(
            "full_name, phone_number, avatar_url, bio, role, is_verified, verification_status"
          )
          .eq("id", user.id)
          .maybeSingle();

        if (error) {
          console.error("HomeLinker profile error:", error);
          toast.error("Unable to load your profile.");
          return;
        }

        if (data) {
          setProfile({
            full_name: data.full_name ?? "",
            phone_number: data.phone_number ?? "",
            avatar_url: data.avatar_url ?? "",
            bio: data.bio ?? "",
            role: (data.role as Role) ?? "home_seeker",
            is_verified: data.is_verified ?? false,
            verification_status:
              data.verification_status ?? "unverified",
          });
        }

        const { data: request } = await supabase
          .from("verification_requests")
          .select(
            "id, status, rejection_reason, created_at"
          )
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          })
          .limit(1)
          .maybeSingle();

        if (request) {
          setVerificationRequest(
            request as VerificationRequest
          );
        }
      } catch (error) {
        console.error("Profile loading error:", error);
        toast.error("Something went wrong.");
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, [router]);

  async function handleAvatarUpload(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file || !userId) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Profile picture must be smaller than 5MB.");
      return;
    }

    setUploading(true);

    try {
      const extension =
        file.name.split(".").pop() || "jpg";

      const filePath =
        `${userId}/avatar-${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("profile-images")
          .upload(filePath, file, {
            upsert: true,
            contentType: file.type,
          });

      if (uploadError) {
        console.error("Avatar upload error:", uploadError);

        toast.error(
          `Could not upload profile picture: ${uploadError.message}`
        );

        return;
      }

      const { data } = supabase.storage
        .from("profile-images")
        .getPublicUrl(filePath);

      const avatarUrl = data.publicUrl;

      /*
       * IMPORTANT:
       * Upsert instead of update.
       *
       * This makes sure the profile row exists and saves
       * the avatar even if the profile row was never created.
       */
      const { error: profileError } =
        await supabase
          .from("profiles")
          .upsert(
            {
              id: userId,
              avatar_url: avatarUrl,
              updated_at: new Date().toISOString(),
            },
            {
              onConflict: "id",
            }
          );

      if (profileError) {
        console.error(
          "Profile avatar save error:",
          profileError
        );

        toast.error(
          `Picture uploaded, but profile could not be saved: ${profileError.message}`
        );

        return;
      }

      setProfile((current) => ({
        ...current,
        avatar_url: avatarUrl,
      }));

      toast.success("Profile picture saved!");
    } catch (error) {
      console.error("Avatar upload error:", error);

      toast.error(
        "Something went wrong uploading your picture."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSaveProfile() {
    if (!userId) {
      toast.error("You are not logged in.");
      return;
    }

    if (!profile.full_name.trim()) {
      toast.error("Please enter your name.");
      return;
    }

    if (!profile.phone_number.trim()) {
      toast.error("Please enter your phone number.");
      return;
    }

    setSaving(true);

    try {
      /*
       * IMPORTANT:
       * Use UPSERT instead of UPDATE.
       *
       * UPDATE only works if a profile row already exists.
       * UPSERT creates it when necessary and updates it when
       * it already exists.
       */
      const { data, error } = await supabase
        .from("profiles")
        .upsert(
          {
            id: userId,
            full_name: profile.full_name.trim(),
            phone_number: profile.phone_number.trim(),
            avatar_url: profile.avatar_url || null,
            bio: profile.bio.trim(),
            role: profile.role,
            is_verified: profile.is_verified,
            verification_status:
              profile.verification_status,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        )
        .select(
          "full_name, phone_number, avatar_url, bio, role, is_verified, verification_status"
        )
        .single();

      if (error) {
        console.error(
          "PROFILE SAVE ERROR:",
          error
        );

        toast.error(
          `Could not save profile: ${error.message}`
        );

        return;
      }

      if (!data) {
        toast.error(
          "Profile was not returned after saving."
        );

        return;
      }

      setProfile({
        full_name: data.full_name ?? "",
        phone_number: data.phone_number ?? "",
        avatar_url: data.avatar_url ?? "",
        bio: data.bio ?? "",
        role: (data.role as Role) ?? "home_seeker",
        is_verified: data.is_verified ?? false,
        verification_status:
          data.verification_status ?? "unverified",
      });

      toast.success(
        "Profile saved successfully!"
      );
    } catch (error) {
      console.error(
        "Profile save error:",
        error
      );

      toast.error(
        "Something went wrong saving your profile."
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleVerificationSubmit() {
    if (!userId || !verificationFile) {
      toast.error("Please choose your verification document.");
      return;
    }

    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
      ].includes(verificationFile.type)
    ) {
      toast.error(
        "Please upload a JPG, PNG or WebP image."
      );
      return;
    }

    if (verificationFile.size > 5 * 1024 * 1024) {
      toast.error(
        "Verification document must be smaller than 5MB."
      );
      return;
    }

    if (
      verificationRequest?.status === "pending"
    ) {
      toast.error(
        "You already have a verification request under review."
      );
      return;
    }

    setSubmittingVerification(true);

    try {
      const extension =
        verificationFile.name.split(".").pop() || "jpg";

      const filePath =
        `${userId}/id-${Date.now()}.${extension}`;

      const { error: uploadError } =
        await supabase.storage
          .from("verification-documents")
          .upload(filePath, verificationFile, {
            upsert: false,
            contentType: verificationFile.type,
          });

      if (uploadError) {
        console.error(uploadError);

        toast.error(
          `Could not upload document: ${uploadError.message}`
        );

        return;
      }

      const { data: request, error: requestError } =
        await supabase
          .from("verification_requests")
          .insert({
            user_id: userId,
            id_document_url: filePath,
            selfie_url: filePath,
            status: "pending",
          })
          .select(
            "id, status, rejection_reason, created_at"
          )
          .single();

      if (requestError) {
        console.error(requestError);

        await supabase.storage
          .from("verification-documents")
          .remove([filePath]);

        toast.error(
          `Could not submit verification: ${requestError.message}`
        );

        return;
      }

      await supabase
        .from("profiles")
        .update({
          verification_status: "pending",
          is_verified: false,
          updated_at: new Date().toISOString(),
        })
        .eq("id", userId);

      setVerificationRequest(
        request as VerificationRequest
      );

      setProfile((current) => ({
        ...current,
        verification_status: "pending",
        is_verified: false,
      }));

      setVerificationFile(null);

      toast.success(
        "Verification submitted! We'll review your account."
      );
    } catch (error) {
      console.error(
        "Verification submission error:",
        error
      );

      toast.error(
        "Something went wrong submitting verification."
      );
    } finally {
      setSubmittingVerification(false);
    }
  }

  async function handleLogout() {
    const confirmed = window.confirm(
      "Are you sure you want to log out of HomeLinker?"
    );

    if (!confirmed) return;

    const { error } =
      await supabase.auth.signOut();

    if (error) {
      toast.error(
        `Could not log out: ${error.message}`
      );
      return;
    }

    router.replace("/");
  }

  function getRoleLabel(role: Role) {
    if (role === "estate_agent") return "Estate Agent";
    if (role === "property_owner")
      return "Property Owner";
    return "Home Seeker";
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-24">
        <div className="mx-auto max-w-3xl">
          <div className="rounded-[32px] border border-[#F0E7CF] bg-white p-10 text-center shadow-xl">
            <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-[#C9A227]/20 border-t-[#C9A227]" />

            <h1 className="mt-6 text-2xl font-black text-[#1B1B1B]">
              Loading your profile...
            </h1>
          </div>
        </div>
      </main>
    );
  }

  const initials =
    profile.full_name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "HL";

  const isPending =
    verificationRequest?.status === "pending" ||
    profile.verification_status === "pending";

  const isRejected =
    verificationRequest?.status === "rejected" ||
    profile.verification_status === "rejected";

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#FCFAF5_0%,#F8F6F1_100%)] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-4xl">

        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 font-semibold text-slate-600 transition hover:text-[#A67C00]"
        >
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        {/* PROFILE HEADER */}
        <div className="overflow-hidden rounded-[32px] border border-[#E8D8A5] bg-white shadow-xl">
          <div className="border-t-8 border-[#C9A227] p-6 sm:p-10">
            <div className="flex flex-col gap-6 sm:flex-row sm:items-center">

              <div className="relative shrink-0">
                <div className="relative flex h-28 w-28 items-center justify-center overflow-hidden rounded-full border-4 border-[#C9A227] bg-[#FFF9E8] sm:h-32 sm:w-32">
                  {profile.avatar_url ? (
                    <Image
                      src={profile.avatar_url}
                      alt={
                        profile.full_name ||
                        "Profile picture"
                      }
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  ) : (
                    <span className="text-3xl font-black text-[#C9A227]">
                      {initials}
                    </span>
                  )}
                </div>

                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-[#C9A227] text-white shadow-lg transition hover:bg-[#A67C00]"
                >
                  <Camera size={18} />

                  <input
                    id="avatar-upload"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleAvatarUpload}
                    disabled={uploading}
                  />
                </label>
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-3xl font-black text-[#1B1B1B] sm:text-4xl">
                    {profile.full_name ||
                      "Your Name"}
                  </h1>

                  {profile.is_verified && (
                    <CheckCircle2
                      size={24}
                      className="text-[#C9A227]"
                    />
                  )}
                </div>

                <p className="mt-2 text-slate-500">
                  {getRoleLabel(profile.role)}
                </p>

                <div className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E8D8A5] bg-[#FFF9E8] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#A67C00]">
                  <ShieldCheck size={14} />

                  {profile.is_verified
                    ? "Verified Profile"
                    : isPending
                    ? "Verification Pending"
                    : "Profile Not Yet Verified"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PERSONAL INFORMATION */}
        <section className="mt-8 rounded-[32px] border border-[#F0E7CF] bg-white p-6 shadow-xl sm:p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-black text-[#1B1B1B] sm:text-3xl">
              Personal Information
            </h2>

            <p className="mt-2 text-slate-500">
              Keep your HomeLinker profile information up to date.
            </p>
          </div>

          <div className="space-y-6">

            <div>
              <label className="mb-2 block text-sm font-bold text-[#1B1B1B]">
                Full Name
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      full_name:
                        event.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 text-[#1B1B1B] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#1B1B1B]">
                Phone Number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="tel"
                  value={profile.phone_number}
                  onChange={(event) =>
                    setProfile((current) => ({
                      ...current,
                      phone_number:
                        event.target.value,
                    }))
                  }
                  placeholder="e.g. 082 123 4567"
                  className="w-full rounded-2xl border border-slate-200 py-4 pl-12 pr-4 text-[#1B1B1B] outline-none focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/10"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#1B1B1B]">
                Email Address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full cursor-not-allowed rounded-2xl border border-slate-200 bg-slate-50 py-4 pl-12 pr-4 text-slate-500"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#1B1B1B]">
                Account Type
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-[#F0E7CF] bg-[#FFF9E8] p-4">
                <House
                  size={20}
                  className="text-[#C9A227]"
                />

                <div>
                  <p className="font-bold text-[#1B1B1B]">
                    {getRoleLabel(profile.role)}
                  </p>

                  <p className="text-sm text-slate-500">
                    Your HomeLinker account role.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-[#1B1B1B]">
                About You
              </label>

              <textarea
                rows={5}
                value={profile.bio}
                onChange={(event) =>
                  setProfile((current) => ({
                    ...current,
                    bio: event.target.value,
                  }))
                }
                placeholder="Tell people a little about yourself..."
                className="w-full resize-none rounded-2xl border border-slate-200 p-4 text-[#1B1B1B] outline-none focus:border-[#C9A227]"
              />
            </div>
          </div>

          <button
            type="button"
            onClick={handleSaveProfile}
            disabled={saving}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-4 font-bold text-white transition hover:bg-[#A67C00] disabled:opacity-60 sm:w-auto"
          >
            <Save size={18} />
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>
        </section>

        {/* VERIFICATION */}
        <section className="mt-8 rounded-[32px] border border-[#F0E7CF] bg-white p-6 shadow-xl sm:p-10">

          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#FFF9E8] text-[#C9A227]">
              <ShieldCheck size={25} />
            </div>

            <div>
              <h2 className="text-2xl font-black text-[#1B1B1B] sm:text-3xl">
                Verification & Safety
              </h2>

              <p className="mt-2 text-slate-600">
                Verify your identity to help other HomeLinker
                users know that your account is genuine.
              </p>
            </div>
          </div>

          {profile.is_verified ? (
            <div className="mt-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2
                  size={30}
                  className="text-emerald-600"
                />

                <div>
                  <h3 className="font-black text-emerald-800">
                    Your account is verified
                  </h3>

                  <p className="mt-1 text-sm text-emerald-700">
                    Other users can now see that your HomeLinker
                    profile has been verified.
                  </p>
                </div>
              </div>
            </div>
          ) : isPending ? (
            <div className="mt-6 rounded-2xl border border-yellow-200 bg-yellow-50 p-6">
              <div className="flex items-center gap-3">
                <Clock3
                  size={30}
                  className="text-yellow-600"
                />

                <div>
                  <h3 className="font-black text-yellow-800">
                    Verification under review
                  </h3>

                  <p className="mt-1 text-sm text-yellow-700">
                    Your verification documents have been submitted.
                    Please wait while HomeLinker reviews them.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {isRejected && (
                <div className="mt-6 rounded-2xl border border-red-200 bg-red-50 p-5">
                  <div className="flex items-start gap-3">
                    <XCircle
                      size={24}
                      className="mt-0.5 shrink-0 text-red-600"
                    />

                    <div>
                      <h3 className="font-black text-red-800">
                        Verification was not approved
                      </h3>

                      {verificationRequest?.rejection_reason && (
                        <p className="mt-1 text-sm text-red-700">
                          Reason:{" "}
                          {
                            verificationRequest.rejection_reason
                          }
                        </p>
                      )}

                      <p className="mt-2 text-sm text-red-700">
                        You can submit a new document below.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="mt-6 rounded-2xl border-2 border-dashed border-[#E8D9A8] bg-[#FFFDF8] p-6">

                <div className="text-center">
                  <FileCheck2
                    size={40}
                    className="mx-auto text-[#C9A227]"
                  />

                  <h3 className="mt-4 text-xl font-black text-[#1B1B1B]">
                    Verify your account
                  </h3>

                  <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
                    Upload a clear photo of an accepted identity
                    document. Your document is stored privately and
                    only used for verification.
                  </p>
                </div>

                <label
                  htmlFor="verification-document"
                  className="mx-auto mt-6 flex max-w-xl cursor-pointer items-center justify-center gap-3 rounded-2xl border border-[#C9A227] bg-white px-6 py-5 font-bold text-[#A67C00] transition hover:bg-[#FFF9E8]"
                >
                  <Upload size={20} />

                  {verificationFile
                    ? verificationFile.name
                    : "Choose verification document"}

                  <input
                    id="verification-document"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={(event) => {
                      setVerificationFile(
                        event.target.files?.[0] ??
                          null
                      );
                    }}
                  />
                </label>

                <p className="mt-3 text-center text-xs text-slate-400">
                  JPG, PNG or WebP • Maximum 5MB
                </p>

                {verificationFile && (
                  <button
                    type="button"
                    onClick={handleVerificationSubmit}
                    disabled={submittingVerification}
                    className="mx-auto mt-6 flex w-full max-w-xl items-center justify-center gap-2 rounded-2xl bg-[#C9A227] px-6 py-4 font-bold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <ShieldCheck size={19} />

                    {submittingVerification
                      ? "Submitting..."
                      : "Submit for Verification"}
                  </button>
                )}
              </div>
            </>
          )}
        </section>

        {/* COMMUNITY */}
        <section className="mt-8 rounded-[32px] border border-[#F0E7CF] bg-white p-6 shadow-xl sm:p-10">
          <h2 className="text-2xl font-black text-[#1B1B1B]">
            Community & Safety
          </h2>

          <p className="mt-2 text-slate-600">
            Help keep HomeLinker safe and trustworthy.
          </p>

          <div className="mt-6 space-y-3">
            <Link
              href="/terms"
              className="block rounded-2xl border border-slate-200 p-4 font-semibold transition hover:border-[#C9A227] hover:bg-[#FFF9E8]"
            >
              Terms & Conditions
            </Link>

            <Link
              href="/privacy"
              className="block rounded-2xl border border-slate-200 p-4 font-semibold transition hover:border-[#C9A227] hover:bg-[#FFF9E8]"
            >
              Privacy Policy
            </Link>
          </div>
        </section>

        {/* LOGOUT */}
        <section className="mt-8 rounded-[32px] border border-red-100 bg-white p-6 shadow-xl sm:p-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-black text-[#1B1B1B]">
                Sign out of HomeLinker
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                You can sign back in at any time.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </section>

        <div className="pb-8 pt-8 text-center text-sm text-slate-400">
          HomeLinker • Your trusted property marketplace
        </div>
      </div>
    </main>
  );
}