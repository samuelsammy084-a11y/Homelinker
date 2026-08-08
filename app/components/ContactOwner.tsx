"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Phone, Send } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type ContactOwnerProps = {
  propertyId: number;
  title: string;
  contactNumber?: string | null;
  contactName?: string | null;
  ownerId?: string | null;
  createdAt?: string | null;
};

function formatWhatsAppNumber(value: string) {
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  // South African local number: 0612345678 -> 27612345678
  if (digits.startsWith("0")) {
    return `27${digits.slice(1)}`;
  }

  // Already international without +
  if (digits.startsWith("27")) {
    return digits;
  }

  // Fallback
  return digits;
}

export default function ContactOwner({
  propertyId,
  title,
  contactNumber,
  contactName,
  ownerId,
  createdAt,
}: ContactOwnerProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showMessageBox, setShowMessageBox] = useState(false);
  const [message, setMessage] = useState(
    `Hi, I found your property "${title}" on HomeLinker and I'm interested. Is it still available?`
  );

  const hasPhone = Boolean(contactNumber?.trim());

  const whatsappNumber = hasPhone
    ? formatWhatsAppNumber(contactNumber!.trim())
    : "";

  const whatsappUrl = whatsappNumber
    ? `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
        `Hi, I found your property "${title}" on HomeLinker and I'm interested. Is it still available?`
      )}`
    : "";

  async function startConversation() {
    if (loading) return;

    setLoading(true);

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError) {
        console.error("HomeLinker auth error:", authError);
        toast.error("Unable to verify your login.");
        setLoading(false);
        return;
      }

      if (!user) {
        toast.error("Please log in before messaging the property owner.");
        router.push("/login");
        return;
      }

      if (!ownerId) {
        toast.error("This property does not have a valid owner.");
        setLoading(false);
        return;
      }

      if (user.id === ownerId) {
        toast.error("You cannot message yourself about your own property.");
        setLoading(false);
        return;
      }

      if (!message.trim()) {
        toast.error("Please enter a message.");
        setLoading(false);
        return;
      }

      /*
       * Find an existing conversation first.
       * This prevents creating a new conversation every time
       * the buyer clicks Message Owner.
       */
      const { data: existingConversation, error: existingError } =
  await supabase
    .from("conversations")
    .select("id")
    .eq("property_id", propertyId)
    .eq("buyer_id", user.id)
    .eq("owner_id", ownerId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
      if (existingError) {
        console.error(
          "HomeLinker existing conversation error:",
          existingError
        );

        toast.error(
          existingError.message || "Unable to check your conversation."
        );

        setLoading(false);
        return;
      }

      let conversationId: string;

      if (existingConversation?.id) {
        conversationId = existingConversation.id;
      } else {
        /*
         * Create the conversation.
         */
        const { data: newConversation, error: conversationError } =
          await supabase
            .from("conversations")
            .insert({
              property_id: propertyId,
              property_title: title,
              owner_id: ownerId,
              buyer_id: user.id,
            })
            .select("id")
            .single();

        if (conversationError || !newConversation) {
          console.error(
            "HomeLinker conversation creation error:",
            conversationError
          );

          toast.error(
            conversationError?.message ||
              "Unable to create the conversation."
          );

          setLoading(false);
          return;
        }

        conversationId = newConversation.id;
      }

      /*
       * Send the actual message.
       */
      const { data: newMessage, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          body: message.trim(),
        })
        .select("id")
        .single();

      if (messageError || !newMessage) {
        console.error(
          "HomeLinker initial message error:",
          messageError
        );

        toast.error(
          messageError?.message || "Unable to send your message."
        );

        setLoading(false);
        return;
      }

      /*
       * Update conversation preview.
       */
      const { error: updateError } = await supabase
        .from("conversations")
        .update({
          last_message: message.trim(),
          last_message_at: new Date().toISOString(),
        })
        .eq("id", conversationId);

      if (updateError) {
        console.error(
          "HomeLinker conversation update error:",
          updateError
        );
      }

      /*
       * Create the owner's notification.
       *
       * IMPORTANT:
       * "type" is required by the notifications table.
       *
       * We intentionally do NOT send listing_id because your
       * notifications.listing_id is UUID while properties.id
       * is BIGINT.
       */
      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: ownerId,
          title: "New property message",
          message: `${contactName || "Someone"} sent you a message about "${title}".`,
          type: "message",
          is_read: false,
          conversation_id: conversationId,
        });

      if (notificationError) {
        console.error(
          "HomeLinker notification creation error:",
          notificationError
        );

        /*
         * Do not block the conversation if notification creation
         * fails. The message has already been sent successfully.
         */
        toast.warning(
          "Message sent, but the owner notification could not be created."
        );
      }

      /*
       * Open the conversation immediately.
       */
      router.push(`/messages/${conversationId}`);
    } catch (error) {
      console.error("HomeLinker contact owner error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong while contacting the owner."
      );

      setLoading(false);
    }
  }

  return (
    <section className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div>
        <h2 className="text-2xl font-bold text-black">
          Contact the owner
        </h2>

        <p className="mt-3 text-sm text-slate-500">
          {contactName || "Advertiser"}
        </p>

        {createdAt ? (
          <p className="mt-1 text-sm text-slate-500">
            Posted{" "}
            {new Date(createdAt).toLocaleDateString("en-ZA")}
          </p>
        ) : null}
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setShowMessageBox((value) => !value)}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:bg-[#b89520] disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MessageCircle size={18} />
          {loading ? "Opening..." : "Message Owner"}
        </button>

        {hasPhone && (
          <a
            href={`tel:${contactNumber}`}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-black transition hover:border-[#C9A227] hover:bg-[#FFFDF8]"
          >
            <Phone size={18} />
            Call Owner
          </a>
        )}

        {whatsappUrl && (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white transition hover:brightness-95"
          >
            <MessageCircle size={18} />
            WhatsApp
          </a>
        )}
      </div>

      {showMessageBox && (
        <div className="mt-6 rounded-2xl border border-[#E8D8A5] bg-[#FFFDF8] p-5">
          <label
            htmlFor="owner-message"
            className="block text-sm font-semibold text-black"
          >
            Your message
          </label>

          <textarea
            id="owner-message"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            rows={5}
            className="mt-3 w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-3 text-black outline-none placeholder:text-slate-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20"
            placeholder="Write your message..."
          />

          <div className="mt-3 flex justify-end">
            <button
              type="button"
              onClick={startConversation}
              disabled={loading || !message.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-black transition hover:bg-[#b89520] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send size={17} />
              {loading ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      )}

      {!hasPhone ? (
        <div className="mt-5 rounded-xl bg-[#FFF9E8] px-4 py-3 text-sm text-[#A16207]">
          Phone and WhatsApp contact details are not available for this
          listing.
        </div>
      ) : (
        <p className="mt-5 text-sm text-slate-500">
          You can call or WhatsApp the owner directly, or send a message
          through HomeLinker.
        </p>
      )}
    </section>
  );
}