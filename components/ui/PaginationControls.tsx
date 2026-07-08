import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { clsx } from "clsx";

interface PaginationControlsProps {
  currentPage: number;
  totalPage: number;
  baseUrl: string;
}

export function PaginationControls({ currentPage, totalPage, baseUrl }: PaginationControlsProps) {
  if (totalPage <= 1) return null;

  const pages: number[] = [];
  const delta = 2;
  for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPage, currentPage + delta); i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="p-2 rounded-xl glass border border-white/10 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
      {pages[0] > 1 && (
        <>
          <Link href={`${baseUrl}?page=1`} className="px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">1</Link>
          {pages[0] > 2 && <span className="text-text-muted">…</span>}
        </>
      )}
      {pages.map(p => (
        <Link
          key={p}
          href={`${baseUrl}?page=${p}`}
          className={clsx(
            "px-3 py-2 rounded-xl text-sm font-medium transition-all",
            p === currentPage
              ? "bg-gradient-primary text-white shadow-glow"
              : "text-text-secondary hover:text-text-primary hover:bg-white/5"
          )}
        >
          {p}
        </Link>
      ))}
      {pages[pages.length - 1] < totalPage && (
        <>
          {pages[pages.length - 1] < totalPage - 1 && <span className="text-text-muted">…</span>}
          <Link href={`${baseUrl}?page=${totalPage}`} className="px-3 py-2 rounded-xl text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-all">{totalPage}</Link>
        </>
      )}
      {currentPage < totalPage && (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="p-2 rounded-xl glass border border-white/10 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
