"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useCart } from "@/lib/cart-store";
import { useWishlist } from "@/lib/wishlist-store";
import { useUser } from "@/lib/user-store";

const navLinks = [
  { label: "Shop", href: "/jewellery" },
  { label: "Rings", href: "/jewellery/rings" },
  { label: "Earrings", href: "/jewellery/earrings" },
  { label: "Necklaces", href: "/jewellery/necklaces" },
  { label: "Bracelets", href: "/jewellery/bracelets" },
  { label: "Pendants", href: "/jewellery/pendants" },
  { label: "Nose Pins", href: "/jewellery/nose-pins" },
];

function HeartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M12 20.5s-7.5-4.6-9.8-9.1C.6 8 2 4.5 5.4 3.7c2.1-.5 4.2.3 5.6 2.1l1 1.3 1-1.3c1.4-1.8 3.5-2.6 5.6-2.1 3.4.8 4.8 4.3 3.2 7.7-2.3 4.5-9.8 9.1-9.8 9.1z" />
    </svg>
  );
}

function BagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M6 8h12l1 13H5L6 8z" strokeLinejoin="round" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" strokeLinecap="round" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
      <circle cx="12" cy="8" r="3.5" />
      <path d="M4.5 20c1.5-3.5 5-5 7.5-5s6 1.5 7.5 5" strokeLinecap="round" />
    </svg>
  );
}

function MenuIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7h16M4 12h16M4 17h16" strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4-4" strokeLinecap="round" />
    </svg>
  );
}

export function Header() {
  const { itemCount } = useCart();
  const { count: wishlistCount } = useWishlist();
  const { user, isLoggedIn } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const [search, setSearch] = useState("");
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const lastY = useRef(0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!search.trim()) return;
    router.push(`/search?q=${encodeURIComponent(search.trim())}`);
    setMenuOpen(false);
  };

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      const goingDown = y > lastY.current;

      setHidden(goingDown && y > 80);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Tapping a link inside the drawer should leave it closed on the next page.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
    <header
      className={
        "sticky top-0 z-50 transition-all duration-300 " +
        (hidden ? "-translate-y-full" : "translate-y-0") +
        " bg-brand border-b border-gold-light/15"
      }
    >
      <div className="mx-auto max-w-7xl grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6 px-4 sm:px-6 py-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className={
              "grid h-10 w-10 shrink-0 place-items-center rounded-full text-gold-light transition-colors hover:bg-brand-secondary lg:hidden"
            }
          >
            <MenuIcon />
          </button>

          <Link href="/" className="shrink-0">
            <Image
              src="/brand/sanganie-jewells-logo-gold.png"
              alt="Sanganie Jewells"
              width={160}
              height={160}
              className="h-11 w-11 object-contain sm:h-12 sm:w-12"
              priority
            />
          </Link>
        </div>

        <nav
          className={
            "hidden lg:flex items-center justify-center gap-4 xl:gap-8 whitespace-nowrap text-sm font-medium text-gold-light transition-colors"
          }
        >
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-gold transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3 justify-self-end">
          <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
            <span
              className={
                "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gold-light/50"
              }
            >
              <SearchIcon />
            </span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search..."
              className={
                "w-44 lg:w-32 xl:w-44 rounded-full border border-gold-light/25 bg-brand-secondary/40 pl-9 pr-4 py-1.5 text-sm text-gold-light placeholder:text-gold-light/40 focus:outline-none focus:ring-1 focus:ring-gold transition-colors"
              }
            />
          </form>
          <Link
            href="/account/wishlist"
            aria-label="Wishlist"
            className={
              "relative grid h-9 w-9 place-items-center rounded-full border border-gold-light/25 text-gold-light/80 transition-colors hover:border-gold hover:text-gold"
            }
          >
            <HeartIcon />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-medium text-brand">
                {wishlistCount > 9 ? "9+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label="Cart"
            className={
              "relative grid h-9 w-9 place-items-center rounded-full border border-gold-light/25 text-gold-light/80 transition-colors hover:border-gold hover:text-gold"
            }
          >
            <BagIcon />
            {itemCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 grid h-5 w-5 place-items-center rounded-full bg-gold text-[10px] font-medium text-brand">
                {itemCount > 9 ? "9+" : itemCount}
              </span>
            )}
          </Link>
          <Link
            href={isLoggedIn ? "/account" : "/login"}
            aria-label="Account"
            className={
              "grid h-9 w-9 place-items-center rounded-full border border-gold-light/25 text-gold-light/80 transition-colors hover:border-gold hover:text-gold"
            }
          >
            {isLoggedIn && user ? (
              <span className="font-heading italic text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            ) : (
              <UserIcon />
            )}
          </Link>
        </div>
      </div>
    </header>

      {/* Mobile menu — rendered outside <header> so the scroll-hide transform doesn't move it */}
      {menuOpen && (
        <div className="lg:hidden">
          <div
            className="fixed inset-0 z-[60] bg-black/50"
            onClick={() => setMenuOpen(false)}
            aria-hidden="true"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-y-0 left-0 z-[70] flex w-[82%] max-w-xs flex-col bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-gold-light/30 bg-brand px-4 py-3">
              <Image
                src="/brand/sanganie-jewells-logo-gold.png"
                alt="Sanganie Jewells"
                width={160}
                height={160}
                className="h-14 w-14 object-contain"
              />
              <button
                onClick={() => setMenuOpen(false)}
                aria-label="Close menu"
                className="grid h-10 w-10 place-items-center rounded-full text-gold-light hover:bg-white/10"
              >
                <CloseIcon />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="border-b border-beige p-4">
              <div className="relative">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40">
                  <SearchIcon />
                </span>
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search jewellery…"
                  className="w-full rounded-full border border-beige bg-ivory py-2.5 pl-9 pr-4 text-sm text-ink placeholder:text-ink/40 focus:outline-none focus:ring-1 focus:ring-gold"
                />
              </div>
            </form>

            <nav className="flex-1 overflow-y-auto p-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-lg px-4 py-3 text-sm text-ink/80 transition-colors hover:bg-beige hover:text-brand"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="border-t border-beige p-2">
              <Link
                href="/account/wishlist"
                className="block rounded-lg px-4 py-3 text-sm text-ink/80 transition-colors hover:bg-beige hover:text-brand"
              >
                Wishlist{wishlistCount > 0 ? ` (${wishlistCount})` : ""}
              </Link>
              <Link
                href={isLoggedIn ? "/account" : "/login"}
                className="block rounded-lg px-4 py-3 text-sm text-ink/80 transition-colors hover:bg-beige hover:text-brand"
              >
                {isLoggedIn && user ? `My account — ${user.name}` : "Sign in"}
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
