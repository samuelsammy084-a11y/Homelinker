"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import MessageThread from "@/app/components/MessageThread";
import Link from "next/link";
import { ArrowLeft, Home, ShieldCheck } from "lucide-react";

type Message = {
  id: string;
  conversation_id?: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type Conversation = {
  id: string;
  property_title: string | null;
  buyer_id: string;
  owner_id: string;
  created_at: string;
};

export default function MessagesPageClient({
  conversationId,
}: {
  conversationId: string;
}) {
  const [conversation, setConversation] =
    useState<Conversation | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(
    null
  );

  useEffect(() => {
    async function loadConversation() {
      setLoading(true);

      if (!conversationId || conversationId === "undefined") {
        toast.error("Invalid conversation.");
        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // 1. Get logged-in user
      // --------------------------------------------------

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("HomeLinker auth error:", authError);

        toast.error("Unable to verify your login.");
        setLoading(false);
        return;
      }

      const user = authData.user;

      if (!user) {
        setLoggedOut(true);
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      // --------------------------------------------------
      // 2. Load conversation
      // --------------------------------------------------

      const {
        data: conversationData,
        error: conversationError,
      } = await supabase
        .from("conversations")
        .select(
          "id, property_title, buyer_id, owner_id, created_at"
        )
        .eq("id", conversationId)
        .maybeSingle();

      if (conversationError) {
        console.error(
          "HomeLinker conversation fetch error:",
          conversationError
        );

        toast.error(
          conversationError.message ||
            "Unable to load conversation."
        );

        setLoading(false);
        return;
      }

      if (!conversationData) {
        setConversation(null);
        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // 3. Make sure user belongs to conversation
      // --------------------------------------------------

      const isParticipant =
        conversationData.buyer_id === user.id ||
        conversationData.owner_id === user.id;

      if (!isParticipant) {
        console.error(
          "HomeLinker: User is not a participant."
        );

        setConversation(null);
        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // 4. Load messages
      // --------------------------------------------------

      const {
        data: messageData,
        error: messageError,
      } = await supabase
        .from("messages")
        .select(
          "id, conversation_id, sender_id, body, created_at"
        )
        .eq("conversation_id", conversationId)
        .order("created_at", {
          ascending: true,
        });

      if (messageError) {
        console.error(
          "HomeLinker messages fetch error:",
          messageError
        );

        toast.error(
          messageError.message ||
            "Unable to load messages."
        );

        setLoading(false);
        return;
      }

      setConversation(conversationData);
      setMessages(messageData ?? []);
      setLoading(false);
    }

    loadConversation();
  }, [conversationId]);

  // --------------------------------------------------
  // Loading
  // --------------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-10">
        <div className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center">
          <div className="rounded-2xl border border-slate-200 bg-white px-8 py-6 text-center shadow-sm">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-[#C9A227]" />

            <p className="mt-4 font-semibold text-black">
              Loading conversation...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Logged out
  // --------------------------------------------------

  if (loggedOut) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-10">
        <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-black">
              Please log in
            </h1>

            <p className="mt-3 text-slate-600">
              You must be logged in to view your conversations.
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
  // Conversation not found
  // --------------------------------------------------

  if (!conversation) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-4 py-10">
        <div className="mx-auto flex min-h-[60vh] max-w-lg items-center justify-center">
          <div className="w-full rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-black">
              Conversation not found
            </h1>

            <p className="mt-3 text-slate-600">
              You can only view conversations you are part of.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:bg-[#b89520]"
            >
              Back to properties
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const isOwner = currentUserId === conversation.owner_id;

  const otherPersonLabel = isOwner
    ? "Buyer"
    : "Property Owner";

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-3 py-6 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Back button */}
        <Link
          href="/messages"
          className="mb-4 inline-flex items-center gap-2 text-sm font-semibold text-[#9F7D0A] transition hover:text-black"
        >
          <ArrowLeft size={17} />
          Back to messages
        </Link>

        {/* Chat header */}
        <div className="overflow-hidden rounded-t-3xl border border-slate-200 bg-black shadow-sm">
          <div className="flex items-center gap-4 px-5 py-4 sm:px-6">
            {/* Icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C9A227] text-black">
              <Home size={22} />
            </div>

            {/* Conversation details */}
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium uppercase tracking-wide text-[#C9A227]">
                Property enquiry
              </p>

              <h1 className="truncate text-lg font-bold text-white sm:text-xl">
                {conversation.property_title ||
                  "Property conversation"}
              </h1>

              <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck size={13} />

                <span>
                  Chatting with {otherPersonLabel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Chat */}
        <MessageThread
          conversationId={conversation.id}
          initialMessages={messages}
          currentUserId={currentUserId}
          otherPersonLabel={otherPersonLabel}
        />
      </div>
    </main>
  );
}