"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { DualRangeSlider } from "@/components/DualRangeSlider";
import { categories, categoryToSlug, type DummyProduct } from "@/lib/dummy-images";
import {
  FACETS,
  countActive,
  facetOptions,
  parseFilters,
  type FacetParam,
} from "@/lib/product-filters";

type FilterSectionProps = {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
};

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-beige py-3 last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="flex w-full items-center justify-between text-sm font-medium text-brand"
      >
        {title}
        <span className="text-ink/40">{open ? "▾" : "▸"}</span>
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function Checkbox({
  label,
  count,
  checked,
  onChange,
}: {
  label: string;
  count?: number;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-sm text-ink/70">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 rounded border-beige accent-gold focus:ring-1 focus:ring-gold"
      />
      <span className="flex-1">{label}</span>
      {count !== undefined && <span className="text-xs text-ink/35">{count}</span>}
    </label>
  );
}

type FilterSidebarProps = {
  priceMin: number;
  priceMax: number;
  /** Everything in scope before filtering — facet options are counted from this. */
  products: DummyProduct[];
  activeCategories?: string[];
  mobileMode?: boolean; // inside drawer — hide heading, remove sticky/border styles
};

export function FilterSidebar({
  priceMin,
  priceMax,
  products,
  activeCategories = [],
  mobileMode = false,
}: FilterSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const filters = parseFilters((key) => searchParams.get(key));
  const activeCount = countActive(filters);

  const commit = (next: URLSearchParams) => {
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  const toggleFacetValue = (param: FacetParam, value: string) => {
    const next = new URLSearchParams(searchParams.toString());
    const current = filters.values[param];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    if (updated.length) next.set(param, updated.join(","));
    else next.delete(param);
    commit(next);
  };

  const setPriceRange = ([low, high]: [number, number]) => {
    const next = new URLSearchParams(searchParams.toString());
    if (low > priceMin) next.set("minPrice", String(low));
    else next.delete("minPrice");
    if (high < priceMax) next.set("maxPrice", String(high));
    else next.delete("maxPrice");
    commit(next);
  };

  const toggleInStock = () => {
    const next = new URLSearchParams(searchParams.toString());
    if (filters.inStockOnly) next.delete("instock");
    else next.set("instock", "1");
    commit(next);
  };

  const clearAll = () => {
    const next = new URLSearchParams(searchParams.toString());
    ["minPrice", "maxPrice", "instock", ...FACETS.map((f) => f.param)].forEach((k) => next.delete(k));
    commit(next);
  };

  const toggleCategory = (slug: string) => {
    const nextCategories = activeCategories.includes(slug)
      ? activeCategories.filter((s) => s !== slug)
      : [...activeCategories, slug];

    // Category changes the route; carry the other filters across with it.
    const params = new URLSearchParams(searchParams.toString());
    params.delete("category");
    const rest = params.toString();
    const suffix = rest ? `?${rest}` : "";

    if (nextCategories.length === 0) router.push(`/jewellery${suffix}`);
    else if (nextCategories.length === 1) router.push(`/jewellery/${nextCategories[0]}${suffix}`);
    else
      router.push(
        `/jewellery?category=${nextCategories.join(",")}${rest ? `&${rest}` : ""}`
      );
  };

  const inStockCount = products.filter((p) => p.stock > 0).length;

  return (
    <aside
      className={
        mobileMode
          ? "w-full"
          : "w-64 shrink-0 rounded-xl border border-beige p-5 sticky top-20 self-start max-h-[calc(100vh-6rem)] overflow-y-auto [scrollbar-width:thin] [scrollbar-color:var(--color-beige)_transparent] [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:bg-beige [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-transparent"
      }
    >
      <div className={"flex items-center justify-between " + (mobileMode ? "mb-1" : "mb-4")}>
        {!mobileMode && <h3 className="font-heading text-xl text-brand">Filters</h3>}
        {activeCount > 0 && (
          <button onClick={clearAll} className="text-xs text-gold hover:text-brand">
            Clear all ({activeCount})
          </button>
        )}
      </div>

      <FilterSection title="Category">
        {categories.map((c) => {
          const slug = categoryToSlug(c);
          return (
            <Checkbox
              key={c}
              label={c}
              checked={activeCategories.includes(slug)}
              onChange={() => toggleCategory(slug)}
            />
          );
        })}
      </FilterSection>

      {priceMax > priceMin && (
        <FilterSection title="Price">
          <DualRangeSlider
            min={priceMin}
            max={priceMax}
            step={100}
            value={[filters.minPrice ?? priceMin, filters.maxPrice ?? priceMax]}
            onCommit={setPriceRange}
          />
        </FilterSection>
      )}

      {FACETS.map((facet) => {
        const options = facetOptions(products, filters, facet.param);
        if (options.length < 2) return null; // a single option filters nothing
        return (
          <FilterSection key={facet.param} title={facet.label}>
            {options.map((o) => (
              <Checkbox
                key={o.value}
                label={o.value}
                count={o.count}
                checked={filters.values[facet.param].includes(o.value)}
                onChange={() => toggleFacetValue(facet.param, o.value)}
              />
            ))}
          </FilterSection>
        );
      })}

      <FilterSection title="Availability" defaultOpen={false}>
        <Checkbox
          label="In stock only"
          count={inStockCount}
          checked={filters.inStockOnly}
          onChange={toggleInStock}
        />
      </FilterSection>
    </aside>
  );
}
