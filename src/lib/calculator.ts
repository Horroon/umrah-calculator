import {
  PACKAGES,
  FLIGHT_OPTIONS,
  HOTEL_OPTIONS,
  GROUP_DISCOUNTS,
  CURRENCIES,
} from "@/data/packages";
import type { PackageTier, Currency, BreakdownItem } from "@/types";

export function getPackage(tier: PackageTier) {
  return PACKAGES.find((p) => p.tier === tier)!;
}

export function getFlightOption(city: string) {
  return FLIGHT_OPTIONS.find((f) => f.city === city) ?? FLIGHT_OPTIONS[0];
}

export function getHotelOption(stars: number) {
  return HOTEL_OPTIONS.find((h) => h.stars === stars) ?? HOTEL_OPTIONS[0];
}

export function getGroupDiscount(numPersons: number) {
  return [...GROUP_DISCOUNTS].reverse().find((d) => numPersons >= d.minPersons)!;
}

export function convertFromPKR(amountPKR: number, currency: Currency): number {
  const curr = CURRENCIES.find((c) => c.code === currency)!;
  return amountPKR * curr.rate;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const curr = CURRENCIES.find((c) => c.code === currency)!;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: currency === "PKR" ? 0 : 2,
    maximumFractionDigits: currency === "PKR" ? 0 : 2,
  }).format(amount);
  return `${curr.symbol}${formatted}`;
}

export interface CalculationResult {
  breakdown: BreakdownItem[];
  subtotalPKR: number;
  discountPKR: number;
  totalPKR: number;
  totalPerPersonPKR: number;
  discountLabel: string;
  numPersons: number;
}

export function calculate(
  tier: PackageTier,
  departureCity: string,
  numPersons: number
): CalculationResult {
  const pkg = getPackage(tier);
  const flight = getFlightOption(departureCity);
  const hotel = getHotelOption(pkg.hotelStars);
  const groupDiscount = getGroupDiscount(numPersons);

  const flightFare =
    pkg.flightClass === "economy" ? flight.economyFare : flight.businessFare;

  const hotelMakkah = hotel.pricePerNightMakkah * pkg.nightsMakkah;
  const hotelMadinah = hotel.pricePerNightMadinah * pkg.nightsMadinah;

  const breakdown: BreakdownItem[] = [
    { label: `Flight (${pkg.flightClass === "economy" ? "Economy" : "Business"} — ${departureCity})`, amountPKR: flightFare, perPerson: true },
    { label: `Hotel Makkah (${hotel.label} × ${pkg.nightsMakkah} nights)`, amountPKR: hotelMakkah, perPerson: true },
    { label: `Hotel Madinah (${hotel.label} × ${pkg.nightsMadinah} nights)`, amountPKR: hotelMadinah, perPerson: true },
    { label: "Umrah Visa Fee", amountPKR: pkg.visaFee, perPerson: true },
    { label: "Service & Handling Charges", amountPKR: pkg.serviceFee, perPerson: true },
    { label: "Travel Insurance", amountPKR: pkg.insuranceFee, perPerson: true },
    { label: "Ziyarat & Local Transport", amountPKR: pkg.ziyaratFee, perPerson: true },
  ];

  const perPersonPKR = breakdown.reduce((sum, item) => sum + item.amountPKR, 0);
  const subtotalPKR = perPersonPKR * numPersons;
  const discountPKR = subtotalPKR * groupDiscount.discount;
  const totalPKR = subtotalPKR - discountPKR;

  return {
    breakdown,
    subtotalPKR,
    discountPKR,
    totalPKR,
    totalPerPersonPKR: totalPKR / numPersons,
    discountLabel: groupDiscount.label,
    numPersons,
  };
}
