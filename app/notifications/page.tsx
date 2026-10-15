"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  Bell,
  CheckCheck,
  ChevronRight,
  Home,
  ShieldCheck,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  action_url?: string | null;
  action_label?: string | null;
  type?: string | null;
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [markingAll, setMarkingAll] = useState(false);

  const loadNotifications = useCallback(async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select(
        "id, title, message, is_read, created_at, action_url, action_label, type"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setNotifications(data);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  async function markAsRead(id: string) {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, is_read: true }
          : notification
      )
    );

    await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id)
      .eq("user_id", user.id);
  }

  async function markAllAsRead() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    setMarkingAll(true);

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("user_id", user.id)
      .eq("is_read", false);

    if (!error) {
      setNotifications((current) =>
        current.map((notification) => ({
          ...notification,
          is_read: true,
        }))
      );
    }

    setMarkingAll(false);
  }

  function getNotificationIcon(type?: string | null) {
    if (type === "verification") {
      return <ShieldCheck size={22} />;
    }

    if (type === "property") {
      return <Home size={22} />;
    }

    return <Bell size={22} />;
  }

  function formatDate(date: string) {
    const notificationDate = new Date(date);
    const now = new Date();

    const difference = now.getTime() - notificationDate.getTime();
    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(difference / 3600000);
    const days = Math.floor(difference / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;

    return notificationDate.toLocaleDateString("en-ZA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }

  const unreadCount = notifications.filter(
    (notification) => !notification.is_read
  ).length;

  return (
    <main className="min-h-screen bg-[#111111] text-white">
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <div className="relative flex h-12 w-12 items-center justify-center rounded-2xl bg-[#C9A227]/10 text-[#C9A227]">
                <Bell size={26} />

                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex min-h-5 min-w-5 items-center justify-center rounded-full bg-[#C9A227] px-1 text-[11px] font-bold text-black">
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </span>
                )}
              </div>

              <div>
                <h1 className="text-3xl font-bold sm:text-4xl">
                  Notifications
                </h1>

                <p className="mt-1 text-sm text-gray-400">
                  {unreadCount > 0
                    ? `${unreadCount} unread ${
                        unreadCount === 1 ? "notification" : "notifications"
                      }`
                    : "You're all caught up"}
                </p>
              </div>
            </div>
          </div>

          {unreadCount > 0 && (
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={markingAll}
              className="flex items-center justify-center gap-2 rounded-xl border border-[#C9A227]/40 px-5 py-3 text-sm font-semibold text-[#E2C14F] transition hover:border-[#C9A227] hover:bg-[#C9A227]/10 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <CheckCheck size={18} />

              {markingAll ? "Updating..." : "Mark all as read"}
            </button>
          )}
        </div>

        {loading ? (
          <div className="py-20 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-gray-700 border-t-[#C9A227]" />

            <p className="mt-4 text-sm text-gray-400">
              Loading notifications...
            </p>
          </div>
        ) : notifications.length === 0 ? (
          <div className="rounded-3xl border border-white/10 bg-[#181818] px-6 py-16 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#C9A227]/10 text-[#C9A227]">
              <Bell size={32} />
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              No notifications yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-gray-400">
              Important account updates, property activity and HomeLinker
              notices will appear here.
            </p>

            <Link
              href="/properties"
              className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#C9A227] px-7 py-3 font-bold text-black transition hover:bg-[#D8B43C]"
            >
              Browse Properties
              <ChevronRight size={18} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((notification) => {
              const content = (
                <div
                  className={`group relative rounded-2xl border p-5 transition sm:p-6 ${
                    notification.is_read
                      ? "border-white/10 bg-[#181818] hover:border-white/20"
                      : "border-[#C9A227]/50 bg-[#1D1B14] hover:border-[#C9A227]"
                  }`}
                >
                  {!notification.is_read && (
                    <span className="absolute right-5 top-5 h-2.5 w-2.5 rounded-full bg-[#C9A227]" />
                  )}

                  <div className="flex gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                        notification.type === "verification"
                          ? "bg-[#C9A227]/15 text-[#E2C14F]"
                          : "bg-white/5 text-gray-300"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>

                    <div className="min-w-0 flex-1 pr-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3
                          className={`text-base sm:text-lg ${
                            notification.is_read
                              ? "font-semibold text-gray-200"
                              : "font-bold text-white"
                          }`}
                        >
                          {notification.title}
                        </h3>

                        {notification.type === "verification" && (
                          <span className="rounded-full border border-[#C9A227]/30 bg-[#C9A227]/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-[#E2C14F]">
                            Account security
                          </span>
                        )}
                      </div>

                      <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400 sm:text-[15px]">
                        {notification.message}
                      </p>

                      <div className="mt-4 flex flex-wrap items-center gap-4">
                        <span className="text-xs text-gray-500">
                          {formatDate(notification.created_at)}
                        </span>

                        {notification.action_url && (
                          <span className="inline-flex items-center gap-1 text-sm font-bold text-[#E2C14F]">
                            {notification.action_label || "View"}
                            <ChevronRight
                              size={16}
                              className="transition group-hover:translate-x-1"
                            />
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );

              if (notification.action_url) {
                return (
                  <Link
                    key={notification.id}
                    href={notification.action_url}
                    onClick={() => void markAsRead(notification.id)}
                    className="block"
                  >
                    {content}
                  </Link>
                );
              }

              return (
                <button
                  type="button"
                  key={notification.id}
                  onClick={() => void markAsRead(notification.id)}
                  className="block w-full text-left"
                >
                  {content}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}