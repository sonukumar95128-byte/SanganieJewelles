import Link from "next/link";

type SectionHeadingProps = {
  title: string;
  subtitle?: string;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function SectionHeading({ title, subtitle, viewAllHref, viewAllLabel = "View all" }: SectionHeadingProps) {
  return (
    <div className="text-center mb-10">
      <h2 className="font-sans font-semibold uppercase tracking-[0.15em] text-xl sm:text-2xl text-brand">
        {title}
      </h2>
      {subtitle && <p className="mt-2 text-sm text-ink/50">{subtitle}</p>}
      {viewAllHref && (
        <Link href={viewAllHref} className="mt-3 inline-block text-xs uppercase tracking-wide text-gold hover:text-brand transition-colors">
          {viewAllLabel} →
        </Link>
      )}
    </div>
  );
}
