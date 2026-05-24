"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";
import { Check } from "lucide-react";

export default function LoginPage() {
  const { signInWithGoogle, signInWithFacebook, signInWithMicrosoft } = useAuth();
  const [error, setError]     = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleLogin(provider: "google" | "facebook" | "microsoft") {
    setError(""); setLoading(provider);
    try {
      if (provider === "google")    await signInWithGoogle();
      if (provider === "facebook")  await signInWithFacebook();
      if (provider === "microsoft") await signInWithMicrosoft();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Login failed. Please try again.");
    } finally { setLoading(null); }
  }

  return (
    <div className="min-h-screen flex">

      {/* ── Left decorative panel (desktop only) ── */}
      <div className="hidden lg:flex lg:w-[45%] bg-gradient-to-br from-emerald-950 via-emerald-800 to-teal-700 flex-col items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-white/5 rounded-full" />
        <div className="absolute -bottom-20 -right-16 w-80 h-80 bg-white/5 rounded-full" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-600/10 rounded-full" />

        <div className="relative z-10 text-center max-w-sm">
          <div className="inline-flex bg-white/10 backdrop-blur-sm border border-white/20 rounded-3xl p-5 mb-7 shadow-2xl">
            <Logo className="w-16 h-16" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3 leading-tight">Umrah Calculator</h1>
          <p className="text-emerald-200 text-lg leading-relaxed mb-10">
            Plan your sacred journey with precision and ease
          </p>
          <div className="space-y-3 text-left">
            {[
              "Manage hotels with full pricing control",
              "DUBL · TRPL · QUAD · Sharing rates",
              "Adults & infants with custom fees",
              "Multi-currency with live exchange rates",
              "Printable PDF estimates",
            ].map(feat => (
              <div key={feat} className="flex items-center gap-3 text-emerald-100">
                <div className="w-5 h-5 rounded-full bg-emerald-500/50 border border-emerald-400/30 flex items-center justify-center shrink-0">
                  <Check size={10} className="text-white" />
                </div>
                <span className="text-sm">{feat}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right login panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50 dark:bg-gray-950 min-h-screen">
        <div className="w-full max-w-md">

          {/* Mobile logo */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex bg-emerald-800 dark:bg-emerald-900 rounded-2xl p-3.5 mb-3 shadow-lg">
              <Logo className="w-12 h-12" />
            </div>
            <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Umrah Calculator</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Plan your sacred journey</p>
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Welcome back</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mb-8">
              Sign in to manage your packages and hotels
            </p>

            <div className="space-y-3">
              {/* Google */}
              <button onClick={() => handleLogin("google")} disabled={!!loading}
                className="w-full flex items-center gap-4 px-5 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed group">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1 text-left">
                  {loading === "google" ? "Signing in…" : "Continue with Google"}
                </span>
                <span className="text-xs text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
              </button>

              {/* Microsoft */}
              <button onClick={() => handleLogin("microsoft")} disabled={!!loading}
                className="w-full flex items-center gap-4 px-5 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed group">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 23 23">
                  <path fill="#f25022" d="M0 0h11v11H0z"/>
                  <path fill="#00a4ef" d="M12 0h11v11H12z"/>
                  <path fill="#7fba00" d="M0 12h11v11H0z"/>
                  <path fill="#ffb900" d="M12 12h11v11H12z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1 text-left">
                  {loading === "microsoft" ? "Signing in…" : "Continue with Microsoft"}
                </span>
                <span className="text-xs text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
              </button>

              {/* Facebook */}
              <button onClick={() => handleLogin("facebook")} disabled={!!loading}
                className="w-full flex items-center gap-4 px-5 py-3.5 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 transition-all disabled:opacity-60 disabled:cursor-not-allowed group">
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 flex-1 text-left">
                  {loading === "facebook" ? "Signing in…" : "Continue with Facebook"}
                </span>
                <span className="text-xs text-gray-300 dark:text-gray-600 group-hover:text-gray-400 transition-colors">→</span>
              </button>
            </div>

            {error && (
              <div className="mt-4 px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl">
                <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
              </div>
            )}

            <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-6">
              Your data is stored securely and never shared.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
