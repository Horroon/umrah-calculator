import { FLIGHT_OPTIONS, CURRENCIES } from "@/data/packages";
import type { CalculatorState, CalculationResult, Currency, Hotel, Flight, SharingType } from "@/types";

const INFANT_FLIGHT_RATIO  = 0.10;
const INFANT_SERVICE_RATIO = 0.50;

export function getHotelById(id: string, hotels: Hotel[]): Hotel | undefined {
  return hotels.find((h) => h.id === id);
}

export function getFlightById(id: string, flights: Flight[]): Flight | undefined {
  return flights.find((f) => f.id === id);
}

export function getHotelPrice(hotel: Hotel, sharingType: SharingType): number {
  return sharingType === "DUBL" ? hotel.priceDouble :
    sharingType === "TRPL" ? hotel.priceTriple :
    sharingType === "QUAD" ? hotel.priceQuad   :
    hotel.priceSharing;
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

export function calculate(state: CalculatorState, hotels: Hotel[], flights: Flight[]): CalculationResult {
  const {
    selectedFlightId, departureCity, flightClass, economyFare, businessFare,
    numAdults, numInfants,
    makkahHotelId, makkahSharingType, nightsMakkah,
    madinahHotelId, madinahSharingType, nightsMadinah,
    visaFee, serviceFee, insuranceFee, ziyaratFee,
    infantCharges = 0,
    customRates,
    currency
  } = state;

  const selectedFlight = getFlightById(selectedFlightId, flights);
  const flightFare = selectedFlight
    ? selectedFlight.charges
    : (flightClass === "economy" ? economyFare : businessFare);
  const flightLabel = selectedFlight
    ? `Flight (${selectedFlight.flyCode} – ${selectedFlight.departureCity})`
    : `Flight (${flightClass === "economy" ? "Economy" : "Business"} – ${departureCity})`;

  const mHotel = getHotelById(makkahHotelId, hotels);
  const dHotel = getHotelById(madinahHotelId, hotels);
  // Hotel prices are stored in PKR (per person/night); use directly without currency conversion
  const mRate  = mHotel ? getHotelPrice(mHotel, makkahSharingType)  : 0;
  const dRate  = dHotel ? getHotelPrice(dHotel, madinahSharingType) : 0;

  const makkahLabel  = mHotel
    ? `Hotel Makkah – ${mHotel.name} (${nightsMakkah}N · ${makkahSharingType}${mHotel.shuttle ? " · shuttle ✓" : ""})`
    : `Hotel Makkah (${nightsMakkah}N)`;
  const madinahLabel = dHotel
    ? `Hotel Madinah – ${dHotel.name} (${nightsMadinah}N · ${madinahSharingType}${dHotel.shuttle ? " · shuttle ✓" : ""})`
    : `Hotel Madinah (${nightsMadinah}N)`;

  const infantService = serviceFee * INFANT_SERVICE_RATIO;

  const breakdown = [
    {
      label: flightLabel,
      adultAmountPKR:  flightFare,
      infantAmountPKR: 0,
    },
    {
      label: makkahLabel,
      adultAmountPKR:  mRate * nightsMakkah  * (customRates[currency] ?? 1),
      infantAmountPKR: 0,
    },
    {
      label: madinahLabel,
      adultAmountPKR:  dRate * nightsMadinah * (customRates[currency] ?? 1),
      infantAmountPKR: 0,
    },
    {
      label: "Umrah Visa Fee",
      adultAmountPKR:  visaFee,
      infantAmountPKR: 0,
    },
    {
      label: "Service & Handling Charges",
      adultAmountPKR:  serviceFee,
      infantAmountPKR: 0,
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
    ...(infantCharges > 0 && numInfants > 0 ? [{
      label: "Infant Additional Charges",
      adultAmountPKR:  0,
      infantAmountPKR: infantCharges * numInfants,
    }] : []),
  ];

  const adultSubtotalPKR  = breakdown.reduce((s, r) => s + r.adultAmountPKR, 0);
  const infantSubtotalPKR = numInfants > 0 ? infantCharges * numInfants : 0;
  const subtotalPKR       = adultSubtotalPKR * numAdults;

  const totalPKR      = numAdults > 0 ? subtotalPKR + infantSubtotalPKR : 0;
  const totalPerAdultPKR = adultSubtotalPKR;

  return {
    adultSubtotalPKR,
    infantSubtotalPKR,
    subtotalPKR,
    breakdown,
    numAdults,
    numInfants,
    totalPerAdultPKR,
    totalPKR,
  };
}
