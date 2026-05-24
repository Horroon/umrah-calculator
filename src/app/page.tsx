"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import type { PackageTier, Currency, CalculatorState, Hotel, SharingType, VisaTier } from "@/types";
import { PACKAGE_PRESETS, FLIGHT_OPTIONS, CURRENCIES } from "@/data/packages";
import { calculate } from "@/lib/calculator";
import { useAuth } from "@/contexts/AuthContext";
import { subscribeToHotels, loadVisaTiers, saveVisaTiers } from "@/lib/firestore";
import CurrencySelector from "@/components/CurrencySelector";
import PriceSummary from "@/components/PriceSummary";
import Logo from "@/components/Logo";
import ThemeToggle from "@/components/ThemeToggle";
import HotelPicker from "@/components/HotelPicker";
import FeeInputs from "@/components/FeeInputs";
import PrintLayout from "@/components/PrintLayout";
import LoginPage from "@/components/LoginPage";
import HotelManager from "@/components/HotelManager";
import { MapPin, Settings, LogOut, Minus, Plus, Users } from "lucide-react";

const SILVER = PACKAGE_PRESETS.find((p) => p.tier === "silver")!;

const DEFAULT_STATE: CalculatorState = {
  departureCity:      FLIGHT_OPTIONS[0].city,
  flightClass:        SILVER.flightClass,
  economyFare:        FLIGHT_OPTIONS[0].economyFare,
  businessFare:       FLIGHT_OPTIONS[0].businessFare,
  numAdults:          2,
  numInfants:         0,
  makkahHotelId:      "",
  makkahSharingType:  "DUBL",
  shuttleMakkah:      true,
  madinahHotelId:     "",
  madinahSharingType: "DUBL",
  shuttleMadinah:     true,
  nightsMakkah:       SILVER.nightsMakkah,
  nightsMadinah:      SILVER.nightsMadinah,
  visaFee:            SILVER.visaFee,
  serviceFee:         SILVER.serviceFee,
  insuranceFee:       SILVER.insuranceFee,
  ziyaratFee:         SILVER.ziyaratFee,
  infantCharges:      0,
  currency:           "SAR",
  activePreset:       "silver",
  customRates:        {},
  visaTiers:          [{ id: "t1", minPax: 1, cost: 0 }],
};

const VALID_SHARING: SharingType[] = ["DUBL", "TRPL", "QUAD", "SHARING"];

function parseState(p: URLSearchParams): CalculatorState {
  const s = { ...DEFAULT_STATE };
  const city = p.get("city");
  if (city && FLIGHT_OPTIONS.some(f => f.city === city)) s.departureCity = city;
  const fc = p.get("fc");
  if (fc === "e" || fc === "b") s.flightClass = fc === "e" ? "economy" : "business";
  const cityOption = FLIGHT_OPTIONS.find(f => f.city === s.departureCity) ?? FLIGHT_OPTIONS[0];
  s.economyFare  = cityOption.economyFare;
  s.businessFare = cityOption.businessFare;
  const ef = parseInt(p.get("ef") ?? ""); if (!isNaN(ef) && ef > 0) s.economyFare  = ef;
  const bf = parseInt(p.get("bf") ?? ""); if (!isNaN(bf) && bf > 0) s.businessFare = bf;
  const a = parseInt(p.get("a") ?? "");  if (!isNaN(a)  && a >= 1 && a <= 50) s.numAdults  = a;
  const i = parseInt(p.get("i") ?? "");  if (!isNaN(i)  && i >= 0 && i <= 10) s.numInfants = Math.min(i, s.numAdults);
  const mh = p.get("mh"); if (mh) s.makkahHotelId  = mh;
  const dh = p.get("dh"); if (dh) s.madinahHotelId = dh;
  const mst = p.get("mst") as SharingType; if (mst && VALID_SHARING.includes(mst)) s.makkahSharingType  = mst;
  const dst = p.get("dst") as SharingType; if (dst && VALID_SHARING.includes(dst)) s.madinahSharingType = dst;
  s.shuttleMakkah  = p.get("ms") !== "0";
  s.shuttleMadinah = p.get("ds") !== "0";
  const nm = parseInt(p.get("nm") ?? ""); if (!isNaN(nm) && nm >= 1 && nm <= 30) s.nightsMakkah  = nm;
  const nd = parseInt(p.get("nd") ?? ""); if (!isNaN(nd) && nd >= 1 && nd <= 20) s.nightsMadinah = nd;
  const vf  = parseInt(p.get("vf")  ?? ""); if (!isNaN(vf)  && vf  >= 0) s.visaFee      = vf;
  const sf  = parseInt(p.get("sf")  ?? ""); if (!isNaN(sf)  && sf  >= 0) s.serviceFee   = sf;
  const inf = parseInt(p.get("inf") ?? ""); if (!isNaN(inf) && inf >= 0) s.insuranceFee = inf;
  const zf  = parseInt(p.get("zf")   ?? ""); if (!isNaN(zf)   && zf   >= 0) s.ziyaratFee     = zf;
  const ic  = parseInt(p.get("ichrg") ?? ""); if (!isNaN(ic)   && ic   >= 0) s.infantCharges   = ic;
  const cur = p.get("cur") as Currency;
  if (cur && CURRENCIES.some(c => c.code === cur)) s.currency = cur;
  const pre = p.get("pre") as PackageTier;
  if (pre && ["bronze", "silver", "gold"].includes(pre)) s.activePreset = pre;
  else s.activePreset = null;
  return s;
}

function stateToParams(s: CalculatorState): string {
  const p = new URLSearchParams();
  p.set("city", s.departureCity);
  p.set("fc",  s.flightClass === "economy" ? "e" : "b");
  p.set("ef",  String(s.economyFare));
  p.set("bf",  String(s.businessFare));
  p.set("a",   String(s.numAdults));
  p.set("i",   String(s.numInfants));
  p.set("mh",  s.makkahHotelId);
  p.set("mst", s.makkahSharingType);
  p.set("ms",  s.shuttleMakkah  ? "1" : "0");
  p.set("dh",  s.madinahHotelId);
  p.set("dst", s.madinahSharingType);
  p.set("ds",  s.shuttleMadinah ? "1" : "0");
  p.set("nm",  String(s.nightsMakkah));
  p.set("nd",  String(s.nightsMadinah));
  p.set("vf",  String(s.visaFee));
  p.set("sf",  String(s.serviceFee));
  p.set("inf", String(s.insuranceFee));
  p.set("zf",   String(s.ziyaratFee));
  p.set("ichrg", String(s.infantCharges));
  p.set("cur", s.currency);
  if (s.activePreset) p.set("pre", s.activePreset);
  return p.toString();
}

function computeActiveTier(tiers: VisaTier[], totalPax: number): VisaTier | null {
  if (tiers.length === 0) return null;
  const sorted = [...tiers].sort((a, b) => b.minPax - a.minPax);
  return sorted.find(t => t.minPax <= totalPax) ?? sorted[sorted.length - 1];
}

function computeVisaFee(
  tiers: VisaTier[], totalPax: number,
  currency: Currency, customRates: Partial<Record<string, number>>,
): number {
  const tier = computeActiveTier(tiers, totalPax);
  if (!tier) return 0;
  if (currency === "PKR") return tier.cost;
  const c = CURRENCIES.find(c => c.code === currency);
  if (!c) return tier.cost;
  const pkrPerUnit = customRates[currency] ?? Math.round(1 / c.rate);
  return Math.round(tier.cost * pkrPerUnit);
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
  const { user, loading, logout } = useAuth();
  const [state, setState]           = useState<CalculatorState>(DEFAULT_STATE);
  const [hotels, setHotels]         = useState<Hotel[]>([]);
  const [showHotelManager, setShowHotelManager] = useState(false);
  const visaTiersLoaded = useRef(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.toString()) setState(parseState(params));
  }, []);

  useEffect(() => {
    history.replaceState(null, "", `?${stateToParams(state)}`);
  }, [state]);

  useEffect(() => {
    if (!user) { setHotels([]); return; }
    return subscribeToHotels(user.uid, setHotels);
  }, [user]);

  // Load visa tiers from Firestore when user logs in
  useEffect(() => {
    if (!user) { visaTiersLoaded.current = false; return; }
    loadVisaTiers(user.uid).then(tiers => {
      visaTiersLoaded.current = true;
      if (tiers && tiers.length > 0) setState(prev => ({ ...prev, visaTiers: tiers }));
    });
  }, [user]);

  // Auto-save visa tiers (debounced), only after initial Firestore load
  useEffect(() => {
    if (!user || !visaTiersLoaded.current) return;
    const t = setTimeout(() => saveVisaTiers(user.uid, state.visaTiers), 800);
    return () => clearTimeout(t);
  }, [user, state.visaTiers]);

  // Auto-select first hotel when hotels load
  useEffect(() => {
    const mk = hotels.filter(h => h.city === "makkah");
    const md = hotels.filter(h => h.city === "madinah");
    setState(prev => ({
      ...prev,
      makkahHotelId:  mk.some(h => h.id === prev.makkahHotelId)  ? prev.makkahHotelId  : (mk[0]?.id ?? ""),
      madinahHotelId: md.some(h => h.id === prev.madinahHotelId) ? prev.madinahHotelId : (md[0]?.id ?? ""),
    }));
  }, [hotels]);

  // Keep visaFee in sync with tiers, pax count, currency, and exchange rates
  useEffect(() => {
    const fee = computeVisaFee(state.visaTiers, state.numAdults + state.numInfants, state.currency, state.customRates);
    if (fee !== state.visaFee) setState(prev => ({ ...prev, visaFee: fee }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.numAdults, state.numInfants, state.visaTiers, state.currency, state.customRates]);

  function setField<K extends keyof CalculatorState>(key: K, value: CalculatorState[K]) {
    setState(prev => ({ ...prev, [key]: value, activePreset: null }));
  }

  function addTier() {
    const maxPax = state.visaTiers.reduce((m, t) => Math.max(m, t.minPax), 0);
    const next: VisaTier = { id: Date.now().toString(), minPax: maxPax + 1, cost: 0 };
    setField("visaTiers", [...state.visaTiers, next]);
  }

  function updateTier(id: string, field: "minPax" | "cost", value: number) {
    setState(prev => ({
      ...prev,
      activePreset: null,
      visaTiers: prev.visaTiers.map(t => t.id === id ? { ...t, [field]: value } : t),
    }));
  }

  function deleteTier(id: string) {
    setField("visaTiers", state.visaTiers.filter(t => t.id !== id));
  }

  function applyPreset(tier: PackageTier) {
    const preset = PACKAGE_PRESETS.find(p => p.tier === tier)!;
    setState(prev => ({
      ...prev,
      flightClass:   preset.flightClass,
      nightsMakkah:  preset.nightsMakkah,
      nightsMadinah: preset.nightsMadinah,
      visaFee:       preset.visaFee,
      serviceFee:    preset.serviceFee,
      insuranceFee:  preset.insuranceFee,
      ziyaratFee:    preset.ziyaratFee,
      activePreset:  tier,
    }));
  }

  const result = useMemo(() => calculate(state, hotels), [state, hotels]);

  const makkahHotels  = hotels.filter(h => h.city === "makkah");
  const madinahHotels = hotels.filter(h => h.city === "madinah");

  const activeCurrencyData  = CURRENCIES.find(c => c.code === state.currency);
  const defaultPkrPerForeign = activeCurrencyData && state.currency !== "PKR" ? Math.round(1 / activeCurrencyData.rate) : null;
  const currentPkrPerForeign = state.currency !== "PKR" ? (state.customRates[state.currency] ?? defaultPkrPerForeign ?? 0) : null;

  // User avatar initials
  const initials = user?.displayName?.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() ?? "?";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-emerald-800 rounded-2xl p-3 animate-pulse"><Logo className="w-10 h-10" /></div>
          <p className="text-sm text-gray-400">Loading…</p>
        </div>
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-900">

      {showHotelManager && <HotelManager hotels={hotels} onClose={() => setShowHotelManager(false)} />}

      {/* ── Header ── */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-10 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          {/* Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-emerald-800 dark:bg-emerald-900 rounded-xl p-2">
              <Logo className="w-8 h-8" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-base font-bold text-emerald-800 dark:text-emerald-400 leading-tight">Umrah Calculator</h1>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-wrap justify-end">
            <CurrencySelector value={state.currency} onChange={c => setState(prev => ({ ...prev, currency: c }))} />

            <button onClick={() => setShowHotelManager(true)}
              className="flex items-center gap-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 rounded-lg px-2.5 py-1.5 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-colors">
              <Settings size={13} />
              <span className="hidden sm:inline">Hotels</span>
            </button>

            <ThemeToggle />

            {/* User + sign out */}
            <div className="flex items-center gap-2 pl-1 border-l border-gray-200 dark:border-gray-700 ml-1">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName ?? ""} className="w-7 h-7 rounded-full ring-2 ring-emerald-200 dark:ring-emerald-800" referrerPolicy="no-referrer"/>
              ) : (
                <div className="w-7 h-7 rounded-full bg-emerald-700 text-white text-xs font-bold flex items-center justify-center ring-2 ring-emerald-200 dark:ring-emerald-800">
                  {initials}
                </div>
              )}
              <span className="text-xs text-gray-600 dark:text-gray-400 hidden md:block max-w-[120px] truncate">
                {user.displayName ?? user.email}
              </span>
              <button onClick={logout}
                className="flex items-center gap-1 text-xs font-medium text-red-500 hover:text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1.5 rounded-lg transition-colors"
                title="Sign out">
                <LogOut size={13} />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-3 sm:px-4 py-5 sm:py-8 space-y-4 sm:space-y-6 print-only-summary">

        {/* Quick Start */}
        <div className="no-print bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 sm:p-5 shadow-sm">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">Quick Start</h2>

          {/* Travellers + Exchange Rate */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-5 gap-y-4 mb-5 pb-5 border-b border-gray-100 dark:border-gray-700/60">

            {/* Adults */}
            <div>
              <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
                <Users size={11} /> Adults
              </label>
              <div className="flex items-center gap-2">
                <button onClick={() => setField("numAdults", Math.max(1, state.numAdults - 1))} disabled={state.numAdults <= 1}
                  className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <Minus size={11} />
                </button>
                <span className="w-6 text-center font-bold text-sm text-gray-800 dark:text-gray-100">{state.numAdults}</span>
                <button onClick={() => setField("numAdults", Math.min(50, state.numAdults + 1))} disabled={state.numAdults >= 50}
                  className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <Plus size={11} />
                </button>
              </div>
            </div>

            {/* Infants */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">Infants <span className="font-normal text-gray-400">(under 2)</span></label>
              <div className="flex items-center gap-2">
                <button onClick={() => setField("numInfants", Math.max(0, state.numInfants - 1))} disabled={state.numInfants <= 0}
                  className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <Minus size={11} />
                </button>
                <span className="w-6 text-center font-bold text-sm text-gray-800 dark:text-gray-100">{state.numInfants}</span>
                <button onClick={() => setField("numInfants", Math.min(state.numAdults, state.numInfants + 1))} disabled={state.numInfants >= state.numAdults}
                  className="w-7 h-7 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-500 disabled:opacity-30 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center justify-center transition-colors">
                  <Plus size={11} />
                </button>
              </div>
            </div>

            {/* Exchange rate */}
            <div>
              <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2 block">
                Exchange Rate
                {state.currency === "PKR" && <span className="ml-1 font-normal text-gray-400">(select currency above)</span>}
              </label>
              {state.currency !== "PKR" && currentPkrPerForeign !== null ? (
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-500 dark:text-gray-400 shrink-0">1 {state.currency} =</span>
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700 flex-1 min-w-0">
                    <input type="number" min={1} step={1} value={currentPkrPerForeign}
                      onChange={e => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0)
                          setState(prev => ({ ...prev, customRates: { ...prev.customRates, [prev.currency]: val } }));
                      }}
                      className="flex-1 px-2 py-1.5 text-sm text-gray-800 dark:text-gray-100 bg-transparent focus:outline-none min-w-0" />
                    <span className="pr-2 text-xs text-gray-400 dark:text-gray-500">PKR</span>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-gray-300 dark:text-gray-600 py-2">— PKR selected</div>
              )}
            </div>
          </div>

          {/* Visa cost tiers */}
          {(() => {
            const currencyMeta = CURRENCIES.find(c => c.code === state.currency)!;
            const currSymbol   = currencyMeta.symbol;
            const totalPax     = state.numAdults + state.numInfants;
            const activeTier   = computeActiveTier(state.visaTiers, totalPax);
            return (
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                    Visa Cost by Group Size
                  </span>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500">
                    amounts in {currencyMeta.name} ({state.currency})
                  </span>
                </div>
                <div className="space-y-1.5">
                  <div className="grid grid-cols-[88px_1fr_28px] gap-2 text-[10px] font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide px-1 mb-1">
                    <span>Min Pax</span>
                    <span>Per Person ({state.currency})</span>
                    <span />
                  </div>
                  {[...state.visaTiers]
                    .sort((a, b) => a.minPax - b.minPax)
                    .map(tier => {
                      const isActive = tier.id === activeTier?.id;
                      return (
                        <div key={tier.id}
                          className={`grid grid-cols-[88px_1fr_28px] gap-2 items-center rounded-lg px-2 py-1.5 transition-colors
                            ${isActive
                              ? "bg-emerald-50 dark:bg-emerald-900/20 ring-1 ring-emerald-300 dark:ring-emerald-700"
                              : "bg-gray-50 dark:bg-gray-700/50"}`}>
                          <div className="flex items-center gap-1">
                            <input type="number" min={1} max={50} value={tier.minPax}
                              onChange={e => updateTier(tier.id, "minPax", Math.max(1, parseInt(e.target.value) || 1))}
                              className="w-11 text-sm font-semibold text-center bg-transparent focus:outline-none text-gray-800 dark:text-gray-100" />
                            <span className="text-xs text-gray-400 dark:text-gray-500">pax+</span>
                          </div>
                          <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-white dark:bg-gray-800 focus-within:ring-1 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700">
                            <span className="pl-2 text-xs text-gray-400 dark:text-gray-500">{currSymbol}</span>
                            <input type="number" min={0} step={state.currency === "PKR" ? 1000 : 1} value={tier.cost}
                              onChange={e => updateTier(tier.id, "cost", Math.max(0, parseFloat(e.target.value) || 0))}
                              className="flex-1 px-1.5 py-1.5 text-sm bg-transparent focus:outline-none text-gray-800 dark:text-gray-100 min-w-0" />
                          </div>
                          <button onClick={() => deleteTier(tier.id)} disabled={state.visaTiers.length <= 1}
                            className="w-7 h-7 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 disabled:opacity-30 flex items-center justify-center transition-colors text-base leading-none">
                            ×
                          </button>
                        </div>
                      );
                    })}
                  <button onClick={addTier}
                    className="flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400 hover:underline mt-0.5 ml-1">
                    <Plus size={11} /> Add tier
                  </button>
                </div>
                {activeTier && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-2">
                    {totalPax} pax → {currSymbol}{activeTier.cost.toLocaleString()} per person
                    {state.currency !== "PKR" && currentPkrPerForeign !== null && (
                      <span className="text-gray-400 dark:text-gray-500 ml-1">
                        (≈ ₨{(activeTier.cost * currentPkrPerForeign).toLocaleString()} PKR)
                      </span>
                    )}
                  </p>
                )}
              </div>
            );
          })()}
        </div>

        {/* 1. Flight & Travellers */}
        <SectionCard title="Flight & Travellers" number="1">
          <div className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Departure city */}
              <div>
                <label className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  <MapPin size={13} className="text-emerald-600 dark:text-emerald-500" /> Departure City
                </label>
                <select value={state.departureCity}
                  onChange={e => {
                    const city = e.target.value;
                    const preset = FLIGHT_OPTIONS.find(f => f.city === city) ?? FLIGHT_OPTIONS[0];
                    setState(prev => ({ ...prev, departureCity: city, economyFare: preset.economyFare, businessFare: preset.businessFare, activePreset: null }));
                  }}
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm text-gray-700 dark:text-gray-200 bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700">
                  {FLIGHT_OPTIONS.map(f => <option key={f.city} value={f.city}>{f.city}</option>)}
                </select>
              </div>
              {/* Economy fare */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Economy Fare <span className="text-gray-400 font-normal">(PKR, round-trip)</span>
                </label>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700">
                  <span className="px-2.5 text-sm text-gray-400 dark:text-gray-500 shrink-0">₨</span>
                  <input type="number" min={0} step={5000} value={state.economyFare}
                    onChange={e => setField("economyFare", Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 py-2.5 pr-3 text-sm text-gray-800 dark:text-gray-100 bg-transparent focus:outline-none min-w-0" />
                </div>
              </div>
              {/* Business fare */}
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Business Fare <span className="text-gray-400 font-normal">(PKR, round-trip)</span>
                </label>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 focus-within:ring-2 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700">
                  <span className="px-2.5 text-sm text-gray-400 dark:text-gray-500 shrink-0">₨</span>
                  <input type="number" min={0} step={5000} value={state.businessFare}
                    onChange={e => setField("businessFare", Math.max(0, parseInt(e.target.value) || 0))}
                    className="flex-1 py-2.5 pr-3 text-sm text-gray-800 dark:text-gray-100 bg-transparent focus:outline-none min-w-0" />
                </div>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* 2 & 3. Hotels */}
        <div className="no-print grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          <SectionCard title="Hotel in Makkah" number="2" className="!mb-0">
            <HotelPicker city="makkah" hotels={makkahHotels}
              selectedHotelId={state.makkahHotelId}
              selectedSharingType={state.makkahSharingType}
              shuttleEnabled={state.shuttleMakkah}
              onHotelChange={id => setField("makkahHotelId", id)}
              onSharingTypeChange={t => setField("makkahSharingType", t)}
              onShuttleChange={v => setField("shuttleMakkah", v)}
              onManageHotels={() => setShowHotelManager(true)} />
          </SectionCard>
          <SectionCard title="Hotel in Madinah" number="3" className="!mb-0">
            <HotelPicker city="madinah" hotels={madinahHotels}
              selectedHotelId={state.madinahHotelId}
              selectedSharingType={state.madinahSharingType}
              shuttleEnabled={state.shuttleMadinah}
              onHotelChange={id => setField("madinahHotelId", id)}
              onSharingTypeChange={t => setField("madinahSharingType", t)}
              onShuttleChange={v => setField("shuttleMadinah", v)}
              onManageHotels={() => setShowHotelManager(true)} />
          </SectionCard>
        </div>

        {/* 4. Duration & Fees */}
        <SectionCard title="Duration & Fees" number="4">
          <FeeInputs
            nightsMakkah={state.nightsMakkah} nightsMadinah={state.nightsMadinah}
            flightClass={state.flightClass}
            serviceFee={state.serviceFee}
            insuranceFee={state.insuranceFee} ziyaratFee={state.ziyaratFee}
            infantCharges={state.infantCharges}
            onNightsMakkahChange={n => setField("nightsMakkah", n)}
            onNightsMadinahChange={n => setField("nightsMadinah", n)}
            onFlightClassChange={c => setField("flightClass", c)}
            onServiceChange={v => setField("serviceFee", v)}
            onInsuranceChange={v => setField("insuranceFee", v)}
            onZiyaratChange={v => setField("ziyaratFee", v)}
            onInfantChargesChange={v => setField("infantCharges", v)} />
            
        </SectionCard>

        {/* 5. Estimate */}
        <section className="price-summary-section">
          <h2 className="text-xs sm:text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3 no-print">
            5. Your Estimate
          </h2>
          <PriceSummary result={result} />
        </section>

        <footer className="no-print text-center text-xs text-gray-400 dark:text-gray-500 pb-6 sm:pb-8">
          <p>All amounts in PKR. Hotel rates are per person per night. Visa costs converted using your entered exchange rate.</p>
        </footer>
      </div>

      <PrintLayout state={state} result={result} hotels={hotels} />
    </main>
  );
}
