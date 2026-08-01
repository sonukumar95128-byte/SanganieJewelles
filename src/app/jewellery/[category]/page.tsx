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

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = slugToCategory(slug);
  if (!category) return { title: "Not found — Sanganie Jewells" };

  return {
    title: `${category} | Sanganie Jewells`,
    description: `Shop fine ${category.toLowerCase()} — hallmarked gold and certified diamonds, handcrafted by Sanganie Jewells.`,
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const category = slugToCategory(slug);

  if (!category) notFound();

  const products = dummyProducts.filter((p) => p.category === category);

  return (
    <CategoryListing
      title={category}
      pageId={slug}
      fallbackBanner={categoryBannerImages[category]}
      products={products}
      activeCategories={[slug]}
    />
  );
}
