import Image from "next/image";
import Link from "next/link";
import type { AdminTestimonial } from "@/lib/admin-store";
import { categoryToSlug, getProductBySlug } from "@/lib/dummy-images";

// Approved stories only, featured first. When a product is given, stories about that product lead.
export function pickTestimonials(
  testimonials: AdminTestimonial[],
  { productSlug, limit = 3 }: { productSlug?: string; limit?: number } = {},
): AdminTestimonial[] {
  const rank = (t: AdminTestimonial) => (productSlug && t.productSlug === productSlug ? 2 : 0) + (t.featured ? 1 : 0);
  return testimonials
    .filter((t) => t.status === "approved")
    .sort((a, b) => rank(b) - rank(a))
    .slice(0, limit);
}

export function CustomerStoryGrid({
  testimonials,
  revealStagger = false,
  glass = false,
}: {
  testimonials: AdminTestimonial[];
  revealStagger?: boolean; // homepage only: lets ScrollReveal stagger the cards in
  glass?: boolean; // frosted cards, for use on a coloured band
}) {
  const card = glass
    ? "rounded-2xl border border-white/70 bg-white/45 p-5 shadow-[0_8px_32px_rgba(18,60,48,0.10)] backdrop-blur-xl"
    : "rounded-lg border border-beige p-4";
  return (
    <div data-reveal-stagger={revealStagger || undefined} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {testimonials.map((t) => {
        const taggedProduct = t.productSlug ? getProductBySlug(t.productSlug) : undefined;
        return (
          <div key={t.id} className={card}>
            <div className="text-gold text-sm mb-2">{"★".repeat(t.rating)}{"☆".repeat(5 - t.rating)}</div>
            <p className="text-sm text-ink/80 leading-relaxed mb-3">{t.text}</p>
            <div className="flex items-center gap-2">
              {t.avatar ? (
                <div className="relative h-8 w-8 rounded-full overflow-hidden shrink-0">
                  <Image src={t.avatar} alt={t.name} fill sizes="32px" className="object-cover" />
                </div>
              ) : (
                <div className="h-8 w-8 rounded-full bg-brand/10 flex items-center justify-center text-brand text-sm font-medium shrink-0">
                  {t.name.charAt(0)}
                </div>
              )}
              <span className="text-sm font-medium text-brand">{t.name}</span>
              <span className="text-xs text-gold ml-auto">✓ verified</span>
            </div>
            {taggedProduct && (
              <Link
                href={`/jewellery/${categoryToSlug(taggedProduct.category)}/${taggedProduct.slug}`}
                className={"mt-3 pt-3 border-t flex items-center gap-2 hover:opacity-80 transition-opacity " + (glass ? "border-brand/10" : "border-beige")}
              >
                <div className="relative h-10 w-10 rounded overflow-hidden shrink-0 bg-beige">
                  <Image src={taggedProduct.image} alt={taggedProduct.name} fill sizes="40px" className="object-cover" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-ink/70 truncate">{taggedProduct.name}</p>
                  <p className="text-xs font-semibold text-brand">{taggedProduct.price}</p>
                </div>
              </Link>
            )}
          </div>
        );
      })}
      {testimonials.length === 0 && (
        <p className="col-span-full text-center text-sm text-ink/40 py-8">No approved testimonials yet.</p>
      )}
    </div>
  );
}
