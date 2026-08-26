"use client";

import { FormEvent, useState } from "react";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const starterQuestions = [
  "I need a 2 bedroom house in Pretoria under R8,000",
  "Find me a cheap room in Johannesburg",
  "I need a furnished apartment in Cape Town",
];

export default function AIAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "Hi! 👋 I'm HomeLinker AI. Tell me what kind of property you're looking for and I'll help you narrow it down.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage(messageText?: string) {
    const text = (messageText ?? input).trim();

    if (!text || loading) {
      return;
    }

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: text,
    };

    setMessages((current) => [...current, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: text,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Something went wrong."
        );
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content: data.answer,
      };

      setMessages((current) => [
        ...current,
        assistantMessage,
      ]);
    } catch (error) {
      console.error("AI chat error:", error);

      const errorMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content:
          error instanceof Error
            ? error.message
            : "Sorry, something went wrong. Please try again.",
      };

      setMessages((current) => [
        ...current,
        errorMessage,
      ]);
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await sendMessage();
  }

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="overflow-hidden rounded-[32px] border border-[#E7D9AD] bg-white shadow-2xl">
        {/* HEADER */}
        <div className="bg-[#111111] px-6 py-6 sm:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#C9A227] text-2xl shadow-lg">
              🏠
            </div>

            <div>
              <h1 className="text-xl font-black text-white sm:text-2xl">
                HomeLinker AI
              </h1>

              <p className="mt-1 text-sm text-gray-300">
                Your intelligent property search assistant
              </p>
            </div>

            <div className="ml-auto hidden items-center gap-2 rounded-full bg-white/10 px-3 py-2 text-xs font-semibold text-white sm:flex">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              AI Online
            </div>
          </div>
        </div>

        {/* CHAT */}
        <div className="min-h-[500px] bg-[#F8F6F1] p-4 sm:p-8">
          <div className="mx-auto max-w-4xl space-y-5">
            {messages.map((message) => {
              const isUser = message.role === "user";

              return (
                <div
                  key={message.id}
                  className={`flex ${
                    isUser
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[90%] rounded-3xl px-5 py-4 text-sm leading-7 shadow-sm sm:max-w-[75%] ${
                      isUser
                        ? "rounded-br-md bg-[#111111] text-white"
                        : "rounded-bl-md border border-[#E8DDBE] bg-white text-[#222222]"
                    }`}
                  >
                    {!isUser && (
                      <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#C9A227]">
                        <span>🏠</span>
                        HomeLinker AI
                      </div>
                    )}

                    <p className="whitespace-pre-wrap">
                      {message.content}
                    </p>
                  </div>
                </div>
              );
            })}

            {loading && (
              <div className="flex justify-start">
                <div className="rounded-3xl rounded-bl-md border border-[#E8DDBE] bg-white px-5 py-4 shadow-sm">
                  <div className="mb-2 text-xs font-black uppercase tracking-wider text-[#C9A227]">
                    HomeLinker AI
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="h-2 w-2 animate-bounce rounded-full bg-[#C9A227]" />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-[#C9A227]"
                      style={{ animationDelay: "120ms" }}
                    />
                    <span
                      className="h-2 w-2 animate-bounce rounded-full bg-[#C9A227]"
                      style={{ animationDelay: "240ms" }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* STARTER QUESTIONS */}
        <div className="border-t border-[#EEE5CE] bg-white px-4 py-5 sm:px-8">
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-gray-500">
            Try asking
          </p>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {starterQuestions.map((question) => (
              <button
                key={question}
                type="button"
                disabled={loading}
                onClick={() => sendMessage(question)}
                className="shrink-0 rounded-full border border-[#DCCB91] bg-[#FCFAF5] px-4 py-2 text-sm font-semibold text-[#333333] transition hover:border-[#C9A227] hover:bg-[#F8F1D9] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* INPUT */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-[#EEE5CE] bg-white p-4 sm:p-6"
        >
          <div className="flex items-end gap-3 rounded-2xl border border-[#DCDCDC] bg-[#FAFAFA] p-2 shadow-inner focus-within:border-[#C9A227]">
            <textarea
              value={input}
              onChange={(event) =>
                setInput(event.target.value)
              }
              onKeyDown={(event) => {
                if (
                  event.key === "Enter" &&
                  !event.shiftKey
                ) {
                  event.preventDefault();

                  if (!loading) {
                    sendMessage();
                  }
                }
              }}
              placeholder="Tell me what kind of property you're looking for..."
              rows={1}
              disabled={loading}
              className="max-h-32 min-h-[48px] flex-1 resize-none border-0 bg-transparent px-3 py-3 text-sm text-[#111111] outline-none placeholder:text-gray-400"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#C9A227] text-xl text-white shadow-md transition hover:bg-[#B38D1D] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label="Send message"
            >
              ↑
            </button>
          </div>

          <p className="mt-3 text-center text-xs text-gray-400">
            HomeLinker AI can make mistakes. Always verify property details
            with the listing owner or agent.
          </p>
        </form>
      </div>
    </div>
  );
}