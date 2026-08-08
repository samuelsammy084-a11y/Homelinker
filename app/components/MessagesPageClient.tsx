"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import MessageThread from "@/app/components/MessageThread";

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type Conversation = {
  id: string;
  property_title?: string | null;
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

  useEffect(() => {
    async function loadConversation() {
      setLoading(true);

      try {
        // ---------------------------------------------
        // Validate conversation ID
        // ---------------------------------------------

        if (!conversationId || conversationId === "undefined") {
          console.error(
            "HomeLinker: Invalid conversation ID:",
            conversationId
          );

          toast.error("Invalid conversation.");
          setLoading(false);
          return;
        }

        // ---------------------------------------------
        // Check logged-in user
        // ---------------------------------------------

        const {
          data: authData,
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          console.error(
            "HomeLinker auth error:",
            authError
          );

          toast.error(
            "Unable to verify your account."
          );

          setLoading(false);
          return;
        }

        const user = authData.user;

        if (!user) {
          setLoggedOut(true);
          setLoading(false);
          return;
        }

        // ---------------------------------------------
        // Get conversation
        // ---------------------------------------------

        const {
          data: conversationData,
          error: conversationError,
        } = await supabase
          .from("conversations")
          .select("id, property_title, owner_id, buyer_id")
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
          console.error(
            "HomeLinker: Conversation not found or user is not a participant.",
            {
              conversationId,
              userId: user.id,
            }
          );

          setConversation(null);
          setLoading(false);
          return;
        }

        // ---------------------------------------------
        // Extra client-side participant check
        // ---------------------------------------------

        const isParticipant =
          conversationData.owner_id === user.id ||
          conversationData.buyer_id === user.id;

        if (!isParticipant) {
          console.error(
            "HomeLinker: User is not part of conversation."
          );

          setConversation(null);
          setLoading(false);
          return;
        }

        // ---------------------------------------------
        // Get messages separately
        // ---------------------------------------------

        const {
          data: messageData,
          error: messageError,
        } = await supabase
          .from("messages")
          .select(
            "id, sender_id, body, created_at"
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

        setConversation({
          id: conversationData.id,
          property_title:
            conversationData.property_title,
        });

        setMessages(messageData ?? []);
        setLoading(false);
      } catch (error) {
        console.error(
          "HomeLinker conversation loading error:",
          error
        );

        toast.error(
          error instanceof Error
            ? error.message
            : "Something went wrong."
        );

        setLoading(false);
      }
    }

    loadConversation();
  }, [conversationId]);

  // ---------------------------------------------
  // Loading
  // ---------------------------------------------

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-700">
              Loading conversation...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------
  // Logged out
  // ---------------------------------------------

  if (loggedOut) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-black">
              Please log in
            </h1>

            <p className="mt-3 text-slate-600">
              You must be logged in to view your
              conversations.
            </p>

            <Link
              href="/login"
              className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Log in
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------
  // Conversation not found
  // ---------------------------------------------

  if (!conversation) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-black">
              Conversation not found
            </h1>

            <p className="mt-3 text-slate-600">
              You can only view conversations you
              are part of.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:scale-[1.02]"
            >
              Back to properties
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ---------------------------------------------
  // Conversation
  // ---------------------------------------------

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-10">
      <div className="mx-auto max-w-4xl">
        <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Conversation about
          </p>

          <h1 className="mt-1 text-2xl font-bold text-black">
            {conversation.property_title ||
              "Property"}
          </h1>
        </div>

        <MessageThread
          conversationId={conversation.id}
          initialMessages={messages}
        />
      </div>
    </main>
  );
}