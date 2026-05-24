import { FLIGHT_OPTIONS, ALL_HOTELS, GROUP_DISCOUNTS, CURRENCIES } from "@/data/packages";
import type { CalculatorState, CalculationResult, Currency } from "@/types";

const INFANT_FLIGHT_RATIO   = 0.10;
const INFANT_SERVICE_RATIO  = 0.50;

export function getHotelById(id: string) {
  return ALL_HOTELS.find((h) => h.id === id) ?? ALL_HOTELS[0];
}

export function getFlightFare(city: string, flightClass: "economy" | "business") {
  const f = FLIGHT_OPTIONS.find((o) => o.city === city) ?? FLIGHT_OPTIONS[0];
  return flightClass === "economy" ? f.economyFare : f.businessFare;
}

export function convertFromPKR(amountPKR: number, currency: Currency): number {
  const c = CURRENCIES.find((c) => c.code === currency)!;
  return amountPKR * c.rate;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const c = CURRENCIES.find((c) => c.code === currency)!;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: currency === "PKR" ? 0 : 2,
    maximumFractionDigits: currency === "PKR" ? 0 : 2,
  }).format(amount);
  return `${c.symbol}${formatted}`;
}

export function calculate(state: CalculatorState): CalculationResult {
  const {
    departureCity, flightClass, economyFare, businessFare,
    numAdults, numInfants,
    makkahHotelId, shuttleMakkah, nightsMakkah,
    madinahHotelId, shuttleMadinah, nightsMadinah,
    visaFee, serviceFee, insuranceFee, ziyaratFee,
  } = state;

  const flightFare = flightClass === "economy" ? economyFare : businessFare;
  const mHotel     = getHotelById(makkahHotelId);
  const dHotel     = getHotelById(madinahHotelId);
  const mRate      = shuttleMakkah   ? mHotel.priceWithShuttle   : mHotel.priceWithoutShuttle;
  const dRate      = shuttleMadinah  ? dHotel.priceWithShuttle   : dHotel.priceWithoutShuttle;

  // Per-adult costs
  const adultFlight      = flightFare;
  const adultHotelMakkah = mRate * nightsMakkah;
  const adultHotelMadinah = dRate * nightsMadinah;
  const adultVisa        = visaFee;
  const adultService     = serviceFee;
  const adultInsurance   = insuranceFee;
  const adultZiyarat     = ziyaratFee;

  // Per-infant costs
  const infantFlight     = flightFare * INFANT_FLIGHT_RATIO;
  const infantVisa       = visaFee;
  const infantService    = serviceFee * INFANT_SERVICE_RATIO;

  // Breakdown rows: each shows the adult total and infant total for that line
  const breakdown = [
    {
      label: `Flight (${flightClass === "economy" ? "Economy" : "Business"} – ${departureCity})`,
      adultAmountPKR:  adultFlight  * numAdults,
      infantAmountPKR: infantFlight * numInfants,
    },
    {
      label: `Hotel Makkah – ${mHotel.name} (${nightsMakkah}N${shuttleMakkah ? " · shuttle ✓" : ""})`,
      adultAmountPKR:  adultHotelMakkah * numAdults,
      infantAmountPKR: 0,
    },
    {
      label: `Hotel Madinah – ${dHotel.name} (${nightsMadinah}N${shuttleMadinah ? " · shuttle ✓" : ""})`,
      adultAmountPKR:  adultHotelMadinah * numAdults,
      infantAmountPKR: 0,
    },
    {
      label: "Umrah Visa Fee",
      adultAmountPKR:  adultVisa    * numAdults,
      infantAmountPKR: infantVisa   * numInfants,
    },
    {
      label: "Service & Handling Charges",
      adultAmountPKR:  adultService  * numAdults,
      infantAmountPKR: infantService * numInfants,
    },
    ...(insuranceFee > 0 ? [{
      label: "Travel Insurance",
      adultAmountPKR:  adultInsurance * numAdults,
      infantAmountPKR: 0,
    }] : []),
    ...(ziyaratFee > 0 ? [{
      label: "Ziyarat & Local Transport",
      adultAmountPKR:  adultZiyarat * numAdults,
      infantAmountPKR: 0,
    }] : []),
  ];

  const adultSubtotalPKR  = breakdown.reduce((s, r) => s + r.adultAmountPKR,  0);
  const infantSubtotalPKR = breakdown.reduce((s, r) => s + r.infantAmountPKR, 0);
  const subtotalPKR       = adultSubtotalPKR + infantSubtotalPKR;

  const totalPersons = numAdults + numInfants;
  const groupDiscount = [...GROUP_DISCOUNTS].reverse().find((d) => totalPersons >= d.minPersons)!;
  const discountPKR = subtotalPKR * groupDiscount.discount;
  const totalPKR    = subtotalPKR - discountPKR;

  return {
    breakdown,
    adultSubtotalPKR,
    infantSubtotalPKR,
    subtotalPKR,
    discountPKR,
    totalPKR,
    totalPerAdultPKR: numAdults > 0 ? (adultSubtotalPKR * (1 - groupDiscount.discount)) / numAdults : 0,
    discountLabel: groupDiscount.label,
    numAdults,
    numInfants,
  };
}
