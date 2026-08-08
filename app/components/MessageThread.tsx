"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Message = {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
};

export default function MessageThread({ conversationId, initialMessages }: { conversationId: string; initialMessages: Message[] }) {
  const [messages, setMessages] = useState<Message[]>(initialMessages || []);
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    const { data: authData } = await supabase.auth.getUser();
    const user = authData.user;

    if (!user) {
      toast("Please log in to send messages.", {
        action: { label: "Log in", onClick: () => (window.location.href = "/login") },
      });
      return;
    }

    if (!text.trim()) return;

    setSending(true);

    const { data, error } = await supabase.from("messages").insert({ conversation_id: conversationId, sender_id: user.id, body: text }).select().maybeSingle();

    if (error) {
      toast.error?.(error.message || "Could not send message.");
      setSending(false);
      return;
    }

    // Update conversation last_message
    await supabase.from("conversations").update({ last_message: text, last_message_at: new Date().toISOString() }).eq("id", conversationId);

    setMessages((m) => [...m, data]);
    setText("");
    setSending(false);
  }

  return (
    <div>
      <div className="max-h-96 overflow-auto space-y-3 p-3 border rounded">
        {messages.map((m) => (
          <div key={m.id} className="p-2 rounded bg-slate-100">
            <p className="text-sm">{m.body}</p>
            <p className="text-xs text-slate-500">{new Date(m.created_at).toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="mt-3 flex gap-2">
        <input className="flex-1 rounded px-3 py-2 border" value={text} onChange={(e) => setText(e.target.value)} />
        <button disabled={sending} onClick={send} className="bg-[#C9A227] text-white px-4 py-2 rounded">Send</button>
      </div>
    </div>
  );
}
