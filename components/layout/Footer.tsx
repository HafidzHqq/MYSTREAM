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
    <footer className="mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-t from-bg-secondary to-transparent z-0"></div>
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-accent-purple/5 blur-[128px] z-0 rounded-full"></div>
      <div className="absolute top-0 right-1/4 w-64 h-64 bg-accent-blue/5 blur-[100px] z-0 rounded-full"></div>
      
      <div className="relative z-10 border-t border-white/5 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/10 group-hover:border-accent-purple/50 transition-colors shadow-glow-blue">
                  <Image src="/logo.jpg" alt="QQ" fill className="object-cover" unoptimized />
                </div>
              </Link>
              <p className="text-text-muted text-sm leading-relaxed mb-6">
                Platform streaming anime Indonesia terlengkap dengan desain antarmuka modern yang nyaman di mata.
              </p>
              <div className="flex items-center gap-3">
                <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:-translate-y-1 text-text-secondary hover:text-white transition-all border border-white/5">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:-translate-y-1 text-text-secondary hover:text-white transition-all border border-white/5">
                  <MessageCircle className="w-5 h-5" />
                </a>
                <a href="#" className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 hover:-translate-y-1 text-text-secondary hover:text-white transition-all border border-white/5">
                  <Play className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title}>
                <h3 className="text-base font-bold text-white mb-4">{title}</h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
                      <Link
                         href={link.href}
                        className="text-sm text-text-muted hover:text-accent-blue transition-colors flex items-center gap-2 group"
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-accent-blue/30 group-hover:bg-accent-blue transition-colors"></span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-text-muted text-xs">
              © {new Date().getFullYear()} QQ. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
