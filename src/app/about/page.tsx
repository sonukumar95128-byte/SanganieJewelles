import Image from "next/image";

export const metadata = { title: "About Us — Sanganie Jewells" };

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 sm:px-6 py-12">
      <Image
        src="/brand/sanganie-jewells-logo.svg"
        alt="Sanganie Jewells"
        width={220}
        height={220}
        className="h-14 w-14 object-contain mb-6"
      />
      <h1 className="font-heading italic text-3xl text-brand mb-6">About Sanganie Jewells</h1>

      <div className="prose prose-sm max-w-none text-ink/80 space-y-4">
        <p>
          Sanganie Jewells is a fine jewellery house dedicated to crafting pieces that blend timeless design with
          modern sensibility. Every piece in our collection — from delicate everyday studs to statement bridal sets
          — is hallmarked, certified, and made with genuine gold and diamonds.
        </p>
        <p>
          We believe jewellery should be as personal as the moments it&apos;s worn for. That&apos;s why we offer
          lifetime maintenance, a 15-day exchange window, and a team that&apos;s always happy to help you find the
          right piece — whether that&apos;s for a wedding, a gift, or just because.
        </p>
        <p>
          Thank you for considering Sanganie Jewells for your next piece of jewellery.
        </p>
      </div>
    </div>
  );
}
