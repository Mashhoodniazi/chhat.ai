"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

interface AccountSettingsProps {
  initialName: string;
  email: string;
  initials: string;
  memberSince: string;
  plan: "FREE" | "BUSINESS";
}

type Tab = "profile" | "security" | "billing";

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
    </svg>
  );
}

function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  return (
    <div className="flex items-center gap-3 bg-gray-900 text-white text-sm px-4 py-3 rounded-xl shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
      <span className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center flex-shrink-0">
        <CheckIcon className="w-3 h-3 text-white" />
      </span>
      <span className="flex-1">{message}</span>
      <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors ml-2">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

function FieldRow({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[200px_1fr] gap-6 items-start py-5 border-b border-gray-100 last:border-0">
      <div className="pt-2.5">
        <p className="text-sm font-medium text-gray-700">{label}</p>
        {hint && <p className="text-xs text-gray-400 mt-0.5 leading-relaxed">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  );
}

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] overflow-hidden">
      <div className="px-6 pt-5 pb-4 border-b border-gray-50">
        <h2 className="text-[15px] font-semibold text-gray-900">{title}</h2>
        {description && <p className="text-sm text-gray-400 mt-0.5">{description}</p>}
      </div>
      <div className="px-6 pb-2">{children}</div>
    </div>
  );
}

function PasswordStrength({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[0-9]/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;
  const colors = ["bg-gray-200", "bg-red-400", "bg-amber-400", "bg-emerald-400", "bg-emerald-500"];
  const labels = ["", "Weak", "Fair", "Good", "Strong"];

  if (!password) return null;

  return (
    <div className="mt-2.5 space-y-1.5">
      <div className="flex gap-1">
        {[0, 1, 2, 3].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${i < score ? colors[score] : "bg-gray-100"}`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${score <= 1 ? "text-red-500" : score === 2 ? "text-amber-500" : "text-emerald-600"}`}>
        {labels[score]}
      </p>
    </div>
  );
}

export default function AccountSettings({
  initialName,
  email,
  initials,
  memberSince,
  plan: initialPlan,
}: AccountSettingsProps) {
  const { update: updateSession } = useSession();
  const [activeTab, setActiveTab] = useState<Tab>("billing");

  const [name, setName] = useState(initialName);
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileToast, setProfileToast] = useState("");
  const [profileError, setProfileError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordToast, setPasswordToast] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [currentPlan, setCurrentPlan] = useState<"FREE" | "BUSINESS">(initialPlan);
  const [planLoading, setPlanLoading] = useState(false);
  const [planToast, setPlanToast] = useState("");

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileError("");
    setProfileLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileError(data.error ?? "Failed to update profile.");
        return;
      }
      await updateSession({ name: data.name });
      setProfileToast("Profile updated successfully.");
    } finally {
      setProfileLoading(false);
    }
  }

  async function handlePasswordChange(e: React.FormEvent) {
    e.preventDefault();
    setPasswordError("");
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }
    setPasswordLoading(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordError(data.error ?? "Failed to update password.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setPasswordToast("Password changed successfully.");
    } finally {
      setPasswordLoading(false);
    }
  }

  async function handlePlanChange(newPlan: "FREE" | "BUSINESS") {
    if (newPlan === currentPlan) return;
    setPlanLoading(true);
    try {
      const res = await fetch("/api/user/plan", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
      });
      if (res.ok) {
        setCurrentPlan(newPlan);
        // Pass data so NextAuth sends POST → triggers JWT callback to re-fetch plan
        await updateSession({ plan: newPlan });
        setPlanToast(`Switched to ${newPlan === "BUSINESS" ? "Business" : "Free"} plan.`);
      }
    } finally {
      setPlanLoading(false);
    }
  }

  const tabs: { id: Tab; label: string }[] = [
    { id: "billing", label: "Billing & Plan" },
    { id: "profile", label: "Profile" },
    { id: "security", label: "Security" },
  ];

  return (
    <div className="flex gap-7">
      {/* Sidebar */}
      <aside className="w-44 flex-shrink-0">
        <nav className="flex flex-col gap-0.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.08)] border border-gray-100"
                  : "text-gray-500 hover:text-gray-800 hover:bg-white/60"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 space-y-4">

        {/* Toast */}
        {(profileToast || passwordToast || planToast) && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
            <Toast
              message={profileToast || passwordToast || planToast}
              onClose={() => { setProfileToast(""); setPasswordToast(""); setPlanToast(""); }}
            />
          </div>
        )}

        {/* ── BILLING ── */}
        {activeTab === "billing" && (
          <>
            {/* Current plan hero card */}
            <div className={`relative overflow-hidden rounded-2xl border shadow-sm p-6 ${
              currentPlan === "BUSINESS"
                ? "bg-gradient-to-br from-violet-600 to-indigo-700 border-violet-500"
                : "bg-white border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)]"
            }`}>
              <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-2 ${currentPlan === "BUSINESS" ? "text-violet-300" : "text-gray-400"}`}>
                    Current Plan
                  </p>
                  <div className="flex items-center gap-2.5 mb-1.5">
                    <h2 className={`text-2xl font-bold ${currentPlan === "BUSINESS" ? "text-white" : "text-gray-900"}`}>
                      {currentPlan === "BUSINESS" ? "Business" : "Free"}
                    </h2>
                    {currentPlan === "BUSINESS" && (
                      <span className="inline-flex items-center gap-1 bg-yellow-400/20 border border-yellow-300/30 text-yellow-300 text-[11px] font-bold px-2 py-0.5 rounded-full">
                        <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                        Most popular
                      </span>
                    )}
                  </div>
                  <p className={`text-sm ${currentPlan === "BUSINESS" ? "text-violet-200" : "text-gray-500"}`}>
                    {currentPlan === "BUSINESS"
                      ? "White-label experience — no Chaat.ai branding shown."
                      : "Unlimited bots and conversations, always free."}
                  </p>
                  <div className={`mt-4 pt-4 border-t ${currentPlan === "BUSINESS" ? "border-white/10" : "border-gray-50"}`}>
                    <span className={`text-3xl font-bold ${currentPlan === "BUSINESS" ? "text-white" : "text-gray-900"}`}>
                      {currentPlan === "BUSINESS" ? "$99" : "$0"}
                    </span>
                    <span className={`text-sm ml-1 ${currentPlan === "BUSINESS" ? "text-violet-300" : "text-gray-400"}`}>/month</span>
                  </div>
                </div>
                <div className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center ${currentPlan === "BUSINESS" ? "bg-white/15" : "bg-violet-50"}`}>
                  {currentPlan === "BUSINESS" ? (
                    <svg className="w-7 h-7 text-yellow-300" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                  )}
                </div>
              </div>
            </div>

            {/* Billing notice */}
            <div className="flex items-start gap-3.5 bg-amber-50 border border-amber-100 rounded-2xl px-5 py-4">
              <span className="text-xl mt-0.5">🎉</span>
              <div>
                <p className="text-sm font-semibold text-amber-900">Both plans are free right now</p>
                <p className="text-sm text-amber-700 mt-0.5">Billing is not yet active. Switch freely — your selection locks in your rate when payments go live.</p>
              </div>
            </div>

            {/* Plan switcher */}
            <Section title="Switch Plan" description="Change your plan at any time. No charges until billing activates.">
              <div className="py-4 grid sm:grid-cols-2 gap-3">
                {/* Free option */}
                <button
                  type="button"
                  disabled={planLoading}
                  onClick={() => handlePlanChange("FREE")}
                  className={`relative text-left p-5 rounded-xl border-2 transition-all duration-150 ${
                    currentPlan === "FREE"
                      ? "border-violet-500 bg-violet-50/60"
                      : "border-gray-100 bg-gray-50/60 hover:border-gray-200"
                  }`}
                >
                  {currentPlan === "FREE" && (
                    <span className="absolute top-3.5 right-3.5 w-4 h-4 bg-violet-600 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${currentPlan === "FREE" ? "text-violet-600" : "text-gray-400"}`}>Free</p>
                  <p className="text-xl font-bold text-gray-900">$0 <span className="text-sm font-normal text-gray-400">/mo</span></p>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">Unlimited usage · Chaat.ai branding shown</p>
                </button>

                {/* Business option */}
                <button
                  type="button"
                  disabled={planLoading}
                  onClick={() => handlePlanChange("BUSINESS")}
                  className={`relative text-left p-5 rounded-xl border-2 transition-all duration-150 ${
                    currentPlan === "BUSINESS"
                      ? "border-violet-500 bg-violet-600 shadow-lg shadow-violet-200"
                      : "border-gray-100 bg-gray-50/60 hover:border-violet-200"
                  }`}
                >
                  {currentPlan === "BUSINESS" && (
                    <span className="absolute top-3.5 right-3.5 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-violet-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                  )}
                  <p className={`text-xs font-semibold uppercase tracking-wider mb-1 ${currentPlan === "BUSINESS" ? "text-violet-200" : "text-violet-500"}`}>Business</p>
                  <p className={`text-xl font-bold ${currentPlan === "BUSINESS" ? "text-white" : "text-gray-900"}`}>$99 <span className={`text-sm font-normal ${currentPlan === "BUSINESS" ? "text-violet-300" : "text-gray-400"}`}>/mo</span></p>
                  <p className={`text-xs mt-2 leading-relaxed ${currentPlan === "BUSINESS" ? "text-violet-200" : "text-gray-500"}`}>Everything in Free · Removes branding</p>
                </button>
              </div>

              {planLoading && (
                <div className="pb-4 flex items-center gap-2 text-sm text-gray-500">
                  <div className="w-4 h-4 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                  Updating your plan…
                </div>
              )}
            </Section>

            {/* Features checklist */}
            <Section title="What&apos;s included" description="Features available on your current plan.">
              <div className="divide-y divide-gray-50">
                {[
                  { label: "Unlimited bots", included: true },
                  { label: "Unlimited conversations", included: true },
                  { label: "PDF & document uploads", included: true },
                  { label: "Embeddable chat widget", included: true },
                  { label: "Custom bot instructions", included: true },
                  { label: 'Remove "Powered by Chaat.ai" branding', included: currentPlan === "BUSINESS" },
                  { label: "Priority support", included: currentPlan === "BUSINESS" },
                ].map((f) => (
                  <div key={f.label} className="flex items-center justify-between py-3">
                    <span className={`text-sm ${f.included ? "text-gray-700" : "text-gray-400"}`}>{f.label}</span>
                    {f.included ? (
                      <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                  </div>
                ))}
              </div>
              <div className="pb-4 pt-1">
                <Link href="/pricing" className="text-sm text-violet-600 hover:text-violet-700 font-medium transition-colors">
                  View full plan comparison →
                </Link>
              </div>
            </Section>
          </>
        )}

        {/* ── PROFILE ── */}
        {activeTab === "profile" && (
          <>
            {/* Avatar card */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_4px_rgba(0,0,0,0.04)] p-6">
              <div className="flex items-center gap-5">
                <div className="relative flex-shrink-0">
                  <div className="w-[72px] h-[72px] rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center text-white text-2xl font-bold shadow-md">
                    {initials}
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full" />
                </div>
                <div>
                  <p className="text-base font-semibold text-gray-900">{name || "Your Account"}</p>
                  <p className="text-sm text-gray-400 mt-0.5">{email}</p>
                  <div className="flex items-center gap-3 mt-2.5">
                    <span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                      <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
                      Active
                    </span>
                    <span className="text-xs text-gray-400">Member since {memberSince}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile form */}
            <Section title="Personal Information" description="This information is visible on your account.">
              <form onSubmit={handleProfileSave}>
                <FieldRow label="Full name" hint="Your display name across the platform.">
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Jane Smith"
                  />
                </FieldRow>
                <FieldRow label="Email address" hint="Email cannot be changed.">
                  <Input value={email} disabled type="email" />
                </FieldRow>
                <div className="pt-4 pb-3 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { setName(initialName); setProfileError(""); }}
                    className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    Reset
                  </button>
                  <div className="flex items-center gap-3">
                    {profileError && (
                      <p className="text-xs text-red-500">{profileError}</p>
                    )}
                    <Button type="submit" loading={profileLoading} size="sm">
                      Save changes
                    </Button>
                  </div>
                </div>
              </form>
            </Section>
          </>
        )}

        {/* ── SECURITY ── */}
        {activeTab === "security" && (
          <>
            {/* Change password */}
            <Section title="Change Password" description="Use a strong password you don't use elsewhere.">
              <form onSubmit={handlePasswordChange}>
                <FieldRow label="Current password">
                  <Input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                </FieldRow>
                <FieldRow label="New password">
                  <div>
                    <Input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                    <PasswordStrength password={newPassword} />
                  </div>
                </FieldRow>
                <FieldRow label="Confirm password">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    error={passwordError}
                  />
                </FieldRow>
                <div className="pt-4 pb-3 flex justify-end">
                  <Button type="submit" loading={passwordLoading} size="sm">
                    Update password
                  </Button>
                </div>
              </form>
            </Section>

          </>
        )}
      </div>
    </div>
  );
}
