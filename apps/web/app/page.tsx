import Link from "next/link";
import Image from "next/image";
import LandingNavbar from "@/components/landing/Navbar";

const features = [
  {
    title: "Trains on your exact content",
    description:
      "Upload PDFs, FAQs, product guides — anything. Your bot learns only from what you provide. No outside knowledge, no surprises.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "text-violet-600 bg-violet-50",
  },
  {
    title: "Zero hallucinations",
    description:
      "If the answer isn't in your docs, your bot says so — politely. No guessing, no making things up, no embarrassing wrong answers.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    color: "text-emerald-600 bg-emerald-50",
  },
  {
    title: "Live on your site in 60 seconds",
    description:
      "Copy one line of code and paste it before </body>. That's it. Works with Webflow, WordPress, Shopify, or any custom site.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    color: "text-amber-600 bg-amber-50",
  },
  {
    title: "Available around the clock",
    description:
      "Handle customer questions at 3am, on weekends, during the holidays. Your bot never takes a break, never calls in sick.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "text-blue-600 bg-blue-50",
  },
  {
    title: "Conversations that feel natural",
    description:
      "Multi-turn memory keeps context across the whole conversation. Customers can follow up, rephrase, and explore — just like talking to a real person.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    ),
    color: "text-pink-600 bg-pink-50",
  },
  {
    title: "Your brand, your personality",
    description:
      "Give your bot a name, a tone, a set of rules. Friendly? Professional? Concise? You decide exactly how it represents your brand.",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
      </svg>
    ),
    color: "text-indigo-600 bg-indigo-50",
  },
];

const steps = [
  {
    step: "01",
    title: "Upload your content",
    desc: "Add your FAQs, product docs, support guides — any PDF or text file. We process and index everything automatically.",
    detail: "PDF, TXT · Processes in seconds",
  },
  {
    step: "02",
    title: "Customize your bot",
    desc: "Give it a name, set its tone, define its focus. Whether it's formal support or a casual brand voice — you're in control.",
    detail: "No coding · Takes 2 minutes",
  },
  {
    step: "03",
    title: "Go live instantly",
    desc: "Copy one JavaScript snippet and paste it on your website. Your bot appears immediately — no deployments, no waiting.",
    detail: "One line of code · Works everywhere",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <LandingNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-40 right-0 w-[600px] h-[600px] bg-gradient-to-bl from-violet-100/60 to-transparent rounded-full blur-3xl" />
          <div className="absolute top-60 -left-20 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-70" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 pt-16 pb-20 lg:pt-24 lg:pb-28">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            {/* Left: Copy */}
            <div>
              <div className="inline-flex items-center gap-2 bg-violet-50 border border-violet-100/80 text-violet-700 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-violet-500 rounded-full animate-pulse" />
                AI Customer Support · Instant Setup
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-[52px] font-bold text-slate-900 leading-[1.1] tracking-tight mb-5">
                Turn your docs into a{" "}
                <span className="bg-gradient-to-r from-violet-600 to-indigo-500 bg-clip-text text-transparent">
                  24/7 AI assistant
                </span>
              </h1>

              <p className="text-lg text-slate-500 leading-relaxed mb-8 max-w-lg">
                Upload your knowledge base, create a chatbot, and embed it on your website. 
                Customers get instant, accurate answers — always from <em className="not-italic font-semibold text-slate-700">your</em> content.
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-7">
                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-semibold px-7 py-3.5 rounded-2xl text-base transition-all shadow-lg shadow-violet-200 hover:shadow-violet-300 hover:-translate-y-0.5"
                >
                  Build your bot for free
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="text-sm font-medium text-slate-500 hover:text-slate-800 transition-colors flex items-center gap-1.5"
                >
                  Already have an account? Sign in
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-5 text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  No credit card required
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Live in under 5 minutes
                </span>
                <span className="flex items-center gap-1.5">
                  <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Works on any website
                </span>
              </div>
            </div>

            {/* Right: Chat Demo Mockup */}
            <div className="flex justify-center lg:justify-end">
              <div className="relative w-full max-w-sm py-4 px-4 lg:px-0">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-violet-200 to-indigo-200 rounded-3xl blur-2xl opacity-30 scale-110" />

                {/* Chat widget */}
                <div className="relative bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden">
                  {/* Chat header */}
                  <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4 flex items-center gap-3">
                    <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center">
                      <svg className="w-4.5 h-4.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-white font-semibold text-sm">Support Assistant</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                        <span className="text-white/70 text-xs">Online now</span>
                      </div>
                    </div>
                    <div className="ml-auto flex gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                      <div className="w-2 h-2 rounded-full bg-white/30" />
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-4 space-y-3 bg-slate-50/40 min-h-[200px]">
                    <div className="flex gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-700 shadow-sm border border-slate-100 max-w-[80%]">
                        Hey! 👋 How can I help you today?
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-violet-600 rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-white max-w-[80%]">
                        What&apos;s your refund policy?
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-700 shadow-sm border border-slate-100 max-w-[85%]">
                        We offer a <span className="font-semibold text-violet-600">30-day money-back guarantee</span>. Simply reach out within 30 days of purchase for a full refund — no questions asked. ✓
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <div className="bg-violet-600 rounded-2xl rounded-tr-sm px-3.5 py-2.5 text-sm text-white max-w-[80%]">
                        How do I request one?
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <div className="w-7 h-7 bg-gradient-to-br from-violet-500 to-indigo-600 rounded-xl flex-shrink-0 flex items-center justify-center">
                        <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                      </div>
                      <div className="bg-white rounded-2xl rounded-tl-sm px-3.5 py-2.5 text-sm text-slate-700 shadow-sm border border-slate-100 max-w-[85%]">
                        Email <span className="font-medium text-slate-900">support@company.com</span> with your order number and we&apos;ll process it within 24 hours.
                      </div>
                    </div>
                  </div>

                  {/* Input bar */}
                  <div className="px-4 py-3.5 bg-white border-t border-slate-100 flex items-center gap-2.5">
                    <div className="flex-1 bg-slate-50 rounded-xl px-4 py-2.5 text-sm text-slate-400 border border-slate-100">
                      Ask a question...
                    </div>
                    <div className="w-9 h-9 bg-violet-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
                <div className="absolute -top-3 -right-3 bg-white border border-slate-100 shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2">
                  <span className="text-lg">⚡</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">Instant reply</p>
                    <p className="text-xs text-slate-400">0.3s response</p>
                  </div>
                </div>

                {/* Bottom badge */}
                <div className="absolute -bottom-3 -left-3 bg-white border border-slate-100 shadow-lg rounded-2xl px-3 py-2 flex items-center gap-2">
                  <span className="text-lg">✅</span>
                  <div>
                    <p className="text-xs font-bold text-slate-900">100% accurate</p>
                    <p className="text-xs text-slate-400">From your docs only</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof bar */}
      <div className="border-y border-slate-100 bg-slate-50/50 py-6">
        <div className="max-w-5xl mx-auto px-6">
          {/* Stats */}
          <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-12 mb-5">
            {[
              { value: "1,200+", label: "Bots created" },
              { value: "50,000+", label: "Conversations handled" },
              { value: "< 60 sec", label: "Average setup time" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-lg font-bold text-slate-900">{stat.value}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
          {/* Benefit tags */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 text-center">
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Perfect for</p>
            <div className="flex flex-wrap justify-center gap-2">
              {["Stop answering repeat questions", "Support customers 24/7", "Scale without hiring", "Launch in minutes"].map((tag) => (
                <span key={tag} className="bg-white border border-slate-200 text-slate-600 text-xs font-medium px-3 py-1.5 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-4">
              Everything your customers need.
              <br />
              <span className="text-slate-400">None of what they don&apos;t.</span>
            </h2>
            <p className="text-lg text-slate-500">
              Simple to set up. Incredibly effective for your customers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
              >
                <div className={`w-10 h-10 ${feature.color} rounded-xl flex items-center justify-center mb-4`}>
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-slate-900 mb-2 text-sm">
                  {feature.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-24 bg-slate-50/70">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight mb-3">
              From signup to live in 5 minutes
            </h2>
            <p className="text-slate-500 text-lg">
              No technical setup. No developer needed. Really.
            </p>
          </div>

          <div className="space-y-4">
            {steps.map((item, i) => (
              <div
                key={item.step}
                className="flex items-start gap-5 bg-white rounded-2xl p-7 border border-slate-100 shadow-sm"
              >
                <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-violet-500 to-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-base shadow-sm shadow-violet-200/60">
                  {i + 1}
                </div>
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                    <h3 className="font-semibold text-slate-900 text-lg">{item.title}</h3>
                    <span className="inline-flex items-center text-xs font-medium text-violet-600 bg-violet-50 border border-violet-100 px-2.5 py-0.5 rounded-full w-fit">
                      {item.detail}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases strip */}
      <section id="use-cases" className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight mb-3">
              Built for any team with a website
            </h2>
            <p className="text-slate-500 text-base">
              Whatever your industry, your customers have questions. Your bot has answers.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                emoji: "🛒",
                title: "E-commerce",
                desc: "Answer questions about shipping, returns, sizing, and product details — without your team lifting a finger.",
                cta: "Build a store bot",
              },
              {
                emoji: "🖥️",
                title: "SaaS & Tech",
                desc: "Turn your help docs into an interactive assistant. Onboard users faster and reduce support tickets instantly.",
                cta: "Build a docs bot",
              },
              {
                emoji: "🏢",
                title: "Agencies & Consultants",
                desc: "Build branded bots for clients in minutes. Deliver a premium AI support experience as part of your offering.",
                cta: "Build a client bot",
              },
            ].map((uc) => (
              <div key={uc.title} className="group bg-gradient-to-b from-slate-50 to-white border border-slate-100 rounded-2xl p-7 flex flex-col hover:border-violet-100 hover:shadow-sm transition-all duration-200">
                <div className="text-3xl mb-4">{uc.emoji}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{uc.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed flex-1">{uc.desc}</p>
                <Link
                  href="/signup"
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-violet-600 hover:text-violet-700 transition-colors"
                >
                  {uc.cta}
                  <svg className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="relative overflow-hidden bg-gradient-to-br from-violet-600 via-violet-600 to-indigo-700 rounded-3xl p-12 md:p-16 text-center shadow-2xl shadow-violet-200/60">
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>
            <div className="relative">
              <p className="text-violet-300 text-sm font-semibold uppercase tracking-widest mb-4">
                Start for free today
              </p>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">
                Stop answering the same
                <br />questions over and over.
              </h2>
              <p className="text-violet-200 text-lg mb-8 max-w-md mx-auto">
                Let your bot handle it. You focus on building.
              </p>
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 bg-white hover:bg-violet-50 text-violet-700 font-semibold px-8 py-3.5 rounded-2xl text-base transition-all shadow-lg hover:-translate-y-0.5"
              >
                Create your free bot
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="mt-4 text-violet-300/70 text-sm">No credit card · Cancel anytime · Up in minutes</p>
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
            <Link href="/#features" className="hover:text-slate-600 transition-colors">Features</Link>
            <Link href="/pricing" className="hover:text-slate-600 transition-colors">Pricing</Link>
            <Link href="/login" className="hover:text-slate-600 transition-colors">Sign in</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
