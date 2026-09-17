import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CategoryListing } from "@/components/CategoryListing";
import {
  categories,
  categoryBannerImages,
  categoryToSlug,
  dummyProducts,
  slugToCategory,
} from "@/lib/dummy-images";
import { absoluteUrl, openGraphFor, productFacts } from "@/lib/site";
import { JsonLd } from "@/components/JsonLd";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Not found — Sanganie Jewells" };

  const facts = productFacts(dummyProducts.filter((p) => p.category === category));
  const noun = category === "Nose Pins" ? "Diamond Nose Pins" : `Diamond ${category}`;
  const title = `${noun} in ${facts.colours.replace(/\b(?!and\b)\w/g, (c) => c.toUpperCase())} Gold | Sanganie Jewells`;
  const description =
    `Shop ${facts.count} ${noun.toLowerCase()} in ${facts.karats} ${facts.colours} gold with ${facts.certificates} certified diamonds` +
    `${facts.fromPrice ? `, from ${facts.fromPrice}` : ""}. Free shipping over ₹999 and easy 15-day returns.`;
  const path = `/jewellery/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: openGraphFor(path, { title, description, images: [{ url: categoryBannerImages[category], alt: noun }] }),
    twitter: { card: "summary_large_image", title, description, images: [categoryBannerImages[category]] },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);

  if (!category) notFound();

  const products = dummyProducts.filter((p) => p.category === category);

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
            { "@type": "ListItem", position: 2, name: "Jewellery", item: absoluteUrl("/jewellery") },
            { "@type": "ListItem", position: 3, name: category, item: absoluteUrl(`/jewellery/${slug}`) },
          ],
        }}
      />
      <CategoryListing
        title={category}
        pageId={slug}
        fallbackBanner={categoryBannerImages[category]}
        products={products}
        activeCategories={[slug]}
      />
    </>
  );
}
