"use client";

import React from "react";
import type { CalculatorState, CalculationResult, Currency } from "@/types";
import { getHotelById, convertFromPKR, formatCurrency } from "@/lib/calculator";
import { PACKAGE_PRESETS } from "@/data/packages";
import Logo from "@/components/Logo";

interface Props {
  state: CalculatorState;
  result: CalculationResult;
  currency: Currency;
}

function fmt(pkr: number, currency: Currency) {
  return formatCurrency(convertFromPKR(pkr, currency), currency);
}
function fmtPKR(pkr: number) {
  return formatCurrency(pkr, "PKR");
}

function Stars({ count }: { count: number }) {
  return <span>{"★".repeat(count)}{"☆".repeat(5 - count)}</span>;
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <tr className={`border-b border-gray-100 ${bold ? "font-semibold" : ""}`}>
      <td className="py-1.5 pr-4 text-gray-500 w-44 align-top">{label}</td>
      <td className="py-1.5 text-gray-900">{value}</td>
    </tr>
  );
}

export default function PrintLayout({ state, result, currency }: Props) {
  const makkahHotel  = getHotelById(state.makkahHotelId);
  const madinahHotel = getHotelById(state.madinahHotelId);
  const preset       = PACKAGE_PRESETS.find((p) => p.tier === state.activePreset);
  const today        = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
  const showCurrency = currency !== "PKR";
  const totalNights  = state.nightsMakkah + state.nightsMadinah;

  return (
    <div className="print-layout hidden bg-white text-gray-900 text-sm font-sans p-8 max-w-3xl mx-auto">

      {/* ── Document header ── */}
      <div className="flex items-center justify-between mb-6 pb-5 border-b-2 border-emerald-700">
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
          {preset && (
            <div className="mt-1">
              <span className="bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-semibold uppercase tracking-wide text-[10px]">
                {preset.label} Package
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Trip overview ── */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Trip Overview</div>
        <table className="w-full text-sm">
          <tbody>
            <Row label="Departure City"  value={state.departureCity} />
            <Row label="Flight Class"    value={state.flightClass === "economy" ? "Economy Class" : "Business Class"} />
            <Row label="Travellers"
              value={`${result.numAdults} Adult${result.numAdults !== 1 ? "s" : ""}${result.numInfants > 0 ? ` · ${result.numInfants} Infant${result.numInfants !== 1 ? "s" : ""} (under 2)` : ""}`}
            />
            <Row label="Total Duration"  value={`${totalNights} Nights  (${state.nightsMakkah}N Makkah · ${state.nightsMadinah}N Madinah)`} />
            <Row label="Display Currency" value={currency} />
          </tbody>
        </table>
      </div>

      {/* ── Accommodation ── */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Accommodation</div>
        <div className="grid grid-cols-2 gap-4">
          {/* Makkah */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase text-gray-400 mb-2">Makkah</div>
            <div className="font-semibold text-gray-900 leading-snug mb-1">{makkahHotel.name}</div>
            <div className="text-yellow-500 text-xs mb-1"><Stars count={makkahHotel.stars} /></div>
            <table className="w-full text-xs text-gray-600">
              <tbody>
                <tr><td className="pr-3 py-0.5 text-gray-400">Distance</td><td>{makkahHotel.distanceLabel}</td></tr>
                <tr><td className="pr-3 py-0.5 text-gray-400">Duration</td><td>{state.nightsMakkah} nights</td></tr>
                <tr>
                  <td className="pr-3 py-0.5 text-gray-400">Shuttle</td>
                  <td>{state.shuttleMakkah ? "✓ Included" : "✗ Not included"}</td>
                </tr>
                <tr>
                  <td className="pr-3 py-0.5 text-gray-400">Rate/night</td>
                  <td className="font-medium">
                    {fmtPKR(state.shuttleMakkah ? makkahHotel.priceWithShuttle : makkahHotel.priceWithoutShuttle)}
                    <span className="text-gray-400 font-normal"> /person</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Madinah */}
          <div className="border border-gray-200 rounded-xl p-4">
            <div className="text-xs font-bold uppercase text-gray-400 mb-2">Madinah</div>
            <div className="font-semibold text-gray-900 leading-snug mb-1">{madinahHotel.name}</div>
            <div className="text-yellow-500 text-xs mb-1"><Stars count={madinahHotel.stars} /></div>
            <table className="w-full text-xs text-gray-600">
              <tbody>
                <tr><td className="pr-3 py-0.5 text-gray-400">Distance</td><td>{madinahHotel.distanceLabel}</td></tr>
                <tr><td className="pr-3 py-0.5 text-gray-400">Duration</td><td>{state.nightsMadinah} nights</td></tr>
                <tr>
                  <td className="pr-3 py-0.5 text-gray-400">Shuttle</td>
                  <td>{state.shuttleMadinah ? "✓ Included" : "✗ Not included"}</td>
                </tr>
                <tr>
                  <td className="pr-3 py-0.5 text-gray-400">Rate/night</td>
                  <td className="font-medium">
                    {fmtPKR(state.shuttleMadinah ? madinahHotel.priceWithShuttle : madinahHotel.priceWithoutShuttle)}
                    <span className="text-gray-400 font-normal"> /person</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Price breakdown ── */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Price Breakdown</div>
        <table className="w-full text-sm border border-gray-200 rounded-xl overflow-hidden">
          <thead>
            <tr className="bg-emerald-700 text-white">
              <th className="text-left py-2 px-4 font-semibold">Description</th>
              <th className="text-right py-2 px-4 font-semibold whitespace-nowrap">
                {showCurrency ? currency : "PKR"}
              </th>
              {showCurrency && <th className="text-right py-2 px-4 font-semibold text-emerald-200">PKR</th>}
            </tr>
          </thead>
          <tbody>
            {result.breakdown.map((item, idx) => (
              <React.Fragment key={item.label}>
                {/* Adult row */}
                <tr className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="py-2 px-4 text-gray-700">
                    {item.label}
                    {result.numAdults > 1 && (
                      <span className="text-gray-400 text-xs ml-1">× {result.numAdults} adults</span>
                    )}
                  </td>
                  <td className="py-2 px-4 text-right font-medium whitespace-nowrap">
                    {fmt(item.adultAmountPKR, currency)}
                  </td>
                  {showCurrency && (
                    <td className="py-2 px-4 text-right text-gray-400 whitespace-nowrap text-xs">
                      {fmtPKR(item.adultAmountPKR)}
                    </td>
                  )}
                </tr>
                {/* Infant row (if applicable) */}
                {result.numInfants > 0 && item.infantAmountPKR > 0 && (
                  <tr className={`${idx % 2 === 0 ? "bg-white" : "bg-gray-50"} border-t border-dashed border-gray-100`}>
                    <td className="py-1.5 px-4 pl-8 text-amber-600 text-xs">
                      ↳ Infants × {result.numInfants}
                    </td>
                    <td className="py-1.5 px-4 text-right text-amber-600 text-xs whitespace-nowrap">
                      {fmt(item.infantAmountPKR, currency)}
                    </td>
                    {showCurrency && (
                      <td className="py-1.5 px-4 text-right text-amber-400 text-xs whitespace-nowrap">
                        {fmtPKR(item.infantAmountPKR)}
                      </td>
                    )}
                  </tr>
                )}
              </React.Fragment>
            ))}

            {/* Subtotals */}
            <tr className="border-t-2 border-gray-300 bg-gray-50">
              <td className="py-2 px-4 text-gray-500">
                Subtotal ({result.numAdults + result.numInfants} pax)
              </td>
              <td className="py-2 px-4 text-right font-medium whitespace-nowrap">
                {fmt(result.subtotalPKR, currency)}
              </td>
              {showCurrency && (
                <td className="py-2 px-4 text-right text-gray-400 whitespace-nowrap text-xs">
                  {fmtPKR(result.subtotalPKR)}
                </td>
              )}
            </tr>

            {result.discountPKR > 0 && (
              <tr className="bg-emerald-50">
                <td className="py-2 px-4 text-emerald-700">
                  Group Discount ({result.discountLabel})
                </td>
                <td className="py-2 px-4 text-right font-medium text-emerald-700 whitespace-nowrap">
                  − {fmt(result.discountPKR, currency)}
                </td>
                {showCurrency && (
                  <td className="py-2 px-4 text-right text-emerald-500 whitespace-nowrap text-xs">
                    − {fmtPKR(result.discountPKR)}
                  </td>
                )}
              </tr>
            )}

            {/* Grand total */}
            <tr className="bg-emerald-700 text-white">
              <td className="py-3 px-4 font-bold text-base">TOTAL PACKAGE COST</td>
              <td className="py-3 px-4 text-right font-bold text-base whitespace-nowrap">
                {fmt(result.totalPKR, currency)}
              </td>
              {showCurrency && (
                <td className="py-3 px-4 text-right text-emerald-200 whitespace-nowrap text-xs">
                  {fmtPKR(result.totalPKR)}
                </td>
              )}
            </tr>

            {/* Per adult */}
            <tr className="bg-emerald-50 border-t border-emerald-200">
              <td className="py-2 px-4 text-emerald-800 font-medium">Per Adult</td>
              <td className="py-2 px-4 text-right font-bold text-emerald-700 whitespace-nowrap">
                {fmt(result.totalPerAdultPKR, currency)}
              </td>
              {showCurrency && (
                <td className="py-2 px-4 text-right text-emerald-500 whitespace-nowrap text-xs">
                  {fmtPKR(result.totalPerAdultPKR)}
                </td>
              )}
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Applied fees ── */}
      <div className="mb-6">
        <div className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">
          Applied Fees (per adult)
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "Umrah Visa", value: state.visaFee },
            { label: "Service Fee", value: state.serviceFee },
            { label: "Insurance",   value: state.insuranceFee },
            { label: "Ziyarat",     value: state.ziyaratFee },
          ].map(({ label, value }) => (
            <div key={label} className="border border-gray-200 rounded-lg p-3 text-center">
              <div className="text-xs text-gray-400 mb-1">{label}</div>
              <div className="font-semibold text-gray-800">{fmtPKR(value)}</div>
              {value === 0 && <div className="text-xs text-gray-400">Not included</div>}
            </div>
          ))}
        </div>
        {result.numInfants > 0 && (
          <p className="text-xs text-amber-600 mt-2">
            Infant rates: 10% flight · free hotel · same visa · 50% service fee · no insurance or ziyarat
          </p>
        )}
      </div>

      {/* ── Footer ── */}
      <div className="pt-4 border-t border-gray-200 text-xs text-gray-400 space-y-1">
        <p>• Prices are indicative estimates based on current market rates and may vary at time of booking.</p>
        <p>• Hotel rates are per person per night on a double-sharing basis.</p>
        <p>• Flight fares are quoted in PKR. {showCurrency ? `Amounts shown in ${currency} use indicative conversion rates.` : ""}</p>
        <p>• This estimate does not constitute a confirmed booking. Contact your travel agent to confirm.</p>
      </div>

    </div>
  );
}
