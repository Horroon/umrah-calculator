"use client";

import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Logo from "@/components/Logo";

export default function LoginPage() {
  const { signInWithGoogle, signInWithFacebook, signInWithMicrosoft } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<string | null>(null);

  async function handleLogin(provider: "google" | "facebook" | "microsoft") {
    setError("");
    setLoading(provider);
    try {
      if (provider === "google")    await signInWithGoogle();
      if (provider === "facebook")  await signInWithFacebook();
      if (provider === "microsoft") await signInWithMicrosoft();
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Login failed. Please try again.";
      setError(msg);
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo + title */}
        <div className="text-center mb-8">
          <div className="inline-flex bg-emerald-800 dark:bg-emerald-900 rounded-2xl p-3 mb-4">
            <Logo className="w-12 h-12" />
          </div>
          <h1 className="text-2xl font-bold text-emerald-800 dark:text-emerald-400">Umrah Calculator</h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Sign in to manage your packages & hotels</p>
        </div>

        {/* Login card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm p-6 space-y-3">
          <p className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider text-center mb-4">
            Continue with
          </p>

          {/* Google */}
          <button
            onClick={() => handleLogin("google")}
            disabled={!!loading}
            className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {loading === "google" ? "Signing in…" : "Continue with Google"}
            </span>
          </button>

          {/* Microsoft */}
          <button
            onClick={() => handleLogin("microsoft")}
            disabled={!!loading}
            className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 23 23">
              <path fill="#f25022" d="M0 0h11v11H0z"/>
              <path fill="#00a4ef" d="M12 0h11v11H12z"/>
              <path fill="#7fba00" d="M0 12h11v11H0z"/>
              <path fill="#ffb900" d="M12 12h11v11H12z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {loading === "microsoft" ? "Signing in…" : "Continue with Microsoft"}
            </span>
          </button>

          {/* Facebook */}
          <button
            onClick={() => handleLogin("facebook")}
            disabled={!!loading}
            className="w-full flex items-center gap-3 px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
              {loading === "facebook" ? "Signing in…" : "Continue with Facebook"}
            </span>
          </button>

          {error && (
            <p className="text-xs text-red-500 text-center pt-1">{error}</p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 dark:text-gray-500 mt-4">
          Your hotel data is stored securely in your account.
        </p>
      </div>
    </div>
  );
}
