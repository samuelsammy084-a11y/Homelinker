"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Message = {
  id: string;
  conversation_id?: string;
  sender_id: string;
  body: string;
  created_at: string;
};

type Props = {
  conversationId: string;
  initialMessages: Message[];
};

export default function MessageThread({
  conversationId,
  initialMessages,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages ?? []
  );
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (sending) return;

    const trimmedText = text.trim();

    if (!trimmedText) return;

    if (!conversationId || conversationId === "undefined") {
      toast.error("Invalid conversation.");
      return;
    }

    setSending(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        toast.error("Please log in to send messages.");
        return;
      }

      const { data, error } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          body: trimmedText,
        })
        .select(
          "id, conversation_id, sender_id, body, created_at"
        )
        .single();

      if (error) {
        console.error("HomeLinker message send error:", {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });

        toast.error(
          error.message || "Could not send message."
        );

        return;
      }

      await supabase
        .from("conversations")
        .update({
          last_message: trimmedText,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      setMessages((current) => [...current, data]);
      setText("");
    } catch (error) {
      console.error("HomeLinker messaging error:", error);

      toast.error("Something went wrong sending the message.");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white shadow-sm">
      {/* Messages */}
      <div className="min-h-[400px] space-y-4 p-6">
        {messages.length === 0 ? (
          <div className="flex min-h-[350px] items-center justify-center text-center">
            <div>
              <div className="text-4xl">💬</div>

              <p className="mt-3 font-semibold text-black">
                No messages yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Start the conversation below.
              </p>
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <p className="whitespace-pre-wrap break-words text-base leading-7 text-black">
                {message.body}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                {new Date(
                  message.created_at
                ).toLocaleString("en-ZA")}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Message input */}
      <div className="border-t border-slate-200 bg-white p-4">
        <div className="flex gap-3">
          <input
            type="text"
            value={text}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                send();
              }
            }}
            placeholder="Type your message..."
            disabled={sending}
            className="min-w-0 flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none placeholder:text-slate-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 disabled:bg-slate-100"
          />

          <button
            type="button"
            onClick={send}
            disabled={sending || !text.trim()}
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#b89520] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
}