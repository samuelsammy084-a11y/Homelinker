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
};

export default function NotificationBell() {
  const [count, setCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();

    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadNotifications() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    const { data } = await supabase
      .from("notifications")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (data) {
      setNotifications(data);
      setCount(data.filter((n) => !n.is_read).length);
    }
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-full p-2 transition hover:bg-[#222]"
      >
        <Bell className="h-6 w-6 text-white" />

        {count > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
            {count}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-96 overflow-hidden rounded-xl border border-gray-700 bg-[#111111] shadow-2xl">
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
                  <p className="font-semibold text-white">
                    {notification.title}
                  </p>

                  <p className="mt-1 text-sm text-gray-400">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-xs text-gray-500">
                    {new Date(
                      notification.created_at
                    ).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="border-t border-gray-700 p-3">
            <Link
              href="/notifications"
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