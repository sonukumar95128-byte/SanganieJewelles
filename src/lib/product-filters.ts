import { priceToNumber, type DummyProduct } from "@/lib/dummy-images";

// Facets are derived from the catalog rather than hardcoded, so every option
// shown returns at least one product and the list stays right as stock changes.
export const FACETS = [
  { param: "colour", label: "Gold colour", attribute: "Gold Colour" },
  { param: "karat", label: "Gold karat", attribute: "Gold Karat" },
  { param: "dcolour", label: "Diamond colour", attribute: "Diamond Colour" },
  { param: "dclarity", label: "Diamond clarity", attribute: "Diamond Clarity" },
  { param: "cert", label: "Certification", attribute: "Lab Certificate" },
] as const;

export type FacetParam = (typeof FACETS)[number]["param"];

export type ProductFilters = {
  minPrice?: number;
  maxPrice?: number;
  inStockOnly: boolean;
  values: Record<FacetParam, string[]>;
};

export const EMPTY_FILTERS: ProductFilters = {
  inStockOnly: false,
  values: { colour: [], karat: [], dcolour: [], dclarity: [], cert: [] },
};

export function parseFilters(get: (key: string) => string | null): ProductFilters {
  const num = (key: string) => {
    const raw = get(key);
    if (!raw) return undefined;
    const n = Number(raw);
    return Number.isFinite(n) ? n : undefined;
  };
  const list = (key: string) => (get(key) ?? "").split(",").filter(Boolean);

  return {
    minPrice: num("minPrice"),
    maxPrice: num("maxPrice"),
    inStockOnly: get("instock") === "1",
    values: {
      colour: list("colour"),
      karat: list("karat"),
      dcolour: list("dcolour"),
      dclarity: list("dclarity"),
      cert: list("cert"),
    },
  };
}

export function countActive(filters: ProductFilters): number {
  const facetCount = Object.values(filters.values).reduce((n, v) => n + v.length, 0);
  const priceCount = filters.minPrice !== undefined || filters.maxPrice !== undefined ? 1 : 0;
  return facetCount + priceCount + (filters.inStockOnly ? 1 : 0);
}

export function applyFilters(products: DummyProduct[], filters: ProductFilters): DummyProduct[] {
  return products.filter((p) => {
    const price = priceToNumber(p.price);
    if (filters.minPrice !== undefined && price < filters.minPrice) return false;
    if (filters.maxPrice !== undefined && price > filters.maxPrice) return false;
    if (filters.inStockOnly && p.stock <= 0) return false;

    for (const facet of FACETS) {
      const selected = filters.values[facet.param];
      if (selected.length === 0) continue;
      const value = p.attributes?.[facet.attribute];
      if (!value || !selected.includes(value)) return false;
    }
    return true;
  });
}

export type FacetOption = { value: string; count: number };

/**
 * Options for one facet, counted against the products that pass every *other*
 * filter — so ticking "Rose Gold" doesn't collapse the gold-colour list itself.
 */
export function facetOptions(
  products: DummyProduct[],
  filters: ProductFilters,
  param: FacetParam
): FacetOption[] {
  const facet = FACETS.find((f) => f.param === param);
  if (!facet) return [];

  const others: ProductFilters = { ...filters, values: { ...filters.values, [param]: [] } };
  const pool = applyFilters(products, others);

  const counts = new Map<string, number>();
  for (const p of pool) {
    const value = p.attributes?.[facet.attribute];
    if (value) counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return [...counts.entries()]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => b.count - a.count || a.value.localeCompare(b.value));
}
