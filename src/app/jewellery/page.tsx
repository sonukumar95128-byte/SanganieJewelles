import { CategoryListing } from "@/components/CategoryListing";
import { dummyProducts, priceToNumber, promoImage, slugToCategory } from "@/lib/dummy-images";

const SHOP_FALLBACK = promoImage;

export default async function JewelleryPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; minPrice?: string; maxPrice?: string }>;
}) {
  const { category, minPrice, maxPrice } = await searchParams;
  const selectedSlugs = category ? category.split(",").filter(Boolean) : [];
  const selectedCategories = selectedSlugs.map(slugToCategory).filter((c): c is NonNullable<typeof c> => !!c);
  const min = minPrice ? Number(minPrice) : undefined;
  const max = maxPrice ? Number(maxPrice) : undefined;

  let products = selectedCategories.length
    ? dummyProducts.filter((p) => selectedCategories.includes(p.category))
    : dummyProducts;

  if (min !== undefined || max !== undefined) {
    products = products.filter((p) => {
      const price = priceToNumber(p.price);
      return (min === undefined || price >= min) && (max === undefined || price <= max);
    });
  }

  const title =
    selectedCategories.length > 0 ? selectedCategories.join(" + ") : "The Full Collection";

  return (
    <CategoryListing
      title={title}
      pageId="shop"
      fallbackBanner={SHOP_FALLBACK}
      products={products}
      activeCategories={selectedSlugs}
    />
  );
}
