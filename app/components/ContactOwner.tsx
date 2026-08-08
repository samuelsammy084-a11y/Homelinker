"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Props = {
  propertyId: number;
  title: string;
  contactNumber?: string | null;
  contactName?: string | null;
  ownerId?: string | null;
  createdAt?: string | null;
};

function normalizeSA(number?: string | null): string | null {
  if (!number) return null;

  const cleaned = number.replace(/\D/g, "");

  // South African international format: 27614445545
  if (cleaned.startsWith("27")) {
    const localPart = cleaned.slice(2);

    if (localPart.length === 9) {
      return `+27${localPart}`;
    }

    return null;
  }

  // South African local format: 0614445545
  if (cleaned.startsWith("0")) {
    const localPart = cleaned.slice(1);

    if (localPart.length === 9) {
      return `+27${localPart}`;
    }

    return null;
  }

  // Nine-digit number without leading 0
  if (cleaned.length === 9) {
    return `+27${cleaned}`;
  }

  return null;
}

function isValidUUID(value?: string | null): boolean {
  if (!value) return false;

  return /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value.trim()
  );
}

export default function ContactOwner({
  propertyId,
  title,
  contactNumber,
  contactName,
  ownerId,
  createdAt,
}: Props) {
  const [sending, setSending] = useState(false);

  const phoneE164 = normalizeSA(contactNumber);

  const waNumber = phoneE164
    ? phoneE164.replace(/^\+/, "")
    : null;

  const whatsappMessage = `Hi, I found your property "${title}" on HomeLinker and I'm interested. Is it still available?`;

  async function handleMessageOwner() {
    if (sending) return;

    setSending(true);

    try {
      if (!propertyId || propertyId <= 0) {
        toast.error("Invalid property information.");
        setSending(false);
        return;
      }

      const validOwnerId =
        typeof ownerId === "string" && isValidUUID(ownerId)
          ? ownerId.trim()
          : null;

      if (!validOwnerId) {
        console.error("HomeLinker: Invalid owner ID", {
          propertyId,
          title,
          ownerId,
        });

        toast.error(
          "The owner information for this property is unavailable."
        );

        setSending(false);
        return;
      }

      const { data: authData, error: authError } =
        await supabase.auth.getUser();

      if (authError) {
        console.error("HomeLinker auth error:", authError);
        toast.error(
          "Unable to verify your account. Please try again."
        );
        setSending(false);
        return;
      }

      const user = authData.user;

      if (!user) {
        toast("Please log in to message the property owner.", {
          action: {
            label: "Log in",
            onClick: () => {
              window.location.href = "/login";
            },
          },
        });

        setSending(false);
        return;
      }

      if (user.id === validOwnerId) {
        toast("This is your listing.");
        setSending(false);
        return;
      }

      const initialBody = `Hi, I found your property "${title}" on HomeLinker and I'm interested. Is it still available?`;

      const { data: conversation, error: conversationError } =
        await supabase
          .from("conversations")
          .insert({
            property_id: propertyId,
            property_title: title,
            owner_id: validOwnerId,
            buyer_id: user.id,
            last_message: initialBody,
            last_message_at: new Date().toISOString(),
          })
          .select("id")
          .single();

      if (conversationError || !conversation?.id) {
        console.error(
          "HomeLinker conversation error:",
          conversationError
        );

        toast.error(
          conversationError?.message ||
            "Could not start the conversation."
        );

        setSending(false);
        return;
      }

      const conversationId = conversation.id;

      const { error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: user.id,
          body: initialBody,
        });

      if (messageError) {
        console.error(
          "HomeLinker message error:",
          messageError
        );

        await supabase
          .from("conversations")
          .delete()
          .eq("id", conversationId);

        toast.error(
          messageError.message ||
            "Could not send your message."
        );

        setSending(false);
        return;
      }

      const { error: notificationError } = await supabase
        .from("notifications")
        .insert({
          user_id: validOwnerId,
          title: "New message",
          body: initialBody,
        });

      if (notificationError) {
        console.warn(
          "HomeLinker notification warning:",
          notificationError
        );
      }

      window.location.href = `/messages/${conversationId}`;
    } catch (error) {
      console.error("HomeLinker messaging error:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );

      setSending(false);
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6">
      <div>
        <h2 className="text-2xl font-bold text-black">
          Contact the owner
        </h2>

        <p className="mt-2 text-lg font-semibold text-slate-900">
          {contactName || "Advertiser"}
        </p>

        {createdAt ? (
          <p className="mt-1 text-sm text-slate-500">
            Posted{" "}
            {new Date(createdAt).toLocaleDateString("en-ZA")}
          </p>
        ) : null}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        {phoneE164 ? (
          <a
            href={`tel:${phoneE164}`}
            className="inline-flex items-center justify-center rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-[#b8911f]"
          >
            📞 Call Owner
          </a>
        ) : null}

        {waNumber ? (
          <a
            href={`https://wa.me/${waNumber}?text=${encodeURIComponent(
              whatsappMessage
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-xl bg-green-600 px-6 py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-green-700"
          >
            💬 WhatsApp Owner
          </a>
        ) : null}

        <button
          type="button"
          onClick={handleMessageOwner}
          disabled={sending}
          className="inline-flex items-center justify-center rounded-xl bg-[#0EA5A4] px-6 py-3 font-semibold text-white transition hover:scale-[1.02] hover:bg-[#0c9291] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {sending ? "Opening..." : "💬 Message Owner"}
        </button>
      </div>

      {!phoneE164 ? (
        <p className="mt-4 rounded-xl bg-yellow-50 px-4 py-3 text-sm font-medium text-yellow-800">
          Phone and WhatsApp contact details are not available for
          this listing.
        </p>
      ) : null}
    </div>
  );
}