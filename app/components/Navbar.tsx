"use client";

import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
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
    } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null);
      }
    );

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
    <nav className="relative z-50 border-b border-[#C9A227]/30 bg-[#111111]">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/images/logo/logo.png"
            alt="HomeLinker Logo"
            width={55}
            height={55}
            style={{ height: "auto" }}
            priority
          />

          <h1 className="text-2xl font-extrabold sm:text-3xl">
            <span className="text-[#C9A227]">
              Home
            </span>
            <span className="text-white">
              Linker
            </span>
          </h1>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-7 lg:flex">
          <Link
            href="/"
            className={linkClass("/")}
          >
            Home
          </Link>

          <Link
            href="/properties"
            className={linkClass("/properties")}
          >
            Browse
          </Link>

          <Link
            href="/contact"
            className={linkClass("/contact")}
          >
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

          {/* Messages */}
          {user && (
            <Link
              href="/messages"
              className={linkClass("/messages")}
            >
              Messages
            </Link>
          )}

          {/* Notifications */}
          {user && <NotificationBell />}

          {/* Authentication */}
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

          {/* Post Property */}
          <Link
            href="/post-listing"
            className="rounded-xl bg-[#C9A227] px-6 py-3 font-bold text-white transition hover:bg-[#A67C00]"
          >
            Post Property
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() =>
            setMenuOpen((current) => !current)
          }
          className="text-white lg:hidden"
          aria-label={
            menuOpen
              ? "Close navigation"
              : "Open navigation"
          }
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <X size={30} />
          ) : (
            <Menu size={30} />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t border-[#C9A227]/30 bg-[#111111] lg:hidden">
          <div className="flex flex-col gap-5 p-6">
            <Link
              href="/"
              className={linkClass("/")}
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/properties"
              className={linkClass("/properties")}
              onClick={() => setMenuOpen(false)}
            >
              Browse
            </Link>

            <Link
              href="/contact"
              className={linkClass("/contact")}
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

            <Link
              href="/dashboard"
              className={linkClass("/dashboard")}
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </Link>

            <Link
              href="/favorites"
              className={linkClass("/favorites")}
              onClick={() => setMenuOpen(false)}
            >
              Favorites
            </Link>

            {/* Mobile Messages */}
            {user && (
              <Link
                href="/messages"
                className={linkClass("/messages")}
                onClick={() => setMenuOpen(false)}
              >
                Messages
              </Link>
            )}

            {/* Mobile Notifications */}
            {user && (
              <div className="flex items-center">
                <NotificationBell />
              </div>
            )}

            {/* Mobile Authentication */}
            {user ? (
              <button
                type="button"
                onClick={handleLogout}
                className="text-left text-white transition hover:text-red-500"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white transition hover:text-[#C9A227]"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="text-white transition hover:text-[#C9A227]"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}

            {/* Mobile Post Property */}
            <Link
              href="/post-listing"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-[#C9A227] py-3 text-center font-bold text-white transition hover:bg-[#A67C00]"
            >
              Post Property
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}