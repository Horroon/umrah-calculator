"use client";

import { useState } from "react";
import type { FlightClass } from "@/types";
import { Minus, Plus } from "lucide-react";

interface Props {
  nightsMakkah: number;
  nightsMadinah: number;
  flightClass: FlightClass;
  serviceFee: number;
  insuranceFee: number;
  ziyaratFee: number;
  infantCharges: number;
  onNightsMakkahChange: (n: number) => void;
  onNightsMadinahChange: (n: number) => void;
  onFlightClassChange: (c: FlightClass) => void;
  onServiceChange: (v: number) => void;
  onInsuranceChange: (v: number) => void;
  onZiyaratChange: (v: number) => void;
  onInfantChargesChange: (v: number) => void;
}

const DURATION_PRESETS = [
  { days: 10, nightsMakkah: 7,  nightsMadinah: 3 },
  { days: 15, nightsMakkah: 10, nightsMadinah: 5 },
  { days: 21, nightsMakkah: 14, nightsMadinah: 7 },
  { days: 28, nightsMakkah: 19, nightsMadinah: 9 },
];

function NightsStepper({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (n: number) => void;
}) {
  return (
    <div>
      <div className="text-xs text-gray-400 dark:text-gray-500 mb-1.5">{label}</div>
      <div className="flex items-center gap-1.5">
        <button onClick={() => onChange(Math.max(min, value - 1))} disabled={value <= min}
          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors flex items-center justify-center">
          <Minus size={11} />
        </button>
        <span className="w-7 text-center font-bold text-gray-800 dark:text-gray-100 text-sm">{value}</span>
        <button onClick={() => onChange(Math.min(max, value + 1))} disabled={value >= max}
          className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors flex items-center justify-center">
          <Plus size={11} />
        </button>
        <span className="text-xs text-gray-400 dark:text-gray-500">N</span>
      </div>
    </div>
  );
}

function FeeField({ label, hint, value, onChange }: {
  label: string; hint?: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">
        {label}
        {hint && <span className="ml-1 font-normal text-gray-400 dark:text-gray-500">{hint}</span>}
      </label>
      <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700">
        <span className="px-2.5 text-sm text-gray-400 dark:text-gray-500 shrink-0">₨</span>
        <input type="number" min={0} step={1000} value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="flex-1 py-2 pr-3 text-sm text-gray-800 dark:text-gray-100 bg-transparent focus:outline-none min-w-0"
        />
      </div>
    </div>
  );
}

export default function FeeInputs({
  nightsMakkah, nightsMadinah, flightClass,
  serviceFee, insuranceFee, ziyaratFee, infantCharges,
  onNightsMakkahChange, onNightsMadinahChange, onFlightClassChange,
  onServiceChange, onInsuranceChange, onZiyaratChange,
  onInfantChargesChange,
}: Props) {
  const [customMode, setCustomMode] = useState(false);

  const matchedPreset = DURATION_PRESETS.find(
    p => p.nightsMakkah === nightsMakkah && p.nightsMadinah === nightsMadinah
  );
  const isCustomActive = customMode || !matchedPreset;
  const totalNights    = nightsMakkah + nightsMadinah;

  function selectPreset(p: typeof DURATION_PRESETS[number]) {
    setCustomMode(false);
    onNightsMakkahChange(p.nightsMakkah);
    onNightsMadinahChange(p.nightsMadinah);
  }

  return (
    <div className="space-y-5">

      {/* Duration presets */}
      <div>
        <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
          Trip Duration
          <span className="ml-2 font-normal text-gray-400 dark:text-gray-500">
            Total: <span className="font-semibold text-gray-700 dark:text-gray-300">{totalNights} nights</span>
          </span>
        </div>

        {/* Preset chips */}
        <div className="flex flex-wrap gap-2 mb-3">
          {DURATION_PRESETS.map(p => {
            const active = !isCustomActive && matchedPreset?.days === p.days;
            return (
              <button key={p.days} onClick={() => selectPreset(p)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
                  ${active
                    ? "bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-600"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-600"
                  }`}>
                {p.days} Days
                <span className={`ml-1 font-normal ${active ? "text-emerald-200" : "text-gray-400"}`}>
                  ({p.nightsMakkah}+{p.nightsMadinah}N)
                </span>
              </button>
            );
          })}
          <button onClick={() => setCustomMode(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all
              ${isCustomActive
                ? "bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-600"
                : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400 dark:hover:border-emerald-600"
              }`}>
            Custom
          </button>
        </div>

        {/* Steppers — shown for fine-tuning (always when custom active, shown collapsed otherwise) */}
        <div className="flex items-center gap-5 bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 border border-gray-100 dark:border-gray-700">
          <NightsStepper label="Makkah" value={nightsMakkah} min={1} max={30}
            onChange={v => { setCustomMode(true); onNightsMakkahChange(v); }} />
          <div className="w-px h-8 bg-gray-200 dark:bg-gray-600" />
          <NightsStepper label="Madinah" value={nightsMadinah} min={1} max={20}
            onChange={v => { setCustomMode(true); onNightsMadinahChange(v); }} />
        </div>
      </div>

      {/* Flight class */}
      <div>
        <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Flight Class</label>
        <div className="flex gap-2">
          {(["economy", "business"] as FlightClass[]).map((c) => (
            <button key={c} onClick={() => onFlightClassChange(c)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize
                ${flightClass === c
                  ? "bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-600 dark:border-emerald-700"
                  : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400"
                }`}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Fee inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FeeField label="Service & Handling" value={serviceFee} onChange={onServiceChange} />
        <FeeField label="Travel Insurance" hint="(0 = none)" value={insuranceFee} onChange={onInsuranceChange} />
        <FeeField label="Ziyarat & Transport" hint="(0 = none)" value={ziyaratFee} onChange={onZiyaratChange} />
        <FeeField label="Infant Charges" hint="(per infant)" value={infantCharges} onChange={onInfantChargesChange} />
      </div>
    </div>
  );
}
