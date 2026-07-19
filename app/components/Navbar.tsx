"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Navbar() {
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

  async function handleLogout() {
    await supabase.auth.signOut();
    setMenuOpen(false);
    window.location.href = "/";
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#111111] border-b border-[#C9A227] shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
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

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-8">

          <Link href="/" className="text-white hover:text-[#C9A227]">
            Home
          </Link>

          <Link href="/properties" className="text-white hover:text-[#C9A227]">
            Browse
          </Link>

          <Link href="/contact" className="text-white hover:text-[#C9A227]">
            Contact
          </Link>

          {user ? (
            <>
              <Link
                href="/dashboard"
                className="text-white hover:text-[#C9A227]"
              >
                Dashboard
              </Link>

              <Link
                href="/favorites"
                className="text-white hover:text-[#C9A227]"
              >
                ❤️ Favorites
              </Link>

              <button
                onClick={handleLogout}
                className="text-white hover:text-red-500"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-white hover:text-[#C9A227]"
              >
                Login
              </Link>

              <Link
                href="/register"
                className="text-white hover:text-[#C9A227]"
              >
                Register
              </Link>
            </>
          )}

          <Link
            href="/post-listing"
            className="bg-[#C9A227] hover:bg-[#A67C00] text-white px-6 py-3 rounded-xl font-bold"
          >
            Post Listing
          </Link>

        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="lg:hidden text-white"
        >
          {menuOpen ? <X size={30} /> : <Menu size={30} />}
        </button>

      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden bg-[#111111] border-t border-[#C9A227]">
          <div className="flex flex-col gap-5 p-6">

            <Link
              href="/"
              className="text-white"
              onClick={() => setMenuOpen(false)}
            >
              Home
            </Link>

            <Link
              href="/properties"
              className="text-white"
              onClick={() => setMenuOpen(false)}
            >
              Browse
            </Link>

            <Link
              href="/contact"
              className="text-white"
              onClick={() => setMenuOpen(false)}
            >
              Contact
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Dashboard
                </Link>

                <Link
                  href="/favorites"
                  className="text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  ❤️ Favorites
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-left text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="text-white"
                  onClick={() => setMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}

            <Link
              href="/post-listing"
              onClick={() => setMenuOpen(false)}
              className="bg-[#C9A227] text-white text-center py-3 rounded-xl font-bold"
            >
              Post Listing
            </Link>

          </div>
        </div>
      )}
    </nav>
  );
}