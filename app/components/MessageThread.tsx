"use client";

import { useEffect, useRef, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
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
  currentUserId: string | null;
  otherPersonLabel: "Buyer" | "Property Owner";
};

export default function MessageThread({
  conversationId,
  initialMessages,
  currentUserId,
  otherPersonLabel,
}: Props) {
  const [messages, setMessages] = useState<Message[]>(
    initialMessages ?? []
  );

  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Keep the newest message visible
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages.length]);

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
        console.error(
          "HomeLinker message send error:",
          error
        );

        toast.error(
          error.message || "Could not send message."
        );

        return;
      }

      // Update conversation preview
      const { error: conversationError } = await supabase
        .from("conversations")
        .update({
          last_message: trimmedText,
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      if (conversationError) {
        console.error(
          "HomeLinker conversation update error:",
          conversationError
        );
      }

      setMessages((current) => [...current, data]);
      setText("");
    } catch (error) {
      console.error(
        "HomeLinker messaging error:",
        error
      );

      toast.error(
        "Something went wrong sending the message."
      );
    } finally {
      setSending(false);
    }
  }

  function formatTime(date: string) {
    return new Date(date).toLocaleTimeString("en-ZA", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  return (
    <div className="overflow-hidden rounded-b-3xl border-x border-b border-slate-200 bg-[#EFEAE2] shadow-sm">
      {/* Chat area */}
      <div className="min-h-[500px] max-h-[65vh] overflow-y-auto px-3 py-5 sm:px-6">
        {messages.length === 0 ? (
          <div className="flex min-h-[450px] items-center justify-center">
            <div className="max-w-sm rounded-2xl bg-white px-6 py-5 text-center shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#C9A227]/15 text-[#9F7D0A]">
                <MessageCircle size={22} />
              </div>

              <p className="mt-3 font-bold text-black">
                No messages yet
              </p>

              <p className="mt-1 text-sm text-slate-500">
                Start the conversation by sending a message below.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {messages.map((message, index) => {
              const isMine =
                message.sender_id === currentUserId;

              const previousMessage =
                messages[index - 1];

              const previousDate = previousMessage
                ? formatDate(previousMessage.created_at)
                : null;

              const currentDate = formatDate(
                message.created_at
              );

              const showDate =
                currentDate !== previousDate;

              return (
                <div key={message.id}>
                  {/* Date divider */}
                  {showDate && (
                    <div className="my-5 flex items-center justify-center">
                      <span className="rounded-full bg-white px-3 py-1 text-[11px] font-semibold text-slate-500 shadow-sm">
                        {currentDate}
                      </span>
                    </div>
                  )}

                  {/* Message */}
                  <div
                    className={`flex ${
                      isMine
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] sm:max-w-[70%] ${
                        isMine
                          ? "items-end"
                          : "items-start"
                      }`}
                    >
                      {/* Sender */}
                      <div
                        className={`mb-1 px-2 text-[11px] font-semibold ${
                          isMine
                            ? "text-right text-[#8A6C08]"
                            : "text-left text-slate-500"
                        }`}
                      >
                        {isMine
                          ? "You"
                          : otherPersonLabel}
                      </div>

                      {/* Bubble */}
                      <div
                        className={`relative rounded-2xl px-4 py-3 shadow-sm ${
                          isMine
                            ? "rounded-br-md bg-[#C9A227] text-black"
                            : "rounded-bl-md border border-slate-200 bg-white text-black"
                        }`}
                      >
                        <p className="whitespace-pre-wrap break-words text-[15px] leading-6">
                          {message.body}
                        </p>

                        <div
                          className={`mt-1.5 flex items-center justify-end gap-1 text-[10px] ${
                            isMine
                              ? "text-black/60"
                              : "text-slate-400"
                          }`}
                        >
                          <span>
                            {formatTime(
                              message.created_at
                            )}
                          </span>

                          {isMine && (
                            <span className="font-bold">
                              ✓
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="border-t border-slate-200 bg-white p-3 sm:p-4">
        <div className="flex items-end gap-2 rounded-2xl border border-slate-200 bg-[#F8F6F1] p-2">
          <input
            type="text"
            value={text}
            onChange={(event) =>
              setText(event.target.value)
            }
            onKeyDown={(event) => {
              if (
                event.key === "Enter" &&
                !event.shiftKey
              ) {
                event.preventDefault();
                send();
              }
            }}
            placeholder="Type a message..."
            disabled={sending}
            className="min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm text-black outline-none placeholder:text-slate-400 disabled:opacity-50"
          />

          <button
            type="button"
            onClick={send}
            disabled={sending || !text.trim()}
            aria-label="Send message"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#C9A227] text-black transition hover:bg-[#b89520] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Send size={18} />
          </button>
        </div>

        <p className="mt-2 text-center text-[11px] text-slate-400">
          Press Enter to send
        </p>
      </div>
    </div>
  );
}