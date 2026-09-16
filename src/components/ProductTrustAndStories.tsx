"use client";

import { CustomerStoryGrid, pickTestimonials } from "@/components/CustomerStories";
import { TrustBadgeGrid } from "@/components/TrustBadges";
import { useAdmin } from "@/lib/admin-store";

// Product page versions of the homepage's "Our Promise" badges and "Customer Stories",
// reading the same admin-managed content.

export function ProductTrustBadges() {
  const { trustBadges } = useAdmin();
  return (
    <div className="mt-12">
      <TrustBadgeGrid badges={trustBadges} />
    </div>
  );
}

export function ProductCustomerStories({ productSlug }: { productSlug: string }) {
  const { testimonials } = useAdmin();
  const stories = pickTestimonials(testimonials, { productSlug });
  if (stories.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="font-heading italic text-2xl text-brand">Customer Stories</h2>
      <p className="mt-1 mb-5 text-sm text-ink/50">★ 4.8 average · 12,400+ verified reviews</p>
      <CustomerStoryGrid testimonials={stories} />
    </div>
  );
}
