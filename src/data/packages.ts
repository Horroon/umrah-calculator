import type { Package, FlightOption, HotelOption, Currency } from "@/types";

export const PACKAGES: Package[] = [
  {
    tier: "bronze",
    label: "Bronze",
    color: "from-amber-700 to-amber-500",
    accent: "amber",
    description: "Essential Umrah experience with comfortable accommodation",
    nightsMakkah: 7,
    nightsMadinah: 4,
    hotelStars: 3,
    flightClass: "economy",
    visaFee: 25000,
    serviceFee: 15000,
    insuranceFee: 5000,
    ziyaratFee: 8000,
  },
  {
    tier: "silver",
    label: "Silver",
    color: "from-slate-500 to-slate-300",
    accent: "slate",
    description: "Enhanced Umrah with premium hotels near Haram",
    nightsMakkah: 10,
    nightsMadinah: 5,
    hotelStars: 4,
    flightClass: "economy",
    visaFee: 25000,
    serviceFee: 20000,
    insuranceFee: 7000,
    ziyaratFee: 12000,
  },
  {
    tier: "gold",
    label: "Gold",
    color: "from-yellow-500 to-yellow-300",
    accent: "yellow",
    description: "Luxury Umrah with 5-star hotels & business class flights",
    nightsMakkah: 14,
    nightsMadinah: 7,
    hotelStars: 5,
    flightClass: "business",
    visaFee: 25000,
    serviceFee: 35000,
    insuranceFee: 10000,
    ziyaratFee: 20000,
  },
];

export const FLIGHT_OPTIONS: FlightOption[] = [
  { city: "Karachi", economyFare: 180000, businessFare: 420000 },
  { city: "Lahore", economyFare: 165000, businessFare: 390000 },
  { city: "Islamabad", economyFare: 155000, businessFare: 370000 },
  { city: "Peshawar", economyFare: 160000, businessFare: 380000 },
  { city: "Quetta", economyFare: 175000, businessFare: 410000 },
  { city: "Multan", economyFare: 170000, businessFare: 400000 },
  { city: "Faisalabad", economyFare: 168000, businessFare: 395000 },
];

export const HOTEL_OPTIONS: HotelOption[] = [
  {
    stars: 3,
    label: "3-Star Comfort",
    pricePerNightMakkah: 12000,
    pricePerNightMadinah: 9000,
    distanceMakkah: "800m – 1.5km from Haram",
    distanceMadinah: "700m – 1.2km from Masjid Nabawi",
  },
  {
    stars: 4,
    label: "4-Star Premium",
    pricePerNightMakkah: 22000,
    pricePerNightMadinah: 16000,
    distanceMakkah: "300m – 600m from Haram",
    distanceMadinah: "200m – 500m from Masjid Nabawi",
  },
  {
    stars: 5,
    label: "5-Star Luxury",
    pricePerNightMakkah: 45000,
    pricePerNightMadinah: 32000,
    distanceMakkah: "50m – 200m from Haram",
    distanceMadinah: "100m – 300m from Masjid Nabawi",
  },
];

export const CURRENCIES: { code: Currency; symbol: string; name: string; rate: number }[] = [
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 0.0036 },
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0028 },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal", rate: 0.0135 },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham", rate: 0.0132 },
];

export const GROUP_DISCOUNTS: { minPersons: number; discount: number; label: string }[] = [
  { minPersons: 1, discount: 0, label: "No discount" },
  { minPersons: 5, discount: 0.05, label: "5% off" },
  { minPersons: 10, discount: 0.10, label: "10% off" },
  { minPersons: 20, discount: 0.15, label: "15% off" },
];
