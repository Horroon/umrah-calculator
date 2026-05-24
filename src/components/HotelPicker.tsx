"use client";

import type { Hotel, HotelCity } from "@/types";
import { Star, Bus, MapPin, Check } from "lucide-react";

interface Props {
  city: HotelCity;
  hotels: Hotel[];
  selectedHotelId: string;
  shuttleEnabled: boolean;
  onHotelChange: (id: string) => void;
  onShuttleChange: (enabled: boolean) => void;
}

function StarRow({ count }: { count: number }) {
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i} size={10}
          className={i < count ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200 dark:fill-gray-600 dark:text-gray-600"}
        />
      ))}
    </span>
  );
}

function formatPKR(n: number) {
  return "₨" + new Intl.NumberFormat("en-US").format(n);
}

export default function HotelPicker({ hotels, selectedHotelId, shuttleEnabled, onHotelChange, onShuttleChange }: Props) {
  const sorted = [...hotels].sort((a, b) => a.distanceMeters - b.distanceMeters);

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
        {sorted.map((hotel) => {
          const price = shuttleEnabled ? hotel.priceWithShuttle : hotel.priceWithoutShuttle;
          const selected = hotel.id === selectedHotelId;

          return (
            <button
              key={hotel.id}
              onClick={() => onHotelChange(hotel.id)}
              className={`w-full text-left rounded-xl border p-3 transition-all
                ${selected
                  ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20"
                  : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-emerald-300 dark:hover:border-emerald-700"
                }`}
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
                    <span className="flex items-center gap-0.5 text-xs text-gray-400 dark:text-gray-500">
                      <MapPin size={9} />
                      {hotel.distanceLabel}
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
