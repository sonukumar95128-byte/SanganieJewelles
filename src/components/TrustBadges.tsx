import type { CSSProperties } from "react";
import type { TrustBadge } from "@/lib/admin-store";

function Badge({ badge, hidden = false }: { badge: TrustBadge; hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex flex-col items-center text-center gap-2 px-3">
      <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-xl text-gold-light">{badge.icon}</span>
      <span className="text-sm font-medium text-gold-light">{badge.label}</span>
      <span className="text-xs text-gold-light/50">{badge.sub}</span>
    </div>
  );
}

export function TrustBadgeGrid({
  badges,
  revealStagger = false,
}: {
  badges: TrustBadge[];
  revealStagger?: boolean; // homepage only: lets ScrollReveal bring the badges in
}) {
  const live = badges.filter((b) => b.enabled);
  if (live.length === 0) return null;

  // Desktop ticker: the badges are laid out twice in a track twice the box's width and slid left
  // by one copy, so the loop is seamless. Up to four badges are in view at a time.
  const visible = Math.min(live.length, 4);
  const track: CSSProperties = {
    width: `${((2 * live.length) / visible) * 100}%`,
    animationDuration: `${live.length * 6}s`,
  };
  const item: CSSProperties = { width: `${100 / (2 * live.length)}%` };

  return (
    <section className="rounded-xl bg-brand py-10 px-4">
      {/* Phones: a still grid */}
      <div data-reveal-stagger={revealStagger || undefined} className="grid grid-cols-2 gap-6 md:hidden">
        {live.map((b) => (
          <Badge key={b.id} badge={b} />
        ))}
      </div>

      {/* Desktop: badges slide continuously and fade out at both edges of the green box */}
      <div
        data-reveal={revealStagger || undefined}
        className="group/ticker hidden overflow-hidden md:block [mask-image:linear-gradient(to_right,transparent,black_14%,black_86%,transparent)]"
      >
        <div
          className="flex animate-trust-ticker group-hover/ticker:[animation-play-state:paused]"
          style={track}
        >
          {[...live, ...live].map((b, i) => (
            <div key={`${b.id}-${i}`} className="shrink-0" style={item}>
              <Badge badge={b} hidden={i >= live.length} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
