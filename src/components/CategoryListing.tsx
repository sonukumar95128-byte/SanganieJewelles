"use client";

import Image from "next/image";
import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Dropdown } from "@/components/Dropdown";
import { FilterSidebar } from "@/components/FilterSidebar";
import { InfiniteProductGrid } from "@/components/InfiniteProductGrid";
import { getPriceRange, type DummyProduct } from "@/lib/dummy-images";
import { useAdmin } from "@/lib/admin-store";
import { applyFilters, countActive, parseFilters } from "@/lib/product-filters";

type CategoryListingProps = {
  title: string;
  pageId: string;
  fallbackBanner: string;
  products: DummyProduct[];
  activeCategories?: string[];
};

export function CategoryListing(props: CategoryListingProps) {
  return (
    <Suspense fallback={<ListingFallback title={props.title} />}>
      <CategoryListingContent {...props} />
    </Suspense>
  );
}

function ListingFallback({ title }: { title: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
      <h1 className="font-heading italic text-3xl text-brand">{title}</h1>
    </div>
  );
}

function CategoryListingContent({ title, pageId, fallbackBanner, products, activeCategories }: CategoryListingProps) {
  const { pageBanners } = useAdmin();
  const bannerImage = pageBanners[pageId] ?? fallbackBanner;
  const { min, max } = getPriceRange(products);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sort, setSort] = useState("newest");

  const searchParams = useSearchParams();
  const filters = parseFilters((key) => searchParams.get(key));
  const activeCount = countActive(filters);
  const filteredProducts = applyFilters(products, filters);

  const toNum = (p: string) => Number(p.replace(/[^0-9.]/g, ""));
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sort === "price-asc") return toNum(a.price) - toNum(b.price);
    if (sort === "price-desc") return toNum(b.price) - toNum(a.price);
    if (sort === "bestselling") return b.rating - a.rating;
    return 0; // newest = original order
  });

  return (
    <div>
      {/* Banner — the whole 3:2 picture, never cropped. Title sits beside it on desktop, over it on phones. */}
      <section className="bg-brand">
        <div className="relative mx-auto max-w-7xl md:grid md:grid-cols-2 md:items-center">
          <div className="relative aspect-[3/2] md:order-2">
            <Image src={bannerImage} alt={title} fill loading="eager" fetchPriority="high" sizes="(min-width:1280px) 640px, (min-width:768px) 50vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-brand/70 via-brand/25 to-transparent md:hidden" />
          </div>
          <div className="absolute inset-y-0 left-0 flex flex-col justify-center px-5 md:static md:px-12 lg:px-16 md:py-10">
            <p className="hidden md:block text-xs uppercase tracking-[0.3em] text-gold-light">Sanganie Jewells</p>
            <h1 className="font-heading italic text-3xl text-white drop-shadow md:mt-3 md:text-5xl md:drop-shadow-none">{title}</h1>
            <p className="mt-2 text-xs text-white/80 md:mt-4 md:text-sm md:text-white/60">{products.length} pieces</p>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
        {/* Top bar — Filter button (mobile) + Sort */}
        <div className="flex items-center justify-between mb-6">
          {/* Filter button — mobile only */}
          <button
            onClick={() => setFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 rounded-full border border-gold bg-white px-4 py-2 text-sm text-brand hover:bg-gold/10 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4h18M7 12h10M11 20h2" />
            </svg>
            Filters
            {activeCount > 0 && (
              <span className="grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[10px] font-medium text-brand">
                {activeCount}
              </span>
            )}
          </button>
          <span className="hidden text-sm text-ink/50 lg:block">
            {sortedProducts.length} {sortedProducts.length === 1 ? "piece" : "pieces"}
            {activeCount > 0 && products.length !== sortedProducts.length && ` of ${products.length}`}
          </span>
          <Dropdown
            defaultValue="newest"
            options={[
              { value: "newest", label: "Sort: Newest" },
              { value: "price-asc", label: "Price: Low to High" },
              { value: "price-desc", label: "Price: High to Low" },
              { value: "bestselling", label: "Bestselling" },
            ]}
            onChange={setSort}
          />
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start gap-10">
          {/* Desktop sidebar — always visible */}
          <div className="hidden lg:block">
            <FilterSidebar
              priceMin={min}
              priceMax={max}
              products={products}
              activeCategories={activeCategories}
            />
          </div>

          {/* Products */}
          <div className="flex-1">
            {sortedProducts.length === 0 ? (
              <p className="rounded-xl border border-dashed border-beige py-16 text-center text-sm text-ink/50">
                No pieces match these filters. Try widening your price range or clearing a filter.
              </p>
            ) : (
              <InfiniteProductGrid products={sortedProducts} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filterOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/50"
            onClick={() => setFilterOpen(false)}
          />
          {/* Drawer — slides up from bottom */}
          <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-2xl bg-white max-h-[85vh] flex flex-col lg:hidden">
            {/* Drawer header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-beige shrink-0">
              <h2 className="font-heading text-xl text-brand">Filters</h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="text-ink/40 hover:text-brand text-2xl leading-none"
              >
                ✕
              </button>
            </div>
            {/* Scrollable filter content */}
            <div className="overflow-y-auto flex-1 px-5 pb-6">
              <FilterSidebar
                priceMin={min}
                priceMax={max}
                products={products}
                activeCategories={activeCategories}
                mobileMode
              />
            </div>
            {/* Apply button */}
            <div className="px-5 py-4 border-t border-beige shrink-0">
              <button
                onClick={() => setFilterOpen(false)}
                className="w-full rounded-full bg-brand py-3 text-sm font-medium text-gold-light hover:bg-brand-secondary transition-colors"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
