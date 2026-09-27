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
    <div className="flex items-center justify-center gap-1.5 mt-10 flex-wrap">
      {currentPage > 1 && (
        <Link
          href={`${baseUrl}?page=${currentPage - 1}`}
          className="p-2 rounded-xl bg-bg-secondary/80 border border-white/[0.08] hover:bg-white/[0.08] text-text-secondary hover:text-white transition-all"
        >
          <ChevronLeft className="w-4 h-4" />
        </Link>
      )}
      {pages[0] > 1 && (
        <>
          <Link href={`${baseUrl}?page=1`} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white bg-bg-secondary/50 border border-white/[0.06] hover:bg-white/[0.08] transition-all">1</Link>
          {pages[0] > 2 && <span className="text-text-muted px-1">…</span>}
        </>
      )}
      {pages.map(p => (
        <Link
          key={p}
          href={`${baseUrl}?page=${p}`}
          className={clsx(
            "px-3 py-1.5 rounded-xl text-xs font-bold transition-all border",
            p === currentPage
              ? "bg-white text-black border-white shadow-sm"
              : "bg-bg-secondary/60 text-text-secondary hover:text-white border-white/[0.06] hover:bg-white/[0.08]"
          )}
        >
          {p}
        </Link>
      ))}
      {pages[pages.length - 1] < totalPage && (
        <>
          {pages[pages.length - 1] < totalPage - 1 && <span className="text-text-muted px-1">…</span>}
          <Link href={`${baseUrl}?page=${totalPage}`} className="px-3 py-1.5 rounded-xl text-xs font-semibold text-text-secondary hover:text-white bg-bg-secondary/50 border border-white/[0.06] hover:bg-white/[0.08] transition-all">{totalPage}</Link>
        </>
      )}
      {currentPage < totalPage && (
        <Link
          href={`${baseUrl}?page=${currentPage + 1}`}
          className="p-2 rounded-xl bg-bg-secondary/80 border border-white/[0.08] hover:bg-white/[0.08] text-text-secondary hover:text-white transition-all"
        >
          <ChevronRight className="w-4 h-4" />
        </Link>
      )}
    </div>
  );
}
