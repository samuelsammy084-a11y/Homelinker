"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, MessageCircle } from "lucide-react";
import { supabase } from "@/lib/supabase";
import NotificationBell from "./NotificationBell";

export default function Navbar() {
  const pathname = usePathname();

  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
    }

    getUser();

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
    }, 0);

    return () => {
      window.clearTimeout(timer);
    };
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();

    setMenuOpen(false);
    window.location.href = "/";
  }

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

    return false;
  }

  function linkClass(href: string) {
    return isActive(href)
      ? "font-semibold text-[#C9A227]"
      : "text-white hover:text-[#C9A227]";
  }

  return (
    <nav className="relative z-50 border-b border-white/10 bg-[#111111] shadow-lg">
      <div className="mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">

        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 items-center gap-2"
          onClick={() => setMenuOpen(false)}
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

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          <Link
            href="/properties"
            className={linkClass("/properties")}
          >
            Browse
          </Link>

          <Link href="/contact" className={linkClass("/contact")}>
            Contact
          </Link>

          <Link
            href="/dashboard"
            className={linkClass("/dashboard")}
          >
            Dashboard
          </Link>

          <Link
            href="/favorites"
            className={linkClass("/favorites")}
          >
            Favorites
          </Link>

          {user && (
            <Link
              href="/messages"
              className={linkClass("/messages")}
            >
              Messages
            </Link>
          )}

          {user && <NotificationBell />}

          {user ? (
            <button
              type="button"
              onClick={handleLogout}
              className="text-white transition hover:text-red-500"
            >
              Logout
            </button>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white transition hover:text-[#C9A227]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="text-white transition hover:text-[#C9A227]"
              >
                Register
              </Link>
            </>
          )}

          <Link
            href="/post-listing"
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-bold text-white transition hover:bg-[#A67C00]"
          >
            Post Property
          </Link>
        </div>

        {/* MOBILE ACTIONS */}
        <div className="flex items-center gap-2 lg:hidden">

          {/* Notifications OUTSIDE hamburger */}
          {user && (
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              <NotificationBell />
            </div>
          )}

          {/* Messages OUTSIDE hamburger */}
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

              {/* Small active indicator */}
              {isActive("/messages") && (
                <span className="absolute bottom-1 h-1 w-1 rounded-full bg-[#C9A227]" />
              )}
            </Link>
          )}

          {/* Hamburger */}
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

              <Link
                href="/"
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/")
                    ? "bg-[#C9A227]/10 text-[#C9A227]"
                    : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>

              <Link
                href="/properties"
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/properties")
                    ? "bg-[#C9A227]/10 text-[#C9A227]"
                    : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                }`}
                onClick={() => setMenuOpen(false)}
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
                onClick={() => setMenuOpen(false)}
              >
                Contact
              </Link>

              <Link
                href="/dashboard"
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/dashboard")
                    ? "bg-[#C9A227]/10 text-[#C9A227]"
                    : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Dashboard
              </Link>

              <Link
                href="/favorites"
                className={`rounded-xl px-4 py-3 transition ${
                  isActive("/favorites")
                    ? "bg-[#C9A227]/10 text-[#C9A227]"
                    : "text-white hover:bg-white/5 hover:text-[#C9A227]"
                }`}
                onClick={() => setMenuOpen(false)}
              >
                Favorites
              </Link>

              <div className="my-2 border-t border-white/10" />

              {user ? (
                <button
                  type="button"
                  onClick={handleLogout}
                  className="rounded-xl px-4 py-3 text-left text-white transition hover:bg-red-500/10 hover:text-red-400"
                >
                  Logout
                </button>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-xl px-4 py-3 text-white transition hover:bg-white/5 hover:text-[#C9A227]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>

                  <Link
                    href="/register"
                    className="rounded-xl px-4 py-3 text-white transition hover:bg-white/5 hover:text-[#C9A227]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Register
                  </Link>
                </>
              )}

              <Link
                href="/post-listing"
                onClick={() => setMenuOpen(false)}
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