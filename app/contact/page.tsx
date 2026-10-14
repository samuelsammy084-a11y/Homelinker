"use client";

import { FormEvent, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  XCircle,
} from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [sending, setSending] = useState(false);

  const [notice, setNotice] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (sending) return;

    setNotice(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    // -----------------------------
    // VALIDATION
    // -----------------------------

    if (cleanName.length < 2 || cleanName.length > 100) {
      setNotice({
        type: "error",
        message: "Please enter a valid name.",
      });
      return;
    }

    const emailRegex =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (
      !emailRegex.test(cleanEmail) ||
      cleanEmail.length > 254
    ) {
      setNotice({
        type: "error",
        message: "Please enter a valid email address.",
      });
      return;
    }

    if (cleanPhone.length > 30) {
      setNotice({
        type: "error",
        message: "Please enter a valid phone number.",
      });
      return;
    }

    if (
      cleanMessage.length < 10 ||
      cleanMessage.length > 5000
    ) {
      setNotice({
        type: "error",
        message:
          "Your message must be between 10 and 5,000 characters.",
      });
      return;
    }

    setSending(true);

    try {
      const { error } = await supabase
        .from("contact_messages")
        .insert([
          {
            name: cleanName,
            email: cleanEmail,
            phone: cleanPhone || null,
            message: cleanMessage,

            // Must match our RLS policy.
            status: "new",
          },
        ]);

      if (error) {
        console.error("Contact form error:", error);

        setNotice({
          type: "error",
          message:
            "Your message could not be sent right now. Please try again or contact us by email or WhatsApp.",
        });

        return;
      }

      setName("");
      setEmail("");
      setPhone("");
      setMessage("");

      setNotice({
        type: "success",
        message:
          "Thanks! Your message has been sent to HomeLinker successfully.",
      });
    } catch (error) {
      console.error(
        "Unexpected contact form error:",
        error
      );

      setNotice({
        type: "error",
        message:
          "Something went wrong while sending your message. Please try again.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F8F6F1] py-12 sm:py-16">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* HEADER */}
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <p className="text-sm font-black uppercase tracking-[0.2em] text-[#C9A227]">
            HomeLinker Support
          </p>

          <h1 className="mt-3 text-4xl font-black tracking-tight text-slate-900 sm:text-5xl">
            Contact HomeLinker
          </h1>

          <p className="mt-4 text-base leading-7 text-slate-600 sm:text-lg">
            Have a question about a property, your account,
            listings, payments or HomeLinker? Get in touch
            with us.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
          {/* CONTACT INFORMATION */}
          <section className="rounded-3xl border border-[#EEE5CF] bg-white p-6 shadow-xl sm:p-8">
            <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
              Contact Information
            </h2>

            <p className="mt-3 leading-7 text-slate-600">
              You can contact HomeLinker directly using any
              of the options below.
            </p>

            <div className="mt-8 space-y-5">
              {/* PHONE */}
              <a
                href="tel:+27614445545"
                className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-[#C9A227]/40 hover:bg-[#FFFDF8]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF7DD] text-[#A67C00]">
                  <Phone size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Phone
                  </p>

                  <p className="mt-1 text-slate-600">
                    061 444 5545
                  </p>
                </div>
              </a>

              {/* EMAIL */}
              <a
                href="mailto:contact@homelinker.co.za"
                className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4 transition hover:border-[#C9A227]/40 hover:bg-[#FFFDF8]"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF7DD] text-[#A67C00]">
                  <Mail size={20} />
                </div>

                <div className="min-w-0">
                  <p className="font-bold text-slate-900">
                    Email
                  </p>

                  <p className="mt-1 break-all text-slate-600">
                    contact@homelinker.co.za
                  </p>
                </div>
              </a>

              {/* SERVICE AREA */}
              <div className="flex items-start gap-4 rounded-2xl border border-slate-100 p-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF7DD] text-[#A67C00]">
                  <MapPin size={20} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    Service Area
                  </p>

                  <p className="mt-1 text-slate-600">
                    All 9 provinces of South Africa
                  </p>
                </div>
              </div>
            </div>

            {/* WHATSAPP */}
            <div className="mt-8 rounded-2xl bg-[#F7FFF8] p-5">
              <div className="flex items-center gap-3">
                <MessageCircle
                  size={24}
                  className="text-green-600"
                />

                <div>
                  <p className="font-black text-slate-900">
                    Prefer WhatsApp?
                  </p>

                  <p className="mt-1 text-sm text-slate-600">
                    Send HomeLinker a direct message.
                  </p>
                </div>
              </div>

              <a
                href="https://wa.me/27614445545"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>
          </section>

          {/* CONTACT FORM */}
          <section className="rounded-3xl border border-[#EEE5CF] bg-white p-6 shadow-xl sm:p-8">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FFF7DD] text-[#A67C00]">
                <Send size={20} />
              </div>

              <h2 className="text-2xl font-black text-slate-900 sm:text-3xl">
                Send Us a Message
              </h2>
            </div>

            <p className="mt-4 leading-7 text-slate-600">
              Fill in the form and your message will be sent
              to the HomeLinker support team.
            </p>

            {/* NOTICE */}
            {notice && (
              <div
                role="alert"
                className={`mt-6 flex items-start gap-3 rounded-2xl border p-4 ${
                  notice.type === "success"
                    ? "border-green-200 bg-green-50 text-green-800"
                    : "border-red-200 bg-red-50 text-red-700"
                }`}
              >
                {notice.type === "success" ? (
                  <CheckCircle2
                    size={21}
                    className="mt-0.5 shrink-0"
                  />
                ) : (
                  <XCircle
                    size={21}
                    className="mt-0.5 shrink-0"
                  />
                )}

                <p className="text-sm font-semibold leading-6">
                  {notice.message}
                </p>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="mt-8 space-y-5"
            >
              {/* NAME */}
              <div>
                <label
                  htmlFor="contact-name"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Full Name
                </label>

                <input
                  id="contact-name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                  maxLength={100}
                  required
                  disabled={sending}
                  className="w-full rounded-xl border border-slate-300 p-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 disabled:bg-slate-100"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="contact-email"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Email Address
                </label>

                <input
                  id="contact-email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  autoComplete="email"
                  maxLength={254}
                  required
                  disabled={sending}
                  className="w-full rounded-xl border border-slate-300 p-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 disabled:bg-slate-100"
                />
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="contact-phone"
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  Phone Number{" "}
                  <span className="font-normal text-slate-400">
                    (optional)
                  </span>
                </label>

                <input
                  id="contact-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  placeholder="082 123 4567"
                  autoComplete="tel"
                  maxLength={30}
                  disabled={sending}
                  className="w-full rounded-xl border border-slate-300 p-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 disabled:bg-slate-100"
                />
              </div>

              {/* MESSAGE */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-4">
                  <label
                    htmlFor="contact-message"
                    className="block text-sm font-bold text-slate-800"
                  >
                    Message
                  </label>

                  <span className="text-xs text-slate-400">
                    {message.length}/5000
                  </span>
                </div>

                <textarea
                  id="contact-message"
                  rows={7}
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  placeholder="How can we help?"
                  minLength={10}
                  maxLength={5000}
                  required
                  disabled={sending}
                  className="w-full resize-y rounded-xl border border-slate-300 p-4 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/20 disabled:bg-slate-100"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#C9A227] py-4 font-bold text-white transition hover:bg-[#A67C00] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Send size={18} />

                {sending
                  ? "Sending Message..."
                  : "Send Message"}
              </button>

              <p className="text-center text-xs leading-5 text-slate-500">
                Please do not send passwords or sensitive
                payment information through this form.
              </p>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}