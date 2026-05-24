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
      className={`relative w-full text-left rounded-2xl border-2 transition-all duration-200 cursor-pointer
        /* mobile: horizontal layout */ flex sm:flex-col items-start gap-3 p-4 sm:p-5
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

      {/* Tier badge — acts as left icon on mobile */}
      <div className={`shrink-0 bg-gradient-to-br ${pkg.color} text-white text-xs font-bold px-3 py-1 rounded-full sm:mb-1`}>
        {pkg.label}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 mb-2 sm:mb-3 leading-snug">{pkg.description}</p>

        <div className="space-y-1.5 text-xs sm:text-sm text-gray-700">
          <div className="flex items-center gap-1.5">
            <Plane size={12} className="text-gray-400 shrink-0" />
            <span className="capitalize">{pkg.flightClass} Class</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Hotel size={12} className="text-gray-400 shrink-0" />
            <span className="flex items-center gap-0.5">
              {Array.from({ length: pkg.hotelStars }).map((_, i) => (
                <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1 hidden sm:inline">{hotel.label}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-gray-400 shrink-0" />
            <span>{pkg.nightsMakkah + pkg.nightsMadinah}N total</span>
            <span className="hidden sm:inline text-gray-400">({pkg.nightsMakkah} Makkah · {pkg.nightsMadinah} Madinah)</span>
          </div>
        </div>
      </div>
    </button>
  );
}
