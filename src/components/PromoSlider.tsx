"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { PromoStrip } from "@/lib/admin-store";

// Infinite loop: the slides are rendered three times in a row and the track always rests on the
// middle copy, so there is a neighbour on both sides. After sliding into an outer copy, the track
// jumps back to the matching middle slide with the transition switched off, which looks identical.
const GAP_PX = 12;

export function PromoSlider({ slides }: { slides: PromoStrip[] }) {
  const count = slides.length;
  const looping = count > 1;
  const items = looping ? [...slides, ...slides, ...slides] : slides;

  const [pos, setPos] = useState(looping ? count : 0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const posRef = useRef(pos);

  useEffect(() => {
    posRef.current = pos;
  }, [pos]);

  const active = looping ? pos % count : 0;
  const inOuterCopy = (p: number) => p < count || p >= 2 * count;
  const toMiddle = (p: number) => count + ((((p - count) % count) + count) % count);

  const go = (delta: number) => {
    if (!looping) return;
    setAnimate(true);
    setPos((p) => Math.min(Math.max(p + delta, 0), 3 * count - 1));
  };

  const recentre = () => {
    if (looping && inOuterCopy(posRef.current)) {
      setAnimate(false);
      setPos(toMiddle(posRef.current));
      return true;
    }
    return false;
  };

  // Turn the transition back on once the silent jump has been painted.
  useEffect(() => {
    if (animate) return;
    let inner = 0;
    const outer = requestAnimationFrame(() => {
      inner = requestAnimationFrame(() => setAnimate(true));
    });
    return () => {
      cancelAnimationFrame(outer);
      cancelAnimationFrame(inner);
    };
  }, [animate]);

  useEffect(() => {
    if (!looping || paused) return;
    const id = setInterval(() => {
      // Background tabs can skip transitionend, so recentre before moving on.
      if (!recentre()) go(1);
    }, 4500);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [looping, paused, count]);

  if (count === 0) return null;

  return (
    <section
      className="w-full py-5"
      aria-roledescription="carousel"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden [--w:86%] sm:[--w:58%] lg:[--w:44%]">
        <div
          className={"flex " + (animate ? "transition-transform duration-[900ms] ease-apple" : "")}
          style={{
            gap: GAP_PX,
            transform: `translateX(calc(50% - ${pos} * (var(--w) + ${GAP_PX}px) - var(--w) / 2))`,
          }}
          onTransitionEnd={(e) => {
            if (e.target === e.currentTarget) recentre();
          }}
        >
          {items.map((s, i) => {
            const isActive = i === pos;
            return (
              <Link
                key={`${s.id}-${i}`}
                href={s.link || "/jewellery"}
                aria-hidden={!isActive}
                tabIndex={isActive ? 0 : -1}
                onClick={(e) => {
                  if (!isActive) {
                    e.preventDefault();
                    go(i - pos);
                  }
                }}
                className={
                  "relative block aspect-[3/2] w-[var(--w)] flex-shrink-0 overflow-hidden rounded-2xl " +
                  // No transition during the silent recentring jump, or the swapped cards would visibly resize.
                  (animate ? "transition duration-[900ms] ease-apple " : "") +
                  (isActive ? "opacity-100 scale-100" : "opacity-50 scale-[0.92]")
                }
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={s.image} alt={s.title} loading="lazy" className="h-full w-full object-cover" />
                {s.title && (
                  <>
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-black/55 via-black/10 to-transparent" />
                    <p className="pointer-events-none absolute bottom-4 left-4 right-4 font-heading text-lg italic leading-snug text-white drop-shadow sm:bottom-6 sm:left-8 sm:right-auto sm:text-3xl">
                      {s.title}
                    </p>
                  </>
                )}
              </Link>
            );
          })}
        </div>

        {looping && (
          <>
            <button
              onClick={() => go(-1)}
              aria-label="Previous offer"
              className="absolute left-[3.5%] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-brand shadow-md transition-colors hover:bg-beige sm:flex"
            >
              ←
            </button>
            <button
              onClick={() => go(1)}
              aria-label="Next offer"
              className="absolute right-[3.5%] top-1/2 z-20 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white text-lg text-brand shadow-md transition-colors hover:bg-beige sm:flex"
            >
              →
            </button>
          </>
        )}
      </div>

      {looping && (
        <div className="mt-3 flex justify-center gap-2">
          {slides.map((s, i) => (
            <button
              key={s.id}
              onClick={() => {
                setAnimate(true);
                setPos(count + i);
              }}
              aria-label={`Go to offer ${i + 1}`}
              className={
                "rounded-full transition-all duration-300 " +
                (i === active ? "h-2 w-6 bg-brand" : "h-2 w-2 bg-brand/30 hover:bg-brand/60")
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
