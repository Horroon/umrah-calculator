"use client";

import { useState } from "react";
import { X, Plus, Pencil, Trash2, Hotel, Star } from "lucide-react";
import type { Hotel as HotelType, HotelCity, SharingType } from "@/types";
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
  sharingType: SharingType;
  priceWithoutShuttle: number;
  priceWithShuttle: number;
}

const EMPTY_FORM: HotelForm = {
  name: "",
  city: "makkah",
  stars: 4,
  distanceLabel: "",
  sharingType: "DUBL",
  priceWithoutShuttle: 0,
  priceWithShuttle: 0,
};

const SHARING_LABELS: Record<SharingType, string> = {
  SNGL: "Single", DUBL: "Double", TRPL: "Triple", QUAD: "Quad", SHARING: "Sharing",
};

function formatPKR(n: number) {
  return "₨" + new Intl.NumberFormat("en-US").format(n);
}

export default function HotelManager({ hotels, onClose }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [form, setForm] = useState<HotelForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  const makkahHotels  = hotels.filter(h => h.city === "makkah");
  const madinahHotels = hotels.filter(h => h.city === "madinah");

  function startAdd() {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setError("");
    setMode("add");
  }

  function startEdit(hotel: HotelType) {
    setForm({
      name: hotel.name,
      city: hotel.city,
      stars: hotel.stars,
      distanceLabel: hotel.distanceLabel,
      sharingType: hotel.sharingType,
      priceWithoutShuttle: hotel.priceWithoutShuttle,
      priceWithShuttle: hotel.priceWithShuttle,
    });
    setEditingId(hotel.id);
    setError("");
    setMode("edit");
  }

  async function handleSave() {
    if (!user) return;
    if (!form.name.trim()) { setError("Hotel name is required."); return; }
    if (!form.distanceLabel.trim()) { setError("Distance is required."); return; }
    if (form.priceWithoutShuttle <= 0) { setError("Price without shuttle must be > 0."); return; }
    setSaving(true);
    setError("");
    try {
      if (mode === "add") {
        await addHotel(user.uid, form);
      } else if (mode === "edit" && editingId) {
        await updateHotel(editingId, form);
      }
      setMode("list");
    } catch {
      setError("Failed to save. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this hotel?")) return;
    setDeleting(id);
    try {
      await deleteHotel(id);
    } finally {
      setDeleting(null);
    }
  }

  function setF<K extends keyof HotelForm>(key: K, val: HotelForm[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative ml-auto w-full sm:w-[560px] bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex items-center gap-2">
            <Hotel size={18} className="text-emerald-600" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {mode === "list" ? "Manage Hotels" : mode === "add" ? "Add Hotel" : "Edit Hotel"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {mode === "list" && (
              <button
                onClick={startAdd}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors"
              >
                <Plus size={14} />
                Add Hotel
              </button>
            )}
            <button onClick={mode === "list" ? onClose : () => setMode("list")} className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5">
          {/* List mode */}
          {mode === "list" && (
            <div className="space-y-6">
              {[
                { label: "Makkah Hotels", list: makkahHotels },
                { label: "Madinah Hotels", list: madinahHotels },
              ].map(({ label, list }) => (
                <div key={label}>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 mb-3">{label}</h3>
                  {list.length === 0 ? (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic py-2">No hotels added yet</p>
                  ) : (
                    <div className="space-y-2">
                      {list.map(hotel => (
                        <div key={hotel.id} className="flex items-center gap-3 border border-gray-200 dark:border-gray-700 rounded-xl p-3 bg-white dark:bg-gray-800">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-sm text-gray-900 dark:text-gray-100 truncate">{hotel.name}</div>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-xs text-gray-400">{hotel.distanceLabel}</span>
                              <span className="inline-flex items-center gap-0.5 text-xs text-yellow-500">
                                {Array.from({ length: hotel.stars }).map((_, i) => <Star key={i} size={9} className="fill-yellow-400" />)}
                              </span>
                              <span className="text-xs bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-1.5 py-0.5 rounded-full font-medium">
                                {SHARING_LABELS[hotel.sharingType]}
                              </span>
                              <span className="text-xs text-gray-500">{formatPKR(hotel.priceWithoutShuttle)}/night</span>
                            </div>
                          </div>
                          <div className="flex gap-1 shrink-0">
                            <button
                              onClick={() => startEdit(hotel)}
                              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                              <Pencil size={14} className="text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleDelete(hotel.id)}
                              disabled={deleting === hotel.id}
                              className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50"
                            >
                              <Trash2 size={14} className="text-red-400" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Add/Edit form */}
          {(mode === "add" || mode === "edit") && (
            <div className="space-y-4">
              {/* Hotel name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Hotel Name *</label>
                <input
                  type="text"
                  value={form.name}
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
                    <button
                      key={c}
                      onClick={() => setF("city", c)}
                      className={`py-2.5 text-sm font-medium rounded-xl border transition-colors capitalize
                        ${form.city === c
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-emerald-300"}`}
                    >
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
                    <button
                      key={s}
                      onClick={() => setF("stars", s)}
                      className={`py-2.5 text-sm font-medium rounded-xl border transition-colors
                        ${form.stars === s
                          ? "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-yellow-300"}`}
                    >
                      {"★".repeat(s)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sharing type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Room Sharing *</label>
                <div className="grid grid-cols-5 gap-2">
                  {(["SNGL", "DUBL", "TRPL", "QUAD", "SHARING"] as SharingType[]).map(t => (
                    <button
                      key={t}
                      onClick={() => setF("sharingType", t)}
                      className={`py-2 text-xs font-medium rounded-xl border transition-colors
                        ${form.sharingType === t
                          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                          : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:border-emerald-300"}`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Distance from Haram *</label>
                <input
                  type="text"
                  value={form.distanceLabel}
                  onChange={e => setF("distanceLabel", e.target.value)}
                  placeholder="e.g. 200m from Haram"
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Price without Shuttle *<span className="text-xs font-normal text-gray-400 ml-1">(PKR/person/night)</span>
                  </label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700">
                    <span className="px-2.5 text-sm text-gray-400 shrink-0">₨</span>
                    <input
                      type="number" min={0} step={500}
                      value={form.priceWithoutShuttle || ""}
                      onChange={e => setF("priceWithoutShuttle", Math.max(0, parseInt(e.target.value) || 0))}
                      className="flex-1 py-2.5 pr-3 text-sm text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none min-w-0"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Price with Shuttle<span className="text-xs font-normal text-gray-400 ml-1">(PKR/person/night)</span>
                  </label>
                  <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700">
                    <span className="px-2.5 text-sm text-gray-400 shrink-0">₨</span>
                    <input
                      type="number" min={0} step={500}
                      value={form.priceWithShuttle || ""}
                      onChange={e => setF("priceWithShuttle", Math.max(0, parseInt(e.target.value) || 0))}
                      placeholder="0 = no shuttle"
                      className="flex-1 py-2.5 pr-3 text-sm text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none min-w-0"
                    />
                  </div>
                </div>
              </div>

              {error && <p className="text-sm text-red-500">{error}</p>}

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setMode("list")}
                  className="flex-1 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-2.5 text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
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
