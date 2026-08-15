"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, MessageCircle, X } from "lucide-react";
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
  const pathname = usePathname();

  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const channelRef = useRef<ReturnType<typeof supabase.channel> | null>(
    null
  );

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
      console.error(
        "HomeLinker notification loading error:",
        error
      );
      return;
    }

    const notificationList = data ?? [];

    setNotifications(notificationList);
    setCount(
      notificationList.filter(
        (notification) => !notification.is_read
      ).length
    );
  }

  /*
   * Close the notification dropdown whenever the user
   * navigates to another page.
   */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  /*
   * Load notifications and setup realtime updates.
   *
   * IMPORTANT:
   * We create a unique channel name and register the
   * postgres_changes listener BEFORE subscribe().
   * This prevents the "cannot add postgres_changes callbacks
   * after subscribe()" runtime error.
   */
  useEffect(() => {
    let cancelled = false;

    async function setupNotifications() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || cancelled) return;

      await loadNotifications();

      if (cancelled) return;

      /*
       * Remove any previous channel first.
       */
      if (channelRef.current) {
        await supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }

      /*
       * Unique channel name prevents an old subscribed
       * channel from being reused during development/HMR.
       */
      const channelName = `notifications-${user.id}-${Date.now()}`;

      const channel = supabase.channel(channelName);

      channelRef.current = channel;

      channel
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          (payload) => {
            if (cancelled) return;

            const notification =
              payload.new as Notification;

            setNotifications((current) => {
              /*
               * Prevent duplicate notifications.
               */
              if (
                current.some(
                  (item) => item.id === notification.id
                )
              ) {
                return current;
              }

              return [
                notification,
                ...current,
              ].slice(0, 30);
            });

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

    void setupNotifications();

    return () => {
      cancelled = true;

      const channel = channelRef.current;

      channelRef.current = null;

      if (channel) {
        void supabase.removeChannel(channel);
      }
    };
  }, []);

  /*
   * Close notification dropdown when clicking anywhere
   * outside of it.
   */
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (!open) return;

      const target = event.target as Node;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
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
  }, [open]);

  /*
   * Close when pressing Escape.
   */
  useEffect(() => {
    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
      }
    }

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "keydown",
        handleEscape
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

    setCount((current) =>
      Math.max(0, current - 1)
    );
  }

  async function markAllAsRead() {
    const unreadIds = notifications
      .filter(
        (notification) => !notification.is_read
      )
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
      return (
        notification.message ||
        "You have a new property enquiry."
      );
    }

    return (
      notification.message ||
      "You have a new notification."
    );
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      {/* BELL */}
      <button
        type="button"
        onClick={() =>
          setOpen((value) => !value)
        }
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
        <>
          {/* MOBILE BACKDROP */}
          <div
            className="fixed inset-0 z-40 bg-black/20 sm:hidden"
            aria-hidden="true"
          />

          {/* NOTIFICATION PANEL */}
          <div
            className="
              fixed
              left-1/2
              top-[72px]
              z-50
              w-[calc(100vw-24px)]
              max-w-[390px]
              -translate-x-1/2
              overflow-hidden
              rounded-2xl
              border
              border-slate-700
              bg-[#111111]
              shadow-2xl

              sm:absolute
              sm:left-auto
              sm:right-0
              sm:top-auto
              sm:mt-3
              sm:w-[360px]
              sm:max-w-[360px]
              sm:translate-x-0
            "
          >
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-slate-700 px-4 py-4 sm:px-5">
              <div>
                <h3 className="text-base font-bold text-white sm:text-lg">
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
                className="rounded-lg p-2 text-slate-400 transition hover:bg-white/10 hover:text-white"
                aria-label="Close notifications"
              >
                <X size={18} />
              </button>
            </div>

            {/* NOTIFICATIONS */}
            <div className="max-h-[65vh] overflow-y-auto sm:max-h-[390px]">
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
                notifications.map(
                  (notification) => {
                    const isMessage =
                      notification.type ===
                      "message";

                    const content = (
                      <div
                        className={`border-b border-slate-800 px-4 py-4 transition hover:bg-[#1b1b1b] sm:px-5 ${
                          !notification.is_read
                            ? "bg-[#181818]"
                            : ""
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          {/* ICON */}
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#C9A227]/15 text-[#C9A227] sm:h-10 sm:w-10">
                            {isMessage ? (
                              <MessageCircle
                                size={18}
                              />
                            ) : (
                              <Bell size={18} />
                            )}
                          </div>

                          {/* CONTENT */}
                          <div className="min-w-0 flex-1">
                            <div className="flex items-start gap-2">
                              <div className="min-w-0 flex-1">
                                <p className="break-words text-sm font-semibold leading-5 text-white sm:text-base">
                                  {getNotificationLabel(
                                    notification
                                  )}
                                </p>

                                <p className="mt-1 break-words text-xs leading-5 text-slate-400 sm:text-sm sm:leading-6">
                                  {getNotificationDescription(
                                    notification
                                  )}
                                </p>
                              </div>

                              {!notification.is_read && (
                                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#C9A227]" />
                              )}
                            </div>

                            <p className="mt-2 text-[11px] text-slate-500 sm:text-xs">
                              {new Date(
                                notification.created_at
                              ).toLocaleString(
                                "en-ZA",
                                {
                                  dateStyle:
                                    "short",
                                  timeStyle:
                                    "short",
                                }
                              )}
                            </p>

                            {/* VIEW MESSAGE */}
                            {isMessage &&
                              notification.conversation_id && (
                                <Link
                                  href={`/messages/${notification.conversation_id}`}
                                  onClick={() => {
                                    void markAsRead(
                                      notification.id
                                    );
                                    setOpen(false);
                                  }}
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
                      <div
                        key={notification.id}
                      >
                        {content}
                      </div>
                    );
                  }
                )
              )}
            </div>

            {/* FOOTER */}
            <div className="flex items-center justify-between gap-3 border-t border-slate-700 p-3">
              <Link
                href="/notifications"
                onClick={() =>
                  setOpen(false)
                }
                className="text-xs font-semibold text-[#C9A227] hover:underline sm:text-sm"
              >
                View all
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
        </>
      )}
    </div>
  );
}