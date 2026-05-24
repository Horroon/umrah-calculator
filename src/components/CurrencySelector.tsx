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
        className="sm:hidden border border-gray-200 rounded-lg px-2 py-1.5 text-sm font-medium text-gray-700 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-300"
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
                ? "bg-emerald-600 text-white border-emerald-600"
                : "bg-white text-gray-600 border-gray-200 hover:border-emerald-400"
              }`}
          >
            {c.symbol} {c.code}
          </button>
        ))}
      </div>
    </>
  );
}
