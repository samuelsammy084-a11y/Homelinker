"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronDown,
  Menu,
  X,
  MessageCircle,
  UserRound,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    void getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setMenuOpen(false);
      setMoreOpen(false);
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") {
      return pathname === "/";
    }

    if (href === "/properties") {
      return pathname.startsWith("/properties");
    }

    if (href === "/contact") {
      return pathname.startsWith("/contact");
    }

    if (href === "/dashboard") {
      return pathname.startsWith("/dashboard");
    }

    if (href === "/favorites") {
      return pathname.startsWith("/favorites");
    }

    if (href === "/messages") {
      return pathname.startsWith("/messages");
    }

    if (href === "/profile") {
      return pathname.startsWith("/profile");
    }

    return false;
  }

  function linkClass(href: string) {
    return isActive(href)
      ? "font-semibold text-[#C9A227]"
      : "text-white transition hover:text-[#C9A227]";
  }

  function closeMenus() {
    setMenuOpen(false);
    setMoreOpen(false);
  }

  return (
    <nav className="relative z-50 border-b border-white/10 bg-[#111111] shadow-lg">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* LOGO */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          onClick={closeMenus}
        >
          <Image
            src="/images/logo/logo.png"
            alt="HomeLinker Logo"
            width={48}
            height={48}
            className="h-11 w-11 object-contain sm:h-12 sm:w-12"
            priority
          />

          <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl">
            <span className="text-[#C9A227]">Home</span>
            <span className="text-white">Linker</span>
          </h1>
        </Link>

        {/* DESKTOP NAVIGATION */}
        <div className="hidden items-center gap-6 lg:flex">
          {/* HOME */}
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          {/* DASHBOARD */}
          {user && (
            <Link
              href="/dashboard"
              className={linkClass("/dashboard")}
            >
              Dashboard
            </Link>
          )}

          {/* MESSAGES */}
          {user && (
            <Link
              href="/messages"
              className={`inline-flex items-center gap-2 ${linkClass(
                "/messages"
              )}`}
            >
              <MessageCircle size={18} />
              Messages
            </Link>
          )}

          {/* NOTIFICATIONS */}
          {user && <NotificationBell />}

          {/* PROFILE */}
          {user && (
            <Link
              href="/profile"
              className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2 transition ${
                isActive("/profile")
                  ? "border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227]"
                  : "border-white/10 text-white hover:border-[#C9A227]/50 hover:text-[#C9A227]"
              }`}
            >
              <UserRound size={18} />
              Profile
            </Link>
          )}

          {/* MORE DROPDOWN */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setMoreOpen((current) => !current)}
              className={`inline-flex items-center gap-1.5 text-white transition hover:text-[#C9A227] ${
                moreOpen ? "text-[#C9A227]" : ""
              }`}
              aria-expanded={moreOpen}
              aria-haspopup="menu"
            >
              More
              <ChevronDown
                size={16}
                className={`transition-transform ${
                  moreOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {moreOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-[#C9A227]/20 bg-[#181818] p-2 shadow-2xl">
                <Link
                  href="/properties"
                  onClick={closeMenus}
                  className={`block rounded-xl px-4 py-3 transition ${
                    isActive("/properties")
                      ? "bg-[#C9A227]/10 text-[#C9A227]"
                      : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                  }`}
                >
                  Browse Properties
                </Link>

                <Link
                  href="/contact"
                  onClick={closeMenus}
                  className={`block rounded-xl px-4 py-3 transition ${
                    isActive("/contact")
                      ? "bg-[#C9A227]/10 text-[#C9A227]"
                      : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                  }`}
                >
                  Contact
                </Link>

                <Link
                  href="/favorites"
                  onClick={closeMenus}
                  className={`block rounded-xl px-4 py-3 transition ${
                    isActive("/favorites")
                      ? "bg-[#C9A227]/10 text-[#C9A227]"
                      : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                  }`}
                >
                  Favorites
                </Link>

                {!user && (
                  <>
                    <div className="my-2 border-t border-white/10" />

                    <Link
                      href="/login"
                      onClick={closeMenus}
                      className="block rounded-xl px-4 py-3 text-white transition hover:bg-white/5 hover:text-[#C9A227]"
                    >
                      Login
                    </Link>

                    <Link
                      href="/register"
                      onClick={closeMenus}
                      className="block rounded-xl px-4 py-3 text-white transition hover:bg-white/5 hover:text-[#C9A227]"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* POST PROPERTY */}
          <Link
            href="/post-listing"
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-bold text-white transition hover:bg-[#A67C00]"
          >
            Post Property
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* NOTIFICATIONS */}
          {user && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <NotificationBell />
            </div>
          )}

          {/* MESSAGES */}
          {user && (
            <Link
              href="/messages"
              aria-label="Messages"
              className={`relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition ${
                isActive("/messages")
                  ? "text-[#C9A227]"
                  : "text-white hover:text-[#C9A227]"
              }`}
            >
              <MessageCircle size={21} />

              {isActive("/messages") && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#C9A227]" />
              )}
            </Link>
          )}

          {/* PROFILE */}
          {user && (
            <Link
              href="/profile"
              aria-label="Profile"
              className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 transition ${
                isActive("/profile")
                  ? "text-[#C9A227]"
                  : "text-white hover:text-[#C9A227]"
              }`}
            >
              <UserRound size={21} />
            </Link>
          )}

          {/* HAMBURGER */}
          <button
            type="button"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition hover:border-[#C9A227]/50 hover:text-[#C9A227]"
            aria-label={
              menuOpen
                ? "Close navigation"
                : "Open navigation"
            }
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={23} /> : <Menu size={23} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      {menuOpen && (
        <div className="border-t border-[#C9A227]/20 bg-[#111111] lg:hidden">
          <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6">
            <div className="grid gap-2">
              {/* HOME */}
              <Link
                href="/"
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/")
                    ? "bg-[#C9A227]/10 text-[#C9A227]"
                    : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                }`}
                onClick={closeMenus}
              >
                Home
              </Link>

              {/* DASHBOARD */}
              {user && (
                <Link
                  href="/dashboard"
                  className={`rounded-xl px-4 py-3 transition ${
                    isActive("/dashboard")
                      ? "bg-[#C9A227]/10 text-[#C9A227]"
                      : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                  }`}
                  onClick={closeMenus}
                >
                  Dashboard
                </Link>
              )}

              {/* PROFILE */}
              {user && (
                <Link
                  href="/profile"
                  className={`rounded-xl px-4 py-3 transition ${
                    isActive("/profile")
                      ? "bg-[#C9A227]/10 text-[#C9A227]"
                      : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                  }`}
                  onClick={closeMenus}
                >
                  Profile
                </Link>
              )}

              {/* MESSAGES */}
              {user && (
                <Link
                  href="/messages"
                  className={`rounded-xl px-4 py-3 transition ${
                    isActive("/messages")
                      ? "bg-[#C9A227]/10 text-[#C9A227]"
                      : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                  }`}
                  onClick={closeMenus}
                >
                  Messages
                </Link>
              )}

              <div className="my-2 border-t border-white/10" />

              {/* MORE ITEMS */}
              <p className="px-4 pt-1 text-xs font-bold uppercase tracking-wider text-[#C9A227]">
                More
              </p>

              <Link
                href="/properties"
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/properties")
                    ? "bg-[#C9A227]/10 text-[#C9A227]"
                    : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                }`}
                onClick={closeMenus}
              >
                Browse Properties
              </Link>

              <Link
                href="/contact"
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/contact")
                    ? "bg-[#C9A227]/10 text-[#C9A227]"
                    : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                }`}
                onClick={closeMenus}
              >
                Contact
              </Link>

              <Link
                href="/favorites"
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/favorites")
                    ? "bg-[#C9A227]/10 text-[#C9A227]"
                    : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                }`}
                onClick={closeMenus}
              >
                Favorites
              </Link>

              {/* LOGIN / REGISTER FOR GUESTS */}
              {!user && (
                <>
                  <div className="my-2 border-t border-white/10" />

                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-3 text-white transition hover:bg-white/5 hover:text-[#C9A227]"
                    onClick={closeMenus}
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl px-4 py-3 text-white transition hover:bg-white/5 hover:text-[#C9A227]"
                    onClick={closeMenus}
                  >
                    Register
                  </Link>
                </>
              )}

              {/* POST PROPERTY */}
              <Link
                href="/post-listing"
                onClick={closeMenus}
                className="mt-2 rounded-xl bg-[#C9A227] py-3.5 text-center font-bold text-white shadow-lg transition hover:bg-[#A67C00]"
              >
                Post Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}