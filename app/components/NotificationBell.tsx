"use client";

import { useEffect, useRef, useState } from "react";
import { Bell, MessageCircle, X } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
  conversation_id?: string | null;
  listing_id?: string | null;
};

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setNotifications([]);
      setCount(0);
      return;
    }

    const { data, error } = await supabase
      .from("notifications")
      .select(
        "id, title, message, type, is_read, created_at, conversation_id, listing_id"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      console.error("HomeLinker notification loading error:", error);
      return;
    }

    const notificationList = data ?? [];

    setNotifications(notificationList);
    setCount(notificationList.filter((n) => !n.is_read).length);
  }

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;
    let cancelled = false;

    async function setup() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) return;

      await loadNotifications();

      if (cancelled) return;

      /*
       * IMPORTANT:
       * The postgres_changes callback MUST be registered
       * before subscribe().
       */
      channel = supabase
        .channel(`notifications-${user.id}`)
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            const notification =
              payload.new as Notification;

            setNotifications((current) => [
              notification,
              ...current,
            ]);

            setCount((current) => current + 1);
          }
        )
        .subscribe((status) => {
          console.log(
            "HomeLinker notifications realtime:",
            status
          );
        });
    }

    setup();

    return () => {
      cancelled = true;

      if (channel) {
        supabase.removeChannel(channel);
        channel = null;
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(
          event.target as Node
        )
      ) {
        setOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  async function markAsRead(id: string) {
    const notification = notifications.find(
      (item) => item.id === id
    );

    if (!notification || notification.is_read) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) {
      console.error(
        "HomeLinker mark notification read error:",
        error
      );
      return;
    }

    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, is_read: true }
          : item
      )
    );

    setCount((current) => Math.max(0, current - 1));
  }

  async function markAllAsRead() {
    const unreadIds = notifications
      .filter((notification) => !notification.is_read)
      .map((notification) => notification.id);

    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (error) {
      console.error(
        "HomeLinker mark all notifications read error:",
        error
      );
      return;
    }

    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        is_read: true,
      }))
    );

    setCount(0);
  }

  function getNotificationLabel(
    notification: Notification
  ) {
    if (notification.type === "message") {
      return "New message";
    }

    return notification.title || "Notification";
  }

  function getNotificationDescription(
    notification: Notification
  ) {
    if (notification.type === "message") {
      return "You have a new property enquiry.";
    }

    return "You have a new notification.";
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label="Notifications"
        aria-expanded={open}
        className="relative rounded-full p-2 text-white transition hover:bg-[#222]"
      >
        <Bell size={22} />

        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[360px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-2xl border border-slate-700 bg-[#111111] shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
            <div>
              <h3 className="text-lg font-bold text-white">
                Notifications
              </h3>

              {count > 0 && (
                <p className="mt-1 text-xs text-slate-400">
                  {count} unread
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
              aria-label="Close notifications"
            >
              <X size={18} />
            </button>
          </div>

          {/* Notifications */}
          <div className="max-h-[390px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Bell
                  size={30}
                  className="mx-auto text-slate-500"
                />

                <p className="mt-3 font-semibold text-white">
                  No notifications
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  You&apos;re all caught up.
                </p>
              </div>
            ) : (
              notifications.map((notification) => {
                const isMessage =
                  notification.type === "message";

                const content = (
                  <div
                    className={`border-b border-slate-800 px-5 py-4 transition hover:bg-[#1b1b1b] ${
                      !notification.is_read
                        ? "bg-[#181818]"
                        : ""
                    }`}
                  >
                    <div className="flex gap-3">
                      {/* Icon */}
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-[#C9A227]">
                        {isMessage ? (
                          <MessageCircle size={19} />
                        ) : (
                          <Bell size={19} />
                        )}
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-white">
                              {getNotificationLabel(
                                notification
                              )}
                            </p>

                            <p className="mt-1 text-sm text-slate-400">
                              {getNotificationDescription(
                                notification
                              )}
                            </p>
                          </div>

                          {!notification.is_read && (
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C9A227]" />
                          )}
                        </div>

                        <p className="mt-2 text-xs text-slate-500">
                          {new Date(
                            notification.created_at
                          ).toLocaleString("en-ZA", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </p>

                        {/* View message */}
                        {isMessage &&
                          notification.conversation_id && (
                            <Link
                              href={`/messages/${notification.conversation_id}`}
                              onClick={() =>
                                markAsRead(notification.id)
                              }
                              className="mt-3 inline-flex items-center rounded-lg bg-[#C9A227] px-3 py-2 text-xs font-bold text-black transition hover:bg-[#b89520]"
                            >
                              View message
                            </Link>
                          )}
                      </div>
                    </div>
                  </div>
                );

                return (
                  <div key={notification.id}>
                    {content}
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between gap-3 border-t border-slate-700 p-3">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="text-sm font-semibold text-[#C9A227] hover:underline"
            >
              View all notifications
            </Link>

            {count > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="text-xs font-semibold text-slate-400 hover:text-white"
              >
                Mark all read
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}