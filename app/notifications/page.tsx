"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setNotifications(data);
    }

    setLoading(false);
  }

  async function markAllAsRead() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id);

    loadNotifications();
  }

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-4xl px-6 py-10">

        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="text-[#C9A227]" size={34} />
            <h1 className="text-4xl font-bold">
              Notifications
            </h1>
          </div>

          <button
            onClick={markAllAsRead}
            className="rounded-lg bg-[#C9A227] px-5 py-2 font-semibold hover:bg-[#A67C00]"
          >
            Mark all as read
          </button>
        </div>

        {loading ? (
          <div className="text-center py-20">
            Loading...
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-2xl border border-gray-700 bg-[#1a1a1a] p-16 text-center">
            <Bell
              size={60}
              className="mx-auto mb-5 text-[#C9A227]"
            />

            <h2 className="text-2xl font-bold">
              No notifications yet
            </h2>

            <p className="mt-3 text-gray-400">
              We'll let you know when something happens.
            </p>

            <Link
              href="/properties"
              className="mt-8 inline-block rounded-xl bg-[#C9A227] px-8 py-3 font-bold text-white hover:bg-[#A67C00]"
            >
              Browse Properties
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`rounded-xl border p-5 transition ${
                  notification.is_read
                    ? "border-gray-700 bg-[#1a1a1a]"
                    : "border-[#C9A227] bg-[#202020]"
                }`}
              >
                <h3 className="text-lg font-bold">
                  {notification.title}
                </h3>

                <p className="mt-2 text-gray-300">
                  {notification.message}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {new Date(
                    notification.created_at
                  ).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}