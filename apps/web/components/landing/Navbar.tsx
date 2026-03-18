"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function LandingNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100/80">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* Logo — width is the primary constraint since the PNG has transparent padding */}
        <Link href="/" className="flex items-center flex-shrink-0">
          <Image
            src="/logo.png"
            alt="Chaat.ai"
            width={360}
            height={96}
            className="w-44 h-auto object-contain"
          />
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-1">
          <Link
            href="/#features"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm shadow-violet-200 ml-1"
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile: CTA + hamburger */}
        <div className="flex sm:hidden items-center gap-2">
          <Link
            href="/signup"
            className="text-xs font-semibold bg-violet-600 hover:bg-violet-700 text-white px-3 py-2 rounded-xl transition-all"
          >
            Get Started
          </Link>
          <button
            onClick={() => setMobileOpen((prev) => !prev)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileOpen && (
        <div className="sm:hidden border-t border-slate-100 bg-white/95 backdrop-blur-sm px-4 py-3 space-y-1 shadow-sm">
          <Link
            href="/#features"
            onClick={() => setMobileOpen(false)}
            className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Features
          </Link>
          <Link
            href="/pricing"
            onClick={() => setMobileOpen(false)}
            className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Pricing
          </Link>
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            className="flex items-center text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            Sign in
          </Link>
          <div className="pt-1 pb-1">
            <Link
              href="/signup"
              onClick={() => setMobileOpen(false)}
              className="flex items-center justify-center text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2.5 rounded-xl transition-all"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
