import type { Metadata } from "next";
import { openGraphFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Jewellery Collections — Bridal, Everyday & Gifting | Sanganie Jewells",
  description: "Explore Sanganie Jewells collections: bridal diamond jewellery, everyday lightweight gold pieces and gifts for every relation, all with certified diamonds.",
  alternates: { canonical: "/collections" },
  openGraph: openGraphFor("/collections", { title: "Jewellery Collections — Bridal, Everyday & Gifting | Sanganie Jewells", description: "Explore Sanganie Jewells collections: bridal diamond jewellery, everyday lightweight gold pieces and gifts for every relation, all with certified diamonds." }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
