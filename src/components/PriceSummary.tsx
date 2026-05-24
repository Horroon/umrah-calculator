"use client";

import type { Currency, CalculationResult } from "@/types";
import { convertFromPKR, formatCurrency } from "@/lib/calculator";
import { Users, Baby, Tag, TrendingDown, Wallet, Printer, Link, Check } from "lucide-react";
import Logo from "@/components/Logo";
import { useState } from "react";

interface Props {
  result: CalculationResult;
  currency: Currency;
  customRates?: Partial<Record<string, number>>;
}

export default function PriceSummary({ result, currency, customRates }: Props) {
  const [copied, setCopied] = useState(false);

  const fmt    = (pkr: number) => formatCurrency(convertFromPKR(pkr, currency, customRates), currency);
  const fmtPKR = (pkr: number) => formatCurrency(pkr, "PKR");

  function copyLink() {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const showInfants = result.numInfants > 0;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">

      {/* Print-only header */}
      <div className="hidden print:flex items-center gap-3 px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="bg-emerald-800 rounded-xl p-1.5 shrink-0">
          <Logo className="w-8 h-8" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-emerald-800 leading-tight">Umrah Calculator</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            Estimate generated on{" "}
            {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>
      </div>

      {/* Card header */}
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-white font-semibold text-base sm:text-lg">Price Breakdown</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-0.5">
            {result.numAdults} adult{result.numAdults !== 1 ? "s" : ""}
            {showInfants && ` · ${result.numInfants} infant${result.numInfants !== 1 ? "s" : ""}`}
            {" · per-person rates"}
          </p>
        </div>
        <div className="no-print flex items-center gap-2 shrink-0">
          <button
            onClick={copyLink}
            className={`flex items-center gap-1.5 text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-lg transition-all cursor-pointer
              ${copied ? "bg-white/30 text-white" : "bg-white/20 hover:bg-white/30 text-white"}`}
          >
            {copied ? <Check size={14} /> : <Link size={14} />}
            <span className="hidden sm:inline">{copied ? "Copied!" : "Copy Link"}</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
          >
            <Printer size={14} />
            <span className="hidden sm:inline">Print / PDF</span>
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-2.5">
        {/* Breakdown rows */}
        {result.breakdown.map((item) => {
          const totalPKR = item.adultAmountPKR + item.infantAmountPKR;
          return (
            <div key={item.label} className="flex justify-between items-start gap-3 text-sm">
              <div className="min-w-0 flex-1">
                <span className="text-gray-600 dark:text-gray-400 leading-snug">{item.label}</span>
                {showInfants && item.infantAmountPKR > 0 && (
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                    <Baby size={10} />
                    <span>+{fmtPKR(item.infantAmountPKR)} infants</span>
                  </div>
                )}
              </div>
              <div className="text-right shrink-0">
                <div className="font-medium text-gray-900 dark:text-gray-100 whitespace-nowrap">{fmt(totalPKR)}</div>
                {currency !== "PKR" && (
                  <div className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">{fmtPKR(totalPKR)}</div>
                )}
              </div>
            </div>
          );
        })}

        {/* Subtotals */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2">
          {showInfants && (
            <>
              <div className="flex justify-between items-start gap-3 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5 shrink-0">
                  <Users size={13} />Adults subtotal ({result.numAdults})
                </span>
                <div className="text-right">
                  <div className="font-medium whitespace-nowrap">{fmt(result.adultSubtotalPKR)}</div>
                  {currency !== "PKR" && <div className="text-xs opacity-70 whitespace-nowrap">{fmtPKR(result.adultSubtotalPKR)}</div>}
                </div>
              </div>
              <div className="flex justify-between items-start gap-3 text-sm text-amber-600 dark:text-amber-400">
                <span className="flex items-center gap-1.5 shrink-0">
                  <Baby size={13} />Infants subtotal ({result.numInfants})
                </span>
                <div className="text-right">
                  <div className="font-medium whitespace-nowrap">{fmt(result.infantSubtotalPKR)}</div>
                  {currency !== "PKR" && <div className="text-xs opacity-70 whitespace-nowrap">{fmtPKR(result.infantSubtotalPKR)}</div>}
                </div>
              </div>
            </>
          )}

          <div className="flex justify-between items-start gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5 shrink-0">
              <Users size={13} />Subtotal ({result.numAdults + result.numInfants} pax)
            </span>
            <div className="text-right">
              <div className="font-medium whitespace-nowrap">{fmt(result.subtotalPKR)}</div>
              {currency !== "PKR" && <div className="text-xs opacity-70 whitespace-nowrap">{fmtPKR(result.subtotalPKR)}</div>}
            </div>
          </div>

          {result.discountPKR > 0 && (
            <div className="flex justify-between items-start gap-3 text-sm text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1.5 shrink-0">
                <TrendingDown size={13} />Group Discount ({result.discountLabel})
              </span>
              <div className="text-right">
                <div className="font-medium whitespace-nowrap">−{fmt(result.discountPKR)}</div>
                {currency !== "PKR" && <div className="text-xs opacity-70 whitespace-nowrap">−{fmtPKR(result.discountPKR)}</div>}
              </div>
            </div>
          )}
        </div>

        {/* Total box */}
        <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3 sm:p-4">
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300 text-sm sm:text-base">
              <Wallet size={15} />Total
            </span>
            <div className="text-right">
              <div className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
                {fmt(result.totalPKR)}
              </div>
              {currency !== "PKR" && (
                <div className="text-xs text-emerald-500 whitespace-nowrap">{fmtPKR(result.totalPKR)}</div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800 gap-3">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 shrink-0">
              <Tag size={12} />Per Adult
            </span>
            <div className="text-right">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                {fmt(result.totalPerAdultPKR)}
              </div>
              {currency !== "PKR" && (
                <div className="text-xs text-emerald-400 dark:text-emerald-500 whitespace-nowrap">
                  {fmtPKR(result.totalPerAdultPKR)}
                </div>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
          * Flight fares in PKR. Conversions are indicative. Hotel prices per person per night. Prices may vary.
        </p>
      </div>
    </div>
  );
}
