"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    setLoading(false);
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center mb-7">
            <Image
              src="/logo.png"
              alt="Chaat.ai"
              width={360}
              height={96}
              className="w-36 h-auto object-contain"
            />
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Reset your password
          </h1>
          <p className="text-slate-500 mt-1.5 text-sm">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {submitted ? (
            <div className="text-center py-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-base font-semibold text-slate-900 mb-2">Check your inbox</h2>
              <p className="text-sm text-slate-500 leading-relaxed">
                If <span className="font-medium text-slate-700">{email}</span> is registered, you&apos;ll receive a password reset link shortly.
              </p>
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 mt-6 text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                required
              />
              <Button
                type="submit"
                loading={loading}
                className="w-full !py-2.5 !text-sm !font-semibold"
                size="lg"
              >
                Send reset link
              </Button>
            </form>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Remember your password?{" "}
          <Link href="/login" className="text-violet-600 hover:text-violet-700 font-semibold">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
