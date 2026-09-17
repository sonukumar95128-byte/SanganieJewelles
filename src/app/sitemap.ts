import type { MetadataRoute } from "next";
import { categories, categoryToSlug, dummyProducts } from "@/lib/dummy-images";
import { absoluteUrl } from "@/lib/site";

type Entry = MetadataRoute.Sitemap[number];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const page = (path: string, priority: number, changeFrequency: Entry["changeFrequency"]): Entry => ({
    url: absoluteUrl(path),
    lastModified,
    changeFrequency,
    priority,
  });

  const staticPages = [
    page("/", 1, "daily"),
    page("/jewellery", 0.9, "daily"),
    page("/collections", 0.7, "weekly"),
    page("/collections/bridal", 0.7, "weekly"),
    page("/collections/everyday-light", 0.7, "weekly"),
    page("/collections/gifting", 0.7, "weekly"),
    page("/about", 0.5, "monthly"),
    page("/store-locator", 0.4, "monthly"),
    page("/help/contact", 0.4, "monthly"),
    page("/help/shipping-returns", 0.3, "yearly"),
    page("/help/size-guide", 0.4, "yearly"),
    page("/help/care-warranty", 0.3, "yearly"),
    page("/privacy", 0.2, "yearly"),
    page("/terms", 0.2, "yearly"),
  ];

  const categoryPages = categories.map((c) => page(`/jewellery/${categoryToSlug(c)}`, 0.9, "daily"));

  const productPages = dummyProducts.map((p): Entry => ({
    ...page(`/jewellery/${categoryToSlug(p.category)}/${p.slug}`, 0.8, "weekly"),
    images: [absoluteUrl(p.image)],
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
