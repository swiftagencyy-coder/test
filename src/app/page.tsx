"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import {
  ArrowRight,
  Instagram,
  Users,
  Sparkles,
  ShieldCheck,
  BarChart3,
  CheckCircle2
} from "lucide-react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center gap-2" href="#">
          <Instagram className="h-6 w-6 text-pink-600" />
          <span className="font-bold text-xl tracking-tight text-slate-900">InstaOutreachOS</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-pink-600 transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-pink-600 transition-colors" href="#compliance">
            Compliance
          </Link>
          {session ? (
            <Link href="/dashboard">
              <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link href="/api/auth/signin">
              <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800">
                Log In
              </Button>
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-slate-50 to-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-full bg-pink-100 px-3 py-1 text-sm font-semibold text-pink-700 mb-4">
                  The #1 Human-In-The-Loop Outreach Platform
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl/none text-slate-900 max-w-4xl mx-auto">
                  Scale Your Instagram Outreach <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600">Compliantly</span>.
                </h1>
                <p className="mx-auto max-w-[700px] text-slate-500 md:text-xl dark:text-slate-400 mt-6 leading-relaxed">
                  Automate the strategy, personalize with AI, but keep the human touch.
                  Reach your ideal prospects without risking your account.
                </p>
              </div>
              <div className="space-x-4 mt-8">
                {session ? (
                  <Link href="/dashboard">
                    <Button size="lg" className="px-8 bg-slate-900 hover:bg-slate-800 text-lg shadow-xl shadow-slate-200">
                      Open Dashboard <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/api/auth/signin">
                    <Button size="lg" className="px-8 bg-slate-900 hover:bg-slate-800 text-lg shadow-xl shadow-slate-200">
                      Start Growing Now <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                )}
                <Button variant="outline" size="lg" className="px-8 border-slate-200 text-lg">
                  Watch Demo
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-400 pt-8">
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  No Bots
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  AI Personalization
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Safe & Secure
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-white">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center mb-16">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  Built for Modern Outreach
                </h2>
                <p className="max-w-[800px] text-slate-500 md:text-xl leading-relaxed">
                  Ditch the spreadsheet and the risky bots. InstaOutreachOS gives you a professional operating system for growth.
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-pink-100 rounded-xl">
                  <Users className="h-8 w-8 text-pink-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Smart CRM</h3>
                <p className="text-slate-500 text-center">
                  Import thousands of leads via CSV. Automatically deduplicate and track their status through your pipeline.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Sparkles className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">AI Personalization</h3>
                <p className="text-slate-500 text-center">
                  Our AI reads lead bios and posts to craft unique, high-converting messages. Say goodbye to generic templetes.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl transition-all duration-300">
                <div className="p-3 bg-emerald-100 rounded-xl">
                  <BarChart3 className="h-8 w-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">Daily Queue</h3>
                <p className="text-slate-500 text-center">
                  Get a fresh list of tasks every morning. Copy the AI draft, click "Open Profile", and hit send.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Compliance Section */}
        <section id="compliance" className="w-full py-12 md:py-24 lg:py-32 bg-slate-900 text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-pink-600/10 rounded-full blur-3xl"></div>
          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-400 border border-emerald-500/20">
                  Compliance First
                </div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
                  Account Safety is Our Priority.
                </h2>
                <p className="text-slate-400 text-lg leading-relaxed">
                  Instagram detects and bans automated bots. That's why InstaOutreachOS never interacts with the Instagram API on your behalf.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-400 mt-1" />
                    <span><strong>Human-in-the-loop:</strong> You perform the final action, keeping your account within safety limits.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-400 mt-1" />
                    <span><strong>No Password Needed:</strong> We don't ask for your IG password. You use your own browser.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <ShieldCheck className="h-6 w-6 text-emerald-400 mt-1" />
                    <span><strong>Rate Limiting:</strong> Intelligent caps on daily tasks prevent you from looking like a spammer.</span>
                  </li>
                </ul>
              </div>
              <div className="relative rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-2xl">
                <div className="flex items-center gap-2 border-b border-slate-800 pb-4 mb-4">
                  <div className="h-3 w-3 rounded-full bg-rose-500"></div>
                  <div className="h-3 w-3 rounded-full bg-amber-500"></div>
                  <div className="h-3 w-3 rounded-full bg-emerald-500"></div>
                </div>
                <div className="space-y-4">
                  <div className="h-8 w-3/4 rounded bg-slate-800/50 animate-pulse"></div>
                  <div className="h-24 w-full rounded bg-slate-800/50 animate-pulse"></div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-12 w-full rounded bg-slate-800/50 animate-pulse"></div>
                    <div className="h-12 w-full rounded bg-slate-800/50 animate-pulse"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl text-slate-900">
                  Start Your Outreach Journey Today
                </h2>
                <p className="mx-auto max-w-[600px] text-slate-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Join hundreds of agencies and marketers scaling their outbound on Instagram legally.
                </p>
              </div>
              <div className="w-full max-w-sm space-y-2">
                <Link href="/api/auth/signin">
                  <Button size="lg" className="w-full bg-slate-900 text-white hover:bg-slate-800">
                    Get Started Free
                  </Button>
                </Link>
                <p className="text-xs text-slate-500">
                  No credit card required. Cancel anytime.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-slate-500">
          © 2026 InstaOutreachOS. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4 text-slate-500" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4 text-slate-500" href="#">
            Privacy Policy
          </Link>
        </nav>
      </footer>
    </div>
  );
}
