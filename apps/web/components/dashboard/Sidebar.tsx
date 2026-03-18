"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";

const navigation = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM14 5a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM14 12a1 1 0 011-1h4a1 1 0 011 1v8a1 1 0 01-1 1h-4a1 1 0 01-1-1v-8z" />
      </svg>
    ),
  },
  {
    name: "My Bots",
    href: "/bots",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
  },
  {
    name: "Settings",
    href: "/settings",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const user = session?.user;

  const [mobileOpen, setMobileOpen] = useState(false);

  // Close mobile nav on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Local plan state — syncs from session but can update immediately on switch
  const [localPlan, setLocalPlan] = useState<string>(user?.plan ?? "FREE");

  useEffect(() => {
    if (user?.plan) setLocalPlan(user.plan);
  }, [user?.plan]);

  const plan = localPlan;
  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase()
    : user?.email?.[0]?.toUpperCase() ?? "?";

  const [switching, setSwitching] = useState(false);

  async function switchToBusiness() {
    setSwitching(true);
    setLocalPlan("BUSINESS");
    try {
      const res = await fetch("/api/user/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: "BUSINESS" }),
      });
      if (res.ok) {
        await updateSession({ plan: "BUSINESS" });
        router.refresh();
      } else {
        setLocalPlan("FREE");
      }
    } catch {
      setLocalPlan("FREE");
    } finally {
      setSwitching(false);
    }
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-4 py-2 border-b border-slate-100">
        <Link href="/dashboard" className="block w-full" onClick={() => setMobileOpen(false)}>
          <Image
            src="/logo.png"
            alt="Chaat.ai"
            width={300}
            height={84}
            className="w-full h-auto object-contain"
          />
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
                ${isActive
                  ? "bg-violet-50 text-violet-700"
                  : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                }
              `}
            >
              <span className={isActive ? "text-violet-600" : "text-slate-400 group-hover:text-slate-600 transition-colors"}>
                {item.icon}
              </span>
              {item.name}
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
              )}
            </Link>
          );
        })}

        {/* New Bot shortcut */}
        <div className="pt-3">
          <Link
            href="/bots/new"
            onClick={() => setMobileOpen(false)}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium border border-dashed border-slate-200 text-slate-500 hover:text-violet-700 hover:bg-violet-50/60 hover:border-violet-200 transition-all duration-150"
          >
            <span className="text-slate-400 group-hover:text-violet-500 transition-colors">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </span>
            New Bot
          </Link>
        </div>

        {/* Admin link — only visible to admin users */}
        {user?.role === "ADMIN" && (
          <div className="pt-3 mt-2 border-t border-slate-100">
            <Link
              href="/admin786"
              onClick={() => setMobileOpen(false)}
              className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-500 hover:text-rose-700 hover:bg-rose-50 transition-all duration-150"
            >
              <span className="text-slate-400 group-hover:text-rose-500 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z" />
                </svg>
              </span>
              Admin Panel
            </Link>
          </div>
        )}
      </nav>

      {/* Upgrade nudge for free users */}
      {plan !== "BUSINESS" && (
        <div className="mx-3 mb-3 bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-100 rounded-2xl p-4">
          <div className="flex items-center gap-1.5 mb-0.5">
            <svg className="w-3.5 h-3.5 text-violet-500 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
            <p className="text-xs font-semibold text-violet-800">Upgrade to Business</p>
          </div>
          <p className="text-xs text-violet-600 leading-tight mb-3">
            Remove Chaat.ai branding and unlock all features.
          </p>
          <button
            onClick={switchToBusiness}
            disabled={switching}
            className="w-full flex items-center justify-center gap-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-700 disabled:opacity-70 text-white py-1.5 rounded-xl transition-colors"
          >
            {switching ? (
              <>
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Switching…
              </>
            ) : "Switch to Business"}
          </button>
        </div>
      )}

      {/* User profile + sign out */}
      <div className="px-3 pb-4 pt-3 border-t border-slate-100">
        <Link
          href="/settings"
          onClick={() => setMobileOpen(false)}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer mb-1"
        >
          <div className="w-8 h-8 bg-gradient-to-br from-violet-400 to-indigo-500 rounded-xl flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-sm">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <p className="text-xs font-semibold text-slate-800 truncate leading-tight">
                {user?.name || "My Account"}
              </p>
              {plan === "BUSINESS" ? (
                <span className="flex-shrink-0 inline-flex items-center gap-0.5 bg-violet-100 text-violet-700 text-[10px] font-bold px-1.5 py-0.5 rounded-md leading-none">
                  <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  PRO
                </span>
              ) : (
                <span className="flex-shrink-0 inline-flex items-center bg-slate-100 text-slate-500 text-[10px] font-semibold px-1.5 py-0.5 rounded-md leading-none">
                  FREE
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 truncate leading-tight">
              {user?.email}
            </p>
          </div>
          <svg className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-400 flex-shrink-0 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>

        <button
          onClick={() => signOut({ callbackUrl: "/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all border border-transparent hover:border-red-100"
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Sign out
        </button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile topbar — visible only on small screens */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-slate-100 px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard">
          <Image
            src="/logo.png"
            alt="Chaat.ai"
            width={200}
            height={56}
            className="h-9 w-auto object-contain"
          />
        </Link>
        <button
          onClick={() => setMobileOpen(true)}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
          aria-label="Open menu"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden sm:flex w-60 bg-white border-r border-slate-200/80 min-h-screen flex-col">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 sm:hidden"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-72 bg-white z-50 sm:hidden flex flex-col shadow-2xl animate-in slide-in-from-left-full duration-200">
            {/* Close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors z-10"
              aria-label="Close menu"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
}
