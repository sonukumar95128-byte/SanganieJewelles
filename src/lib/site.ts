import type { DummyProduct } from "@/lib/dummy-images";

// The live address. Vercel redirects sanganiejewells.com to www, so www is the canonical host.
// Fixed on purpose rather than read from NEXT_PUBLIC_SITE_URL: canonicals, the sitemap and
// structured data must always name the real domain, even from a preview or a stale .env.
export const SITE_URL = "https://www.sanganiejewells.com";
export const SITE_NAME = "Sanganie Jewells";
export const SITE_DESCRIPTION =
  "Shop certified diamond jewellery in hallmarked gold at Sanganie Jewells — rings, earrings, necklaces, mangalsutras, bracelets, pendants and nose pins in rose and yellow gold. Free shipping over ₹999 and easy 15-day returns.";
export const OG_IMAGE = { url: "/og-image.jpg", width: 1200, height: 630, alt: "Sanganie Jewells — certified diamond jewellery" };

export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return SITE_URL + (path.startsWith("/") ? path : `/${path}`);
}

// A page's openGraph replaces the root layout's wholesale, so every page restates the shared fields.
export function openGraphFor(
  path: string,
  { title, description, images }: { title?: string; description?: string; images?: { url: string; alt?: string }[] } = {},
) {
  return {
    type: "website" as const,
    siteName: SITE_NAME,
    locale: "en_IN",
    url: path,
    title,
    description,
    images: images?.length ? images : [OG_IMAGE],
  };
}

// Same for pages that search engines should skip (bag, checkout, sign-in…).
export const NO_INDEX = { index: false, follow: true } as const;

// "Yellow Gold" → "yellow"
export function goldTone(colour: string): string {
  return colour.replace(/\s*gold\s*$/i, "").toLowerCase();
}

function listOf(values: string[]): string {
  if (values.length <= 1) return values.join("");
  return `${values.slice(0, -1).join(", ")} and ${values[values.length - 1]}`;
}

// What a set of products is actually made of, read from the catalogue, for honest page copy.
export function productFacts(products: DummyProduct[]) {
  const attr = (key: string) =>
    [...new Set(products.map((p) => p.attributes?.[key]).filter((v): v is string => !!v))].sort();
  const prices = products.map((p) => Number(p.price.replace(/[^0-9]/g, ""))).filter((n) => n > 0);
  return {
    count: products.length,
    karats: listOf(attr("Gold Karat")),
    colours: listOf(attr("Gold Colour").map(goldTone)), // "rose and yellow"
    certificates: listOf(attr("Lab Certificate")),
    fromPrice: prices.length ? `₹${Math.min(...prices).toLocaleString("en-IN")}` : "",
  };
}
