"use client";

import { useState } from "react";
import { X, Plus, Pencil, Trash2, Building2, Star, Bus } from "lucide-react";
import type { Hotel as HotelType, HotelCity } from "@/types";
import { addHotel, updateHotel, deleteHotel } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  hotels: HotelType[];
  onClose: () => void;
}

interface HotelForm {
  name: string;
  city: HotelCity;
  stars: 3 | 4 | 5;
  distanceLabel: string;
  distanceMeters: number;
  priceDouble: number;
  priceTriple: number;
  priceQuad: number;
  priceSharing: number;
  shuttleSurcharge: number;
}

const EMPTY_FORM: HotelForm = {
  name: "", city: "makkah", stars: 4,
  distanceLabel: "", distanceMeters: 0,
  priceDouble: 0, priceTriple: 0, priceQuad: 0, priceSharing: 0,
  shuttleSurcharge: 0,
};

function fmt(n: number) {
  return n > 0 ? "₨" + new Intl.NumberFormat("en-US").format(n) : "—";
}

function PriceInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">{label}</div>
      <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700">
        <span className="px-2 text-xs text-gray-400 shrink-0">₨</span>
        <input
          type="number" min={0} step={500}
          value={value || ""}
          onChange={e => onChange(Math.max(0, parseInt(e.target.value) || 0))}
          className="flex-1 py-2 pr-2 text-sm text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none min-w-0"
        />
      </div>
    </div>
  );
}

export default function HotelManager({ hotels, onClose }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [form, setForm] = useState<HotelForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const makkahHotels  = hotels.filter(h => h.city === "makkah").sort((a, b) => a.distanceMeters - b.distanceMeters);
  const madinahHotels = hotels.filter(h => h.city === "madinah").sort((a, b) => a.distanceMeters - b.distanceMeters);

  function startAdd() { setForm(EMPTY_FORM); setEditingId(null); setError(""); setMode("add"); }

  function startEdit(hotel: HotelType) {
    setForm({
      name: hotel.name, city: hotel.city, stars: hotel.stars,
      distanceLabel: hotel.distanceLabel, distanceMeters: hotel.distanceMeters,
      priceDouble: hotel.priceDouble, priceTriple: hotel.priceTriple,
      priceQuad: hotel.priceQuad, priceSharing: hotel.priceSharing,
      shuttleSurcharge: hotel.shuttleSurcharge,
    });
    setEditingId(hotel.id); setError(""); setMode("edit");
  }

  function setF<K extends keyof HotelForm>(key: K, val: HotelForm[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    if (!user) return;
    if (!form.name.trim()) { setError("Hotel name is required."); return; }
    if (!form.distanceLabel.trim()) { setError("Distance label is required."); return; }
    if (form.priceDouble <= 0) { setError("Double sharing price is required."); return; }
    setSaving(true); setError("");
    try {
      if (mode === "add")                     await addHotel(user.uid, form);
      else if (mode === "edit" && editingId)  await updateHotel(editingId, form);
      setMode("list");
    } catch { setError("Failed to save. Please try again."); }
    finally   { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this hotel?")) return;
    setDeleting(id);
    try { await deleteHotel(id); } finally { setDeleting(null); }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative ml-auto w-full sm:w-[600px] bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-emerald-600" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {mode === "list" ? "Manage Hotels" : mode === "add" ? "Add Hotel" : "Edit Hotel"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {mode === "list" && (
              <button onClick={startAdd} className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={14} /> Add Hotel
              </button>
            )}
            <button onClick={mode === "list" ? onClose : () => setMode("list")} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5">

          {/* ── LIST ── */}
          {mode === "list" && (
            <div className="space-y-6">
              {[
                { label: "Makkah Hotels", list: makkahHotels },
                { label: "Madinah Hotels", list: madinahHotels },
              ].map(({ label, list }) => (
                <div key={label}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">{label}</h3>
                  {list.length === 0 ? (
                    <p className="text-sm text-gray-400 italic py-2">No hotels added yet</p>
                  ) : (
                    <div className="space-y-3">
                      {list.map(hotel => (
                        <div key={hotel.id} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800">
                          {/* Hotel header row */}
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className="min-w-0">
                              <div className="font-semibold text-sm text-gray-900 dark:text-gray-100">{hotel.name}</div>
                              <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                                <span className="flex gap-0.5">
                                  {Array.from({ length: hotel.stars }).map((_, i) => (
                                    <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
                                  ))}
                                </span>
                                <span className="text-xs text-gray-400">{hotel.distanceLabel}</span>
                                {hotel.shuttleSurcharge > 0 && (
                                  <span className="flex items-center gap-0.5 text-xs text-emerald-600 dark:text-emerald-400">
                                    <Bus size={10} /> Shuttle +{fmt(hotel.shuttleSurcharge)}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="flex gap-1 shrink-0">
                              <button onClick={() => startEdit(hotel)} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                                <Pencil size={14} className="text-gray-500" />
                              </button>
                              <button onClick={() => handleDelete(hotel.id)} disabled={deleting === hotel.id} className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50">
                                <Trash2 size={14} className="text-red-400" />
                              </button>
                            </div>
                          </div>
                          {/* Sharing prices grid */}
                          <div className="grid grid-cols-4 gap-1.5 text-center">
                            {[
                              { label: "DUBL",    price: hotel.priceDouble  },
                              { label: "TRPL",    price: hotel.priceTriple  },
                              { label: "QUAD",    price: hotel.priceQuad    },
                              { label: "SHARING", price: hotel.priceSharing },
                            ].map(({ label: lbl, price }) => (
                              <div key={lbl} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg py-1.5 px-1">
                                <div className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase">{lbl}</div>
                                <div className="text-xs font-semibold text-gray-700 dark:text-gray-200 mt-0.5">{fmt(price)}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* ── ADD / EDIT FORM ── */}
          {(mode === "add" || mode === "edit") && (
            <div className="space-y-5">

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hotel Name *</label>
                <input
                  type="text" value={form.name}
                  onChange={e => setF("name", e.target.value)}
                  placeholder="e.g. Fairmont Makkah Clock Tower"
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
                />
              </div>

              {/* City */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
                <div className="grid grid-cols-2 gap-2">
                  {(["makkah", "madinah"] as HotelCity[]).map(c => (
                    <button key={c} onClick={() => setF("city", c)}
                      className={`py-2.5 text-sm font-medium rounded-xl border transition-colors
                        ${form.city === c
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-emerald-300"}`}>
                      {c === "makkah" ? "Makkah" : "Madinah"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Stars */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Star Rating *</label>
                <div className="grid grid-cols-3 gap-2">
                  {([3, 4, 5] as const).map(s => (
                    <button key={s} onClick={() => setF("stars", s)}
                      className={`py-2.5 text-sm font-medium rounded-xl border transition-colors
                        ${form.stars === s
                          ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-yellow-300"}`}>
                      {"★".repeat(s)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Distance Label *</label>
                  <input type="text" value={form.distanceLabel} onChange={e => setF("distanceLabel", e.target.value)}
                    placeholder="e.g. 200m from Haram"
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Distance (meters) *</label>
                  <input type="number" min={0} step={50} value={form.distanceMeters || ""}
                    onChange={e => setF("distanceMeters", Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="200"
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
                  />
                </div>
              </div>

              {/* Sharing prices */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Prices per person / night (without shuttle) *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <PriceInput label="Double (DUBL)" value={form.priceDouble}  onChange={v => setF("priceDouble",  v)} />
                  <PriceInput label="Triple (TRPL)" value={form.priceTriple}  onChange={v => setF("priceTriple",  v)} />
                  <PriceInput label="Quad (QUAD)"   value={form.priceQuad}    onChange={v => setF("priceQuad",    v)} />
                  <PriceInput label="Sharing"        value={form.priceSharing} onChange={v => setF("priceSharing", v)} />
                </div>
              </div>

              {/* Shuttle surcharge */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Shuttle Surcharge
                  <span className="text-xs font-normal text-gray-400 ml-1">(PKR/person/night · 0 = no shuttle)</span>
                </label>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700 max-w-xs">
                  <Bus size={14} className="ml-3 text-gray-400 shrink-0" />
                  <span className="px-2 text-sm text-gray-400 shrink-0">₨</span>
                  <input type="number" min={0} step={500}
                    value={form.shuttleSurcharge || ""}
                    onChange={e => setF("shuttleSurcharge", Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="0"
                    className="flex-1 py-2.5 pr-3 text-sm text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none min-w-0"
                  />
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              <div className="flex gap-3 pt-1">
                <button onClick={() => setMode("list")}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                  {saving ? "Saving…" : mode === "add" ? "Add Hotel" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
