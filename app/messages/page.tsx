import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Conversation = {
  id: string;
  property_id: number | null;
  property_title: string | null;
  owner_id: string;
  buyer_id: string;
  created_at: string;
  last_message?: string | null;
  last_message_at?: string | null;
};

export default async function MessagesPage() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: conversations, error } = await supabase
    .from("conversations")
    .select(
      "id, property_id, property_title, owner_id, buyer_id, created_at, last_message, last_message_at"
    )
    .or(`buyer_id.eq.${user.id},owner_id.eq.${user.id}`)
    .order("last_message_at", {
      ascending: false,
      nullsFirst: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error("HomeLinker messages inbox error:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
  }

  const conversationList: Conversation[] = conversations ?? [];

  return (
    <main className="min-h-screen bg-[#F8F6F1]">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 rounded-3xl border border-[#E8D8A5] bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-[#C9A227]">
                HomeLinker
              </p>

              <h1 className="mt-1 text-4xl font-bold text-black">
                Messages
              </h1>

              <p className="mt-2 text-slate-600">
                All your property enquiries and conversations in one place.
              </p>
            </div>

            <Link
              href="/properties"
              className="inline-flex items-center justify-center rounded-xl bg-[#C9A227] px-5 py-3 font-semibold text-white transition hover:bg-[#b89520]"
            >
              Browse Properties
            </Link>
          </div>
        </div>

        {/* Conversation list */}
        {conversationList.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#C9A227]/10 text-3xl">
              💬
            </div>

            <h2 className="mt-5 text-2xl font-bold text-black">
              No messages yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-slate-600">
              When you contact a property owner about a listing, your
              conversation will appear here.
            </p>

            <Link
              href="/properties"
              className="mt-6 inline-flex rounded-xl bg-[#C9A227] px-6 py-3 font-semibold text-white transition hover:bg-[#b89520]"
            >
              Find a Property
            </Link>
          </div>
        ) : (
          <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            {/* List header */}
            <div className="border-b border-slate-200 px-6 py-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-bold text-black">
                    Your Conversations
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {conversationList.length} conversation
                    {conversationList.length === 1 ? "" : "s"}
                  </p>
                </div>

                <Link
                  href="/properties"
                  className="hidden rounded-lg border border-[#C9A227] px-4 py-2 text-sm font-semibold text-[#9F7D0A] transition hover:bg-[#FFFDF8] sm:inline-flex"
                >
                  Find a Property
                </Link>
              </div>
            </div>

            {/* Conversations */}
            <div className="divide-y divide-slate-200">
              {conversationList.map((conversation) => {
                const isBuyer =
                  conversation.buyer_id === user.id;

                const title =
                  conversation.property_title ||
                  "Property conversation";

                const preview =
                  conversation.last_message ||
                  "No messages yet.";

                const messageDate =
                  conversation.last_message_at ||
                  conversation.created_at;

                return (
                  <Link
                    key={conversation.id}
                    href={`/messages/${conversation.id}`}
                    className="block px-5 py-5 transition hover:bg-[#FFFDF8] sm:px-6"
                  >
                    <div className="flex items-start gap-4">
                      {/* Avatar */}
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-xl">
                        💬
                      </div>

                      {/* Conversation information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                          <h3 className="truncate text-lg font-bold text-black">
                            {isBuyer
                              ? "Property Owner"
                              : "Buyer Enquiry"}
                          </h3>

                          <span className="shrink-0 text-xs font-medium text-slate-500">
                            {new Date(messageDate).toLocaleString(
                              "en-ZA",
                              {
                                dateStyle: "short",
                                timeStyle: "short",
                              }
                            )}
                          </span>
                        </div>

                        {/* Property */}
                        <p className="mt-1 truncate font-semibold text-[#C9A227]">
                          {title}
                        </p>

                        {/* Message preview */}
                        <p className="mt-1 truncate text-sm text-slate-600">
                          {preview}
                        </p>
                      </div>

                      {/* Arrow */}
                      <span className="mt-2 shrink-0 text-xl text-slate-400">
                        →
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom navigation */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/properties"
            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-5 py-3 font-semibold text-black transition hover:border-[#C9A227] hover:bg-[#FFFDF8]"
          >
            ← Browse Properties
          </Link>

          <Link
            href="/dashboard"
            className="inline-flex flex-1 items-center justify-center rounded-xl bg-black px-5 py-3 font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}