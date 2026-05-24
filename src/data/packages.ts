import type { PackagePreset, FlightOption, Hotel, Currency } from "@/types";

export const MAKKAH_HOTELS: Hotel[] = [
  {
    id: "makkah-fairmont",
    name: "Fairmont Makkah Clock Royal Tower",
    city: "makkah", stars: 5,
    distanceMeters: 80, distanceLabel: "80m from Haram",
    priceWithShuttle: 55000, priceWithoutShuttle: 50000,
  },
  {
    id: "makkah-swissotel",
    name: "Swissôtel Makkah",
    city: "makkah", stars: 5,
    distanceMeters: 100, distanceLabel: "100m from Haram",
    priceWithShuttle: 38000, priceWithoutShuttle: 34000,
  },
  {
    id: "makkah-safwah",
    name: "Al Safwah Royale Orchid Hotel",
    city: "makkah", stars: 5,
    distanceMeters: 150, distanceLabel: "150m from Haram",
    priceWithShuttle: 32000, priceWithoutShuttle: 28000,
  },
  {
    id: "makkah-hilton-suites",
    name: "Hilton Suites Makkah",
    city: "makkah", stars: 5,
    distanceMeters: 300, distanceLabel: "300m from Haram",
    priceWithShuttle: 28000, priceWithoutShuttle: 24000,
  },
  {
    id: "makkah-movenpick",
    name: "Mövenpick Hotel Hajar Tower",
    city: "makkah", stars: 4,
    distanceMeters: 250, distanceLabel: "250m from Haram",
    priceWithShuttle: 18000, priceWithoutShuttle: 15000,
  },
  {
    id: "makkah-elaf-kinda",
    name: "Elaf Kinda Hotel",
    city: "makkah", stars: 4,
    distanceMeters: 400, distanceLabel: "400m from Haram",
    priceWithShuttle: 14000, priceWithoutShuttle: 11500,
  },
  {
    id: "makkah-kiswah",
    name: "Al Kiswah Towers Hotel",
    city: "makkah", stars: 4,
    distanceMeters: 600, distanceLabel: "600m from Haram",
    priceWithShuttle: 12000, priceWithoutShuttle: 9500,
  },
  {
    id: "makkah-millennium",
    name: "Millennium Makkah Al Naseem",
    city: "makkah", stars: 4,
    distanceMeters: 700, distanceLabel: "700m from Haram",
    priceWithShuttle: 11000, priceWithoutShuttle: 9000,
  },
  {
    id: "makkah-anjum",
    name: "Anjum Hotel Makkah",
    city: "makkah", stars: 3,
    distanceMeters: 900, distanceLabel: "900m from Haram",
    priceWithShuttle: 8500, priceWithoutShuttle: 7000,
  },
  {
    id: "makkah-grand",
    name: "Grand Makkah Hotel",
    city: "makkah", stars: 3,
    distanceMeters: 1200, distanceLabel: "1.2km from Haram",
    priceWithShuttle: 7000, priceWithoutShuttle: 5500,
  },
];

export const MADINAH_HOTELS: Hotel[] = [
  {
    id: "madinah-shohada",
    name: "Al Shohada Hotel",
    city: "madinah", stars: 5,
    distanceMeters: 50, distanceLabel: "50m from Masjid Nabawi",
    priceWithShuttle: 24000, priceWithoutShuttle: 21000,
  },
  {
    id: "madinah-movenpick",
    name: "Anwar Al Madinah Mövenpick",
    city: "madinah", stars: 5,
    distanceMeters: 80, distanceLabel: "80m from Masjid Nabawi",
    priceWithShuttle: 28000, priceWithoutShuttle: 25000,
  },
  {
    id: "madinah-hilton",
    name: "Hilton Madinah",
    city: "madinah", stars: 5,
    distanceMeters: 150, distanceLabel: "150m from Masjid Nabawi",
    priceWithShuttle: 22000, priceWithoutShuttle: 19000,
  },
  {
    id: "madinah-pullman",
    name: "Pullman Zamzam Madinah",
    city: "madinah", stars: 5,
    distanceMeters: 200, distanceLabel: "200m from Masjid Nabawi",
    priceWithShuttle: 20000, priceWithoutShuttle: 17500,
  },
  {
    id: "madinah-meridien",
    name: "Le Méridien Madinah",
    city: "madinah", stars: 4,
    distanceMeters: 300, distanceLabel: "300m from Masjid Nabawi",
    priceWithShuttle: 14000, priceWithoutShuttle: 11500,
  },
  {
    id: "madinah-crowne",
    name: "Crowne Plaza Madinah",
    city: "madinah", stars: 4,
    distanceMeters: 500, distanceLabel: "500m from Masjid Nabawi",
    priceWithShuttle: 12000, priceWithoutShuttle: 9500,
  },
  {
    id: "madinah-saja",
    name: "Saja Madinah Hotel",
    city: "madinah", stars: 4,
    distanceMeters: 700, distanceLabel: "700m from Masjid Nabawi",
    priceWithShuttle: 9500, priceWithoutShuttle: 7500,
  },
  {
    id: "madinah-eiman",
    name: "Al Eiman Taibah Hotel",
    city: "madinah", stars: 3,
    distanceMeters: 900, distanceLabel: "900m from Masjid Nabawi",
    priceWithShuttle: 7000, priceWithoutShuttle: 5500,
  },
  {
    id: "madinah-rawda",
    name: "Al Rawda Royal Hotel",
    city: "madinah", stars: 3,
    distanceMeters: 1100, distanceLabel: "1.1km from Masjid Nabawi",
    priceWithShuttle: 6000, priceWithoutShuttle: 4500,
  },
];

export const ALL_HOTELS = [...MAKKAH_HOTELS, ...MADINAH_HOTELS];

export const PACKAGE_PRESETS: PackagePreset[] = [
  {
    tier: "bronze",
    label: "Bronze",
    color: "from-amber-700 to-amber-500",
    description: "3–4★ · Economy · 11 nights",
    nightsMakkah: 7, nightsMadinah: 4,
    flightClass: "economy",
    makkahHotelId: "makkah-anjum",
    madinahHotelId: "madinah-eiman",
    shuttleMakkah: true, shuttleMadinah: true,
    visaFee: 25000, serviceFee: 15000, insuranceFee: 5000, ziyaratFee: 8000,
  },
  {
    tier: "silver",
    label: "Silver",
    color: "from-slate-500 to-slate-300",
    description: "4★ · Economy · 15 nights",
    nightsMakkah: 10, nightsMadinah: 5,
    flightClass: "economy",
    makkahHotelId: "makkah-movenpick",
    madinahHotelId: "madinah-crowne",
    shuttleMakkah: true, shuttleMadinah: true,
    visaFee: 25000, serviceFee: 20000, insuranceFee: 7000, ziyaratFee: 12000,
  },
  {
    tier: "gold",
    label: "Gold",
    color: "from-yellow-500 to-yellow-300",
    description: "5★ · Business · 21 nights",
    nightsMakkah: 14, nightsMadinah: 7,
    flightClass: "business",
    makkahHotelId: "makkah-fairmont",
    madinahHotelId: "madinah-movenpick",
    shuttleMakkah: true, shuttleMadinah: true,
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
  { code: "PKR", symbol: "₨",  name: "Pakistani Rupee", rate: 1       },
  { code: "USD", symbol: "$",  name: "US Dollar",        rate: 0.0036  },
  { code: "GBP", symbol: "£",  name: "British Pound",    rate: 0.0028  },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal",      rate: 0.0135  },
  { code: "AED", symbol: "د.إ",name: "UAE Dirham",       rate: 0.0132  },
];

export const GROUP_DISCOUNTS = [
  { minPersons: 1,  discount: 0,    label: "No discount" },
  { minPersons: 5,  discount: 0.05, label: "5% off"      },
  { minPersons: 10, discount: 0.10, label: "10% off"     },
  { minPersons: 20, discount: 0.15, label: "15% off"     },
];
