"use client";

import { useState, useEffect, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type Plan = "FREE" | "BUSINESS";

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  ) : (
    <svg className="w-4.5 h-4.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
    </svg>
  );
}

function StepIndicator({ current }: { current: 1 | 2 }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-6">
      {[1, 2].map((s) => (
        <div key={s} className="flex items-center gap-2">
          <div
            className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              s < current
                ? "bg-violet-600 text-white"
                : s === current
                ? "bg-violet-600 text-white ring-4 ring-violet-100"
                : "bg-slate-100 text-slate-400"
            }`}
          >
            {s < current ? (
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : s}
          </div>
          {s < 2 && (
            <div className={`w-10 h-0.5 rounded-full ${s < current ? "bg-violet-600" : "bg-slate-200"}`} />
          )}
        </div>
      ))}
      <span className="ml-1 text-xs text-slate-400 font-medium">Step {current} of 2</span>
    </div>
  );
}

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState<"plan" | "account">("plan");
  const [selectedPlan, setSelectedPlan] = useState<Plan>("FREE");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const planParam = searchParams.get("plan");
    if (planParam === "BUSINESS") {
      setSelectedPlan("BUSINESS");
      setStep("account");
    } else if (planParam === "FREE") {
      setSelectedPlan("FREE");
      setStep("account");
    }
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, plan: selectedPlan }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong");
        return;
      }

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  /* ── STEP 1: Plan selection ── */
  if (step === "plan") {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center mb-5">
              <Image
                src="/logo.png"
                alt="Chaat.ai"
                width={360}
                height={96}
                className="w-36 h-auto object-contain"
              />
            </Link>
            <StepIndicator current={1} />
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Choose your plan</h1>
            <p className="text-slate-500 mt-1.5 text-sm">
              Both plans are free to use — billing activates in a future release.
            </p>
          </div>

          {/* Plan cards */}
          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {/* Free Card */}
            <button
              type="button"
              onClick={() => setSelectedPlan("FREE")}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-150 min-h-[200px] ${
                selectedPlan === "FREE"
                  ? "border-violet-500 bg-violet-50/60 shadow-md shadow-violet-100"
                  : "border-slate-200 bg-white hover:border-slate-300 shadow-sm"
              }`}
            >
              {selectedPlan === "FREE" && (
                <span className="absolute top-4 right-4 w-5 h-5 bg-violet-600 rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Free</p>
              <div className="flex items-end gap-1 mb-3">
                <span className="text-3xl font-bold text-slate-900">$0</span>
                <span className="text-slate-400 text-sm pb-1">/mo</span>
              </div>
              <ul className="space-y-1.5 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Unlimited bots &amp; conversations
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Embeddable chat widget
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <span className="text-slate-400">&quot;Powered by Chaat.ai&quot; shown</span>
                </li>
              </ul>
            </button>

            {/* Business Card */}
            <button
              type="button"
              onClick={() => setSelectedPlan("BUSINESS")}
              className={`relative text-left p-6 rounded-2xl border-2 transition-all duration-150 min-h-[200px] ${
                selectedPlan === "BUSINESS"
                  ? "border-violet-500 bg-violet-600 shadow-xl shadow-violet-200"
                  : "border-slate-200 bg-white hover:border-violet-200 shadow-sm"
              }`}
            >
              {selectedPlan === "BUSINESS" && (
                <span className="absolute top-4 right-4 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                  <svg className="w-3 h-3 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${selectedPlan === "BUSINESS" ? "bg-white/20" : "bg-violet-50"}`}>
                <svg className={`w-5 h-5 ${selectedPlan === "BUSINESS" ? "text-white" : "text-violet-600"}`} fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              </div>
              <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${selectedPlan === "BUSINESS" ? "text-violet-200" : "text-violet-500"}`}>Business</p>
              <div className="flex items-end gap-1 mb-3">
                <span className={`text-3xl font-bold ${selectedPlan === "BUSINESS" ? "text-white" : "text-slate-900"}`}>$99</span>
                <span className={`text-sm pb-1 ${selectedPlan === "BUSINESS" ? "text-violet-300" : "text-slate-400"}`}>/mo</span>
              </div>
              <ul className={`space-y-1.5 text-sm ${selectedPlan === "BUSINESS" ? "text-violet-100" : "text-slate-600"}`}>
                <li className="flex items-center gap-2">
                  <svg className={`w-3.5 h-3.5 flex-shrink-0 ${selectedPlan === "BUSINESS" ? "text-yellow-300" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Everything in Free
                </li>
                <li className="flex items-center gap-2">
                  <svg className={`w-3.5 h-3.5 flex-shrink-0 ${selectedPlan === "BUSINESS" ? "text-yellow-300" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Remove &quot;Powered by Chaat.ai&quot;
                </li>
                <li className="flex items-center gap-2">
                  <svg className={`w-3.5 h-3.5 flex-shrink-0 ${selectedPlan === "BUSINESS" ? "text-yellow-300" : "text-emerald-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Priority support
                </li>
              </ul>
            </button>
          </div>

          {/* Free notice */}
          <div className="flex items-center gap-3 mb-5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
            <span className="text-lg">🎉</span>
            <p className="text-sm text-amber-800">
              <span className="font-semibold">Both plans are free right now.</span>{" "}
              Your selection locks in your rate when billing goes live.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => setStep("account")}
            className="w-full !py-3 !text-sm !font-semibold"
            size="lg"
          >
            Continue with {selectedPlan === "BUSINESS" ? "Business" : "Free"} plan
            <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Button>

          <p className="text-center text-sm text-slate-500 mt-5">
            Already have an account?{" "}
            <Link href="/login" className="text-violet-600 hover:text-violet-700 font-semibold">
              Sign in
            </Link>
            {" · "}
            <Link href="/pricing" className="text-violet-600 hover:text-violet-700 font-semibold">
              Compare plans
            </Link>
          </p>
        </div>
      </div>
    );
  }

  /* ── STEP 2: Account details ── */
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-5">
            <Image
              src="/logo.png"
              alt="Chaat.ai"
              width={360}
              height={96}
              className="w-36 h-auto object-contain"
            />
          </Link>
          <StepIndicator current={2} />
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Create your account</h1>

          {/* Plan badge + back button */}
          <div className="flex items-center justify-center gap-2 mt-2">
            <span className="text-slate-400 text-sm">Plan:</span>
            <span
              className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-lg ${
                selectedPlan === "BUSINESS"
                  ? "bg-violet-100 text-violet-700"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {selectedPlan === "BUSINESS" ? "★ Business" : "Free"}
            </span>
            <button
              type="button"
              onClick={() => setStep("plan")}
              className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-violet-600 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Change
            </button>
          </div>
        </div>

        {/* Back navigation */}
        <button
          type="button"
          onClick={() => setStep("plan")}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to plan selection
        </button>

        {/* Form card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Full name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              autoComplete="name"
              required
            />
            <Input
              label="Email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />

            {/* Password with visibility toggle */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium text-slate-700">
                Password
              </label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                autoComplete="new-password"
                required
                hint="Must be at least 8 characters"
                suffix={
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon open={showPassword} />
                  </button>
                }
              />
            </div>

            {error && (
              <div className="flex items-center gap-2.5 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-xl">
                <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {error}
              </div>
            )}

            <Button type="submit" loading={loading} className="w-full !py-2.5 !text-sm !font-semibold" size="lg">
              Create Account
            </Button>

            {/* Terms notice */}
            <p className="text-center text-xs text-slate-400 leading-relaxed">
              By creating an account you agree to our{" "}
              <Link href="/terms" className="underline underline-offset-2 hover:text-slate-600 transition-colors">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="underline underline-offset-2 hover:text-slate-600 transition-colors">
                Privacy Policy
              </Link>.
            </p>
          </form>
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-violet-600 hover:text-violet-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-violet-600 border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <SignupForm />
    </Suspense>
  );
}
