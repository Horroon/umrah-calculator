"use client";

import { Info } from "lucide-react";

interface Props {
  numAdults: number;
  numInfants: number;
  onAdultsChange: (n: number) => void;
  onInfantsChange: (n: number) => void;
}

function Stepper({
  label, sublabel, value, min, max,
  onChange,
}: {
  label: string; sublabel: string; value: number;
  min: number; max: number; onChange: (n: number) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">{label}</div>
        <div className="text-xs text-gray-400 dark:text-gray-500">{sublabel}</div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors text-lg leading-none"
        >−</button>
        <span className="w-7 text-center text-lg font-bold text-gray-800 dark:text-gray-100">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors text-lg leading-none"
        >+</button>
      </div>
    </div>
  );
}

export default function TravellerInput({ numAdults, numInfants, onAdultsChange, onInfantsChange }: Props) {
  function handleAdultsChange(n: number) {
    onAdultsChange(n);
    if (numInfants > n) onInfantsChange(n);
  }

  return (
    <div className="space-y-4">
      <Stepper
        label="Adults" sublabel="Age 2 and above"
        value={numAdults} min={1} max={50}
        onChange={handleAdultsChange}
      />
      <Stepper
        label="Infants" sublabel="Under 2 yrs · cannot exceed adults"
        value={numInfants} min={0} max={numAdults}
        onChange={onInfantsChange}
      />
      {numInfants > 0 && (
        <div className="flex gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-3 text-xs text-amber-700 dark:text-amber-400">
          <Info size={13} className="shrink-0 mt-0.5" />
          <span>Infants: 10% flight fare · free hotel · same visa cost · 50% service fee · no insurance or ziyarat</span>
        </div>
      )}
    </div>
  );
}
