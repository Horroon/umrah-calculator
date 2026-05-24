"use client";

import { useState, useMemo } from "react";
import type { PackageTier, Currency } from "@/types";
import { PACKAGES, FLIGHT_OPTIONS } from "@/data/packages";
import { calculate } from "@/lib/calculator";
import PackageCard from "@/components/PackageCard";
import CurrencySelector from "@/components/CurrencySelector";
import PriceSummary from "@/components/PriceSummary";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import { MapPin, Users, Moon } from "lucide-react";

export default function Home() {
  const [selectedTier, setSelectedTier] = useState<PackageTier>("silver");
  const [departureCity, setDepartureCity] = useState(FLIGHT_OPTIONS[0].city);
  const [numPersons, setNumPersons] = useState(2);
  const [currency, setCurrency] = useState<Currency>("PKR");

  const result = useMemo(
    () => calculate(selectedTier, departureCity, numPersons),
    [selectedTier, departureCity, numPersons]
  );

  const selectedPkg = PACKAGES.find((p) => p.tier === selectedTier)!;

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 dark:bg-emerald-900 rounded-xl p-2 shrink-0">
              <Logo className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 leading-tight">
                  Umrah Calculator
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                  PKR
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
                Estimate your Umrah journey cost
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Display in:</span>
            <CurrencySelector value={currency} onChange={setCurrency} />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-5 sm:space-y-8 print-only-summary">

        {/* Package Selection */}
        <section className="no-print">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            1. Choose Your Package
          </h2>
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-3 sm:gap-4">
            {PACKAGES.map((pkg) => (
              <PackageCard
                key={pkg.tier}
                pkg={pkg}
                selected={selectedTier === pkg.tier}
                onSelect={() => setSelectedTier(pkg.tier)}
              />
            ))}
          </div>
        </section>

        {/* Trip Details */}
        <section className="no-print bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 sm:mb-5">
            2. Trip Details
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
            {/* Departure City */}
            <div>
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin size={13} className="text-emerald-600 dark:text-emerald-500" />
                Departure City
              </label>
              <select
                value={departureCity}
                onChange={(e) => setDepartureCity(e.target.value)}
                className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
              >
                {FLIGHT_OPTIONS.map((f) => (
                  <option key={f.city} value={f.city}>{f.city}</option>
                ))}
              </select>
            </div>

            {/* Number of Persons */}
            <div>
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Users size={13} className="text-emerald-600 dark:text-emerald-500" />
                Persons
              </label>
              <div className="flex items-center gap-2 sm:gap-3">
                <button
                  onClick={() => setNumPersons((n) => Math.max(1, n - 1))}
                  className="w-9 h-9 shrink-0 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-lg leading-none"
                >
                  −
                </button>
                <span className="text-xl font-bold text-gray-800 dark:text-gray-100 flex-1 text-center">
                  {numPersons}
                </span>
                <button
                  onClick={() => setNumPersons((n) => Math.min(50, n + 1))}
                  className="w-9 h-9 shrink-0 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-lg leading-none"
                >
                  +
                </button>
              </div>
              {numPersons >= 5 && (
                <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1.5 font-medium">
                  Group discount!
                </p>
              )}
            </div>

            {/* Duration — full-width on mobile */}
            <div className="col-span-2 sm:col-span-1">
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <Moon size={13} className="text-emerald-600 dark:text-emerald-500" />
                Total Duration
              </label>
              <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl px-4 py-2.5 flex sm:block items-center justify-between">
                <div className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                  {selectedPkg.nightsMakkah + selectedPkg.nightsMadinah} Nights
                </div>
                <div className="text-xs text-emerald-600 dark:text-emerald-500">
                  {selectedPkg.nightsMakkah}N Makkah · {selectedPkg.nightsMadinah}N Madinah
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Price Summary */}
        <section className="price-summary-section">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 no-print">
            3. Your Estimate
          </h2>
          <PriceSummary result={result} currency={currency} />
        </section>

        {/* Disclaimer */}
        <footer className="no-print text-center text-xs text-gray-400 dark:text-gray-500 pb-6 sm:pb-8">
          <p>Prices are indicative estimates based on current market rates.</p>
          <p className="mt-1">Flight fares displayed in PKR · Conversion rates are approximate.</p>
        </footer>
      </div>
    </main>
  );
}
