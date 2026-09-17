import type { Metadata } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { OG_IMAGE, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import { SiteChrome } from "@/components/SiteChrome";
import { CartProvider } from "@/lib/cart-store";
import { AdminProvider } from "@/lib/admin-store";
import { WishlistProvider } from "@/lib/wishlist-store";
import { CompareProvider } from "@/lib/compare-store";
import { UserProvider } from "@/lib/user-store";

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Sanganie Jewells — Certified Diamond Jewellery in Gold",
    template: "%s",
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  keywords: [
    "diamond jewellery",
    "gold jewellery online",
    "diamond rings",
    "diamond earrings",
    "diamond necklace",
    "mangalsutra",
    "diamond bracelet",
    "diamond pendant",
    "diamond nose pin",
    "IGI certified diamonds",
    "rose gold jewellery",
    "Sanganie Jewells",
  ],
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_IN",
    images: [OG_IMAGE],
  },
  twitter: { card: "summary_large_image", images: [OG_IMAGE.url] },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cormorant.variable} ${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-ivory text-ink">
        <AdminProvider>
          <UserProvider>
            <CartProvider>
              <WishlistProvider>
                <CompareProvider>
                  <SiteChrome>{children}</SiteChrome>
                </CompareProvider>
              </WishlistProvider>
            </CartProvider>
          </UserProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
