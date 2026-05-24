export type PackageTier  = "bronze" | "silver" | "gold";
export type FlightClass  = "economy" | "business";
export type Currency     = "PKR" | "USD" | "GBP" | "SAR" | "AED";
export type HotelCity    = "makkah" | "madinah";
export type SharingType  = "DUBL" | "TRPL" | "QUAD" | "SHARING";

export interface FlightOption {
  city: string;
  economyFare: number;
  businessFare: number;
}

export interface Hotel {
  id: string;
  userId?: string;
  name: string;
  city: HotelCity;
  stars: 3 | 4 | 5;
  distanceLabel: string;
  distanceMeters: number;
  priceDouble: number;
  priceTriple: number;
  priceQuad: number;
  priceSharing: number;
  shuttleSurcharge: number; // per person per night extra when shuttle on; 0 = no shuttle
  createdAt?: unknown;
}

export interface PackagePreset {
  tier: PackageTier;
  label: string;
  color: string;
  description: string;
  nightsMakkah: number;
  nightsMadinah: number;
  flightClass: FlightClass;
  visaFee: number;
  serviceFee: number;
  insuranceFee: number;
  ziyaratFee: number;
}

export interface VisaTier {
  id: string;
  minPax: number;
  costPKR: number;
}

export interface CalculatorState {
  departureCity: string;
  flightClass: FlightClass;
  economyFare: number;
  businessFare: number;
  numAdults: number;
  numInfants: number;
  makkahHotelId: string;
  makkahSharingType: SharingType;
  shuttleMakkah: boolean;
  madinahHotelId: string;
  madinahSharingType: SharingType;
  shuttleMadinah: boolean;
  nightsMakkah: number;
  nightsMadinah: number;
  visaFee: number;
  serviceFee: number;
  insuranceFee: number;
  ziyaratFee: number;
  currency: Currency;
  infantCharges: number;
  activePreset: PackageTier | null;
  customRates: Partial<Record<Currency, number>>;
  visaTiers: VisaTier[];
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
