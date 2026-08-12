"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Conversation = {
  id: string;
  property_id: number | null;
  property_title: string | null;
  owner_id: string;
  buyer_id: string;
  created_at: string;
  last_message?: string | null;
  last_message_at?: string | null;
};

type Profile = {
  full_name: string;
  avatar_url: string;
};

export default function MessagesPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [profiles, setProfiles] = useState<Record<string, Profile>>({});
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadMessages() {
      setLoading(true);
      setErrorMessage("");

      try {
        // --------------------------------------------------
        // 1. Get logged-in user
        // --------------------------------------------------

        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error("HomeLinker messages auth error:", authError);
          throw new Error("Unable to verify your login.");
        }

        if (!user) {
          if (mounted) {
            setUserId(null);
            setLoading(false);
          }
          return;
        }

        if (mounted) {
          setUserId(user.id);
        }

        // --------------------------------------------------
        // 2. Get conversations
        // --------------------------------------------------

        const { data, error } = await supabase
          .from("conversations")
          .select(
            "id, property_id, property_title, owner_id, buyer_id, created_at, last_message, last_message_at"
          )
          .or(`buyer_id.eq.${user.id},owner_id.eq.${user.id}`)
          .order("last_message_at", {
            ascending: false,
            nullsFirst: false,
          })
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error("HomeLinker messages inbox error:", {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code,
          });

          throw new Error(
            error.message || "Unable to load your messages."
          );
        }

        const conversationData = (data ?? []) as Conversation[];

        if (!mounted) return;

        setConversations(conversationData);

        // --------------------------------------------------
        // 3. Find the OTHER person in every conversation
        // --------------------------------------------------

        const otherUserIds = Array.from(
          new Set(
            conversationData
              .map((conversation) =>
                conversation.buyer_id === user.id
                  ? conversation.owner_id
                  : conversation.buyer_id
              )
              .filter(Boolean)
          )
        );

        // --------------------------------------------------
        // 4. Load their profiles
        // --------------------------------------------------

        if (otherUserIds.length > 0) {
          const { data: profileData, error: profileError } =
            await supabase
              .from("profiles")
              .select("id, full_name, avatar_url")
              .in("id", otherUserIds);

          if (profileError) {
            console.error(
              "HomeLinker message profiles error:",
              profileError
            );
          } else {
            const profileMap: Record<string, Profile> = {};

            for (const profile of profileData ?? []) {
              profileMap[profile.id] = {
                full_name: profile.full_name ?? "",
                avatar_url: profile.avatar_url ?? "",
              };
            }

            if (mounted) {
              setProfiles(profileMap);
            }
          }
        } else {
          setProfiles({});
        }

        if (mounted) {
          setLoading(false);
        }
      } catch (error) {
        console.error(
          "HomeLinker Messages - unexpected error:",
          error
        );

        if (mounted) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Unable to load messages."
          );

          setLoading(false);
        }
      }
    }

    void loadMessages();

    // --------------------------------------------------
    // 5. Refresh inbox when authentication changes
    // --------------------------------------------------

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(() => {
      void loadMessages();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  function getInitials(name: string) {
    const initials = name
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .filter(Boolean)
      .join("")
      .slice(0, 2)
      .toUpperCase();

    return initials || "HL";
  }

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-12">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="text-lg font-semibold text-slate-700">
              Loading your messages...
            </div>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Not logged in
  // --------------------------------------------------

  if (!userId) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-3xl">
              💬
            </div>

            <h1 className="mt-5 text-3xl font-bold text-black">
              Please log in
            </h1>

            <p className="mt-3 text-slate-600">
              You must be logged in to view your messages.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:bg-[#b89520]"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Error
  // --------------------------------------------------

  if (errorMessage) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-12">
        <div className="mx-auto max-w-2xl">
          <div className="rounded-3xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-black">
              Unable to load messages
            </h1>

            <p className="mt-3 text-red-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-6 rounded-xl bg-black px-6 py-3 font-semibold text-white"
            >
              Try Again
            </button>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Inbox
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-[#C9A227]">
              HomeLinker
            </p>

            <h1 className="mt-1 text-4xl font-bold text-black">
              Messages
            </h1>

            <p className="mt-2 text-slate-600">
              All your property enquiries and conversations in one place.
            </p>
          </div>

          <Link
            href="/properties"
            className="inline-flex items-center justify-center rounded-xl bg-[#C9A227] px-5 py-3 font-semibold text-black transition hover:bg-[#b89520]"
          >
            Browse Properties
          </Link>
        </div>

        {/* Empty state */}
        {conversations.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-3xl">
              💬
            </div>

            <h2 className="mt-5 text-2xl font-bold text-black">
              No messages yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-600">
              When someone contacts you about a property, the
              conversation will appear here.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:bg-[#b89520]"
            >
              Find a Property
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* List header */}
            <div className="border-b border-slate-200 px-6 py-5">
              <h2 className="text-xl font-bold text-black">
                Your Conversations
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {conversations.length} conversation
                {conversations.length === 1 ? "" : "s"}
              </p>
            </div>

            {/* Conversation list */}
            <div className="divide-y divide-slate-200">
              {conversations.map((conversation) => {
                const isBuyer =
                  conversation.buyer_id === userId;

                const otherUserId = isBuyer
                  ? conversation.owner_id
                  : conversation.buyer_id;

                const otherProfile = profiles[otherUserId];

                const otherName =
                  otherProfile?.full_name?.trim() ||
                  (isBuyer ? "Property Owner" : "Home Seeker");

                const avatarUrl =
                  otherProfile?.avatar_url || "";

                const title =
                  conversation.property_title ||
                  "Property conversation";

                const preview =
                  conversation.last_message ||
                  "No messages yet.";

                const messageDate =
                  conversation.last_message_at ||
                  conversation.created_at;

                return (
                  <Link
                    key={conversation.id}
                    href={`/messages/${conversation.id}`}
                    className="block px-5 py-5 transition hover:bg-[#FFFDF8] sm:px-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Profile Avatar */}
                      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-[#C9A227] bg-[#C9A227]/15">
                        {avatarUrl ? (
                          <Image
                            src={avatarUrl}
                            alt={otherName}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        ) : (
                          <span className="text-sm font-black text-[#A67C00]">
                            {getInitials(otherName)}
                          </span>
                        )}
                      </div>

                      {/* Conversation */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <div className="flex min-w-0 items-center gap-2">
                            <h3 className="truncate text-lg font-bold text-black">
                              {otherName}
                            </h3>

                            {otherProfile?.avatar_url && (
                              <span className="shrink-0 text-xs font-semibold text-emerald-600">
                                Profile
                              </span>
                            )}
                          </div>

                          <span className="shrink-0 text-xs font-medium text-slate-500">
                            {new Date(
                              messageDate
                            ).toLocaleString("en-ZA", {
                              dateStyle: "short",
                              timeStyle: "short",
                            })}
                          </span>
                        </div>

                        <p className="mt-1 truncate font-semibold text-[#C9A227]">
                          {title}
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-600">
                          {preview}
                        </p>
                      </div>

                      <span className="mt-2 shrink-0 text-xl text-slate-400">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom navigation */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/properties"
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-black transition hover:border-[#C9A227] hover:bg-[#FFFDF8]"
          >
            ← Browse Properties
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}