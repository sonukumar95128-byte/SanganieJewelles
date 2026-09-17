import type { Metadata } from "next";
import { NO_INDEX } from "@/lib/site";

export const metadata: Metadata = { title: "Create Account — Sanganie Jewells", robots: NO_INDEX };

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
