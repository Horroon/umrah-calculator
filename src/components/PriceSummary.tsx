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
          <p className="text-xs text-gray-400 mt-0.5">Estimate generated on {new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 px-6 py-4 flex items-center justify-between gap-4 print:bg-none print:bg-emerald-700">
        <div>
          <h2 className="text-white font-semibold text-lg">Price Breakdown</h2>
          <p className="text-emerald-100 text-sm mt-0.5">
            {result.numPersons} {result.numPersons === 1 ? "person" : "persons"} · All prices per person
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="no-print flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
        >
          <Printer size={15} />
          Print / PDF
        </button>
      </div>

      <div className="p-6 space-y-3">
        {result.breakdown.map((item) => (
          <div key={item.label} className="flex justify-between items-start gap-4 text-sm">
            <span className="text-gray-600">{item.label}</span>
            <div className="text-right shrink-0">
              <div className="font-medium text-gray-900">{fmt(item.amountPKR)}</div>
              {currency !== "PKR" && (
                <div className="text-xs text-gray-400">{fmtPKR(item.amountPKR)}</div>
              )}
            </div>
          </div>
        ))}

        <div className="border-t border-gray-100 pt-3 mt-3 space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span className="flex items-center gap-1.5"><Users size={14} /> Subtotal ({result.numPersons} persons)</span>
            <div className="text-right">
              <div className="font-medium">{fmt(result.subtotalPKR)}</div>
              {currency !== "PKR" && <div className="text-xs text-gray-400">{fmtPKR(result.subtotalPKR)}</div>}
            </div>
          </div>

          {result.discountPKR > 0 && (
            <div className="flex justify-between text-sm text-emerald-600">
              <span className="flex items-center gap-1.5"><TrendingDown size={14} /> Group Discount ({result.discountLabel})</span>
              <div className="text-right">
                <div className="font-medium">−{fmt(result.discountPKR)}</div>
                {currency !== "PKR" && <div className="text-xs text-emerald-400">−{fmtPKR(result.discountPKR)}</div>}
              </div>
            </div>
          )}
        </div>

        <div className="bg-emerald-50 rounded-xl p-4 mt-2">
          <div className="flex justify-between items-center">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800"><Wallet size={16} /> Total Package</span>
            <div className="text-right">
              <div className="text-xl font-bold text-emerald-700">{fmt(result.totalPKR)}</div>
              {currency !== "PKR" && <div className="text-xs text-emerald-500">{fmtPKR(result.totalPKR)}</div>}
            </div>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-200">
            <span className="flex items-center gap-1.5 text-sm text-emerald-700"><Tag size={13} /> Per Person</span>
            <div className="text-right">
              <div className="font-bold text-emerald-600">{fmt(result.totalPerPersonPKR)}</div>
              {currency !== "PKR" && <div className="text-xs text-emerald-400">{fmtPKR(result.totalPerPersonPKR)}</div>}
            </div>
          </div>
        </div>

        <p className="text-xs text-gray-400 pt-1">
          * Flight fares are in PKR. Other amounts converted at indicative rates. Prices are estimates and may vary.
        </p>
      </div>
    </div>
  );
}
