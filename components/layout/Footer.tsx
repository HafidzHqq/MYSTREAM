import Link from "next/link";
import { Tv, Globe, MessageCircle, Play } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  Navigasi: [
    { label: "Beranda", href: "/" },
    { label: "Ongoing", href: "/ongoing" },
    { label: "Completed", href: "/completed" },
    { label: "Jadwal Rilis", href: "/schedule" },
  ],
  Kategori: [
    { label: "Action", href: "/genre/action" },
    { label: "Romance", href: "/genre/romance" },
    { label: "Fantasy", href: "/genre/fantasy" },
    { label: "Isekai", href: "/genre/isekai" },
  ],
  Lainnya: [
    { label: "Favorit Saya", href: "/favorites" },
    { label: "Riwayat Nonton", href: "/history" },
    { label: "Cari Anime", href: "/search" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/[0.06] bg-bg-secondary/40">
      <div className="w-full 2xl:px-16 mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4 group">
              <div className="relative w-10 h-10 rounded-xl-full overflow-hidden border border-white/15 group-hover:border-sky-400/40 transition-colors">
                <Image src="/logo.jpg" alt="QQ" fill className="object-cover" unoptimized />
              </div>
              <span className="font-extrabold text-lg text-white tracking-tight group-hover:text-sky-400 transition-colors">
                ANISTREAM
              </span>
            </Link>
            <p className="text-text-muted text-xs sm:text-sm leading-relaxed mb-5">
              Platform streaming anime terlengkap dengan kualitas tinggi dan antarmuka modern yang nyaman di mata.
            </p>
            <div className="flex items-center gap-2">
              <a href="#" className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white transition-all border border-white/[0.06]">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white transition-all border border-white/[0.06]">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-text-muted hover:text-white transition-all border border-white/[0.06]">
                <Play className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-xs font-bold text-white/90 uppercase tracking-wider mb-3.5">{title}</h3>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-xs sm:text-sm text-text-muted hover:text-sky-400 transition-colors flex items-center gap-2 group"
                    >
                      <span className="w-1 h-1 rounded-xl-full bg-white/20 group-hover:bg-sky-400 transition-colors"></span>
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-text-muted">
          <p>© {new Date().getFullYear()} AniStream. All rights reserved.</p>
          <p className="text-text-muted/70">Dibuat untuk pengalaman menonton anime terbaik.</p>
        </div>
      </div>
    </footer>
  );
}
