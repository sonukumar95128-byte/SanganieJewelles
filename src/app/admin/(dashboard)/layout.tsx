import Image from "next/image";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { AdminNav } from "@/components/admin/AdminNav";
import { verifyAdminToken } from "@/lib/adminSession";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const jar = await cookies();
  if (!verifyAdminToken(jar.get("admin_auth")?.value)) redirect("/admin/login");
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-ivory">
      <aside className="w-full lg:w-56 lg:shrink-0 lg:sticky lg:top-0 lg:h-screen border-b lg:border-b-0 lg:border-r border-beige bg-brand flex flex-col">
        <div className="flex items-center gap-3 lg:block px-4 lg:px-5 py-3 lg:py-5 border-b border-gold-light/15 shrink-0">
          <Image
            src="/brand/sanganie-jewells-logo.svg"
            alt="Sanganie Jewells"
            width={180}
            height={180}
            className="h-9 w-9 lg:h-10 lg:w-10 object-contain"
            priority
          />
          <p className="text-xs text-gold-light/50 lg:mt-1">Admin panel</p>
          <form action="/api/admin/logout" method="POST" className="ml-auto lg:hidden">
            <button
              type="submit"
              className="rounded-lg px-3 py-2 text-xs text-gold-light/80 bg-brand-secondary/40 hover:bg-brand-secondary hover:text-gold-light transition-colors"
            >
              Log out
            </button>
          </form>
        </div>
        <AdminNav />
        <form action="/api/admin/logout" method="POST" className="hidden lg:block px-3 py-4 border-t border-gold-light/15 shrink-0">
          <button
            type="submit"
            className="w-full rounded-lg px-3 py-2 text-sm text-gold-light/80 bg-brand-secondary/40 hover:bg-brand-secondary hover:text-gold-light transition-colors text-left"
          >
            Log out
          </button>
        </form>
      </aside>

      <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0">{children}</main>
    </div>
  );
}
