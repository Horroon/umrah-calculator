"use client";

import type { CalculationResult } from "@/types";
import { formatCurrency } from "@/lib/calculator";
import { Users, Baby, Tag, Wallet, Printer, Link, Check, ChevronDown } from "lucide-react";
import Logo from "@/components/Logo";
import { useState } from "react";

interface Props {
  result: CalculationResult;
  onPrint: (mode: "with-prices" | "client") => void;
}

function fmt(pkr: number) {
  return formatCurrency(pkr, "PKR");
}

export default function PriceSummary({ result, onPrint }: Props) {
  const [copied, setCopied] = useState(false);
  const [printMenuOpen, setPrintMenuOpen] = useState(false);

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
            {" · per-person rates · all amounts in PKR"}
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
          <div className="relative">
            <button
              onClick={() => setPrintMenuOpen((o) => !o)}
              className="flex items-center gap-1.5 bg-white/20 hover:bg-white/30 text-white text-xs sm:text-sm font-medium px-2.5 sm:px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <Printer size={14} />
              <span className="hidden sm:inline">Print / PDF</span>
              <ChevronDown size={12} className={`transition-transform ${printMenuOpen ? "rotate-180" : ""}`} />
            </button>
            {printMenuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setPrintMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden w-52 text-left">
                  <button
                    onClick={() => { setPrintMenuOpen(false); onPrint("with-prices"); }}
                    className="w-full flex flex-col px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-left"
                  >
                    <span className="text-sm font-medium text-gray-800">With Prices</span>
                    <span className="text-xs text-gray-400">Full breakdown with amounts</span>
                  </button>
                  <div className="border-t border-gray-100" />
                  <button
                    onClick={() => { setPrintMenuOpen(false); onPrint("client"); }}
                    className="w-full flex flex-col px-4 py-2.5 hover:bg-gray-50 cursor-pointer text-left"
                  >
                    <span className="text-sm font-medium text-gray-800">Client Copy</span>
                    <span className="text-xs text-gray-400">Services + total only</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-6 space-y-2.5">
        {/* Breakdown rows */}
        {result.breakdown.map((item) => (
          <div key={item.label} className="flex justify-between items-start gap-3 text-sm">
            <div className="min-w-0 flex-1">
              <span className="text-gray-600 dark:text-gray-400 leading-snug">{item.label}</span>
              {showInfants && item.infantAmountPKR > 0 && (
                <div className="flex items-center gap-1 mt-0.5 text-xs text-amber-600 dark:text-amber-400">
                  <Baby size={10} />
                  <span>{result.numInfants} infant{result.numInfants !== 1 ? "s" : ""}</span>
                </div>
              )}
            </div>
            <div className="text-right shrink-0">
              <div className="font-medium whitespace-nowrap">
                {item.adultAmountPKR > 0
                  ? <span className="text-gray-900 dark:text-gray-100">{fmt(item.adultAmountPKR)}</span>
                  : item.infantAmountPKR > 0
                    ? <span className="text-amber-600 dark:text-amber-400">{fmt(item.infantAmountPKR)}</span>
                    : <span className="text-gray-300">—</span>
                }
              </div>
            </div>
          </div>
        ))}

        {/* Subtotals */}
        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2">
          <div className="flex justify-between items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-1.5 shrink-0">
              <Users size={13} />Subtotal ({result.numAdults} adult{result.numAdults !== 1 ? "s" : ""})
            </span>
            <span className="font-medium whitespace-nowrap">{fmt(result.subtotalPKR)}</span>
          </div>

          {showInfants && (
            <div className="flex justify-between items-center gap-3 text-sm text-amber-600 dark:text-amber-400">
              <span className="flex items-center gap-1.5 shrink-0">
                <Baby size={13} />Infant Charges ({result.numInfants} infant{result.numInfants !== 1 ? "s" : ""})
              </span>
              <span className="font-medium whitespace-nowrap">+{fmt(result.infantSubtotalPKR)}</span>
            </div>
          )}

        </div>

        {/* Total box */}
        <div className="bg-emerald-50 dark:bg-emerald-900/30 rounded-xl p-3 sm:p-4">
          <div className="flex justify-between items-center gap-3">
            <span className="flex items-center gap-1.5 font-semibold text-emerald-800 dark:text-emerald-300 text-sm sm:text-base">
              <Wallet size={15} />Total
            </span>
            <span className="text-lg sm:text-xl font-bold text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
              {fmt(result.totalPKR)}
            </span>
          </div>
          <div className="flex justify-between items-center mt-2 pt-2 border-t border-emerald-200 dark:border-emerald-800 gap-3">
            <span className="flex items-center gap-1.5 text-xs sm:text-sm text-emerald-700 dark:text-emerald-400 shrink-0">
              <Tag size={12} />Per Adult
            </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
              {fmt(result.totalPerAdultPKR)}
            </span>
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 pt-1">
          * All amounts in PKR. Hotel rates are per person per night. Visa costs converted using the exchange rate you entered. Prices are indicative.
        </p>
      </div>
    </div>
  );
}
