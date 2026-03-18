import Link from "next/link";
import Image from "next/image";
import { auth } from "@/lib/auth";
import FAQAccordion from "@/components/pricing/FAQAccordion";

const freeFeatures = [
  { text: "Unlimited bots", included: true },
  { text: "Unlimited conversations", included: true },
  { text: "PDF & document uploads", included: true },
  { text: "Embeddable chat widget", included: true },
  { text: "Custom bot personality & instructions", included: true },
  { text: "Real-time AI responses", included: true },
  { text: "Custom widget colors", included: true },
  { text: "\"Powered by Chaat.ai\" branding", included: true, note: true },
];

const businessFeatures = [
  { text: "Unlimited bots", included: true },
  { text: "Unlimited conversations", included: true },
  { text: "PDF & document uploads", included: true },
  { text: "Embeddable chat widget", included: true },
  { text: "Custom bot personality & instructions", included: true },
  { text: "Real-time AI responses", included: true },
  { text: "Remove \"Powered by Chaat.ai\" branding", included: true, highlight: true },
  { text: "Priority support", included: true },
  { text: "Custom widget colors & branding", included: true },
];

export default async function PricingPage() {
  const session = await auth();
  const isLoggedIn = !!session?.user?.id;
  const freeHref = isLoggedIn ? "/settings" : "/signup?plan=FREE";
  const businessHref = isLoggedIn ? "/settings" : "/signup?plan=BUSINESS";

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-100/80">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/logo.png"
              alt="Chaat.ai"
              width={360}
              height={96}
              className="w-44 h-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className="text-sm font-medium text-slate-500 hover:text-slate-800 px-4 py-2 rounded-xl hover:bg-slate-50 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-violet-700 bg-violet-50 px-4 py-2 rounded-xl transition-colors"
            >
              Pricing
            </Link>
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors px-4 py-2 rounded-xl hover:bg-slate-50"
                >
                  Sign in
                </Link>
                <Link
                  href="/signup"
                  className="text-sm font-semibold bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-xl transition-all shadow-sm shadow-violet-200"
                >
                  Get Started Free
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Logged-in context banner */}
      {isLoggedIn && (
        <div className="bg-violet-600 text-white text-sm py-2.5 px-6 text-center">
          <span className="opacity-80">You&apos;re signed in.</span>
          {" "}Clicking a plan button below will take you to{" "}
          <Link href="/settings" className="font-semibold underline underline-offset-2 hover:opacity-90">
            Settings → Billing
          </Link>{" "}
          where you can switch instantly.
        </div>
      )}

      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-violet-50/80 to-transparent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100 text-violet-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
            <span className="w-1.5 h-1.5 bg-violet-500 rounded-full" />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 tracking-tight mb-4">
            Start free.{" "}
            <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
              Upgrade when ready.
            </span>
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto mb-8">
            Every plan includes unlimited bots, unlimited conversations, and everything you need to build a world-class AI assistant.
          </p>

          {/* "Both plans free" notice — shown BEFORE the cards so users see it before the $99 price */}
          <div className="inline-flex items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3 text-left">
            <span className="text-xl flex-shrink-0">🎉</span>
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Both plans are completely free right now.</span>
              {" "}Billing activates in a future release — your plan choice locks in your rate.
            </p>
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-12">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">

            {/* Free Plan */}
            <div className="relative bg-white rounded-3xl border border-slate-200 shadow-sm p-8 flex flex-col">
              <div className="mb-6">
                <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-4">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                  Free forever
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-1">Free</h2>
                <p className="text-slate-500 text-sm">Everything you need to get started.</p>
              </div>

              <div className="mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-slate-900">$0</span>
                  <span className="text-slate-400 text-sm pb-2">/month</span>
                </div>
                <p className="text-xs text-slate-400 mt-1">No credit card required</p>
              </div>

              <ul className="space-y-3 flex-1 mb-8">
                {freeFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                      <svg className="w-3 h-3 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className={`text-sm ${feature.note ? "text-slate-400 italic" : "text-slate-700"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={freeHref}
                className="w-full flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold py-3 px-6 rounded-2xl transition-all text-sm"
              >
                {isLoggedIn ? "Switch to Free" : "Get started free"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>

            {/* Business Plan */}
            <div className="relative bg-gradient-to-b from-violet-600 to-indigo-700 rounded-3xl shadow-2xl shadow-violet-200/60 p-8 flex flex-col overflow-hidden">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full blur-2xl pointer-events-none" />

              <div className="relative mb-6">
                <div className="inline-flex items-center gap-2 bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4 border border-white/20">
                  <svg className="w-3.5 h-3.5 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                  Most popular
                </div>
                <h2 className="text-2xl font-bold text-white mb-1">Business</h2>
                <p className="text-violet-200 text-sm">For teams serious about their brand.</p>
              </div>

              <div className="relative mb-8">
                <div className="flex items-end gap-1">
                  <span className="text-5xl font-bold text-white">$99</span>
                  <span className="text-violet-300 text-sm pb-2">/month</span>
                </div>
                <p className="text-xs text-violet-300/80 mt-1">Billed monthly · Cancel anytime</p>
              </div>

              <ul className="relative space-y-3 flex-1 mb-8">
                {businessFeatures.map((feature) => (
                  <li key={feature.text} className="flex items-start gap-3">
                    <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-white/15 border border-white/20 flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span className={`text-sm ${feature.highlight ? "text-yellow-300 font-semibold" : "text-violet-100"}`}>
                      {feature.text}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={businessHref}
                className="relative w-full flex items-center justify-center gap-2 bg-white hover:bg-violet-50 text-violet-700 font-semibold py-3 px-6 rounded-2xl transition-all text-sm shadow-lg"
              >
                {isLoggedIn ? "Switch to Business" : "Start with Business"}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison Table */}
      <section className="py-16">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10 tracking-tight">
            Full feature comparison
          </h2>

          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-3 bg-slate-50/70 border-b border-slate-100">
              <div className="px-6 py-4 text-sm font-semibold text-slate-500 uppercase tracking-wider">Feature</div>
              <div className="px-6 py-4 text-center text-sm font-semibold text-slate-700">Free</div>
              <div className="px-6 py-4 text-center text-sm font-semibold text-violet-700">Business</div>
            </div>

            {[
              { label: "AI-powered chatbots", free: "Unlimited", business: "Unlimited" },
              { label: "Monthly conversations", free: "Unlimited", business: "Unlimited" },
              { label: "Document uploads (PDF, TXT)", free: true, business: true },
              { label: "Embeddable widget", free: true, business: true },
              { label: "Custom bot instructions", free: true, business: true },
              { label: "Custom widget colors", free: true, business: true },
              { label: "Remove \"Powered by Chaat.ai\"", free: false, business: true },
              { label: "Priority support", free: false, business: true },
            ].map((row, i) => (
              <div key={row.label} className={`grid grid-cols-3 border-b border-slate-50 last:border-0 ${i % 2 === 0 ? "" : "bg-slate-50/30"}`}>
                <div className="px-6 py-3.5 text-sm text-slate-700 flex items-center">{row.label}</div>
                <div className="px-6 py-3.5 flex items-center justify-center">
                  {typeof row.free === "boolean" ? (
                    row.free ? (
                      <svg className="w-5 h-5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  ) : (
                    <span className="text-sm font-semibold text-slate-800">{row.free}</span>
                  )}
                </div>
                <div className="px-6 py-3.5 flex items-center justify-center">
                  {typeof row.business === "boolean" ? (
                    row.business ? (
                      <svg className="w-5 h-5 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )
                  ) : (
                    <span className="text-sm font-semibold text-violet-700">{row.business}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — accordion via client component */}
      <section className="py-16 bg-slate-50/70">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-slate-900 text-center mb-10 tracking-tight">
            Frequently asked questions
          </h2>
          <FAQAccordion />
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 rounded-3xl p-12 text-center shadow-2xl shadow-violet-200/60">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <h2 className="text-3xl font-bold text-white mb-3 tracking-tight">
                Ready to build your first bot?
              </h2>
              <p className="text-violet-200 mb-8 max-w-md mx-auto">
                It takes 5 minutes. No credit card. No technical skill. Just your content and a bot that answers questions for you.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  href={freeHref}
                  className="inline-flex items-center gap-2 bg-white hover:bg-violet-50 text-violet-700 font-semibold px-7 py-3 rounded-2xl text-sm transition-all shadow-lg hover:-translate-y-0.5"
                >
                  {isLoggedIn ? "Switch to Free" : "Start for free"}
                </Link>
                <Link
                  href={businessHref}
                  className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold px-7 py-3 rounded-2xl text-sm transition-all"
                >
                  {isLoggedIn ? "Switch to Business" : "Start with Business"}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-100 py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Chaat.ai" width={360} height={96} className="w-36 h-auto object-contain" />
            <span className="text-slate-200">·</span>
            <span>© 2026 All rights reserved.</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/" className="hover:text-slate-600 transition-colors">Home</Link>
            <Link href="/pricing" className="hover:text-slate-600 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-slate-600 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
