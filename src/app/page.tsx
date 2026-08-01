export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { CuratedProductGrid } from "@/components/CuratedProductGrid";
import { HeroSlider } from "@/components/HeroSlider";
import { PromoSlider } from "@/components/PromoSlider";
import { SectionHeading } from "@/components/SectionHeading";
import { ReelsSection } from "@/components/ReelsSection";
import {
  categories,
  categoryImages as defaultCategoryImages,
  categoryToSlug,
  dummyProducts,
  dummyTestimonials,
  heroSlides,
  productImages,
  collectionImages,
  priceBands,
  relationShops,
  getProductBySlug,
} from "@/lib/dummy-images";
import type {
  AdminReel,
  AdminCollection,
  AdminTestimonial,
  HomepageSection,
  HeroSlideAdmin,
  PromoStrip,
  TrustBadge,
} from "@/lib/admin-store";

// Seed defaults (used when DB has no value yet)
const defaultSections: HomepageSection[] = [
  { id: "hero", label: "Hero slider", meta: "", manageLabel: "", enabled: true },
  { id: "categories", label: "Category circles", meta: "", manageLabel: "", enabled: true },
  { id: "best-sellers", label: "Best Sellers", meta: "", manageLabel: "", enabled: true },
  { id: "shop-by-price", label: "Shop by Price", meta: "", manageLabel: "", enabled: true },
  { id: "new-arrivals", label: "New Arrivals", meta: "", manageLabel: "", enabled: true },
  { id: "shop-by-relation", label: "Shop by Relation", meta: "", manageLabel: "", enabled: true },
  { id: "offer-banner", label: "Offer banner", meta: "", manageLabel: "", enabled: true },
  { id: "collections", label: "Trending Now", meta: "", manageLabel: "", enabled: true },
  { id: "reels", label: "Watch & Shop", meta: "", manageLabel: "", enabled: true },
  { id: "testimonials", label: "Customer Stories", meta: "", manageLabel: "", enabled: true },
  { id: "trust-badges", label: "Our Promise", meta: "", manageLabel: "", enabled: true },
];

const defaultHeroSlides: HeroSlideAdmin[] = heroSlides.map((s, i) => ({
  id: `slide-${i + 1}`,
  title: s.alt,
  link: s.href,
  image: s.image,
  enabled: true,
}));

const defaultPromoStrips: PromoStrip[] = [
  { id: "promo-slide-1", position: "Homepage slider", title: "New Collection", link: "/jewellery", image: productImages[6], enabled: true },
  { id: "promo-slide-2", position: "Homepage slider", title: "Festive Sale", link: "/jewellery", image: productImages[2], enabled: true },
];

const defaultCollections: AdminCollection[] = [
  {
    id: "bridal",
    title: "Bridal",
    slug: "bridal",
    image: collectionImages.Bridal,
    description: "Statement pieces for the big day and every celebration after it.",
    productSlugs: [],
    enabled: true,
  },
  {
    id: "everyday-light",
    title: "Everyday Light",
    slug: "everyday-light",
    image: collectionImages["Everyday Light"],
    description: "Lightweight, wearable gold for the pieces you'll never want to take off.",
    productSlugs: [],
    enabled: true,
  },
  {
    id: "gifting",
    title: "Gifting",
    slug: "gifting",
    image: collectionImages.Gifting,
    description: "Thoughtful, ready-to-gift edits for the people who matter most.",
    productSlugs: [],
    enabled: true,
  },
];

const defaultTestimonials: AdminTestimonial[] = dummyTestimonials.map((t, i) => ({
  id: `testimonial-${i + 1}`,
  name: t.name,
  rating: t.rating,
  text: t.text,
  avatar: t.avatar,
  status: "approved" as const,
  featured: i === 0,
  productSlug: t.productSlug,
}));

const defaultTrustBadges: TrustBadge[] = [
  { id: "badge-1", icon: "✓", label: "Certified Authenticity", sub: "Every piece verified", enabled: true },
  { id: "badge-2", icon: "🔒", label: "Secure Shopping Experience", sub: "Safe & encrypted checkout", enabled: true },
  { id: "badge-3", icon: "◆", label: "BIS Hallmarked", sub: "Government certified", enabled: true },
  { id: "badge-4", icon: "♾", label: "Lifetime Buyback", sub: "Exchange support, always", enabled: true },
];

async function getSiteConfig() {
  try {
    const prisma = getPrisma();
    const rows = await prisma.siteConfig.findMany({
      where: {
        key: { in: ["banners", "homepage", "testimonials", "collections", "newArrivals", "bestSellers", "categoryImages", "reels", "trustBadges"] },
      },
    });
    const db: Record<string, unknown> = {};
    for (const row of rows) db[row.key] = row.value;
    return db;
  } catch {
    return {};
  }
}

export default async function Home() {
  const db = await getSiteConfig();

  // Banners
  const banners = db.banners as { heroSlidesAdmin?: HeroSlideAdmin[]; promoStrips?: PromoStrip[] } | undefined;
  const heroSlidesAdmin: HeroSlideAdmin[] = banners?.heroSlidesAdmin ?? defaultHeroSlides;
  const promoStrips: PromoStrip[] = banners?.promoStrips ?? defaultPromoStrips;

  // Sections
  const homepageSections: HomepageSection[] = (db.homepage as HomepageSection[]) ?? defaultSections;
  const isOn = (id: string) => homepageSections.find((s) => s.id === id)?.enabled ?? true;

  // Content
  const collections: AdminCollection[] = (db.collections as AdminCollection[]) ?? defaultCollections;
  const testimonials: AdminTestimonial[] = (db.testimonials as AdminTestimonial[]) ?? defaultTestimonials;
  const reels: AdminReel[] = (db.reels as AdminReel[]) ?? [];
  const trustBadges: TrustBadge[] = (db.trustBadges as TrustBadge[]) ?? defaultTrustBadges;
  const catImages: Record<string, string> = (db.categoryImages as Record<string, string>) ?? {};
  const newArrivalsSlugs: string[] = (db.newArrivals as string[]) ?? dummyProducts.slice(0, 8).map((p) => p.slug);
  const bestSellersSlugs: string[] = (db.bestSellers as string[]) ?? dummyProducts.slice(8, 16).map((p) => p.slug);

  // Derived
  const liveHeroSlides = heroSlidesAdmin
    .filter((s) => s.enabled)
    .map((s) => ({ image: s.image, href: s.link, alt: s.title }));

  const homeSlides = promoStrips.filter((p) => p.position === "Homepage slider" && p.enabled !== false);
  const liveCollections = collections.filter((c) => c.enabled);
  const liveTestimonials = testimonials
    .filter((t) => t.status === "approved")
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);

  return (
    <div className="space-y-16 pb-16">
      {/* Hero — full bleed slider */}
      {isOn("hero") && <HeroSlider slides={liveHeroSlides} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
        {/* Category circles */}
        {isOn("categories") && (
          <section className="overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory pb-2">
            <div className="flex gap-6 sm:gap-10 mx-auto w-fit px-2">
              {categories.map((c) => (
                <Link key={c} href={`/jewellery/${categoryToSlug(c)}`} className="flex flex-col items-center gap-3 group shrink-0 snap-center">
                  <div className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full overflow-hidden ring-1 ring-beige group-hover:ring-2 group-hover:ring-gold transition-all">
                    <Image
                      src={catImages[c] || defaultCategoryImages[c] || ""}
                      alt={c}
                      fill
                      sizes="(min-width:1024px) 144px, (min-width:640px) 128px, 96px"
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm sm:text-base text-ink/80">{c}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Best Sellers */}
        {isOn("best-sellers") && (
          <section>
            <SectionHeading title="Best Sellers" subtitle="Loved and worn by thousands of customers" viewAllHref="/jewellery?sort=bestselling" />
            <CuratedProductGrid slugs={bestSellersSlugs} badge="Bestseller" />
          </section>
        )}

        {/* Shop by Price */}
        {isOn("shop-by-price") && (
          <section>
            <SectionHeading title="Shop by Price" subtitle="Find the perfect piece within your budget" />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {priceBands.map((band) => (
                <Link
                  key={band.label}
                  href={`/jewellery?minPrice=${band.minPrice}${band.maxPrice ? `&maxPrice=${band.maxPrice}` : ""}`}
                  className="group relative aspect-square rounded-lg overflow-hidden flex items-end p-3"
                >
                  <Image
                    src={band.image}
                    alt={band.label}
                    fill
                    sizes="(min-width:640px) 25vw, 50vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand/70 to-transparent" />
                  <span className="relative z-10 text-sm sm:text-base font-medium text-white">{band.label}</span>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* New Arrivals */}
        {isOn("new-arrivals") && (
          <section>
            <SectionHeading title="New Arrivals" subtitle="Freshly crafted pieces, added every week" viewAllHref="/jewellery?sort=newest" />
            <CuratedProductGrid slugs={newArrivalsSlugs} />
          </section>
        )}

        {/* Shop by Relation */}
        {isOn("shop-by-relation") && (
          <section>
            <SectionHeading title="Shop by Relation" subtitle="Gifts for everyone you cherish" />
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory pb-2">
              <div className="flex gap-6 sm:gap-10 mx-auto w-fit px-2">
                {relationShops.map((r) => (
                  <Link
                    key={r.label}
                    href={`/jewellery?category=${r.categories.map(categoryToSlug).join(",")}`}
                    className="flex flex-col items-center gap-3 group shrink-0 snap-center"
                  >
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden ring-1 ring-beige group-hover:ring-2 group-hover:ring-gold transition-all">
                      <Image src={r.image} alt={r.label} fill sizes="(min-width:640px) 128px, 96px" className="object-cover" />
                    </div>
                    <span className="text-sm sm:text-base text-ink/80">{r.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Promo slider — full bleed */}
      {isOn("offer-banner") && <PromoSlider slides={homeSlides} />}

      <div className="mx-auto max-w-7xl px-4 sm:px-6 space-y-16">
        {/* Trending Now — shop by collection */}
        {isOn("collections") && (
          <section>
            <SectionHeading title="Trending Now" subtitle="Curated edits for every occasion" viewAllHref="/collections" viewAllLabel="All collections" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {liveCollections.map((c) => (
                <Link key={c.id} href={`/collections/${c.slug}`} className="group">
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden">
                    <Image
                      src={c.image}
                      alt={c.title}
                      fill
                      sizes="33vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-3 font-heading italic text-xl text-brand">{c.title}</p>
                  {c.description && <p className="mt-1 text-sm text-ink/60 leading-relaxed">{c.description}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Watch & Shop — video reels */}
        {isOn("reels") && reels.filter((r) => r.enabled).length > 0 && (
          <section>
            <SectionHeading title="Watch & Shop" subtitle="Tap a reel to explore what's in it" />
            <ReelsSection reels={reels} />
          </section>
        )}

        {/* Customer Stories */}
        {isOn("testimonials") && (
          <section>
            <SectionHeading title="Customer Stories" subtitle="★ 4.8 average · 12,400+ verified reviews" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {liveTestimonials.map((t) => {
                const taggedProduct = t.productSlug ? getProductBySlug(t.productSlug) : undefined;
                return (
                  <div key={t.id} className="rounded-lg border border-beige p-4">
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
                        className="mt-3 pt-3 border-t border-beige flex items-center gap-2 hover:opacity-80 transition-opacity"
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
              {liveTestimonials.length === 0 && (
                <p className="col-span-full text-center text-sm text-ink/40 py-8">No approved testimonials yet.</p>
              )}
            </div>
          </section>
        )}

        {/* Our Promise — trust badges */}
        {isOn("trust-badges") && (
          <section className="grid grid-cols-2 sm:grid-cols-4 gap-6 rounded-xl bg-brand py-10 px-4">
            {trustBadges.filter((b) => b.enabled).map((b) => (
              <div key={b.id} className="flex flex-col items-center text-center gap-2">
                <span className="grid h-12 w-12 place-items-center rounded-full border border-gold/40 text-xl text-gold-light">{b.icon}</span>
                <span className="text-sm font-medium text-gold-light">{b.label}</span>
                <span className="text-xs text-gold-light/50">{b.sub}</span>
              </div>
            ))}
          </section>
        )}
      </div>
    </div>
  );
}
