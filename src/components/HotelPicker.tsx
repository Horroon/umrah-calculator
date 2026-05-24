"use client";

import { useState, useMemo } from "react";
import type { Hotel, HotelCity, SharingType } from "@/types";
import { getHotelPrice } from "@/lib/calculator";
import { Star, Bus, MapPin, Check, Building2, SlidersHorizontal } from "lucide-react";

interface Props {
  city: HotelCity;
  hotels: Hotel[];
  selectedHotelId: string;
  selectedSharingType: SharingType;
  shuttleEnabled: boolean;
  onHotelChange: (id: string) => void;
  onSharingTypeChange: (t: SharingType) => void;
  onShuttleChange: (enabled: boolean) => void;
  onManageHotels: () => void;
}

const SHARING_TYPES: SharingType[] = ["DUBL", "TRPL", "QUAD", "SHARING"];

function fmt(n: number) {
  return "₨" + new Intl.NumberFormat("en-US").format(n);
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} size={10}
          className={i < count ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"}
        />
      ))}
    </span>
  );
}

export default function HotelPicker({
  hotels, selectedHotelId, selectedSharingType, shuttleEnabled,
  onHotelChange, onSharingTypeChange, onShuttleChange, onManageHotels,
}: Props) {
  const [filterMaxDist, setFilterMaxDist] = useState<number | null>(null);
  const [showFilters, setShowFilters]     = useState(false);

  const distanceOptions = useMemo(() => {
    if (hotels.length === 0) return [];
    return [...new Set(hotels.map(h => h.distanceMeters))].sort((a, b) => a - b);
  }, [hotels]);

  // Filter by shuttle and distance; sort ascending by distance
  const filtered = useMemo(() => {
    return hotels
      .filter(h => !shuttleEnabled || h.shuttleSurcharge > 0)
      .filter(h => filterMaxDist === null || h.distanceMeters <= filterMaxDist)
      .sort((a, b) => a.distanceMeters - b.distanceMeters);
  }, [hotels, shuttleEnabled, filterMaxDist]);

  const hasActiveFilter = shuttleEnabled || filterMaxDist !== null;

  if (hotels.length === 0) {
    return (
      <div className="text-center py-10 space-y-3">
        <Building2 size={36} className="mx-auto text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-400 dark:text-gray-500">No hotels added yet</p>
        <button onClick={onManageHotels} className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline">
          + Add your first hotel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">

      {/* Filter button */}
      <div className="flex items-center justify-end">
        <button onClick={() => setShowFilters(f => !f)}
          className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg border transition-colors
            ${showFilters || hasActiveFilter
              ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
              : "border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-gray-300"}`}>
          <SlidersHorizontal size={12} />
          Filter{hasActiveFilter ? " ●" : ""}
        </button>
      </div>

      {/* Filter panel */}
      {showFilters && (
        <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl p-3 space-y-3 border border-gray-200 dark:border-gray-700">

          {/* Shuttle toggle */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <Bus size={12} className={shuttleEnabled ? "text-emerald-500" : "text-gray-400"} />
              <span className="text-xs text-gray-600 dark:text-gray-400">Include shuttle service</span>
            </label>
            <div onClick={() => onShuttleChange(!shuttleEnabled)}
              className={`relative w-9 h-5 rounded-full transition-colors cursor-pointer ${shuttleEnabled ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-600"}`}>
              <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${shuttleEnabled ? "translate-x-4" : ""}`} />
            </div>
          </div>

          {/* Distance filter */}
          {distanceOptions.length > 1 && (
            <div>
              <div className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 flex items-center gap-1">
                <MapPin size={11} /> Max distance
              </div>
              <div className="flex flex-wrap gap-1.5">
                <button onClick={() => setFilterMaxDist(null)}
                  className={`px-2 py-1 text-xs rounded-lg border transition-colors
                    ${filterMaxDist === null
                      ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                      : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300"}`}>
                  All
                </button>
                {distanceOptions.map(d => (
                  <button key={d} onClick={() => setFilterMaxDist(d)}
                    className={`px-2 py-1 text-xs rounded-lg border transition-colors
                      ${filterMaxDist === d
                        ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400"
                        : "border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:border-gray-300"}`}>
                    ≤ {d >= 1000 ? `${d / 1000}km` : `${d}m`}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hotel list — sorted ascending by distance */}
      <div className="space-y-2.5 max-h-[480px] overflow-y-auto pr-1">
        {filtered.length === 0 && (
          <p className="text-sm text-gray-400 dark:text-gray-500 text-center py-4">No hotels match the current filters.</p>
        )}
        {filtered.map(hotel => {
          const isSelected = hotel.id === selectedHotelId;
          return (
            <div key={hotel.id}
              className={`rounded-xl border transition-all ${
                isSelected
                  ? "border-emerald-500 bg-emerald-50/60 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
              }`}>
              <button className="w-full text-left px-3 pt-3 pb-2" onClick={() => onHotelChange(hotel.id)}>
                <div className="flex items-start gap-2">
                  {isSelected && <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />}
                  <div className="min-w-0 flex-1">
                    <div className={`text-sm font-semibold truncate ${isSelected ? "text-emerald-700 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"}`}>
                      {hotel.name}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap mt-0.5">
                      <StarRow count={hotel.stars} />
                      <span className="flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500">
                        <MapPin size={9} />{hotel.distanceLabel}
                      </span>
                      {hotel.shuttleSurcharge > 0 && (
                        <span className="flex items-center gap-0.5 text-xs text-emerald-500 dark:text-emerald-400">
                          <Bus size={9} />Shuttle +{fmt(hotel.shuttleSurcharge)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>

              {/* Sharing price chips */}
              <div className="grid grid-cols-4 gap-1.5 px-3 pb-3">
                {SHARING_TYPES.map(type => {
                  const price    = getHotelPrice(hotel, type, shuttleEnabled);
                  const isActive = isSelected && selectedSharingType === type;
                  return (
                    <button key={type}
                      onClick={() => { onHotelChange(hotel.id); onSharingTypeChange(type); }}
                      className={`rounded-lg py-2 px-1 text-center transition-all border ${
                        isActive
                          ? "border-emerald-500 bg-emerald-600 text-white shadow-sm"
                          : isSelected
                            ? "border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-100"
                            : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 text-gray-600 dark:text-gray-400 hover:border-emerald-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                      }`}>
                      <div className={`text-[9px] font-bold uppercase leading-none ${isActive ? "text-emerald-100" : "opacity-60"}`}>{type}</div>
                      <div className="text-[10px] font-bold mt-1 leading-tight">{fmt(price)}</div>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
