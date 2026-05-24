"use client";

import type { Package } from "@/types";
import { HOTEL_OPTIONS } from "@/data/packages";
import { Check, Star, Plane, Hotel, Clock } from "lucide-react";

interface Props {
  pkg: Package;
  selected: boolean;
  onSelect: () => void;
}

export default function PackageCard({ pkg, selected, onSelect }: Props) {
  const hotel = HOTEL_OPTIONS.find((h) => h.stars === pkg.hotelStars)!;

  return (
    <button
      onClick={onSelect}
      className={`relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 cursor-pointer
        ${selected
          ? "border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100"
          : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-md"
        }`}
    >
      {selected && (
        <span className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full p-0.5">
          <Check size={14} />
        </span>
      )}

      <div className={`inline-block bg-gradient-to-r ${pkg.color} text-white text-xs font-bold px-3 py-1 rounded-full mb-3`}>
        {pkg.label}
      </div>

      <p className="text-sm text-gray-500 mb-4">{pkg.description}</p>

      <div className="space-y-2 text-sm text-gray-700">
        <div className="flex items-center gap-2">
          <Plane size={14} className="text-gray-400 shrink-0" />
          <span className="capitalize">{pkg.flightClass} Class</span>
        </div>
        <div className="flex items-center gap-2">
          <Hotel size={14} className="text-gray-400 shrink-0" />
          <span>
            {Array.from({ length: pkg.hotelStars }).map((_, i) => (
              <Star key={i} size={11} className="inline fill-yellow-400 text-yellow-400" />
            ))}{" "}
            {hotel.label}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={14} className="text-gray-400 shrink-0" />
          <span>{pkg.nightsMakkah}N Makkah + {pkg.nightsMadinah}N Madinah</span>
        </div>
      </div>
    </button>
  );
}
