"use client";

import { useEffect, useRef, useState } from "react";
import { Bell } from "lucide-react";
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
        "id, title, message, type, is_read, created_at, conversation_id"
      )
      .eq("user_id", user.id)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error("HomeLinker notification fetch error:", error);
      return;
    }

    setNotifications(data ?? []);
    setCount(
      (data ?? []).filter(
        (notification) => !notification.is_read
      ).length
    );
  }

  useEffect(() => {
    let channel: ReturnType<typeof supabase.channel> | null = null;

    async function setup() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      await loadNotifications();

      /*
       * IMPORTANT:
       * .on() MUST come BEFORE .subscribe()
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

  async function markAsRead(notificationId: string) {
    await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .eq("id", notificationId);

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === notificationId
          ? {
              ...notification,
              is_read: true,
            }
          : notification
      )
    );

    setCount((current) => Math.max(0, current - 1));
  }

  return (
    <div
      ref={dropdownRef}
      className="relative"
    >
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-full p-2 text-white transition hover:bg-[#222]"
        aria-label="Notifications"
      >
        <Bell size={22} />

        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {count > 99 ? "99+" : count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-700 bg-[#111111] shadow-2xl">
          <div className="border-b border-gray-700 px-5 py-4">
            <h3 className="text-lg font-bold text-white">
              Notifications
            </h3>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                🎉 No notifications yet.
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`border-b border-gray-800 p-4 transition hover:bg-[#1a1a1a] ${
                    !notification.is_read
                      ? "bg-[#181818]"
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      markAsRead(notification.id)
                    }
                    className="w-full text-left"
                  >
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
                  </button>

                  {notification.type === "message" &&
                    notification.conversation_id && (
                      <Link
                        href={`/messages/${notification.conversation_id}`}
                        onClick={() =>
                          markAsRead(notification.id)
                        }
                        className="mt-3 inline-block text-sm font-semibold text-[#C9A227] hover:underline"
                      >
                        Open message →
                      </Link>
                    )}
                </div>
              ))
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