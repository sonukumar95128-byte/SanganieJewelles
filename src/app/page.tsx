export const dynamic = "force-dynamic";

import Image from "next/image";
import Link from "next/link";
import { getPrisma } from "@/lib/prisma";
import { CuratedProductGrid } from "@/components/CuratedProductGrid";
import { CustomerStoryGrid, pickTestimonials } from "@/components/CustomerStories";
import { HeroSlider } from "@/components/HeroSlider";
import { PriceTiles } from "@/components/PriceTiles";
import { PromoSlider } from "@/components/PromoSlider";
import { SectionHeading } from "@/components/SectionHeading";
import { ReelsSection } from "@/components/ReelsSection";
import { ScrollReveal } from "@/components/ScrollReveal";
import { SectionBand } from "@/components/SectionBand";
import { TrustBadgeGrid } from "@/components/TrustBadges";
import {
  categories,
  categoryImages as defaultCategoryImages,
  categoryToSlug,
  dummyTestimonials,
  heroSlides,
  collectionImages,
  promoBanners,
  priceBands,
  bannerFocus,
  newArrivalSlugs,
  bestSellerSlugs,
  reelDefaults,
  relationShops,
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
  mobileImage: s.mobileImage,
  enabled: true,
}));

const defaultPromoStrips: PromoStrip[] = promoBanners.homepage.map((p) => ({
  ...p,
  position: "Homepage slider",
  enabled: true,
}));

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

const defaultReels: AdminReel[] = reelDefaults.map((r) => ({
  id: r.id,
  title: r.title,
  videoUrl: "",
  thumbnail: r.image,
  enabled: true,
  format: "portrait",
  productSlug: r.productSlug,
}));

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
  const reels: AdminReel[] = (db.reels as AdminReel[]) ?? defaultReels;
  const trustBadges: TrustBadge[] = (db.trustBadges as TrustBadge[]) ?? defaultTrustBadges;
  const catImages: Record<string, string> = (db.categoryImages as Record<string, string>) ?? {};
  const newArrivalsSlugs: string[] = (db.newArrivals as string[]) ?? newArrivalSlugs;
  const bestSellersSlugs: string[] = (db.bestSellers as string[]) ?? bestSellerSlugs;

  // Derived
  const liveHeroSlides = heroSlidesAdmin
    .filter((s) => s.enabled)
    .map((s) => ({ image: s.image, mobileImage: s.mobileImage, href: s.link, alt: s.title, focus: bannerFocus[s.image] }));

  const homeSlides = promoStrips.filter((p) => p.position === "Homepage slider" && p.enabled !== false);
  const liveCollections = collections.filter((c) => c.enabled);
  const liveTestimonials = pickTestimonials(testimonials);

  return (
    <div className="space-y-16 pb-16">
      <ScrollReveal />
      {/* Hero — full bleed slider */}
      {isOn("hero") && <HeroSlider slides={liveHeroSlides} />}

      {/* Category circles — gradient band, each circle in a frosted glass ring */}
      {isOn("categories") && (
        <SectionBand>
          <section className="overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory py-3">
            <div data-reveal-stagger="right" className="flex gap-6 sm:gap-10 mx-auto w-fit px-2">
              {categories.map((c) => (
                <Link key={c} href={`/jewellery/${categoryToSlug(c)}`} className="flex flex-col items-center gap-3 group shrink-0 snap-center">
                  <div className="rounded-full border border-white/70 bg-white/40 p-1.5 shadow-[0_8px_24px_rgba(18,60,48,0.12)] backdrop-blur-md transition-all duration-500 ease-apple group-hover:border-gold/70 group-hover:shadow-[0_10px_30px_rgba(201,162,39,0.28)]">
                    <div className="relative h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full overflow-hidden">
                      <Image
                        src={catImages[c] || defaultCategoryImages[c] || ""}
                        alt={c}
                        fill
                        sizes="(min-width:1024px) 144px, (min-width:640px) 128px, 96px"
                        className="object-cover"
                      />
                    </div>
                  </div>
                  <span className="text-sm sm:text-base text-ink/80">{c}</span>
                </Link>
              ))}
            </div>
          </section>
        </SectionBand>
      )}

      {/* Best Sellers */}
      {isOn("best-sellers") && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div data-reveal>
            <SectionHeading title="Best Sellers" subtitle="Loved and worn by thousands of customers" viewAllHref="/jewellery?sort=bestselling" />
          </div>
          <CuratedProductGrid slugs={bestSellersSlugs} badge="Bestseller" />
        </section>
      )}

      {/* Shop by Price — background runs full width */}
      {isOn("shop-by-price") && <PriceTiles bands={priceBands} />}

      {/* New Arrivals */}
      {isOn("new-arrivals") && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div data-reveal>
            <SectionHeading title="New Arrivals" subtitle="Freshly crafted pieces, added every week" viewAllHref="/jewellery?sort=newest" />
          </div>
          <CuratedProductGrid slugs={newArrivalsSlugs} />
        </section>
      )}

      {/* Shop by Relation — gradient band, frosted glass rings */}
      {isOn("shop-by-relation") && (
        <SectionBand>
          <section>
            <div data-reveal>
              <SectionHeading title="Shop by Relation" subtitle="Gifts for everyone you cherish" />
            </div>
            <div className="overflow-x-auto [&::-webkit-scrollbar]:hidden scroll-smooth snap-x snap-mandatory py-3">
              <div data-reveal-stagger="right" className="flex gap-6 sm:gap-10 mx-auto w-fit px-2">
                {relationShops.map((r) => (
                  <Link
                    key={r.label}
                    href={`/jewellery?category=${r.categories.map(categoryToSlug).join(",")}`}
                    className="flex flex-col items-center gap-3 group shrink-0 snap-center"
                  >
                    <div className="rounded-full border border-white/70 bg-white/40 p-1.5 shadow-[0_8px_24px_rgba(18,60,48,0.12)] backdrop-blur-md transition-all duration-500 ease-apple group-hover:border-gold/70 group-hover:shadow-[0_10px_30px_rgba(201,162,39,0.28)]">
                      <div className="relative h-24 w-24 sm:h-32 sm:w-32 rounded-full overflow-hidden">
                        <Image src={r.image} alt={r.label} fill sizes="(min-width:640px) 128px, 96px" className="object-cover" />
                      </div>
                    </div>
                    <span className="text-sm sm:text-base text-ink/80">{r.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        </SectionBand>
      )}

      {/* Promo slider — full bleed */}
      {isOn("offer-banner") && (
        <div data-reveal>
          <PromoSlider slides={homeSlides} />
        </div>
      )}

      {/* Trending Now — shop by collection */}
      {isOn("collections") && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6">
          <div data-reveal>
            <SectionHeading title="Trending Now" subtitle="Curated edits for every occasion" viewAllHref="/collections" viewAllLabel="All collections" />
          </div>
          <div data-reveal-stagger className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {liveCollections.map((c) => (
              <Link key={c.id} href={`/collections/${c.slug}`} className="group">
                <div className="relative aspect-[3/2] rounded-lg overflow-hidden">
                  <Image
                    src={c.image}
                    alt={c.title}
                    fill
                    sizes="33vw"
                    className="object-cover transition-transform duration-700 ease-apple group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-heading italic text-xl text-brand">{c.title}</p>
                {c.description && <p className="mt-1 text-sm text-ink/60 leading-relaxed">{c.description}</p>}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Watch & Shop — video reels on the deep green band */}
      {isOn("reels") && reels.filter((r) => r.enabled).length > 0 && (
        <SectionBand tone="green">
          <section>
            <div data-reveal>
              <SectionHeading title="Watch & Shop" subtitle="Tap a reel to explore what's in it" tone="light" />
            </div>
            <div data-reveal="zoom">
              <ReelsSection reels={reels} onDark />
            </div>
          </section>
        </SectionBand>
      )}

      {/* Customer Stories — gradient band, frosted glass cards */}
      {isOn("testimonials") && (
        <SectionBand>
          <section>
            <div data-reveal>
              <SectionHeading title="Customer Stories" subtitle="★ 4.8 average · 12,400+ verified reviews" />
            </div>
            <CustomerStoryGrid testimonials={liveTestimonials} revealStagger glass />
          </section>
        </SectionBand>
      )}

      {/* Our Promise — trust badges */}
      {isOn("trust-badges") && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <TrustBadgeGrid badges={trustBadges} revealStagger />
        </div>
      )}
    </div>
  );
}
