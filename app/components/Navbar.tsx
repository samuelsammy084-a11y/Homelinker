"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

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

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    window.location.href = "/";
  }

  function isActive(href: string) {
    if (href === "/") return pathname === href;
    if (href === "/properties") return pathname.startsWith("/properties");
    if (href === "/contact") return pathname.startsWith("/contact");
    if (href === "/dashboard") return pathname.startsWith("/dashboard");
    if (href === "/favorites") return pathname.startsWith("/favorites");
    return false;
  }

  function linkClass(href: string) {
    return isActive(href)
      ? "text-[#C9A227] font-semibold"
      : "text-white hover:text-[#C9A227]";
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-[#C9A227] bg-[#111111] shadow-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image
            src="/images/logo/logo.png"
            alt="HomeLinker Logo"
            width={55}
            height={55}
            style={{ height: "auto" }}
            priority
          />

          <h1 className="text-3xl font-extrabold">
            <span className="text-[#C9A227]">Home</span>
            <span className="text-white">Linker</span>
          </h1>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <Link href="/" className={linkClass("/")}>
            Home
          </Link>

          <Link href="/properties" className={linkClass("/properties")}>
            Browse
          </Link>

          <Link href="/contact" className={linkClass("/contact")}>
            Contact
          </Link>

          <Link href="/dashboard" className={linkClass("/dashboard")}>
            Dashboard
          </Link>

          <Link href="/favorites" className={linkClass("/favorites")}>
            Favorites
          </Link>

          {user ? (
            <button onClick={handleLogout} className="text-white hover:text-red-500">
              Logout
            </button>
          ) : (
            <>
              <Link href="/login" className="text-white hover:text-[#C9A227]">
                Login
              </Link>

              <Link href="/register" className="text-white hover:text-[#C9A227]">
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

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-white lg:hidden"
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-[#C9A227] bg-[#111111] lg:hidden">
          <div className="flex flex-col gap-5 p-6">
            <Link href="/" className={linkClass("/")} onClick={() => setMenuOpen(false)}>
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

            {user ? (
              <button onClick={handleLogout} className="text-left text-white">
                Logout
              </button>
            ) : (
              <>
                <Link href="/login" className="text-white" onClick={() => setMenuOpen(false)}>
                  Login
                </Link>

                <Link href="/register" className="text-white" onClick={() => setMenuOpen(false)}>
                  Register
                </Link>
              </>
            )}

            <Link
              href="/post-listing"
              onClick={() => setMenuOpen(false)}
              className="rounded-xl bg-[#C9A227] py-3 text-center font-bold text-white"
            >
              Post Property
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}