import type { ReactNode } from "react";

// Full-width coloured band behind a homepage section, so the page doesn't read as one long white
// column. "gradient" is the cream-to-sage wash from Shop by Price; soft colour glows inside it give
// frosted-glass cards something to blur. "green" is the deep brand green.
export function SectionBand({ tone = "gradient", children }: { tone?: "gradient" | "green"; children: ReactNode }) {
  if (tone === "green") {
    return (
      <div className="relative overflow-hidden bg-brand">
        <div aria-hidden className="pointer-events-none absolute -top-40 left-1/4 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div aria-hidden className="pointer-events-none absolute -bottom-40 right-10 h-96 w-96 rounded-full bg-brand-secondary/60 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">{children}</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-[#f5efdf] via-ivory to-[#e2ece6]">
      <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/3 h-64 w-64 rounded-full bg-gold-light/30 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-brand/15 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">{children}</div>
    </div>
  );
}
