"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { COMPARE_LIMIT, useCompare } from "@/lib/compare-store";

type ProductCardProps = {
  slug: string;
  image: string;
  hoverImage?: string;
  name?: string;
  price?: string;
  badge?: "Bestseller" | "-20%";
  href?: string;
};

export function ProductCard({ slug, image, hoverImage, name, price, badge, href }: ProductCardProps) {
  const { items, addItem } = useCart();
  const inBag = items.some((i) => i.slug === slug);
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(slug);
  const { isComparing, toggleCompare, isFull: compareFull } = useCompare();
  const comparing = isComparing(slug);

  return (
    <div className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-beige/70 overflow-hidden transition-all duration-300 hover:-translate-y-1 animate-fadeUp">
      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-beige">
        {href ? (
          <Link href={href} className="block h-full">
            {/* Primary image */}
            <img
              src={image}
              alt={name ?? "Jewellery product"}
              loading="lazy"
              className={
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 " +
                (hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform")
              }
            />
            {/* Hover image */}
            {hoverImage && (
              <img
                src={hoverImage}
                alt={name ?? "Jewellery product"}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </Link>
        ) : (
          <>
            <img
              src={image}
              alt={name ?? "Jewellery product"}
              loading="lazy"
              className={
                "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 " +
                (hoverImage ? "group-hover:opacity-0" : "group-hover:scale-105 transition-transform")
              }
            />
            {hoverImage && (
              <img
                src={hoverImage}
                alt={name ?? "Jewellery product"}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
              />
            )}
          </>
        )}
        {/* Wishlist + compare float over the photo so Add to Bag can take the whole row */}
        <div className="absolute top-2.5 right-2.5 z-10 flex flex-col gap-1.5">
          <button
            onClick={() => toggleWishlist(slug)}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className={
              "grid h-8 w-8 place-items-center rounded-full border shadow-sm backdrop-blur-sm transition-colors " +
              (wishlisted ? "border-gold bg-gold-light/40 text-gold" : "border-white/80 bg-white/85 text-ink/50 hover:border-gold hover:text-gold")
            }
          >
            <span className="text-sm">{wishlisted ? "♥" : "♡"}</span>
          </button>
          <button
            onClick={() => toggleCompare(slug)}
            disabled={!comparing && compareFull}
            aria-label={comparing ? "Remove from compare" : "Add to compare"}
            title={
              !comparing && compareFull ? `You can compare up to ${COMPARE_LIMIT} items` : "Compare"
            }
            className={
              "grid h-8 w-8 place-items-center rounded-full border text-sm shadow-sm backdrop-blur-sm transition-colors " +
              (comparing
                ? "border-gold bg-gold-light/40 text-gold"
                : compareFull
                  ? "border-white/80 bg-white/70 text-ink/20 cursor-not-allowed"
                  : "border-white/80 bg-white/85 text-ink/50 hover:border-gold hover:text-gold")
            }
          >
            ⇄
          </button>
        </div>
        {badge && (
          <span
            className={
              "absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-0.5 text-xs font-medium " +
              (badge === "Bestseller" ? "bg-brand text-gold-light" : "bg-gold text-brand")
            }
          >
            {badge}
          </span>
        )}
      </div>

      {/* Info + actions inside the card */}
      <div className="p-3">
        {/* Price first */}
        {price ? (
          <p className="text-sm font-semibold text-brand mb-1">{price}</p>
        ) : (
          <div className="h-3 w-1/2 rounded bg-beige mb-1" />
        )}

        {/* Then title */}
        {name ? (
          href ? (
            <Link href={href}>
              <p className="text-xs text-ink/70 line-clamp-1 hover:text-gold transition-colors leading-snug mb-4">
                {name}
              </p>
            </Link>
          ) : (
            <p className="text-xs text-ink/70 line-clamp-1 leading-snug mb-4">{name}</p>
          )
        ) : (
          <div className="h-3 w-3/4 rounded bg-beige mb-4" />
        )}

        {/* Add to Bag gets the full width */}
        {inBag ? (
          <Link
            href="/cart"
            className="block w-full rounded-full bg-brand px-2 py-2 text-center text-xs font-medium text-gold-light transition-colors hover:bg-brand-secondary sm:text-sm"
          >
            In Bag ✓
          </Link>
        ) : (
          <button
            onClick={() => addItem(slug)}
            className="w-full rounded-full border border-brand px-2 py-2 text-xs font-medium text-brand transition-colors hover:bg-brand hover:text-gold-light sm:text-sm"
          >
            Add to Bag
          </button>
        )}
      </div>
    </div>
  );
}
