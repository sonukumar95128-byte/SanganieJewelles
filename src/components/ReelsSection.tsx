"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useAdmin, type AdminReel } from "@/lib/admin-store";
import { categoryToSlug } from "@/lib/dummy-images";

function getYoutubeId(url: string): string | null {
  const patterns = [
    /youtu\.be\/([^?&]+)/,
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtube\.com\/shorts\/([^?&]+)/,
    /youtube\.com\/embed\/([^?&]+)/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function ReelItem({
  reel,
  isCenter,
  videoRef,
}: {
  reel: AdminReel;
  isCenter: boolean;
  videoRef?: (el: HTMLVideoElement | null) => void;
}) {
  const [playing, setPlaying] = useState(false);
  const format = reel.format ?? "portrait";
  const ytId = reel.videoUrl ? getYoutubeId(reel.videoUrl) : null;

  if (ytId) {
    return (
      <div className="relative h-full w-full bg-black overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${ytId}?autoplay=${isCenter ? 1 : 0}&mute=1&loop=1&playlist=${ytId}&controls=0&playsinline=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&disablekb=1`}
          className="absolute inset-0 h-full w-full"
          style={
            format === "portrait"
              ? // Scale up to crop the top branding bar (≈ 50px on a 315px-tall embed)
                { top: "-16%", height: "132%", width: "100%" }
              : { top: "-8%", height: "116%", width: "100%" }
          }
          allow="autoplay; encrypted-media"
          title={reel.title || "Video reel"}
        />
        {/* Play icon overlay for non-center reels */}
        {!isCenter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xl">▶</div>
          </div>
        )}
      </div>
    );
  }

  if (reel.videoUrl) {
    return (
      <div className="relative h-full w-full bg-black">
        <video
          ref={videoRef}
          src={reel.videoUrl}
          className="h-full w-full object-cover"
          muted
          loop
          playsInline
          preload="metadata"
          onClick={() => setPlaying((p) => !p)}
        />
        {!isCenter && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white text-xl">▶</div>
          </div>
        )}
        {isCenter && !playing && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="h-14 w-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white text-2xl">▶</div>
          </div>
        )}
      </div>
    );
  }

  if (reel.thumbnail) {
    // Picture-only reel: a slow pan across the image stands in until a video is uploaded.
    return (
      <div className="relative h-full w-full overflow-hidden bg-black">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={reel.thumbnail}
          alt={reel.title || "Reel"}
          loading="lazy"
          className={"h-full w-full object-cover " + (isCenter ? "animate-reel-pan" : "object-center")}
        />
      </div>
    );
  }

  return (
    <div className="h-full w-full bg-brand/10 flex flex-col items-center justify-center text-ink/30 gap-2">
      <span className="text-4xl">🎬</span>
      <span className="text-xs">No video</span>
    </div>
  );
}

// Coverflow: every reel sits on one stage and is placed purely by its distance from the active
// reel, so changing reel is a transform transition (a continuous glide), never a re-layout.
// The list is repeated to at least 7 slots; only two reels either side are shown, so the reel
// that wraps from one end to the other always makes that trip while invisible.
const SIDE = 2;
const MIN_SLOTS = 7;
const AUTOPLAY_MS = 4500;

function slotStyle(offset: number): CSSProperties {
  const distance = Math.abs(offset);
  const shift = ["0px", "var(--gap1)", "var(--gap2)"][distance] ?? "var(--gap3)";
  const scale = [1, 0.82, 0.66][distance] ?? 0.5;
  return {
    transform: `translate(-50%, -50%) translateX(calc(${Math.sign(offset)} * ${shift})) scale(${scale})`,
    opacity: [1, 0.8, 0.5][distance] ?? 0,
    zIndex: 30 - Math.min(distance, 3) * 10,
  };
}

export function ReelsSection({ reels, onDark = false }: { reels: AdminReel[]; onDark?: boolean }) {
  const { products } = useAdmin();
  const activeReels = reels.filter((r) => r.enabled);
  const count = activeReels.length;
  const copies = count > 1 ? Math.ceil(MIN_SLOTS / count) : 1;
  const slots = Array.from({ length: count * copies }, (_, i) => activeReels[i % count]);
  const total = slots.length;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const dragStartX = useRef<number | null>(null);
  const dragged = useRef(false);

  const go = (delta: number) => {
    if (total > 1) setActive((a) => (((a + delta) % total) + total) % total);
  };

  // Signed distance of a slot from the active one, the short way round.
  const offsetOf = (i: number) => {
    const d = (((i - active) % total) + total) % total;
    return d > total / 2 ? d - total : d;
  };

  useEffect(() => {
    if (count <= 1 || paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % total), AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [count, paused, total]);

  useEffect(() => {
    videoRefs.current.forEach((v, i) => {
      if (!v) return;
      if (i === active) v.play().catch(() => {});
      else {
        v.pause();
        v.currentTime = 0;
      }
    });
  }, [active]);

  if (count === 0) return null;

  const activeReelIndex = active % count;

  return (
    <div
      className="relative w-full select-none"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div
        className="relative w-full touch-pan-y overflow-hidden h-[calc(var(--reel-w)_*_16_/_9_+_2rem)] [--reel-w:44vw] [--gap1:58%] [--gap2:100%] [--gap3:140%] sm:[--reel-w:240px] sm:[--gap1:70%] sm:[--gap2:122%] sm:[--gap3:170%] lg:[--reel-w:300px] lg:[--gap1:78%] lg:[--gap2:140%] lg:[--gap3:190%]"
        onPointerDown={(e) => {
          dragStartX.current = e.clientX;
          dragged.current = false;
        }}
        onPointerUp={(e) => {
          if (dragStartX.current === null) return;
          const diff = dragStartX.current - e.clientX;
          dragStartX.current = null;
          if (Math.abs(diff) > 50) {
            dragged.current = true;
            go(diff > 0 ? 1 : -1);
          }
        }}
      >
        {slots.map((reel, i) => {
          const offset = offsetOf(i);
          const distance = Math.abs(offset);
          const isCenter = offset === 0;
          const taggedProduct = reel.productSlug ? products.find((p) => p.slug === reel.productSlug) : undefined;

          return (
            <div
              key={`${reel.id}-${i}`}
              aria-hidden={!isCenter}
              onClick={() => {
                if (dragged.current) return;
                if (!isCenter && distance <= SIDE) go(offset);
              }}
              className={
                "absolute left-1/2 top-1/2 w-[var(--reel-w)] aspect-[9/16] overflow-hidden rounded-2xl will-change-transform " +
                "transition-[transform,opacity,box-shadow] duration-[900ms] ease-apple motion-reduce:transition-none " +
                (isCenter ? "shadow-2xl " : "cursor-pointer ") +
                (distance > SIDE ? "pointer-events-none" : "")
              }
              style={slotStyle(offset)}
            >
              {distance <= SIDE + 1 && (
                <ReelItem
                  reel={reel}
                  isCenter={isCenter}
                  videoRef={(el) => {
                    videoRefs.current[i] = el;
                  }}
                />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

              <div
                className={
                  "absolute bottom-0 left-0 right-0 p-4 transition-opacity duration-500 " +
                  (isCenter ? "opacity-100" : "pointer-events-none opacity-0")
                }
              >
                {taggedProduct ? (
                  <Link
                    href={`/jewellery/${categoryToSlug(taggedProduct.category)}/${taggedProduct.slug}`}
                    tabIndex={isCenter ? 0 : -1}
                    className="flex items-center gap-1.5 text-white text-sm font-medium drop-shadow hover:text-gold-light transition-colors"
                  >
                    <span className="line-clamp-1">{taggedProduct.name}</span>
                    <span className="shrink-0">→</span>
                  </Link>
                ) : (
                  reel.title && <p className="text-white text-sm font-medium drop-shadow line-clamp-2">{reel.title}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <>
          <button
            onClick={() => go(-1)}
            aria-label="Previous reel"
            className="absolute left-1 sm:left-4 top-[calc(50%_-_1rem)] -translate-y-1/2 z-40 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-brand text-lg hover:bg-white transition-colors"
          >
            ‹
          </button>
          <button
            onClick={() => go(1)}
            aria-label="Next reel"
            className="absolute right-1 sm:right-4 top-[calc(50%_-_1rem)] -translate-y-1/2 z-40 h-10 w-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-lg text-brand text-lg hover:bg-white transition-colors"
          >
            ›
          </button>
        </>
      )}

      {count > 1 && (
        <div className="flex justify-center gap-1.5 mt-4">
          {activeReels.map((reel, i) => (
            <button
              key={reel.id}
              aria-label={`Go to reel ${i + 1}`}
              onClick={() => {
                // Move the short way round to the nearest copy of that reel.
                let delta = (((i - activeReelIndex) % count) + count) % count;
                if (delta > count / 2) delta -= count;
                go(delta);
              }}
              className={
                "rounded-full transition-all duration-300 " +
                (i === activeReelIndex
                  ? "w-6 h-2 " + (onDark ? "bg-gold" : "bg-brand")
                  : "w-2 h-2 " + (onDark ? "bg-gold-light/30 hover:bg-gold-light/60" : "bg-brand/25 hover:bg-brand/50"))
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
