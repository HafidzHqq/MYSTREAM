import Link from "next/link";
import { Tv, Globe, MessageCircle, Play } from "lucide-react";
import Image from "next/image";

const footerLinks = {
  Navigasi: [
    { label: "Beranda", href: "/" },
    { label: "Ongoing", href: "/ongoing" },
    { label: "Completed", href: "/completed" },
    { label: "Jadwal", href: "/schedule" },
  ],
  Kategori: [
    { label: "Action", href: "/genre/action" },
    { label: "Romance", href: "/genre/romance" },
    { label: "Fantasy", href: "/genre/fantasy" },
    { label: "Donghua", href: "/donghua" },
  ],
  Lainnya: [
    { label: "Genre", href: "/genre" },
    { label: "Cari Anime", href: "/search" },
    { label: "Jadwal Rilis", href: "/schedule" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center overflow-hidden relative bg-transparent">
                <Image src="/logo.jpg" alt="QQ.stream" fill className="object-contain" unoptimized />
              </div>
            </Link>
            <p className="text-text-muted text-sm leading-relaxed mb-4">
              Platform streaming anime Indonesia terlengkap. Nonton anime sub indo gratis.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all">
                <MessageCircle className="w-4 h-4" />
              </a>
              <a href="#" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all">
                <Play className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-text-primary mb-3">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-muted hover:text-text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-xs">
            © {new Date().getFullYear()} QQ.stream. Data dari{" "}
            <a href="https://www.sankavollerei.web.id/anime/" target="_blank" rel="noopener" className="text-accent-purple hover:underline">
              Sanka Vollerei API
            </a>
          </p>
          <p className="text-text-muted text-xs">
            Dibuat dengan ❤️ untuk pecinta anime Indonesia
          </p>
        </div>
      </div>
    </footer>
  );
}
