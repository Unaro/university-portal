"use client";

import * as React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/shared/ui/button";

export interface PaginationProps {
  totalPages: number;
  currentPage: number;
  className?: string;
}

/**
 * Универсальный компонент серверной пагинации.
 * Автоматически сохраняет все текущие searchParams при переключении страниц.
 */
export function Pagination({ totalPages, currentPage, className }: PaginationProps) {
  const searchParams = useSearchParams();

  // Функция для создания URL новой страницы с сохранением текущих фильтров
  const createPageUrl = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    return `?${params.toString()}`;
  };

  if (totalPages <= 1) return null;

  // Логика отображения номеров страниц (с многоточием)
  const getPages = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push("...");
      }

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        if (!pages.includes(i)) pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("...");
      }

      if (!pages.includes(totalPages)) {
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center gap-1 mt-8 mb-4", className)}
    >
      {/* Кнопка Назад */}
      <Link
        href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-9 w-9 transition-all active:scale-95",
          currentPage <= 1 && "pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage <= 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Link>

      {/* Номера страниц */}
      <div className="flex items-center gap-1">
        {getPages().map((page, index) =>
          page === "..." ? (
            <div
              key={`ellipsis-${index}`}
              className="flex h-9 w-9 items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground/50" />
            </div>
          ) : (
            <Link
              key={`page-${page}`}
              href={createPageUrl(page)}
              className={cn(
                buttonVariants({
                  variant: currentPage === Number(page) ? "default" : "outline",
                  size: "icon",
                }),
                "h-9 w-9 transition-all active:scale-95 font-medium",
                currentPage === Number(page) && "pointer-events-none shadow-md border-primary"
              )}
              aria-current={currentPage === Number(page) ? "page" : undefined}
            >
              {page}
            </Link>
          )
        )}
      </div>

      {/* Кнопка Вперед */}
      <Link
        href={currentPage < totalPages ? createPageUrl(currentPage + 1) : "#"}
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "h-9 w-9 transition-all active:scale-95",
          currentPage >= totalPages && "pointer-events-none opacity-50"
        )}
        aria-disabled={currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
