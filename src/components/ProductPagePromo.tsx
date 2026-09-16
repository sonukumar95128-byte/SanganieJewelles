"use client";

import Link from "next/link";
import { useAdmin } from "@/lib/admin-store";

export function ProductPagePromo() {
  const { promoStrips } = useAdmin();
  const strip = promoStrips.find((s) => s.id === "product-page");
  if (!strip) return null;

  return (
    // The whole 3:2 picture beside the offer, so the banner is never cropped.
    <div className="mt-12 overflow-hidden rounded-xl bg-brand sm:grid sm:grid-cols-2 sm:items-center">
      <div className="relative aspect-[3/2]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={strip.image} alt={strip.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      </div>
      <div className="p-6 sm:px-10 lg:px-14">
        <p className="text-xs uppercase tracking-[0.3em] text-gold-light">Offer</p>
        <p className="mt-2 mb-5 font-heading italic text-2xl text-white sm:text-3xl lg:text-4xl">{strip.title}</p>
        <Link
          href={strip.link}
          className="inline-block rounded-full bg-gold px-6 py-2 text-sm font-medium text-brand hover:bg-gold-light transition-colors"
        >
          Explore
        </Link>
      </div>
    </div>
  );
}
