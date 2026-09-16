"use client";

import { useEffect } from "react";

// Reveals [data-reveal] blocks and the children of [data-reveal-stagger] as they scroll into view.
// The hidden starting state lives in globals.css; this only decides when to let each block in.
const STEP_MS = 90;
const MAX_STEPS = 8;
const SETTLE_MS = 1300;

export function ScrollReveal() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("motion-ready");

    const targets = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal], [data-reveal-stagger]"));
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-revealed", "reveal-done"));
      return;
    }

    for (const el of targets) {
      if (!el.hasAttribute("data-reveal-stagger")) continue;
      Array.from(el.children).forEach((child, i) => {
        (child as HTMLElement).style.setProperty("--reveal-delay", `${Math.min(i, MAX_STEPS) * STEP_MS}ms`);
      });
    }

    const timers: number[] = [];
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const el = entry.target as HTMLElement;
          observer.unobserve(el);
          el.classList.add("is-revealed");
          // Once settled, drop the reveal transition so the element's own hover transitions apply again.
          const steps = el.hasAttribute("data-reveal-stagger") ? Math.min(el.children.length, MAX_STEPS + 1) : 1;
          timers.push(window.setTimeout(() => el.classList.add("reveal-done"), SETTLE_MS + steps * STEP_MS));
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 },
    );

    targets.forEach((el) => observer.observe(el));
    return () => {
      observer.disconnect();
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, []);

  return null;
}
