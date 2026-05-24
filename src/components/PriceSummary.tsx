"use client";

import type { Currency } from "@/types";
import type { CalculationResult } from "@/lib/calculator";
import { convertFromPKR, formatCurrency } from "@/lib/calculator";
import { Users, Tag, TrendingDown, Wallet, Printer } from "lucide-react";
import Logo from "@/components/Logo";

interface Props {
  result: CalculationResult;
  currency: Currency;
}

export default function PriceSummary({ result, currency }: Props) {
  const fmt = (pkr: number) => formatCurrency(convertFromPKR(pkr, currency), currency);
  const fmtPKR = (pkr: number) => formatCurrency(pkr, "PKR");

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
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
      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-4 sm:px-6 py-4 flex items-center justify-between gap-3 print:bg-none print:bg-emerald-700">
        <div className="min-w-0">
          <h2 className="text-white font-semibold text-base sm:text-lg">Price Breakdown</h2>
          <p className="text-emerald-100 text-xs sm:text-sm mt-0.5 truncate">
            {result.numPersons} {result.numPersons === 1 ? "person" : "persons"} · Per person prices
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print shrink-0 flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Printer size={14} />
          <span>Print / PDF</span>
        </button>
      </div>

      {/* Breakdown rows */}
      <div className="p-4 sm:p-6 space-y-3">
        {result.breakdown.map((item) => (
          <div key={item.label} className="flex justify-between items-start gap-3 text-sm">
            <span className="text-gray-600 min-w-0 leading-snug">{item.label}</span>
            <div className="text-right shrink-0">
              <div className="font-medium text-gray-900 whitespace-nowrap">{fmt(item.amountPKR)}</div>
              {currency !== "PKR" && (
                <div className="text-xs text-gray-400 whitespace-nowrap">{fmtPKR(item.amountPKR)}</div>
              )}
            </div>
          </div>
        ))}

        {/* Subtotal + discount */}
        <div className="border-t border-gray-100 pt-3 mt-1 space-y-2">
          <div className="flex justify-between items-start gap-3 text-sm text-gray-600">
            <span className="flex items-center gap-1.5 shrink-0">
              <Users size={13} />
              <span>Subtotal ({result.numPersons})</span>
            </span>
            <div className="text-right">
              <div className="font-medium whitespace-nowrap">{fmt(result.subtotalPKR)}</div>
              {currency !== "PKR" && (
                <div className="text-xs text-gray-400 whitespace-nowrap">{fmtPKR(result.subtotalPKR)}</div>
              )}
            </div>
          </div>

          {result.discountPKR > 0 && (
            <div className="flex justify-between items-start gap-3 text-sm text-emerald-600">
              <span className="flex items-center gap-1.5 shrink-0">
                <TrendingDown size={13} />
                <span>Discount ({result.discountLabel})</span>
              </span>
              <div className="text-right">
                <div className="font-medium whitespace-nowrap">−{fmt(result.discountPKR)}</div>
                {currency !== "PKR" && (
                  <div className="text-xs text-emerald-400 whitespace-nowrap">−{fmtPKR(result.discountPKR)}</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Total box */}
        <div className="bg-emerald-50 rounded-xl p-3 sm:p-4 mt-1">
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800 text-sm sm:text-base">
              <Wallet size={15} /> Total
            </span>
            <div className="text-right">
              <div className="text-lg sm:text-xl font-bold text-emerald-700 whitespace-nowrap">
                {fmt(result.totalPKR)}
              </div>
              {currency !== "PKR" && (
                <div className="text-xs text-emerald-500 whitespace-nowrap">{fmtPKR(result.totalPKR)}</div>
              )}
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-200 gap-3">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-700 shrink-0">
              <Tag size={12} /> Per Person
            </span>
            <div className="text-right">
              <div className="font-bold text-emerald-600 whitespace-nowrap">{fmt(result.totalPerPersonPKR)}</div>
              {currency !== "PKR" && (
                <div className="text-xs text-emerald-400 whitespace-nowrap">{fmtPKR(result.totalPerPersonPKR)}</div>
              )}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-1">
          * Flight fares in PKR. Conversions are indicative. Prices may vary.
        </p>
      </div>
    </div>
  );
}
