import type { PackagePreset, FlightOption, Currency } from "@/types";

export const PACKAGE_PRESETS: PackagePreset[] = [
  {
    tier: "bronze",
    label: "Bronze",
    color: "from-amber-700 to-amber-500",
    description: "Economy · 11 nights",
    nightsMakkah: 7, nightsMadinah: 4,
    flightClass: "economy",
    visaFee: 25000, serviceFee: 15000, insuranceFee: 5000, ziyaratFee: 8000,
  },
  {
    tier: "silver",
    label: "Silver",
    color: "from-slate-500 to-slate-300",
    description: "Economy · 15 nights",
    nightsMakkah: 10, nightsMadinah: 5,
    flightClass: "economy",
    visaFee: 25000, serviceFee: 20000, insuranceFee: 7000, ziyaratFee: 12000,
  },
  {
    tier: "gold",
    label: "Gold",
    color: "from-yellow-500 to-yellow-300",
    description: "Business · 21 nights",
    nightsMakkah: 14, nightsMadinah: 7,
    flightClass: "business",
    visaFee: 25000, serviceFee: 35000, insuranceFee: 10000, ziyaratFee: 20000,
  },
];

export const FLIGHT_OPTIONS: FlightOption[] = [
  { city: "Karachi",    economyFare: 180000, businessFare: 420000 },
  { city: "Lahore",     economyFare: 165000, businessFare: 390000 },
  { city: "Islamabad",  economyFare: 155000, businessFare: 370000 },
  { city: "Peshawar",   economyFare: 160000, businessFare: 380000 },
  { city: "Quetta",     economyFare: 175000, businessFare: 410000 },
  { city: "Multan",     economyFare: 170000, businessFare: 400000 },
  { city: "Faisalabad", economyFare: 168000, businessFare: 395000 },
];

export const CURRENCIES: { code: Currency; symbol: string; name: string; rate: number }[] = [
  { code: "PKR", symbol: "₨",   name: "Pakistani Rupee", rate: 1       },
  { code: "USD", symbol: "$",   name: "US Dollar",       rate: 0.0036  },
  { code: "GBP", symbol: "£",   name: "British Pound",   rate: 0.0028  },
  { code: "SAR", symbol: "﷼",  name: "Saudi Riyal",     rate: 0.0135  },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham",      rate: 0.0132  },
];

