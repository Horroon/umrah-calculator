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
        flex sm:flex-col items-start gap-3 p-4 sm:p-5
        ${selected
          ? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20 shadow-lg shadow-emerald-100 dark:shadow-emerald-900/20"
          : "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md"
        }`}
    >
      {selected && (
        <span className="absolute top-3 right-3 bg-emerald-500 dark:bg-emerald-600 text-white rounded-full p-0.5">
          <Check size={14} />
        </span>
      )}

      <div className={`shrink-0 bg-gradient-to-br ${pkg.color} text-white text-xs font-bold px-3 py-1 rounded-full sm:mb-1`}>
        {pkg.label}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 sm:mb-3 leading-snug">
          {pkg.description}
        </p>

        <div className="space-y-1.5 text-xs sm:text-sm text-gray-700 dark:text-gray-300">
          <div className="flex items-center gap-1.5">
            <Plane size={12} className="text-gray-400 dark:text-gray-500 shrink-0" />
            <span className="capitalize">{pkg.flightClass} Class</span>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            <Hotel size={12} className="text-gray-400 dark:text-gray-500 shrink-0" />
            <span className="flex items-center gap-0.5">
              {Array.from({ length: pkg.hotelStars }).map((_, i) => (
                <Star key={i} size={10} className="fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-1 hidden sm:inline">{hotel.label}</span>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock size={12} className="text-gray-400 dark:text-gray-500 shrink-0" />
            <span>{pkg.nightsMakkah + pkg.nightsMadinah}N total</span>
            <span className="hidden sm:inline text-gray-400 dark:text-gray-500">
              ({pkg.nightsMakkah} Makkah · {pkg.nightsMadinah} Madinah)
            </span>
          </div>
        </div>
      </div>
    </button>
  );
}
