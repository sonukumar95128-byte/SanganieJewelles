"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/cart-store";
import { useCompare } from "@/lib/compare-store";
import { useAdmin } from "@/lib/admin-store";
import { categoryToSlug, priceToNumber } from "@/lib/dummy-images";

// Rows are ordered so the things shoppers decide on come first.
const ATTRIBUTE_ROWS = [
  "Gold Karat",
  "Gold Colour",
  "Gold Weight",
  "Diamond Colour",
  "Diamond Clarity",
  "Lab Certificate",
];

export default function ComparePage() {
  const { slugs, removeFromCompare, clearCompare } = useCompare();
  const { products } = useAdmin();
  const { items: cart, addItem } = useCart();

  const items = slugs
    .map((slug) => products.find((p) => p.slug === slug))
    .filter((p): p is NonNullable<typeof p> => !!p);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
        <h1 className="font-heading italic text-3xl text-brand">Compare</h1>
        <p className="mt-3 text-sm text-ink/60">
          You haven&apos;t added anything to compare yet. Tick &ldquo;Compare&rdquo; on any product to
          line pieces up side by side.
        </p>
        <Link
          href="/jewellery"
          className="mt-6 inline-block rounded-full bg-brand px-6 py-3 text-sm font-medium text-gold-light transition-colors hover:bg-brand-secondary"
        >
          Browse jewellery
        </Link>
      </div>
    );
  }

  const cheapest = Math.min(...items.map((p) => priceToNumber(p.price)));
  // Only worth highlighting a "lowest price" when they actually differ.
  const pricesDiffer = new Set(items.map((p) => priceToNumber(p.price))).size > 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <div className="mb-6 flex items-baseline justify-between gap-4">
        <h1 className="font-heading italic text-3xl text-brand">Compare</h1>
        <button onClick={clearCompare} className="text-sm text-ink/50 transition-colors hover:text-brand">
          Clear all
        </button>
      </div>

      <div className="overflow-x-auto rounded-xl border border-beige bg-white">
        <table className="w-full min-w-[560px] border-collapse text-sm">
          <thead>
            <tr className="align-top">
              <th className="w-28 border-b border-beige px-4 py-4 text-left text-xs font-medium uppercase tracking-wide text-ink/40 sm:w-36">
                Product
              </th>
              {items.map((p) => (
                <th key={p.slug} className="border-b border-l border-beige px-4 py-4 text-left font-normal">
                  <div className="relative mb-3 aspect-square w-full overflow-hidden rounded-lg bg-beige">
                    <Image
                      src={p.image}
                      alt={p.name}
                      fill
                      sizes="(min-width: 640px) 220px, 45vw"
                      className="object-cover"
                    />
                  </div>
                  <Link
                    href={`/jewellery/${categoryToSlug(p.category)}/${p.slug}`}
                    className="text-xs leading-snug text-ink/80 transition-colors hover:text-gold"
                  >
                    {p.name}
                  </Link>
                  <button
                    onClick={() => removeFromCompare(p.slug)}
                    className="mt-1.5 block text-[11px] text-ink/40 transition-colors hover:text-red-500"
                  >
                    Remove
                  </button>
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            <Row label="Price">
              {items.map((p) => (
                <Cell key={p.slug}>
                  <span className="font-semibold text-brand">{p.price}</span>
                  {p.originalPrice && (
                    <span className="ml-1.5 text-xs text-ink/40 line-through">{p.originalPrice}</span>
                  )}
                  {pricesDiffer && priceToNumber(p.price) === cheapest && (
                    <span className="ml-1.5 rounded-full bg-gold-light/40 px-2 py-0.5 text-[10px] text-brand">
                      Lowest
                    </span>
                  )}
                </Cell>
              ))}
            </Row>

            <Row label="Rating">
              {items.map((p) => (
                <Cell key={p.slug}>
                  <span className="text-gold">{"★".repeat(Math.round(p.rating))}</span>
                  <span className="ml-1.5 text-xs text-ink/50">
                    {p.rating} ({p.reviewCount})
                  </span>
                </Cell>
              ))}
            </Row>

            <Row label="Category">
              {items.map((p) => (
                <Cell key={p.slug}>{p.category}</Cell>
              ))}
            </Row>

            {ATTRIBUTE_ROWS.map((key) => (
              <Row key={key} label={key}>
                {items.map((p) => (
                  <Cell key={p.slug}>{p.attributes?.[key] ?? "—"}</Cell>
                ))}
              </Row>
            ))}

            <Row label="SKU">
              {items.map((p) => (
                <Cell key={p.slug}>
                  <span className="text-xs text-ink/50">{p.sku ?? "—"}</span>
                </Cell>
              ))}
            </Row>

            <Row label="Availability">
              {items.map((p) => (
                <Cell key={p.slug}>
                  {p.stock > 0 ? (
                    <span className="text-green-700">In stock</span>
                  ) : (
                    <span className="text-red-500">Out of stock</span>
                  )}
                </Cell>
              ))}
            </Row>

            <tr>
              <td className="px-4 py-4" />
              {items.map((p) => {
                const inBag = cart.some((i) => i.slug === p.slug);
                return (
                  <td key={p.slug} className="border-l border-beige px-4 py-4">
                    {inBag ? (
                      <Link
                        href="/cart"
                        className="block rounded-full bg-brand px-3 py-2.5 text-center text-xs font-medium text-gold-light transition-colors hover:bg-brand-secondary"
                      >
                        Added ✓ View Bag
                      </Link>
                    ) : (
                      <button
                        onClick={() => addItem(p.slug)}
                        disabled={p.stock === 0}
                        className="w-full rounded-full border border-brand px-3 py-2.5 text-xs font-medium text-brand transition-colors hover:bg-brand hover:text-gold-light disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-brand"
                      >
                        Add to Bag
                      </button>
                    )}
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <tr className="border-b border-beige last:border-b-0 odd:bg-ivory/60">
      <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wide text-ink/40">
        {label}
      </th>
      {children}
    </tr>
  );
}

function Cell({ children }: { children: React.ReactNode }) {
  return <td className="border-l border-beige px-4 py-3 text-ink/80">{children}</td>;
}
