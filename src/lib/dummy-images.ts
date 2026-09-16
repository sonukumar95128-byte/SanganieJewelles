// Marketing banners live in public/banners, each built from a real catalog piece.
// Real catalog product data/photos are generated from the CSV export — see src/lib/real-products.ts.
import { realProducts } from "@/lib/real-products";

// Homepage category circles: square crops of each category banner, centred on its jewellery.
export const categoryImages: Record<string, string> = {
  Rings: "/banners/full/circle-rings.webp",
  Earrings: "/banners/full/circle-earrings.webp",
  Necklaces: "/banners/full/circle-necklaces.webp",
  Bracelets: "/banners/full/circle-bracelets.webp",
  Pendants: "/banners/full/circle-pendants.webp",
  "Nose Pins": "/banners/full/circle-nosepins.webp",
};


export const categoryBannerImages: Record<string, string> = {
  Rings: "/banners/full/cat-rings.webp",
  Earrings: "/banners/full/cat-earrings.webp",
  Necklaces: "/banners/full/cat-necklaces.webp",
  Bracelets: "/banners/full/cat-bracelets.webp",
  Pendants: "/banners/full/cat-pendants.webp",
  "Nose Pins": "/banners/full/cat-nosepins.webp",
};

// Shop, category and collection pages show their banner as a slim 16:4 strip. This is how far down
// (0 = top, 100 = bottom) to anchor each picture so its jewellery stays inside the strip.
// The desktop hero shows its banners in a 19:10 frame (79% of the height), anchored the same way.
export const bannerFocus: Record<string, number> = {
  "/banners/full/hero-1-desktop.webp": 57,
  "/banners/full/hero-2-desktop.webp": 45,
  "/banners/full/hero-3-desktop.webp": 88,
  "/banners/full/hero-4-desktop.webp": 76,
  "/banners/full/cat-shop.webp": 52,
  "/banners/full/cat-rings.webp": 40,
  "/banners/full/cat-earrings.webp": 48,
  "/banners/full/cat-necklaces.webp": 50,
  "/banners/full/cat-bracelets.webp": 40,
  "/banners/full/cat-pendants.webp": 40,
  "/banners/full/cat-nosepins.webp": 56,
  "/banners/full/collection-bridal.webp": 60,
  "/banners/full/collection-everyday-light.webp": 71,
  "/banners/full/collection-gifting.webp": 69,
};

export const heroImage = "/banners/full/hero-1-desktop.webp";

// Banners ship uncropped at ChatGPT's own sizes: 1536×1024 (3:2), and 1024×1536 (2:3) for phones.
// Headlines are drawn into the hero images, so each slide has a separate portrait version for phones.
export const heroSlides: { image: string; mobileImage?: string; href: string; alt: string }[] = [
  {
    image: "/banners/full/hero-1-desktop.webp",
    mobileImage: "/banners/full/hero-1-mobile.webp",
    href: "/jewellery/pendants",
    alt: "Elegance in every hue — pendant collection",
  },
  {
    image: "/banners/full/hero-2-desktop.webp",
    mobileImage: "/banners/full/hero-2-mobile.webp",
    href: "/jewellery/earrings",
    alt: "Grace in every detail — earring collection",
  },
  {
    image: "/banners/full/hero-3-desktop.webp",
    mobileImage: "/banners/full/hero-3-mobile.webp",
    href: "/jewellery/necklaces",
    alt: "Timeless grace — mangalsutra collection",
  },
  {
    image: "/banners/full/hero-4-desktop.webp",
    mobileImage: "/banners/full/hero-4-mobile.webp",
    href: "/jewellery",
    alt: "Every piece certified — hallmarked gold and certified diamonds",
  },
];

export const promoImage = "/banners/full/cat-shop.webp";

// "Watch & Shop" stand-ins until real reel videos are uploaded: each slowly pans across a
// scene banner and tags the catalog piece shown in it.
export const reelDefaults: { id: string; title: string; image: string; productSlug: string }[] = [
  { id: "reel-1", title: "Everyday light necklace", image: "/banners/full/collection-everyday-light.webp", productSlug: "rose-gold-diamond-necklace-ans00182" },
  { id: "reel-2", title: "Emerald bow ring", image: "/banners/full/promo-3.webp", productSlug: "rose-gold-diamond-ring-alr00809" },
  { id: "reel-3", title: "Rose gold hoops", image: "/banners/full/product-page.webp", productSlug: "rose-gold-diamond-earrings-aps00275e" },
  { id: "reel-4", title: "Heart studs", image: "/banners/full/cat-earrings.webp", productSlug: "yellow-gold-diamond-earrings-aps00332e" },
  { id: "reel-5", title: "Diamond nose pin", image: "/banners/full/cat-nosepins.webp", productSlug: "yellow-gold-diamond-nose-pin-anp00063" },
];

export const collectionImages: Record<string, string> = {
  Bridal: "/banners/full/collection-bridal.webp",
  "Everyday Light": "/banners/full/collection-everyday-light.webp",
  Gifting: "/banners/full/collection-gifting.webp",
};

// Homepage offer slider and the product-page strip. The site prints each title over the image.
export const promoBanners = {
  homepage: [
    { id: "promo-slide-1", title: "New Collection — Explore Now", link: "/jewellery/necklaces", image: "/banners/full/promo-1.webp" },
    { id: "promo-slide-2", title: "Festive Sale — Flat 20% Off", link: "/jewellery/pendants", image: "/banners/full/promo-2.webp" },
    { id: "promo-slide-3", title: "Buy 2, Get Free Gold Polish", link: "/jewellery/rings", image: "/banners/full/promo-3.webp" },
  ],
  productPage: { id: "product-page", title: "Buy 2, get free gold polish", link: "/jewellery", image: "/banners/full/product-page.webp" },
};

export const productImages = [
  "https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1611652022419-a9419f74343d?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=500&h=500&fit=crop",
  "https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=500&h=500&fit=crop",
];

export type DummyTestimonial = {
  name: string;
  rating: number;
  text: string;
  avatar: string;
  verified: boolean;
  productSlug?: string;
};

export const dummyTestimonials: DummyTestimonial[] = [
  {
    name: "Aarohi Mehta",
    rating: 5,
    text: "The ring exceeded my expectations — the craftsmanship is stunning and it arrived beautifully packaged. Customer service was wonderful throughout.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop",
    verified: true,
    productSlug: "rose-gold-diamond-ring-alr00390",
  },
  {
    name: "Priya Nair",
    rating: 4,
    text: "Gorgeous earrings, exactly like the pictures. Delivery was quick and the 15-day return policy gave me peace of mind.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop",
    verified: true,
    productSlug: "rose-gold-diamond-earrings-aps00217e",
  },
  {
    name: "Kavya Reddy",
    rating: 5,
    text: "Bought this necklace for my anniversary and it's even more beautiful in person. The hallmark certification made me trust the purchase completely.",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&h=80&fit=crop",
    verified: true,
    productSlug: "yellow-gold-diamond-necklace-ams00143",
  },
];

export const categories = ["Rings", "Earrings", "Necklaces", "Bracelets", "Pendants", "Nose Pins"] as const;
export type Category = (typeof categories)[number];

export function categoryToSlug(category: string): string {
  return category.toLowerCase().replace(/\s+/g, "-");
}

export function slugToCategory(slug: string): Category | undefined {
  return categories.find((c) => categoryToSlug(c) === slug);
}

// "Shop by Price" homepage bands — tuned to the real catalog's price spread (₹6.5k–₹67k).
export type PriceBand = {
  label: string;
  kicker: string; // small line above the amount on the price tile
  amount: string;
  minPrice: number;
  maxPrice?: number;
};

export const priceBands: PriceBand[] = [
  { label: "Under ₹15,000", kicker: "Under", amount: "₹15,000", minPrice: 0, maxPrice: 15000 },
  { label: "₹15,000 – ₹25,000", kicker: "₹15,000 to", amount: "₹25,000", minPrice: 15000, maxPrice: 25000 },
  { label: "₹25,000 – ₹40,000", kicker: "₹25,000 to", amount: "₹40,000", minPrice: 25000, maxPrice: 40000 },
  { label: "Above ₹40,000", kicker: "Above", amount: "₹40,000", minPrice: 40000 },
];

// "Shop by Relation" homepage cards — links reuse the existing /jewellery?category=slug1,slug2 filter.
export type RelationShop = {
  label: string;
  categories: Category[];
  image: string;
};

export const relationShops: RelationShop[] = [
  { label: "Mother", categories: ["Necklaces", "Pendants"], image: "/banners/full/relation-mother.webp" },
  { label: "Sister", categories: ["Earrings", "Bracelets"], image: "/banners/full/relation-sister.webp" },
  { label: "Wife", categories: ["Rings", "Necklaces"], image: "/banners/full/relation-wife.webp" },
  { label: "Friend", categories: ["Pendants", "Earrings"], image: "/banners/full/relation-friend.webp" },
  { label: "Daughter", categories: ["Nose Pins", "Rings"], image: "/banners/full/relation-daughter.webp" },
];

export type DummyProduct = {
  sku?: string;
  name: string;
  slug: string;
  price: string;
  originalPrice?: string;
  image: string;
  gallery: string[];
  hoverImage?: string;
  category: Category;
  stock: number;
  rating: number;
  reviewCount: number;
  description: string;
  attributes?: Record<string, string>;
};

export function slugify(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export const dummyProducts: DummyProduct[] = realProducts.map((p) => ({
  sku: p.sku,
  name: p.name,
  slug: p.slug,
  price: p.price,
  originalPrice: p.originalPrice,
  image: p.image,
  gallery: p.gallery,
  hoverImage: p.hoverImage,
  category: p.category,
  stock: p.stock,
  rating: p.rating,
  reviewCount: p.reviewCount,
  description: p.description,
  attributes: p.attributes,
}));

// The photo a product card switches to on hover: the on-model shot when there is one, otherwise the last photo.
export function hoverImageFor(p: { hoverImage?: string; gallery?: string[] }): string | undefined {
  if (p.hoverImage) return p.hoverImage;
  return p.gallery && p.gallery.length > 1 ? p.gallery[p.gallery.length - 1] : undefined;
}

// Spreads each category evenly through the list (keeping each category's own order), so neighbouring
// cards come from different categories instead of 146 rings in a row.
export function mixByCategory<T extends { category: string }>(items: T[]): T[] {
  const totals = new Map<string, number>();
  for (const item of items) totals.set(item.category, (totals.get(item.category) ?? 0) + 1);
  const seen = new Map<string, number>();
  return items
    .map((item, index) => {
      const n = seen.get(item.category) ?? 0;
      seen.set(item.category, n + 1);
      return { item, index, key: (n + 0.5) / totals.get(item.category)! };
    })
    .sort((a, b) => a.key - b.key || a.index - b.index)
    .map((entry) => entry.item);
}

// Takes one piece from each category in turn (in `ranked` order within a category), preferring pieces
// with an on-model photo so the homepage cards have something to show on hover.
function pickAcrossCategories(ranked: DummyProduct[], count: number, exclude: string[] = []): string[] {
  const pool = ranked.filter((p) => !exclude.includes(p.slug));
  const queues = categories.map((c) => {
    const inCategory = pool.filter((p) => p.category === c);
    return [...inCategory.filter((p) => p.hoverImage), ...inCategory.filter((p) => !p.hoverImage)];
  });
  const picked: string[] = [];
  for (let round = 0; picked.length < count && queues.some((q) => q.length > round); round++) {
    for (const queue of queues) {
      if (picked.length < count && queue[round]) picked.push(queue[round].slug);
    }
  }
  return picked;
}

// Homepage defaults: New Arrivals are the most recently added pieces, Best Sellers the most reviewed.
// Both show every category and never repeat each other.
export const newArrivalSlugs: string[] = pickAcrossCategories([...dummyProducts].reverse(), 8);

export const bestSellerSlugs: string[] = pickAcrossCategories(
  [...dummyProducts].sort((a, b) => b.rating * b.reviewCount - a.rating * a.reviewCount),
  8,
  newArrivalSlugs,
);

export function getProductBySlug(slug: string): DummyProduct | undefined {
  return dummyProducts.find((p) => p.slug === slug);
}

export const metalOptions = ["Gold 14k", "Rose 14k", "Silver"];

// Variant selectors for the product detail page
export const colorOptions: { label: string; swatch: string }[] = [
  { label: "Rose", swatch: "#e6b8a2" },
  { label: "White", swatch: "#d9d9d9" },
  { label: "Yellow", swatch: "#d4a24c" },
];

export const purityOptions = ["9kt Gold", "14kt Gold", "18kt Gold"];

export function getSizeOptions(category: Category): string[] {
  switch (category) {
    case "Rings":
      return ["6", "7", "8", "9", "10", "11", "12"];
    case "Bracelets":
      return ["S", "M", "L"];
    case "Necklaces":
    case "Pendants":
      return ["16in", "18in", "20in"];
    default:
      return [];
  }
}

export type PriceBreakup = {
  gold: number;
  diamond: number;
  otherStones: number;
  making: number;
  gst: number;
  total: number;
};

export function getPriceBreakup(price: string): PriceBreakup {
  const total = priceToNumber(price);
  const gold = Math.round(total * 0.62);
  const diamond = Math.round(total * 0.27);
  const otherStones = Math.round(total * 0.02);
  const making = Math.round(total * 0.06);
  const gst = total - gold - diamond - otherStones - making;
  return { gold, diamond, otherStones, making, gst, total };
}

export type Coupon = { code: string; discountInPaise: number; label: string };

export function getCoupons(price: string): Coupon[] {
  const total = priceToNumber(price);
  return [
    { code: "JB50", discountInPaise: Math.round(total * 0.08), label: "Flat 8% off on prepaid orders" },
    { code: "DAZZLING20", discountInPaise: Math.round(total * 0.05), label: "Flat 5% off, no minimum order value" },
  ];
}

export function getCategoryTags(category: Category): string[] {
  const base: Record<Category, string[]> = {
    Rings: ["Everyday Rings", "Band Rings", "Rings"],
    Earrings: ["Stud Earrings", "Drop Earrings", "Earrings"],
    Necklaces: ["Layered Necklaces", "Chokers", "Necklaces"],
    Bracelets: ["Bangles", "Tennis Bracelets", "Bracelets"],
    Pendants: ["Solitaire Pendants", "Fashion Pendants", "Pendants"],
    "Nose Pins": ["Screw Nose Pins", "Press Nose Pins", "Nose Pins"],
  };
  return base[category];
}

export const styleTags = [
  "Women",
  "Desk to Dinner",
  "Everyday wear",
  "Work wear",
  "Evening wear",
  "Party wear",
  "Gifting",
  "Bestsellers",
  "Designer",
  "Everyday Classic",
];

export function priceToNumber(price: string): number {
  return Number(price.replace(/[^0-9]/g, ""));
}

export function formatRupee(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}

export function getPriceRange(products: DummyProduct[]): { min: number; max: number } {
  if (products.length === 0) return { min: 0, max: 0 };
  const values = products.map((p) => priceToNumber(p.price));
  return { min: Math.min(...values), max: Math.max(...values) };
}
