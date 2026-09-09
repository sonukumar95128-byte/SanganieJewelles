"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { COMPARE_LIMIT, useCompare } from "@/lib/compare-store";
import { useAdmin } from "@/lib/admin-store";

export function CompareBar() {
  const { slugs, removeFromCompare, clearCompare, count } = useCompare();
  const { products } = useAdmin();
  const pathname = usePathname();

  // The compare page shows the same items in full — a floating bar there is noise.
  if (count === 0 || pathname === "/compare") return null;

  const items = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  return (
    <>
      {/* Keeps the fixed bar from covering the end of the page */}
      <div aria-hidden="true" className="h-[73px]" />
      <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-beige bg-white/95 backdrop-blur shadow-[0_-4px_20px_rgba(18,60,48,0.08)]">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6">
        <div className="flex flex-1 items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
          {items.map((p) => (
            <div key={p.slug} className="relative shrink-0">
              <div className="h-12 w-12 overflow-hidden rounded-lg border border-beige bg-beige">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.image} alt={p.name} className="h-full w-full object-cover" />
              </div>
              <button
                onClick={() => removeFromCompare(p.slug)}
                aria-label={`Remove ${p.name} from compare`}
                className="absolute -right-1.5 -top-1.5 grid h-5 w-5 place-items-center rounded-full border border-beige bg-white text-[10px] text-ink/50 shadow-sm hover:text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          {count < COMPARE_LIMIT && (
            <span className="shrink-0 px-2 text-xs text-ink/40">
              Add up to {COMPARE_LIMIT - count} more
            </span>
          )}
        </div>

        <button
          onClick={clearCompare}
          className="hidden shrink-0 text-xs text-ink/50 hover:text-brand sm:block"
        >
          Clear
        </button>
        <Link
          href="/compare"
          className="shrink-0 rounded-full bg-brand px-5 py-2.5 text-xs font-medium text-gold-light transition-colors hover:bg-brand-secondary"
        >
          Compare ({count})
        </Link>
      </div>
      </div>
    </>
  );
}
