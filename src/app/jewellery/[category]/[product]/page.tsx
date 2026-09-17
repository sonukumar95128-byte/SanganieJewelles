import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { ProductPagePromo } from "@/components/ProductPagePromo";
import { ProductPurchasePanel } from "@/components/ProductPurchasePanel";
import { ProductShareButton } from "@/components/ProductShareButton";
import { ProductTabs } from "@/components/ProductTabs";
import { ProductTags } from "@/components/ProductTags";
import { ProductCustomerStories, ProductTrustBadges } from "@/components/ProductTrustAndStories";
import { RecentlyViewed } from "@/components/RecentlyViewed";
import { TrackRecentlyViewed } from "@/components/TrackRecentlyViewed";
import {
  categoryToSlug,
  dummyProducts,
  getCategoryTags,
  getProductBySlug,
  hoverImageFor,
  slugToCategory,
  priceToNumber,
  styleTags,
  type DummyProduct,
} from "@/lib/dummy-images";
import { JsonLd } from "@/components/JsonLd";
import { absoluteUrl, goldTone, openGraphFor, SITE_NAME } from "@/lib/site";

// Render dynamically on demand — avoids pre-building all 390 product pages during
// deployment, which uses too much memory on Hostinger's server.
export const dynamic = "force-dynamic";

function productDescription(product: DummyProduct): string {
  const a = product.attributes ?? {};
  const gold = [a["Gold Karat"], a["Gold Colour"] && goldTone(a["Gold Colour"]), "gold"].filter(Boolean).join(" ");
  const diamonds = [a["Lab Certificate"] && `${a["Lab Certificate"]} certified`, "diamonds", a["Diamond Clarity"] && `(${a["Diamond Clarity"]})`]
    .filter(Boolean)
    .join(" ");
  const weight = a["Gold Weight"] ? `, ${a["Gold Weight"]} gold` : "";
  return `${product.name}${product.sku ? ` ${product.sku}` : ""} in ${gold} with ${diamonds}${weight}. Price ${product.price}. Free shipping over ₹999 and easy 15-day returns at Sanganie Jewells.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}): Promise<Metadata> {
  const { product: productSlug } = await params;
  const product = getProductBySlug(productSlug);

  if (!product) return { title: "Product not found — Sanganie Jewells" };

  // Many products share a name, so the SKU and karat keep every title unique.
  const karat = product.attributes?.["Gold Karat"];
  const title = [product.sku ? `${product.name} ${product.sku}` : product.name, karat && `${karat} Gold`, "Sanganie Jewells"]
    .filter(Boolean)
    .join(" | ");
  const description = productDescription(product);
  const path = `/jewellery/${categoryToSlug(product.category)}/${product.slug}`;
  const images = [product.image, ...product.gallery.filter((g) => g !== product.image)].slice(0, 4);

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: openGraphFor(path, { title, description, images: images.map((url) => ({ url, alt: product.name })) }),
    twitter: { card: "summary_large_image", title, description, images },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ category: string; product: string }>;
}) {
  const { category: categorySlug, product: productSlug } = await params;

  const category = slugToCategory(categorySlug);
  const product = getProductBySlug(productSlug);

  if (!category || !product || product.category !== category) notFound();

  const gallery = product.gallery.length > 0 ? product.gallery : [product.image];

  const related = dummyProducts.filter((p) => p.category === category && p.slug !== product.slug).slice(0, 4);

  const url = absoluteUrl(`/jewellery/${categorySlug}/${product.slug}`);
  const attrs = product.attributes ?? {};
  // Ratings are left out on purpose: the review counts are placeholder data, not real reviews.
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.sku ? `${product.name} ${product.sku}` : product.name,
      sku: product.sku,
      mpn: product.sku,
      image: gallery.map((src) => absoluteUrl(src)),
      description: productDescription(product),
      category: `Jewellery > ${category}`,
      brand: { "@type": "Brand", name: SITE_NAME },
      material: [attrs["Gold Karat"], attrs["Gold Colour"] ?? "Gold"].filter(Boolean).join(" "),
      color: attrs["Gold Colour"],
      url,
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "INR",
        price: priceToNumber(product.price),
        availability: product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
        seller: { "@type": "Organization", name: SITE_NAME },
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: category, item: absoluteUrl(`/jewellery/${categorySlug}`) },
        { "@type": "ListItem", position: 3, name: product.name, item: url },
      ],
    },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-8">
      <JsonLd data={structuredData} />
      <nav className="text-sm text-ink/50 mb-6">
        <Link href="/" className="hover:text-gold">
          Home
        </Link>{" "}
        / <Link href={`/jewellery/${categorySlug}`} className="hover:text-gold">
          {category}
        </Link>{" "}
        / <span className="text-ink/70">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <ProductGallery images={gallery} alt={product.name} />

        <div>
          <div className="flex items-start justify-between gap-3 mb-1">
            <p className="text-xs text-ink/40">SKU: {product.sku ?? product.slug.toUpperCase().replace(/-/g, "").slice(0, 12)}</p>
            <ProductShareButton name={product.name} />
          </div>
          <h1 className="font-heading italic text-3xl sm:text-4xl text-brand mb-2">{product.name}</h1>
          <ProductPurchasePanel
            slug={product.slug}
            name={product.name}
            price={product.price}
            originalPrice={product.originalPrice}
            rating={product.rating}
            reviewCount={product.reviewCount}
            category={category}
          />
        </div>
      </div>

      <div className="mt-12">
        <ProductTabs
          productSlug={product.slug}
          description={product.description}
          rating={product.rating}
          reviewCount={product.reviewCount}
          attributes={product.attributes}
        />
        <ProductTags categoryTags={getCategoryTags(category)} tags={styleTags} />
      </div>

      <TrackRecentlyViewed slug={product.slug} />
      <ProductPagePromo />

      <RecentlyViewed excludeSlug={product.slug} />

      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="font-heading italic text-2xl text-brand mb-5">You may also like</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-10">
            {related.map((p) => (
              <ProductCard
                key={p.slug}
                slug={p.slug}
                image={p.image}
                hoverImage={hoverImageFor(p)}
                name={p.name}
                price={p.price}
                href={`/jewellery/${categoryToSlug(p.category)}/${p.slug}`}
              />
            ))}
          </div>
        </div>
      )}

      <ProductCustomerStories productSlug={product.slug} />
      <ProductTrustBadges />
    </div>
  );
}
