"use client";

import type { FlightClass } from "@/types";
import { Minus, Plus } from "lucide-react";

interface Props {
  nightsMakkah: number;
  nightsMadinah: number;
  flightClass: FlightClass;
  visaFee: number;
  serviceFee: number;
  insuranceFee: number;
  ziyaratFee: number;
  onNightsMakkahChange: (n: number) => void;
  onNightsMadinahChange: (n: number) => void;
  onFlightClassChange: (c: FlightClass) => void;
  onVisaChange: (v: number) => void;
  onServiceChange: (v: number) => void;
  onInsuranceChange: (v: number) => void;
  onZiyaratChange: (v: number) => void;
}

function NightsStepper({ label, value, min, max, onChange }: {
  label: string; value: number; min: number; max: number; onChange: (n: number) => void;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">{label}</label>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          disabled={value <= min}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors flex items-center justify-center"
        ><Minus size={13} /></button>
        <span className="w-8 text-center font-bold text-gray-800 dark:text-gray-100 text-base">{value}</span>
        <button
          onClick={() => onChange(Math.min(max, value + 1))}
          disabled={value >= max}
          className="w-8 h-8 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-600 disabled:opacity-30 transition-colors flex items-center justify-center"
        ><Plus size={13} /></button>
        <span className="text-xs text-gray-400 dark:text-gray-500">nights</span>
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
        <input
          type="number"
          min={0}
          step={1000}
          value={value}
          onChange={(e) => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="flex-1 py-2 pr-3 text-sm text-gray-800 dark:text-gray-100 bg-transparent focus:outline-none min-w-0"
        />
      </div>
    </div>
  );
}

export default function FeeInputs({
  nightsMakkah, nightsMadinah, flightClass,
  visaFee, serviceFee, insuranceFee, ziyaratFee,
  onNightsMakkahChange, onNightsMadinahChange, onFlightClassChange,
  onVisaChange, onServiceChange, onInsuranceChange, onZiyaratChange,
}: Props) {
  return (
    <div className="space-y-5">
      {/* Duration + Flight Class */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <NightsStepper label="Nights in Makkah" value={nightsMakkah} min={1} max={30} onChange={onNightsMakkahChange} />
        <NightsStepper label="Nights in Madinah" value={nightsMadinah} min={1} max={20} onChange={onNightsMadinahChange} />
        <div className="col-span-2 sm:col-span-2">
          <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5">Flight Class</label>
          <div className="flex gap-2">
            {(["economy", "business"] as FlightClass[]).map((c) => (
              <button
                key={c}
                onClick={() => onFlightClassChange(c)}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all capitalize
                  ${flightClass === c
                    ? "bg-emerald-600 dark:bg-emerald-700 text-white border-emerald-600 dark:border-emerald-700"
                    : "bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-emerald-400"
                  }`}
              >{c}</button>
            ))}
          </div>
        </div>
      </div>

      {/* Fee inputs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <FeeField label="Visa Fee (per person)" value={visaFee} onChange={onVisaChange} />
        <FeeField label="Service & Handling" value={serviceFee} onChange={onServiceChange} />
        <FeeField label="Travel Insurance" hint="(0 = none)" value={insuranceFee} onChange={onInsuranceChange} />
        <FeeField label="Ziyarat & Transport" hint="(0 = none)" value={ziyaratFee} onChange={onZiyaratChange} />
      </div>
    </div>
  );
}
