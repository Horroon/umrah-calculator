"use client";

import { CURRENCIES } from "@/data/packages";
import type { Currency } from "@/types";

interface Props {
  value: Currency;
  onChange: (c: Currency) => void;
}

export default function CurrencySelector({ value, onChange }: Props) {
  return (
    <>
      {/* Mobile: compact dropdown */}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as Currency)}
        className="sm:hidden border border-gray-200 dark:border-gray-600 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.symbol} {c.code}
          </option>
        ))}
      </select>

      {/* Desktop: button group */}
      <div className="hidden sm:flex flex-wrap gap-2">
        {CURRENCIES.map((c) => (
          <button
            key={c.code}
            onClick={() => onChange(c.code)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-all
              ${value === c.code
                ? "bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-600 dark:border-emerald-700"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-500"
              }`}
          >
            {c.symbol} {c.code}
          </button>
        ))}
      </div>
    </>
  );
}
