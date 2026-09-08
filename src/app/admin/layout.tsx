"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOutAction } from "@/app/admin/actions";

const navLink =
  "flex items-center rounded-lg px-3 py-2 text-sm font-semibold text-white/85 transition-colors hover:bg-white/10 hover:text-white";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin =
    pathname === "/admin/login" || pathname.startsWith("/admin/login/");

  // The login page is a bare, centered screen — no sidebar, no auth gating.
  // (All route protection lives in middleware.ts to avoid a redirect loop.)
  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-brand-bg antialiased">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 flex w-60 flex-col bg-brand-green text-white">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-pink text-sm font-extrabold tracking-wide text-white">
            ela
          </span>
          <div className="leading-tight">
            <p className="text-sm font-extrabold">Admin</p>
            <p className="text-[11px] text-white/60">Content Studio</p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          <Link href="/admin/events" className={navLink}>
            Events Management
          </Link>
          <Link href="/admin/schools" className={navLink}>
            Schools Management
          </Link>
        </nav>

        <div className="space-y-2 border-t border-white/10 px-3 py-4">
          <Link href="/" className={navLink}>
            ← Back to site
          </Link>
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center rounded-lg px-3 py-2 text-left text-sm font-semibold text-white/85 transition-colors hover:bg-brand-pink hover:text-white"
            >
              Sign out
            </button>
          </form>
        </div>
      </aside>

      {/* Content */}
      <main className="ml-60 min-h-screen px-6 py-8 md:px-10">{children}</main>
    </div>
  );
}
