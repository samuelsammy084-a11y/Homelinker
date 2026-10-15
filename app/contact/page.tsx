"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import {
  CheckCircle2,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  XCircle,
} from "lucide-react";

const CONTACT_EMAIL = "noreplyhomelinker@gmail.com";
const PHONE_DISPLAY = "061 444 5545";
const PHONE_INTERNATIONAL = "+27614445545";
const WHATSAPP_URL = "https://wa.me/27614445545";

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

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (sending) return;

    setNotice(null);

    const cleanName = name.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();
    const cleanMessage = message.trim();

    // -------------------------------------------------------
    // CLIENT-SIDE VALIDATION
    // -------------------------------------------------------
    //
    // The API performs these checks again on the server.
    // Client-side validation is only for a better user
    // experience and must never be trusted for security.

    if (
      cleanName.length < 2 ||
      cleanName.length > 100
    ) {
      setNotice({
        type: "error",
        message: "Please enter a valid name.",
      });

      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      // -----------------------------------------------------
      // SECURE SERVER-SIDE SUBMISSION
      // -----------------------------------------------------
      //
      // The browser no longer writes directly to Supabase.
      //
      // Instead:
      //
      // Browser -> /api/contact -> Supabase
      //
      // The API performs its own validation, anti-spam
      // checks and trusted database insertion.

      const response = await fetch("/api/contact", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name: cleanName,
          email: cleanEmail,
          phone: cleanPhone,
          message: cleanMessage,

          // Honeypot field.
          //
          // Real users never fill this. The API can use it
          // to detect basic automated spam submissions.
          website: "",
        }),
      });

      const result = await response
        .json()
        .catch(() => null);

      if (!response.ok) {
        console.error(
          "Contact form API error:",
          result
        );

        setNotice({
          type: "error",

          message:
            result?.error ||
            "Your message could not be sent right now. Please try again or contact HomeLinker by email or WhatsApp.",
        });

        return;
      }

      // -----------------------------------------------------
      // SUCCESS
      // -----------------------------------------------------

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
            Have a question about HomeLinker, your
            account, a listing, a payment or something
            you&apos;ve seen on the platform? Get in touch
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
              Choose the contact method that works best
              for you.
            </p>

            <div className="mt-8 space-y-5">
              {/* EMAIL */}

              <a
                href={`mailto:${CONTACT_EMAIL}`}
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
                    {CONTACT_EMAIL}
                  </p>
                </div>
              </a>

              {/* PHONE */}

              <a
                href={`tel:${PHONE_INTERNATIONAL}`}
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
                    {PHONE_DISPLAY}
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
                    Property marketplace for South Africa
                  </p>
                </div>
              </div>
            </div>

            {/* WHATSAPP */}

            <div className="mt-8 rounded-2xl border border-green-100 bg-[#F7FFF8] p-5">
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
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3.5 font-bold text-white transition hover:bg-green-700"
              >
                <MessageCircle size={18} />
                Chat on WhatsApp
              </a>
            </div>

            {/* PROPERTY QUESTIONS */}

            <div className="mt-8 rounded-2xl border border-[#C9A227]/30 bg-[#FFF9E8] p-5">
              <h3 className="font-black text-slate-900">
                Asking about a property?
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                HomeLinker is a property marketplace. If
                your question is about the price,
                availability, viewing or condition of a
                specific property, please contact the
                advertiser shown on that property listing.
              </p>

              <Link
                href="/properties"
                className="mt-4 inline-flex font-bold text-[#8A6800] hover:text-[#C9A227]"
              >
                Browse Properties →
              </Link>
            </div>

            {/* SAFETY */}

            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-slate-200 p-5">
              <ShieldCheck
                size={22}
                className="mt-0.5 shrink-0 text-[#A67C00]"
              />

              <div>
                <p className="font-bold text-slate-900">
                  Security reminder
                </p>

                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Never send your password, complete bank
                  card information or other highly sensitive
                  authentication information through the
                  contact form, email or WhatsApp.
                </p>
              </div>
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
              Fill in the form below and your message will
              be submitted to HomeLinker.
            </p>

            {/* NOTICE */}

            {notice && (
              <div
                role="alert"
                aria-live="polite"
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
                  name="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  placeholder="Your full name"
                  autoComplete="name"
                  minLength={2}
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
                  name="email"
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
                  name="phone"
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
                  name="message"
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

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Please include enough information for us
                  to understand the problem, but do not
                  include passwords or complete payment card
                  information.
                </p>
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

              {/* PRIVACY NOTICE */}

              <p className="text-center text-xs leading-5 text-slate-500">
                By submitting this form, the information you
                provide will be used to review and respond to
                your enquiry. Learn more in our{" "}
                <Link
                  href="/privacy"
                  className="font-semibold text-[#8A6800] underline underline-offset-2"
                >
                  Privacy Policy
                </Link>
                .
              </p>
            </form>
          </section>
        </div>

        {/* EXTRA HELP */}

        <section className="mt-10 rounded-3xl border border-[#EEE5CF] bg-white p-6 shadow-lg sm:p-8">
          <div className="grid gap-6 md:grid-cols-3">
            <div>
              <h2 className="font-black text-slate-900">
                Common Questions
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Find answers about listings, accounts,
                property searches and using HomeLinker.
              </p>

              <Link
                href="/faq"
                className="mt-3 inline-flex text-sm font-bold text-[#8A6800] hover:text-[#C9A227]"
              >
                Read the FAQ →
              </Link>
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Privacy Questions
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Learn how HomeLinker handles personal
                information and privacy requests.
              </p>

              <Link
                href="/privacy"
                className="mt-3 inline-flex text-sm font-bold text-[#8A6800] hover:text-[#C9A227]"
              >
                Privacy Policy →
              </Link>
            </div>

            <div>
              <h2 className="font-black text-slate-900">
                Property Guides
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Read practical information about renting,
                viewings and safer property searching.
              </p>

              <Link
                href="/blog"
                className="mt-3 inline-flex text-sm font-bold text-[#8A6800] hover:text-[#C9A227]"
              >
                Read Property Guides →
              </Link>
            </div>
          </div>
        </section>

        {/* POLICY LINKS */}

        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm font-semibold">
          <Link
            href="/about"
            className="text-[#8A6800] hover:text-[#C9A227]"
          >
            About HomeLinker
          </Link>

          <Link
            href="/privacy"
            className="text-[#8A6800] hover:text-[#C9A227]"
          >
            Privacy Policy
          </Link>

          <Link
            href="/terms"
            className="text-[#8A6800] hover:text-[#C9A227]"
          >
            Terms & Conditions
          </Link>

          <Link
            href="/cookie-policy"
            className="text-[#8A6800] hover:text-[#C9A227]"
          >
            Cookie Policy
          </Link>
        </div>
      </div>
    </main>
  );
}