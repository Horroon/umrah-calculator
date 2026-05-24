"use client";

import { useState } from "react";
import { X, Plus, Pencil, Trash2, Plane } from "lucide-react";
import type { Flight } from "@/types";
import { addFlight, updateFlight, deleteFlight } from "@/lib/firestore";
import { useAuth } from "@/contexts/AuthContext";

interface Props {
  flights: Flight[];
  onClose: () => void;
}

interface FlightForm {
  flyCode: string;
  departureCity: string;
  destinationCity: string;
  charges: number;
}

const EMPTY_FORM: FlightForm = { flyCode: "", departureCity: "", destinationCity: "", charges: 0 };

function fmt(n: number) {
  return n > 0 ? "₨" + new Intl.NumberFormat("en-US").format(n) : "—";
}

export default function FlightManager({ flights, onClose }: Props) {
  const { user } = useAuth();
  const [mode, setMode] = useState<"list" | "add" | "edit">("list");
  const [form, setForm] = useState<FlightForm>(EMPTY_FORM);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [error, setError] = useState("");

  function startAdd() { setForm(EMPTY_FORM); setEditingId(null); setError(""); setMode("add"); }

  function startEdit(flight: Flight) {
    setForm({ flyCode: flight.flyCode, departureCity: flight.departureCity, destinationCity: flight.destinationCity ?? "", charges: flight.charges });
    setEditingId(flight.id);
    setError("");
    setMode("edit");
  }

  function setF<K extends keyof FlightForm>(key: K, val: FlightForm[K]) {
    setForm(prev => ({ ...prev, [key]: val }));
  }

  async function handleSave() {
    if (!user) return;
    if (!form.flyCode.trim()) { setError("Flight code is required."); return; }
    if (!form.departureCity.trim()) { setError("Departure city is required."); return; }
    if (!form.destinationCity.trim()) { setError("Destination city is required."); return; }
    if (form.charges <= 0) { setError("Charges must be greater than 0."); return; }
    setSaving(true); setError("");
    try {
      if (mode === "add") await addFlight(user.uid, form);
      else if (mode === "edit" && editingId) await updateFlight(editingId, form);
      setMode("list");
    } catch { setError("Failed to save. Please try again."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this flight?")) return;
    setDeleting(id);
    try { await deleteFlight(id); } finally { setDeleting(null); }
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative ml-auto w-full sm:w-[520px] bg-white dark:bg-gray-900 h-full overflow-y-auto shadow-2xl flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white dark:bg-gray-900 z-10">
          <div className="flex items-center gap-2">
            <Plane size={18} className="text-emerald-600" />
            <h2 className="font-semibold text-gray-900 dark:text-gray-100">
              {mode === "list" ? "Manage Flights" : mode === "add" ? "Add Flight" : "Edit Flight"}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            {mode === "list" && (
              <button onClick={startAdd}
                className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-3 py-1.5 rounded-lg transition-colors">
                <Plus size={14} /> Add Flight
              </button>
            )}
            <button onClick={mode === "list" ? onClose : () => setMode("list")}
              className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
              <X size={18} className="text-gray-500" />
            </button>
          </div>
        </div>

        <div className="flex-1 p-5">

          {/* LIST */}
          {mode === "list" && (
            <div className="space-y-3">
              {flights.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Plane size={40} className="text-gray-200 dark:text-gray-700 mb-3" />
                  <p className="text-sm text-gray-400 dark:text-gray-500">No flights added yet</p>
                  <button onClick={startAdd}
                    className="mt-4 flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
                    <Plus size={14} /> Add your first flight
                  </button>
                </div>
              ) : (
                flights.map(flight => (
                  <div key={flight.id}
                    className="flex items-center justify-between gap-3 border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-white dark:bg-gray-800">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 dark:bg-emerald-900/30 flex items-center justify-center shrink-0">
                        <Plane size={16} className="text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                          {flight.flyCode}
                        </div>
                        <div className="text-xs text-gray-400 dark:text-gray-500">
                          {flight.departureCity} → {flight.destinationCity}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                        {fmt(flight.charges)}
                        <span className="text-xs font-normal text-gray-400 ml-1">/person</span>
                      </div>
                      <div className="flex gap-1">
                        <button onClick={() => startEdit(flight)}
                          className="p-1.5 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                          <Pencil size={14} className="text-gray-500" />
                        </button>
                        <button onClick={() => handleDelete(flight.id)} disabled={deleting === flight.id}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition-colors disabled:opacity-50">
                          <Trash2 size={14} className="text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* ADD / EDIT FORM */}
          {(mode === "add" || mode === "edit") && (
            <div className="space-y-5">

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Flight Code *
                </label>
                <input
                  type="text" value={form.flyCode}
                  onChange={e => setF("flyCode", e.target.value)}
                  placeholder="e.g. PK-301, EK-123"
                  className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Departure City *
                  </label>
                  <input
                    type="text" value={form.departureCity}
                    onChange={e => setF("departureCity", e.target.value)}
                    placeholder="e.g. Karachi"
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                    Destination City *
                  </label>
                  <input
                    type="text" value={form.destinationCity}
                    onChange={e => setF("destinationCity", e.target.value)}
                    placeholder="e.g. Jeddah"
                    className="w-full border border-gray-200 dark:border-gray-600 rounded-xl px-3 py-2.5 text-sm bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-300 dark:focus:ring-emerald-700"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Charges per Person (PKR) *
                </label>
                <div className="flex items-center border border-gray-200 dark:border-gray-600 rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-800 focus-within:ring-2 focus-within:ring-emerald-300 dark:focus-within:ring-emerald-700">
                  <span className="px-3 text-sm text-gray-400 dark:text-gray-500 shrink-0">₨</span>
                  <input
                    type="number" min={0} step={1000}
                    value={form.charges || ""}
                    onChange={e => setF("charges", Math.max(0, parseInt(e.target.value) || 0))}
                    placeholder="180000"
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
                  {saving ? "Saving…" : mode === "add" ? "Add Flight" : "Save Changes"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
