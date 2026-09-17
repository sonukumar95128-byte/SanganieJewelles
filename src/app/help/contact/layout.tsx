import type { Metadata } from "next";
import { openGraphFor } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact Us | Sanganie Jewells",
  description: "Talk to Sanganie Jewells on WhatsApp about orders, sizing, custom diamond jewellery or after-sales care.",
  alternates: { canonical: "/help/contact" },
  openGraph: openGraphFor("/help/contact", { title: "Contact Us | Sanganie Jewells", description: "Talk to Sanganie Jewells on WhatsApp about orders, sizing, custom diamond jewellery or after-sales care." }),
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
