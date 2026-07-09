"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Search, Menu, X } from "lucide-react";
import Image from "next/image";
import { clsx } from "clsx";

const navLinks: { href: string; label: string; badge?: boolean }[] = [
  { href: "/", label: "Beranda" },
  { href: "/ongoing", label: "Ongoing" },
  { href: "/completed", label: "Completed" },
  { href: "/schedule", label: "Jadwal" },
  { href: "/genre", label: "Genre" },
  { href: "/donghua", label: "Donghua" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <nav
        className={clsx(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b-[3px] border-black bg-bg-primary"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center group">
              <div className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center brutal-box brutal-hover relative overflow-hidden bg-white">
                <Image src="/logo.jpg" alt="QQ.stream" fill className="object-contain" unoptimized />
              </div>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden lg:flex items-center gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={clsx(
                    "px-4 py-2 text-base font-black transition-all border-[3px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none relative",
                    pathname === link.href
                      ? "bg-accent-yellow border-black text-black"
                      : "bg-white border-black text-black hover:bg-accent-pink"
                  )}
                >
                  {link.label}
                  {link.badge && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 border-2 border-black rounded-full bg-accent-blue animate-pulse" />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              {/* Search Button */}
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 md:p-3 bg-white border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-accent-yellow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                aria-label="Cari anime"
              >
                <Search className="w-5 h-5 text-black font-bold" strokeWidth={3} />
              </button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 bg-accent-purple border-[3px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-accent-pink active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
              >
                {mobileOpen ? <X className="w-5 h-5 text-black" strokeWidth={3} /> : <Menu className="w-5 h-5 text-black" strokeWidth={3} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden bg-bg-secondary border-t-[3px] border-black border-b-[3px]">
            <div className="px-4 py-6 flex flex-col gap-3 bg-accent-cyan/20">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    "block w-full text-center px-4 py-3 text-lg font-black transition-all border-[3px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none relative",
                    pathname === link.href
                      ? "bg-accent-yellow border-black text-black"
                      : "bg-white border-black text-black"
                  )}
                >
                  {link.label}
                  {link.badge && (
                    <span className="w-3 h-3 ml-2 inline-block border-2 border-black rounded-full bg-accent-blue" />
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay - Brutalist Style */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}
        >
          <form onSubmit={handleSearch} className="w-full max-w-2xl bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <h2 className="text-2xl font-black mb-4 uppercase tracking-wider text-black">Cari Anime</h2>
            <div className="relative flex gap-3">
              <input
                ref={searchRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Ketik judul anime..."
                className="w-full px-4 py-4 bg-white border-[3px] border-black text-black placeholder:text-gray-500 text-lg font-bold focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
              />
              <button
                type="submit"
                className="px-6 bg-accent-yellow border-[3px] border-black font-black text-black hover:bg-accent-pink transition-colors brutal-hover flex items-center justify-center"
              >
                CARI
              </button>
            </div>
            <button
              type="button"
              onClick={() => setSearchOpen(false)}
              className="mt-4 text-sm font-bold underline underline-offset-4 decoration-2 text-black hover:text-accent-pink"
            >
              Tutup / Batal
            </button>
          </form>
        </div>
      )}
    </>
  );
}
