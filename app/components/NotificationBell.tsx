"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

type Notification = {
  id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  conversation_id: string | null;
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
        "id, title, message, is_read, created_at, conversation_id"
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(
        "HomeLinker notification error:",
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

  async function markAsRead(notificationId: string) {
    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", notificationId);

    if (error) {
      console.error(
        "HomeLinker mark notification read error:",
        error
      );
      return;
    }

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? { ...notification, is_read: true }
          : notification
      )
    );

    setCount((current) => Math.max(0, current - 1));
  }

  useEffect(() => {
    let channel:
      | ReturnType<typeof supabase.channel>
      | null = null;

    async function setup() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await loadNotifications();

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
        .subscribe();
    }

    setup();

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

      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, []);

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="relative rounded-full p-2 text-white transition hover:bg-[#222]"
        aria-label="Notifications"
      >
        <Bell size={22} />

        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[calc(100vw-2rem)] max-w-96 overflow-hidden rounded-xl border border-gray-700 bg-[#111111] shadow-2xl">
          <div className="flex items-center justify-between border-b border-gray-700 px-5 py-4">
            <h3 className="text-lg font-bold text-white">
              Notifications
            </h3>

            {count > 0 && (
              <span className="rounded-full bg-red-500 px-2 py-1 text-xs font-bold text-white">
                {count} new
              </span>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                🎉 No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => {
                const content = (
                  <div
                    className={`border-b border-gray-800 p-4 transition hover:bg-[#1a1a1a] ${
                      !notification.is_read
                        ? "bg-[#181818]"
                        : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="mt-1">
                        <Bell
                          size={18}
                          className="text-[#C9A227]"
                        />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-white">
                          {notification.title}
                        </p>

                        <p className="mt-1 text-sm text-gray-300">
                          {notification.message}
                        </p>

                        <p className="mt-2 text-xs text-gray-500">
                          {new Date(
                            notification.created_at
                          ).toLocaleString("en-ZA")}
                        </p>
                      </div>

                      {!notification.is_read && (
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#C9A227]" />
                      )}
                    </div>
                  </div>
                );

                if (notification.conversation_id) {
                  return (
                    <Link
                      key={notification.id}
                      href={`/messages/${notification.conversation_id}`}
                      onClick={() => {
                        if (!notification.is_read) {
                          markAsRead(notification.id);
                        }

                        setOpen(false);
                      }}
                    >
                      {content}
                    </Link>
                  );
                }

                return (
                  <button
                    type="button"
                    key={notification.id}
                    className="block w-full text-left"
                    onClick={() => {
                      if (!notification.is_read) {
                        markAsRead(notification.id);
                      }
                    }}
                  >
                    {content}
                  </button>
                );
              })
            )}
          </div>

          <div className="border-t border-gray-700 p-3">
            <Link
              href="/notifications"
              onClick={() => setOpen(false)}
              className="block text-center text-sm font-semibold text-[#C9A227] hover:underline"
            >
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}