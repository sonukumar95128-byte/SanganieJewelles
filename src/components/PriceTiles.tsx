import Link from "next/link";
import type { PriceBand } from "@/lib/dummy-images";

// Regular octagon inside the 100×100 box, pulled in by `inset` on every side.
function octagon(inset: number) {
  const a = inset;
  const b = 100 - inset;
  const c = (b - a) * 0.2929;
  return [
    [a + c, a],
    [b - c, a],
    [b, a + c],
    [b, b - c],
    [b - c, b],
    [a + c, b],
    [a, b - c],
    [a, a + c],
  ]
    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
    .join(" ");
}

function Sparkle({ className }: { className: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      aria-hidden
      className={"pointer-events-none absolute text-gold " + className}
    >
      <path
        d="M20 0 C21.5 13 27 18.5 40 20 C27 21.5 21.5 27 20 40 C18.5 27 13 21.5 0 20 C13 18.5 18.5 13 20 0 Z"
        fill="currentColor"
      />
    </svg>
  );
}

function PriceTile({ band, index }: { band: PriceBand; index: number }) {
  const fill = `price-fill-${index}`;
  const gold = `price-gold-${index}`;
  const href = `/jewellery?minPrice=${band.minPrice}${band.maxPrice ? `&maxPrice=${band.maxPrice}` : ""}`;

  return (
    <Link
      href={href}
      aria-label={`Shop jewellery ${band.label}`}
      className="group relative block aspect-square w-full [container-type:inline-size] transition-transform duration-700 ease-apple hover:-translate-y-1.5"
    >
      <svg
        viewBox="0 0 100 100"
        aria-hidden
        className="absolute inset-0 h-full w-full drop-shadow-[0_14px_22px_rgba(18,60,48,0.28)]"
      >
        <defs>
          <radialGradient id={fill} cx="32%" cy="28%" r="85%">
            <stop offset="0%" stopColor="#2f735b" />
            <stop offset="55%" stopColor="#164837" />
            <stop offset="100%" stopColor="#0a261d" />
          </radialGradient>
          <linearGradient id={gold} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f6dfa4" />
            <stop offset="50%" stopColor="#c9a227" />
            <stop offset="100%" stopColor="#f2d18a" />
          </linearGradient>
        </defs>
        <polygon points={octagon(0)} fill={`url(#${gold})`} />
        <polygon points={octagon(1.1)} fill={`url(#${fill})`} />
        <polygon
          points={octagon(6.5)}
          fill="none"
          stroke={`url(#${gold})`}
          strokeWidth="0.45"
          className="opacity-60 transition-opacity duration-500 group-hover:opacity-100"
        />
      </svg>

      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <span className="text-[5.5cqw] uppercase tracking-[0.22em] text-gold-light">
          {band.kicker}
        </span>
        <span className="mt-[1.5cqw] font-heading text-[17cqw] font-semibold leading-none text-[#fbf3dc]">
          {band.amount}
        </span>
        <span className="mt-[5cqw] border-b border-transparent pb-0.5 text-[4.5cqw] uppercase tracking-[0.2em] text-white/60 transition-colors group-hover:border-gold-light group-hover:text-gold-light">
          Shop now →
        </span>
      </div>
    </Link>
  );
}

// "Shop by Price" as designed octagon price tiles; each whole tile links to that price range.
export function PriceTiles({ bands }: { bands: PriceBand[] }) {
  // Tiles step up in size left to right on wide screens.
  const stepped = ["lg:w-[21%]", "lg:w-[23.5%]", "lg:w-[26%]", "lg:w-[28.5%]"];

  return (
    // The gradient runs the full screen width; the content keeps the page's usual width.
    <section className="relative overflow-hidden bg-gradient-to-br from-[#f5efdf] via-ivory to-[#e2ece6]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="relative px-5 py-10 sm:px-10 sm:py-14">
          <div
            aria-hidden
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-gold/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute -bottom-28 -right-20 h-80 w-80 rounded-full bg-brand/10 blur-3xl"
          />
          <Sparkle className="left-6 top-6 h-5 w-5 opacity-70 sm:left-[30%] sm:top-8 sm:h-8 sm:w-8" />
          <Sparkle className="right-6 top-10 h-4 w-4 opacity-50 sm:right-[12%]" />
          <Sparkle className="bottom-6 left-[46%] hidden h-5 w-5 opacity-60 lg:block" />

          <div data-reveal className="relative text-center lg:text-left">
            <p className="text-xs uppercase tracking-[0.35em] text-gold">
              Shop by
            </p>
            <h2 className="mt-1 font-heading text-5xl italic text-brand sm:text-6xl">
              Price
            </h2>
            <p className="mt-2 text-sm text-ink/55">
              Find the perfect piece within your budget
            </p>
          </div>

          <div
            data-reveal-stagger="zoom"
            className="relative mt-8 grid grid-cols-2 gap-4 sm:gap-6 lg:mt-4 lg:flex lg:items-end lg:justify-between lg:gap-4"
          >
            {bands.map((band, i) => (
              <div key={band.label} className={stepped[i % stepped.length]}>
                <PriceTile band={band} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
