"use client";

import { CURRENCIES } from "@/data/packages";
import type { Currency } from "@/types";

interface Props {
  value: Currency;
  onChange: (c: Currency) => void;
}

export default function CurrencySelector({ value, onChange }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
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
  );
}
