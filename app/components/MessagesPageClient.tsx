"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import MessageThread from "@/app/components/MessageThread";
import Link from "next/link";

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
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [loggedOut, setLoggedOut] = useState(false);

  useEffect(() => {
    async function loadConversation() {
      setLoading(true);

      console.log(
        "HomeLinker: Loading conversation:",
        conversationId
      );

      if (!conversationId || conversationId === "undefined") {
        console.error(
          "HomeLinker: Invalid conversation ID:",
          conversationId
        );
        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // 1. Check logged-in user
      // --------------------------------------------------

      const {
        data: authData,
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error(
          "HomeLinker auth error:",
          authError.message
        );

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

      console.log(
        "HomeLinker: Current user:",
        user.id
      );

      // --------------------------------------------------
      // 2. Fetch conversation
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
          {
            message: conversationError.message,
            details: conversationError.details,
            hint: conversationError.hint,
            code: conversationError.code,
          }
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
          "HomeLinker: Conversation does not exist or you do not have access:",
          conversationId
        );

        setConversation(null);
        setLoading(false);
        return;
      }

      console.log(
        "HomeLinker: Conversation loaded:",
        conversationData
      );

      // --------------------------------------------------
      // 3. Verify participant
      // --------------------------------------------------

      const isParticipant =
        conversationData.buyer_id === user.id ||
        conversationData.owner_id === user.id;

      if (!isParticipant) {
        console.error(
          "HomeLinker: User is not a participant in this conversation."
        );

        setConversation(null);
        setLoading(false);
        return;
      }

      // --------------------------------------------------
      // 4. Fetch messages separately
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
          {
            message: messageError.message,
            details: messageError.details,
            hint: messageError.hint,
            code: messageError.code,
          }
        );

        toast.error(
          messageError.message ||
            "Unable to load messages."
        );

        setLoading(false);
        return;
      }

      console.log(
        "HomeLinker: Messages loaded:",
        messageData
      );

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
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-semibold text-black">
            Loading conversation...
          </p>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Logged out
  // --------------------------------------------------

  if (loggedOut) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-black">
            Please log in
          </h1>

          <p className="mt-3 text-slate-600">
            You must be logged in to view your conversations.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black"
          >
            Log in
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Conversation not found / inaccessible
  // --------------------------------------------------

  if (!conversation) {
    return (
      <main className="min-h-screen bg-[#F8F6F1] px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
          <h1 className="text-3xl font-bold text-black">
            Conversation not found
          </h1>

          <p className="mt-3 text-slate-600">
            You can only view conversations you are part of.
          </p>

          <Link
            href="/properties"
            className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black"
          >
            Back to properties
          </Link>
        </div>
      </main>
    );
  }

  // --------------------------------------------------
  // Conversation
  // --------------------------------------------------

  return (
    <main className="min-h-screen bg-[#F8F6F1] px-6 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-[#C9A227] hover:underline"
          >
            ← Back to dashboard
          </Link>
        </div>

        <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-medium text-slate-500">
            Conversation about
          </p>

          <h1 className="mt-1 text-2xl font-bold text-black">
            {conversation.property_title ||
              "Property conversation"}
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