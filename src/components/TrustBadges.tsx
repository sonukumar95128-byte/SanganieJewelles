import type { TrustBadge } from "@/lib/admin-store";

export function TrustBadgeGrid({
  badges,
  revealStagger = false,
}: {
  badges: TrustBadge[];
  revealStagger?: boolean; // homepage only: lets ScrollReveal stagger the badges in
}) {
  const live = badges.filter((b) => b.enabled);
  if (live.length === 0) return null;

  return (
    <section
      data-reveal-stagger={revealStagger || undefined}
      className="grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-xl bg-brand py-10 px-4"
    >
      {live.map((b) => (
        <div key={b.id} className="flex flex-col items-center text-center gap-2">
          <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-xl text-gold-light">{b.icon}</span>
          <span className="text-sm font-medium text-gold-light">{b.label}</span>
          <span className="text-xs text-gold-light/50">{b.sub}</span>
        </div>
      ))}
    </section>
  );
}
