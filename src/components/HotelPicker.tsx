"use client";

import type { Hotel, HotelCity, SharingType } from "@/types";
import { Star, Bus, MapPin, Check, Hotel as HotelIcon } from "lucide-react";

interface Props {
  city: HotelCity;
  hotels: Hotel[];
  selectedHotelId: string;
  shuttleEnabled: boolean;
  onHotelChange: (id: string) => void;
  onShuttleChange: (enabled: boolean) => void;
  onManageHotels: () => void;
}

const SHARING_COLORS: Record<SharingType, string> = {
  SNGL:    "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  DUBL:    "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  TRPL:    "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
  QUAD:    "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400",
  SHARING: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
};

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

function formatPKR(n: number) {
  return "₨" + new Intl.NumberFormat("en-US").format(n);
}

export default function HotelPicker({ hotels, selectedHotelId, shuttleEnabled, onHotelChange, onShuttleChange, onManageHotels }: Props) {
  if (hotels.length === 0) {
    return (
      <div className="text-center py-8 space-y-3">
        <HotelIcon size={32} className="mx-auto text-gray-300 dark:text-gray-600" />
        <p className="text-sm text-gray-400 dark:text-gray-500">No hotels added yet</p>
        <button
          onClick={onManageHotels}
          className="text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:underline"
        >
          + Add your first hotel
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Shuttle toggle */}
      <label className="flex items-center gap-2 cursor-pointer select-none">
        <div
          onClick={() => onShuttleChange(!shuttleEnabled)}
          className={`relative w-9 h-5 rounded-full transition-colors ${shuttleEnabled ? "bg-emerald-500" : "bg-gray-200 dark:bg-gray-600"}`}
        >
          <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${shuttleEnabled ? "translate-x-4" : ""}`} />
        </div>
        <Bus size={13} className={shuttleEnabled ? "text-emerald-600 dark:text-emerald-400" : "text-gray-400"} />
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
          {shuttleEnabled ? "Shuttle service included" : "No shuttle service"}
        </span>
      </label>

      {/* Hotel list */}
      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {hotels.map((hotel) => {
          const price = shuttleEnabled ? hotel.priceWithShuttle : hotel.priceWithoutShuttle;
          const selected = hotel.id === selectedHotelId;
          return (
            <button
              key={hotel.id}
              onClick={() => onHotelChange(hotel.id)}
              className={`w-full text-left rounded-xl border p-3 transition-all
                ${selected
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700"}`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 mb-0.5">
                    {selected && <Check size={12} className="text-emerald-500 shrink-0" />}
                    <span className={`text-sm font-medium truncate ${selected ? "text-emerald-700 dark:text-emerald-400" : "text-gray-800 dark:text-gray-200"}`}>
                      {hotel.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <StarRow count={hotel.stars} />
                    <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${SHARING_COLORS[hotel.sharingType]}`}>
                      {hotel.sharingType}
                    </span>
                    <span className="flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500">
                      <MapPin size={9} />{hotel.distanceLabel}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <div className={`text-sm font-bold ${selected ? "text-emerald-600 dark:text-emerald-400" : "text-gray-700 dark:text-gray-300"}`}>
                    {formatPKR(price)}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500">/person/night</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
