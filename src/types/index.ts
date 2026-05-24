export type PackageTier = "bronze" | "silver" | "gold";
export type FlightClass = "economy" | "business";
export type HotelStars = 3 | 4 | 5;
export type Currency = "PKR" | "USD" | "GBP" | "SAR" | "AED";

export interface FlightOption {
  city: string;
  economyFare: number; // PKR
  businessFare: number; // PKR
}

export interface HotelOption {
  stars: HotelStars;
  label: string;
  pricePerNightMakkah: number; // PKR
  pricePerNightMadinah: number; // PKR
  distanceMakkah: string;
  distanceMadinah: string;
}

export interface Package {
  tier: PackageTier;
  label: string;
  color: string;
  accent: string;
  description: string;
  nightsMakkah: number;
  nightsMadinah: number;
  hotelStars: HotelStars;
  flightClass: FlightClass;
  visaFee: number; // PKR
  serviceFee: number; // PKR
  insuranceFee: number; // PKR
  ziyaratFee: number; // PKR
}

export interface CalculatorState {
  selectedPackage: PackageTier;
  departureCity: string;
  numPersons: number;
  currency: Currency;
}

export interface BreakdownItem {
  label: string;
  amountPKR: number;
  perPerson?: boolean;
}
