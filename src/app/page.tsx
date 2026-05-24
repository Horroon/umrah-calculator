"use client";

import { useState, useMemo, useEffect } from "react";
import type { PackageTier, Currency, CalculatorState } from "@/types";
import {
  PACKAGE_PRESETS, FLIGHT_OPTIONS, MAKKAH_HOTELS, MADINAH_HOTELS, CURRENCIES,
} from "@/data/packages";
import { calculate } from "@/lib/calculator";
import CurrencySelector from "@/components/CurrencySelector";
import PriceSummary from "@/components/PriceSummary";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import PresetChips from "@/components/PresetChips";
import TravellerInput from "@/components/TravellerInput";
import HotelPicker from "@/components/HotelPicker";
import FeeInputs from "@/components/FeeInputs";
import PrintLayout from "@/components/PrintLayout";
import { MapPin } from "lucide-react";

const SILVER = PACKAGE_PRESETS.find((p) => p.tier === "silver")!;

const DEFAULT_STATE: CalculatorState = {
  departureCity:   FLIGHT_OPTIONS[0].city,
  flightClass:     SILVER.flightClass,
  numAdults:       2,
  numInfants:      0,
  makkahHotelId:   SILVER.makkahHotelId,
  shuttleMakkah:   SILVER.shuttleMakkah,
  madinahHotelId:  SILVER.madinahHotelId,
  shuttleMadinah:  SILVER.shuttleMadinah,
  nightsMakkah:    SILVER.nightsMakkah,
  nightsMadinah:   SILVER.nightsMadinah,
  visaFee:         SILVER.visaFee,
  serviceFee:      SILVER.serviceFee,
  insuranceFee:    SILVER.insuranceFee,
  ziyaratFee:      SILVER.ziyaratFee,
  currency:        "PKR",
  activePreset:    "silver",
};

function parseState(p: URLSearchParams): CalculatorState {
  const s = { ...DEFAULT_STATE };

  const city = p.get("city");
  if (city && FLIGHT_OPTIONS.some((f) => f.city === city)) s.departureCity = city;

  const fc = p.get("fc");
  if (fc === "e" || fc === "b") s.flightClass = fc === "e" ? "economy" : "business";

  const a = parseInt(p.get("a") ?? "");
  if (!isNaN(a) && a >= 1 && a <= 50) s.numAdults = a;

  const i = parseInt(p.get("i") ?? "");
  if (!isNaN(i) && i >= 0 && i <= 10) s.numInfants = Math.min(i, s.numAdults);

  const mh = p.get("mh");
  if (mh && MAKKAH_HOTELS.some((h) => h.id === mh)) s.makkahHotelId = mh;

  s.shuttleMakkah = p.get("ms") !== "0";

  const dh = p.get("dh");
  if (dh && MADINAH_HOTELS.some((h) => h.id === dh)) s.madinahHotelId = dh;

  s.shuttleMadinah = p.get("ds") !== "0";

  const nm = parseInt(p.get("nm") ?? "");
  if (!isNaN(nm) && nm >= 1 && nm <= 30) s.nightsMakkah = nm;

  const nd = parseInt(p.get("nd") ?? "");
  if (!isNaN(nd) && nd >= 1 && nd <= 20) s.nightsMadinah = nd;

  const vf = parseInt(p.get("vf") ?? "");
  if (!isNaN(vf) && vf >= 0) s.visaFee = vf;

  const sf = parseInt(p.get("sf") ?? "");
  if (!isNaN(sf) && sf >= 0) s.serviceFee = sf;

  const inf = parseInt(p.get("inf") ?? "");
  if (!isNaN(inf) && inf >= 0) s.insuranceFee = inf;

  const zf = parseInt(p.get("zf") ?? "");
  if (!isNaN(zf) && zf >= 0) s.ziyaratFee = zf;

  const cur = p.get("cur") as Currency;
  if (cur && CURRENCIES.some((c) => c.code === cur)) s.currency = cur;

  const pre = p.get("pre") as PackageTier;
  if (pre && ["bronze", "silver", "gold"].includes(pre)) s.activePreset = pre;
  else s.activePreset = null;

  return s;
}

function stateToParams(s: CalculatorState): string {
  const p = new URLSearchParams();
  p.set("city", s.departureCity);
  p.set("fc",   s.flightClass === "economy" ? "e" : "b");
  p.set("a",    String(s.numAdults));
  p.set("i",    String(s.numInfants));
  p.set("mh",   s.makkahHotelId);
  p.set("ms",   s.shuttleMakkah  ? "1" : "0");
  p.set("dh",   s.madinahHotelId);
  p.set("ds",   s.shuttleMadinah ? "1" : "0");
  p.set("nm",   String(s.nightsMakkah));
  p.set("nd",   String(s.nightsMadinah));
  p.set("vf",   String(s.visaFee));
  p.set("sf",   String(s.serviceFee));
  p.set("inf",  String(s.insuranceFee));
  p.set("zf",   String(s.ziyaratFee));
  p.set("cur",  s.currency);
  if (s.activePreset) p.set("pre", s.activePreset);
  return p.toString();
}

function SectionCard({ title, number, children, className = "" }: {
  title: string; number?: string; children: React.ReactNode; className?: string;
}) {
  return (
    <section className={`no-print bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-6 shadow-sm ${className}`}>
      <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
        {number && <span className="mr-1.5">{number}.</span>}{title}
      </h2>
      {children}
    </section>
  );
}

export default function Home() {
  const [state, setState] = useState<CalculatorState>(DEFAULT_STATE);

  // Restore from URL on first load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.toString()) setState(parseState(params));
  }, []);

  // Sync state → URL
  useEffect(() => {
    history.replaceState(null, "", `?${stateToParams(state)}`);
  }, [state]);

  function setField<K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) {
    setState((prev) => ({ ...prev, [key]: value, activePreset: null }));
  }

  function applyPreset(tier: PackageTier) {
    const preset = PACKAGE_PRESETS.find((p) => p.tier === tier)!;
    setState((prev) => ({
      ...prev,
      flightClass:    preset.flightClass,
      makkahHotelId:  preset.makkahHotelId,
      shuttleMakkah:  preset.shuttleMakkah,
      madinahHotelId: preset.madinahHotelId,
      shuttleMadinah: preset.shuttleMadinah,
      nightsMakkah:   preset.nightsMakkah,
      nightsMadinah:  preset.nightsMadinah,
      visaFee:        preset.visaFee,
      serviceFee:     preset.serviceFee,
      insuranceFee:   preset.insuranceFee,
      ziyaratFee:     preset.ziyaratFee,
      activePreset:   tier,
    }));
  }

  const result = useMemo(() => calculate(state), [state]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">

      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-800 dark:bg-emerald-900 rounded-xl p-2 shrink-0">
              <Logo className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-emerald-800 dark:text-emerald-400 leading-tight">
                  Umrah Calculator
                </h1>
                <span className="hidden sm:inline-block text-[10px] font-semibold bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
                  PKR
                </span>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500 leading-tight">
                Estimate your Umrah journey cost
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">Display in:</span>
            <CurrencySelector
              value={state.currency}
              onChange={(c) => setState((prev) => ({ ...prev, currency: c }))}
            />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-4 sm:space-y-6 print-only-summary">

        {/* Preset chips */}
        <div className="no-print bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
          <PresetChips activePreset={state.activePreset} onSelect={applyPreset} />
        </div>

        {/* 1. Flight & Travellers */}
        <SectionCard title="Flight & Travellers" number="1">
          <div className="space-y-5">
            {/* Departure city */}
            <div>
              <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <MapPin size={13} className="text-emerald-600 dark:text-emerald-500" />
                Departure City
              </label>
              <select
                value={state.departureCity}
                onChange={(e) => setField("departureCity", e.target.value)}
                className="w-full sm:w-64 border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
              >
                {FLIGHT_OPTIONS.map((f) => (
                  <option key={f.city} value={f.city}>{f.city}</option>
                ))}
              </select>
            </div>

            {/* Travellers */}
            <TravellerInput
              numAdults={state.numAdults}
              numInfants={state.numInfants}
              onAdultsChange={(n) => setField("numAdults", n)}
              onInfantsChange={(n) => setField("numInfants", n)}
            />
          </div>
        </SectionCard>

        {/* 2. Hotels */}
        <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <SectionCard title="Hotel in Makkah" number="2" className="!mb-0">
            <HotelPicker
              city="makkah"
              hotels={MAKKAH_HOTELS}
              selectedHotelId={state.makkahHotelId}
              shuttleEnabled={state.shuttleMakkah}
              onHotelChange={(id) => setField("makkahHotelId", id)}
              onShuttleChange={(v) => setField("shuttleMakkah", v)}
            />
          </SectionCard>
          <SectionCard title="Hotel in Madinah" number="3" className="!mb-0">
            <HotelPicker
              city="madinah"
              hotels={MADINAH_HOTELS}
              selectedHotelId={state.madinahHotelId}
              shuttleEnabled={state.shuttleMadinah}
              onHotelChange={(id) => setField("madinahHotelId", id)}
              onShuttleChange={(v) => setField("shuttleMadinah", v)}
            />
          </SectionCard>
        </div>

        {/* 4. Fees & Duration */}
        <SectionCard title="Duration & Fees" number="4">
          <FeeInputs
            nightsMakkah={state.nightsMakkah}
            nightsMadinah={state.nightsMadinah}
            flightClass={state.flightClass}
            visaFee={state.visaFee}
            serviceFee={state.serviceFee}
            insuranceFee={state.insuranceFee}
            ziyaratFee={state.ziyaratFee}
            onNightsMakkahChange={(n) => setField("nightsMakkah", n)}
            onNightsMadinahChange={(n) => setField("nightsMadinah", n)}
            onFlightClassChange={(c) => setField("flightClass", c)}
            onVisaChange={(v) => setField("visaFee", v)}
            onServiceChange={(v) => setField("serviceFee", v)}
            onInsuranceChange={(v) => setField("insuranceFee", v)}
            onZiyaratChange={(v) => setField("ziyaratFee", v)}
          />
        </SectionCard>

        {/* 5. Estimate */}
        <section className="price-summary-section">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 no-print">
            5. Your Estimate
          </h2>
          <PriceSummary result={result} currency={state.currency} />
        </section>

        <footer className="no-print text-center text-xs text-gray-400 dark:text-gray-500 pb-6 sm:pb-8">
          <p>Prices are indicative estimates. Hotel rates are per person per night (double sharing).</p>
          <p className="mt-1">Flight fares in PKR · Currency conversions are approximate.</p>
        </footer>
      </div>

      {/* PDF-style print document — hidden on screen, shown only on print */}
      <PrintLayout state={state} result={result} currency={state.currency} />

    </main>
  );
}
