"use client";

import type { PackageTier } from "@/types";
import { PACKAGE_PRESETS } from "@/data/packages";

interface Props {
  activePreset: PackageTier | null;
  onSelect: (tier: PackageTier) => void;
}

export default function PresetChips({ activePreset, onSelect }: Props) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">Quick start:</span>
      {PACKAGE_PRESETS.map((p) => (
        <button
          key={p.tier}
          onClick={() => onSelect(p.tier)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all
            ${activePreset === p.tier
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-emerald-300 dark:hover:border-emerald-700"
            }`}
        >
          <span className={`w-2 h-2 rounded-full bg-gradient-to-br ${p.color}`} />
          {p.label}
          <span className="hidden sm:inline font-normal text-gray-400 dark:text-gray-500">· {p.description}</span>
        </button>
      ))}
    </div>
  );
}
