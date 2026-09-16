import Image from "next/image";
import Link from "next/link";

export type CircleItem = { key: string; href: string; label: string; image: string };

const glassRing =
  "rounded-full border border-white/70 bg-white/40 p-1.5 shadow-[0_8px_24px_rgba(18,60,48,0.12)] backdrop-blur-md transition-all duration-500 ease-apple group-hover:border-gold/70 group-hover:shadow-[0_10px_30px_rgba(201,162,39,0.28)]";

function Circle({
  item,
  circleClass,
  sizes,
  hidden = false,
  className = "",
}: {
  item: CircleItem;
  circleClass: string;
  sizes: string;
  hidden?: boolean;
  className?: string;
}) {
  return (
    <Link
      href={item.href}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      className={"flex flex-col items-center gap-3 group shrink-0 " + className}
    >
      <div className={glassRing}>
        <div className={"relative rounded-full overflow-hidden " + circleClass}>
          <Image src={item.image} alt={hidden ? "" : item.label} fill sizes={sizes} className="object-cover" />
        </div>
      </div>
      <span className="text-sm sm:text-base text-ink/80">{item.label}</span>
    </Link>
  );
}

// Glass-ringed circles. Below 1024px they don't fit on one line, so they glide past in an endless
// loop instead: the set is laid out twice and slid by exactly one copy. Each circle carries its own
// right padding (no flex gap) so both copies are the same width and the loop has no jump.
export function CircleRow({
  items,
  circleClass,
  sizes,
  revealStagger = false,
}: {
  items: CircleItem[];
  circleClass: string; // sizes of the round photo, e.g. "h-24 w-24 sm:h-32 sm:w-32"
  sizes: string;
  revealStagger?: boolean; // homepage only
}) {
  return (
    <>
      <div
        data-reveal={revealStagger || undefined}
        className="group/marquee overflow-hidden py-3 lg:hidden motion-reduce:overflow-x-auto [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]"
      >
        <div
          className="flex w-max animate-marquee group-hover/marquee:[animation-play-state:paused] group-active/marquee:[animation-play-state:paused]"
          style={{ animationDuration: `${items.length * 3.5}s` }}
        >
          {[...items, ...items].map((item, i) => (
            <Circle
              key={`${item.key}-${i}`}
              item={item}
              circleClass={circleClass}
              sizes={sizes}
              hidden={i >= items.length}
              className="pr-6 sm:pr-10"
            />
          ))}
        </div>
      </div>

      <div
        data-reveal-stagger={revealStagger ? "right" : undefined}
        className="hidden lg:flex justify-center gap-10 py-3"
      >
        {items.map((item) => (
          <Circle key={item.key} item={item} circleClass={circleClass} sizes={sizes} />
        ))}
      </div>
    </>
  );
}
