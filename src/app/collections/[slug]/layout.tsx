import type { Metadata } from "next";
import { openGraphFor } from "@/lib/site";

// Copy for the built-in collections. Collections added later in admin fall back to their slug.
const collectionCopy: Record<string, { title: string; description: string }> = {
  bridal: {
    title: "Bridal Diamond Jewellery — Rings, Necklaces & Mangalsutras",
    description:
      "Bridal diamond jewellery by Sanganie Jewells: engagement rings, necklaces, mangalsutras and earrings in hallmarked gold with IGI certified diamonds.",
  },
  "everyday-light": {
    title: "Everyday Lightweight Diamond Jewellery",
    description:
      "Lightweight diamond jewellery for daily wear: studs, slim rings, pendants and nose pins in 14KT and 18KT rose and yellow gold by Sanganie Jewells.",
  },
  gifting: {
    title: "Diamond Jewellery Gifts for Her",
    description:
      "Find a diamond jewellery gift for your mother, sister, wife, daughter or friend. Certified diamonds in gold, gift-ready, from Sanganie Jewells.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const name = slug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  const copy = collectionCopy[slug] ?? {
    title: `${name} Collection`,
    description: `Shop the ${name} collection of certified diamond jewellery in gold at Sanganie Jewells.`,
  };
  const title = `${copy.title} | Sanganie Jewells`;
  const path = `/collections/${slug}`;

  return {
    title,
    description: copy.description,
    alternates: { canonical: path },
    openGraph: openGraphFor(path, { title, description: copy.description }),
  };
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
