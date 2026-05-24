export type PackageTier = "bronze" | "silver" | "gold";
export type FlightClass = "economy" | "business";
export type Currency = "PKR" | "USD" | "GBP" | "SAR" | "AED";
export type HotelCity = "makkah" | "madinah";

export interface FlightOption {
  city: string;
  economyFare: number;
  businessFare: number;
}

export interface Hotel {
  id: string;
  name: string;
  city: HotelCity;
  stars: 3 | 4 | 5;
  distanceMeters: number;
  distanceLabel: string;
  priceWithShuttle: number;
  priceWithoutShuttle: number;
}

export interface PackagePreset {
  tier: PackageTier;
  label: string;
  color: string;
  description: string;
  nightsMakkah: number;
  nightsMadinah: number;
  flightClass: FlightClass;
  makkahHotelId: string;
  madinahHotelId: string;
  shuttleMakkah: boolean;
  shuttleMadinah: boolean;
  visaFee: number;
  serviceFee: number;
  insuranceFee: number;
  ziyaratFee: number;
}

export interface CalculatorState {
  departureCity: string;
  flightClass: FlightClass;
  economyFare: number;
  businessFare: number;
  numAdults: number;
  numInfants: number;
  makkahHotelId: string;
  shuttleMakkah: boolean;
  madinahHotelId: string;
  shuttleMadinah: boolean;
  nightsMakkah: number;
  nightsMadinah: number;
  visaFee: number;
  serviceFee: number;
  insuranceFee: number;
  ziyaratFee: number;
  currency: Currency;
  activePreset: PackageTier | null;
}

export interface BreakdownItem {
  label: string;
  adultAmountPKR: number;
  infantAmountPKR: number;
}

export interface CalculationResult {
  breakdown: BreakdownItem[];
  adultSubtotalPKR: number;
  infantSubtotalPKR: number;
  subtotalPKR: number;
  discountPKR: number;
  totalPKR: number;
  totalPerAdultPKR: number;
  discountLabel: string;
  numAdults: number;
  numInfants: number;
}
