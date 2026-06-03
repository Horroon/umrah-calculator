"use client";

import type { CalculatorState, CalculationResult, Hotel, Flight } from "@/types";
import { getHotelById, getFlightById, formatCurrency } from "@/lib/calculator";
import { PACKAGE_PRESETS } from "@/data/packages";
import Logo from "@/components/Logo";

interface Props {
  state: CalculatorState;
  result: CalculationResult;
  hotels: Hotel[];
  flights: Flight[];
}

function Stars({ count }: { count: number }) {
  return <span>{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-gray-100">
      <td className="py-1.5 pr-4 text-gray-500 w-44 align-top">{label}</td>
      <td className="py-1.5 text-gray-900">{value}</td>
    </tr>
  );
}

export default function PrintLayoutWithPrices({ state, result, hotels, flights }: Props) {
  function fmt(pkr: number) {
    return formatCurrency(pkr, "PKR");
  }

  const makkahHotel  = getHotelById(state.makkahHotelId, hotels);
  const madinahHotel = getHotelById(state.madinahHotelId, hotels);
  const selectedFlight = getFlightById(state.selectedFlightId, flights);
  const preset = PACKAGE_PRESETS.find((p) => p.tier === state.activePreset);
  const today  = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const totalNights = state.nightsMakkah + state.nightsMadinah;
  const showInfants = result.numInfants > 0;

  return (
    <div className="print-layout-with-prices bg-white text-gray-900 text-sm font-sans p-8 w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-emerald-700">
        <div className="flex items-center gap-3">
          <div className="bg-emerald-800 rounded-xl p-2">
            <Logo className="w-10 h-10" />
          </div>
          <div>
            <div className="text-xl font-bold text-emerald-800 leading-tight">Umrah Package Estimate</div>
            <div className="text-xs text-gray-400 mt-0.5">umrah-calculator-two.vercel.app</div>
          </div>
        </div>
        <div className="text-right text-xs text-gray-400">
          <div className="font-medium text-gray-600">Date Prepared</div>
          <div>{today}</div>
          <div className="flex gap-1 mt-1 justify-end">
            {preset && (
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide text-[10px]">
                {preset.label} Package
              </span>
            )}
            <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide text-[10px]">
              System Copy
            </span>
          </div>
        </div>
      </div>

      {/* Trip Overview */}
      <div className="mb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Trip Overview</div>
        <table className="w-full text-sm">
          <tbody>
            {selectedFlight ? (
              <>
                <Row label="Flight Code" value={selectedFlight.flyCode} />
                <Row label="Route" value={`${selectedFlight.departureCity} → ${selectedFlight.destinationCity}`} />
              </>
            ) : (
              <>
                <Row label="Departure City" value={state.departureCity} />
                <Row label="Flight Class" value={state.flightClass === "economy" ? "Economy" : "Business"} />
              </>
            )}
            <Row label="Air Ticket" value="Included" />
            <Row label="Visa" value="Included" />
            <Row
              label="Travellers"
              value={`${result.numAdults} Adult${result.numAdults !== 1 ? "s" : ""}${result.numInfants > 0 ? ` · ${result.numInfants} Infant${result.numInfants !== 1 ? "s" : ""} (under 2)` : ""}`}
            />
            <Row label="Total Duration" value={`${totalNights} Nights (${state.nightsMakkah}N Makkah · ${state.nightsMadinah}N Madinah)`} />
          </tbody>
        </table>
      </div>

      {/* Accommodation */}
      <div className="mb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Accommodation</div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: "Makkah",  hotel: makkahHotel,  sharing: state.makkahSharingType,  nights: state.nightsMakkah },
            { label: "Madinah", hotel: madinahHotel, sharing: state.madinahSharingType, nights: state.nightsMadinah },
          ].map(({ label, hotel, sharing, nights }) => (
            <div key={label} className="border border-gray-200 rounded-xl p-3">
              <div className="text-xs font-bold uppercase text-gray-400 mb-1.5">{label}</div>
              {hotel ? (
                <>
                  <div className="font-semibold text-gray-900 leading-snug mb-1">{hotel.name}</div>
                  <div className="text-yellow-500 text-xs mb-2"><Stars count={hotel.stars} /></div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
                    <span className="text-gray-400">Distance</span><span className="text-gray-700">{hotel.distanceLabel}</span>
                    <span className="text-gray-400">Sharing</span><span className="text-gray-700">{sharing}</span>
                    <span className="text-gray-400">Duration</span><span className="text-gray-700">{nights} nights</span>
                    <span className="text-gray-400">Shuttle</span><span className="text-gray-700">{hotel.shuttle ? "✓ Available" : "✗ Not available"}</span>
                  </div>
                </>
              ) : (
                <div className="text-sm text-gray-400 italic">Not selected</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Price Breakdown */}
      <div className="mb-5">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Price Breakdown</div>
        <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-emerald-700 text-white">
              <th className="text-left py-2 px-4 font-semibold">Description</th>
              <th className="text-right py-2 px-4 font-semibold whitespace-nowrap">Per Adult (PKR)</th>
              {showInfants && (
                <th className="text-right py-2 px-4 font-semibold whitespace-nowrap">Infant Total (PKR)</th>
              )}
            </tr>
          </thead>
          <tbody>
            {result.breakdown.map((item, idx) => (
              <tr key={item.label} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="py-2 px-4 text-gray-700">{item.label}</td>
                <td className="py-2 px-4 text-right text-gray-900 font-medium whitespace-nowrap">
                  {item.adultAmountPKR > 0 ? fmt(item.adultAmountPKR) : <span className="text-gray-300">—</span>}
                </td>
                {showInfants && (
                  <td className="py-2 px-4 text-right font-medium whitespace-nowrap">
                    {item.infantAmountPKR > 0
                      ? <span className="text-amber-700">{fmt(item.infantAmountPKR)}</span>
                      : <span className="text-gray-300">—</span>
                    }
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Totals */}
      <div className="mb-5">
        <table className="w-full text-sm">
          <tbody>
            {showInfants && (
              <>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 text-gray-500">Adults Subtotal ({result.numAdults} pax)</td>
                  <td className="py-1.5 text-right font-medium text-gray-900 whitespace-nowrap">{fmt(result.subtotalPKR)}</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="py-1.5 text-amber-600">Infant Charges ({result.numInfants} infant{result.numInfants !== 1 ? "s" : ""})</td>
                  <td className="py-1.5 text-right font-medium text-amber-700 whitespace-nowrap">+{fmt(result.infantSubtotalPKR)}</td>
                </tr>
              </>
            )}
            <tr className="bg-emerald-700 text-white">
              <td className="py-3 px-4 font-bold text-base">Total Package ({result.numAdults + result.numInfants} pax)</td>
              <td className="py-3 px-4 text-right font-bold text-base whitespace-nowrap">{fmt(result.totalPKR)}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 text-gray-500">Per Adult Rate</td>
              <td className="py-2 px-4 text-right font-semibold text-emerald-700 whitespace-nowrap">{fmt(result.totalPerAdultPKR)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-gray-200 text-xs text-gray-400 space-y-1">
        <p>• Prices are indicative estimates based on current market rates and may vary at time of booking.</p>
        <p>• Hotel rates are per person per night. All amounts in PKR. For internal use only.</p>
      </div>
    </div>
  );
}
