import { FLIGHT_OPTIONS, GROUP_DISCOUNTS, CURRENCIES } from "@/data/packages";
import type { CalculatorState, CalculationResult, Currency, Hotel, SharingType } from "@/types";

const INFANT_FLIGHT_RATIO  = 0.10;
const INFANT_SERVICE_RATIO = 0.50;

export function getHotelById(id: string, hotels: Hotel[]): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

export function getHotelPrice(hotel: Hotel, sharingType: SharingType, shuttle: boolean): number {
  const base =
    sharingType === "DUBL" ? hotel.priceDouble :
    sharingType === "TRPL" ? hotel.priceTriple :
    sharingType === "QUAD" ? hotel.priceQuad   :
    hotel.priceSharing;
  return base + (shuttle ? hotel.shuttleSurcharge : 0);
}

export function getFlightFare(city: string, flightClass: "economy" | "business") {
  const f = FLIGHT_OPTIONS.find((o) => o.city === city) ?? FLIGHT_OPTIONS[0];
  return flightClass === "economy" ? f.economyFare : f.businessFare;
}

export function convertFromPKR(
  amountPKR: number,
  currency: Currency,
  customRates?: Partial<Record<string, number>>,
): number {
  if (currency === "PKR") return amountPKR;
  const c = CURRENCIES.find((c) => c.code === currency)!;
  const defaultPkrPerForeign = 1 / c.rate;
  const pkrPerForeign = customRates?.[currency] ?? defaultPkrPerForeign;
  return amountPKR / pkrPerForeign;
}

export function formatCurrency(amount: number, currency: Currency): string {
  const c = CURRENCIES.find((c) => c.code === currency)!;
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: currency === "PKR" ? 0 : 2,
    maximumFractionDigits: currency === "PKR" ? 0 : 2,
  }).format(amount);
  return `${c.symbol}${formatted}`;
}

export function calculate(state: CalculatorState, hotels: Hotel[]): CalculationResult {
  const {
    departureCity, flightClass, economyFare, businessFare,
    numAdults, numInfants,
    makkahHotelId, makkahSharingType, shuttleMakkah, nightsMakkah,
    madinahHotelId, madinahSharingType, shuttleMadinah, nightsMadinah,
    visaFee, serviceFee, insuranceFee, ziyaratFee,
  } = state;

  const flightFare = flightClass === "economy" ? economyFare : businessFare;
  const mHotel = getHotelById(makkahHotelId, hotels);
  const dHotel = getHotelById(madinahHotelId, hotels);
  const mRate  = mHotel ? getHotelPrice(mHotel, makkahSharingType,  shuttleMakkah)  : 0;
  const dRate  = dHotel ? getHotelPrice(dHotel, madinahSharingType, shuttleMadinah) : 0;

  const makkahLabel  = mHotel
    ? `Hotel Makkah – ${mHotel.name} (${nightsMakkah}N · ${makkahSharingType}${shuttleMakkah && mHotel.shuttleSurcharge > 0 ? " · shuttle ✓" : ""})`
    : `Hotel Makkah (${nightsMakkah}N)`;
  const madinahLabel = dHotel
    ? `Hotel Madinah – ${dHotel.name} (${nightsMadinah}N · ${madinahSharingType}${shuttleMadinah && dHotel.shuttleSurcharge > 0 ? " · shuttle ✓" : ""})`
    : `Hotel Madinah (${nightsMadinah}N)`;

  const infantFlight  = flightFare * INFANT_FLIGHT_RATIO;
  const infantService = serviceFee * INFANT_SERVICE_RATIO;

  const breakdown = [
    {
      label: `Flight (${flightClass === "economy" ? "Economy" : "Business"} – ${departureCity})`,
      adultAmountPKR:  flightFare   * numAdults,
      infantAmountPKR: infantFlight * numInfants,
    },
    {
      label: makkahLabel,
      adultAmountPKR:  mRate * nightsMakkah  * numAdults,
      infantAmountPKR: 0,
    },
    {
      label: madinahLabel,
      adultAmountPKR:  dRate * nightsMadinah * numAdults,
      infantAmountPKR: 0,
    },
    {
      label: "Umrah Visa Fee",
      adultAmountPKR:  visaFee    * numAdults,
      infantAmountPKR: visaFee    * numInfants,
    },
    {
      label: "Service & Handling Charges",
      adultAmountPKR:  serviceFee    * numAdults,
      infantAmountPKR: infantService * numInfants,
    },
    ...(insuranceFee > 0 ? [{
      label: "Travel Insurance",
      adultAmountPKR:  insuranceFee * numAdults,
      infantAmountPKR: 0,
    }] : []),
    ...(ziyaratFee > 0 ? [{
      label: "Ziyarat & Local Transport",
      adultAmountPKR:  ziyaratFee * numAdults,
      infantAmountPKR: 0,
    }] : []),
  ];

  const adultSubtotalPKR  = breakdown.reduce((s, r) => s + r.adultAmountPKR,  0);
  const infantSubtotalPKR = breakdown.reduce((s, r) => s + r.infantAmountPKR, 0);
  const subtotalPKR       = adultSubtotalPKR + infantSubtotalPKR;

  const totalPersons  = numAdults + numInfants;
  const groupDiscount = [...GROUP_DISCOUNTS].reverse().find((d) => totalPersons >= d.minPersons)!;
  const discountPKR   = subtotalPKR * groupDiscount.discount;
  const totalPKR      = subtotalPKR - discountPKR;

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
