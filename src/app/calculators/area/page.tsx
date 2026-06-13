"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Ruler, ArrowLeftRight, RefreshCw } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

type Unit = "sqft" | "sqm" | "sqyd" | "cent" | "acre" | "guntha";

const conversions: Record<Unit, number> = {
  sqft: 1,
  sqm: 10.7639,
  sqyd: 9,
  cent: 435.56,
  acre: 43560,
  guntha: 1089,
};

const unitLabels: Record<Unit, { label: string; abbr: string }> = {
  sqft: { label: "Square Feet", abbr: "sq ft" },
  sqm: { label: "Square Metres", abbr: "sq m" },
  sqyd: { label: "Square Yards", abbr: "sq yd" },
  cent: { label: "Cent", abbr: "cent" },
  acre: { label: "Acre", abbr: "acre" },
  guntha: { label: "Guntha", abbr: "guntha" },
};

export default function AreaConverterPage() {
  const [fromUnit, setFromUnit] = useState<Unit>("sqft");
  const [toUnit, setToUnit] = useState<Unit>("sqm");
  const [inputValue, setInputValue] = useState<string>("1000");

  const rawValue = parseFloat(inputValue) || 0;
  const inSqFt = rawValue * conversions[fromUnit];
  const result = inSqFt / conversions[toUnit];

  const swap = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    setInputValue(result.toFixed(4));
  };

  const unitOptions = Object.entries(unitLabels) as [Unit, { label: string; abbr: string }][];

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        <section className="pt-28 pb-12 bg-brand-black overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 60% 40%, #D31E28, transparent 60%)" }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-4">
              <Ruler size={10} className="text-white" />
              <span className="text-xs font-extrabold tracking-[0.2em] uppercase text-white">Property Tool</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">Area Unit Converter</h1>
            <p className="text-sm text-white/55 font-medium max-w-xl">Convert between square feet, square metres, square yards, cent, acre, and guntha — all commonly used in Hyderabad property listings.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-4xl mx-auto px-6">
            {/* Main converter card */}
            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-8">
              <h2 className="text-xl font-extrabold text-brand-black">Convert Area Units</h2>

              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                {/* From */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-gray-500">From</label>
                  <select value={fromUnit} onChange={e => setFromUnit(e.target.value as Unit)} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-red transition-all cursor-pointer">
                    {unitOptions.map(([key, { label, abbr }]) => <option key={key} value={key}>{label} ({abbr})</option>)}
                  </select>
                  <input
                    type="number"
                    value={inputValue}
                    onChange={e => setInputValue(e.target.value)}
                    className="w-full bg-brand-black text-white text-3xl font-extrabold px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-brand-red transition-all"
                    placeholder="Enter value"
                    min="0"
                  />
                  <p className="text-xs text-gray-400 font-medium text-center">{unitLabels[fromUnit].label}</p>
                </div>

                {/* Swap */}
                <div className="flex items-center justify-center pb-8">
                  <motion.button
                    onClick={swap}
                    whileTap={{ scale: 0.9, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                    className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-red/90 transition-colors shadow-lg shadow-brand-red/20 cursor-pointer"
                  >
                    <ArrowLeftRight size={18} />
                  </motion.button>
                </div>

                {/* To */}
                <div className="space-y-3">
                  <label className="text-xs font-extrabold uppercase tracking-widest text-gray-500">To</label>
                  <select value={toUnit} onChange={e => setToUnit(e.target.value as Unit)} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-bold focus:outline-none focus:border-brand-red transition-all cursor-pointer">
                    {unitOptions.map(([key, { label, abbr }]) => <option key={key} value={key}>{label} ({abbr})</option>)}
                  </select>
                  <div className="bg-brand-red/5 border border-brand-red/20 rounded-2xl px-5 py-4 text-center">
                    <p className="text-3xl font-extrabold text-brand-red">
                      {isNaN(result) ? "—" : result < 0.0001 ? result.toExponential(4) : parseFloat(result.toFixed(6)).toLocaleString("en-IN", { maximumFractionDigits: 6 })}
                    </p>
                    <p className="text-xs text-brand-red/60 font-bold uppercase tracking-wider mt-1">{unitLabels[toUnit].abbr}</p>
                  </div>
                  <p className="text-xs text-gray-400 font-medium text-center">{unitLabels[toUnit].label}</p>
                </div>
              </div>

              {/* Formula */}
              <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl">
                <p className="text-xs font-extrabold text-gray-500 uppercase tracking-widest mb-1">Formula</p>
                <p className="text-sm font-bold text-brand-black">{inputValue || "1"} {unitLabels[fromUnit].abbr} = {parseFloat((rawValue * conversions[fromUnit] / conversions[toUnit]).toFixed(6)).toLocaleString()} {unitLabels[toUnit].abbr}</p>
                <p className="text-xs text-gray-400 mt-1 font-medium">via: 1 {unitLabels[fromUnit].abbr} = {conversions[fromUnit]} sq ft</p>
              </div>
            </div>

            {/* Conversion Reference Table */}
            <div className="mt-10">
              <h2 className="text-2xl font-extrabold text-brand-black mb-6">Complete Reference Table — all relative to 1 {unitLabels[fromUnit].label}</h2>
              <div className="overflow-hidden rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full">
                  <thead className="bg-brand-black text-white">
                    <tr>
                      <th className="text-left px-5 py-4 text-xs font-extrabold uppercase tracking-widest">Unit</th>
                      <th className="text-left px-5 py-4 text-xs font-extrabold uppercase tracking-widest">Abbreviation</th>
                      <th className="text-right px-5 py-4 text-xs font-extrabold uppercase tracking-widest">= 1 {unitLabels[fromUnit].abbr}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unitOptions.filter(([key]) => key !== fromUnit).map(([key, { label, abbr }], i) => {
                      const converted = conversions[fromUnit] / conversions[key as Unit];
                      return (
                        <tr key={key} className={i % 2 === 0 ? "bg-gray-50/40" : "bg-white"}>
                          <td className="px-5 py-3.5 font-bold text-brand-black text-sm">{label}</td>
                          <td className="px-5 py-3.5 text-gray-500 font-medium text-sm">{abbr}</td>
                          <td className="px-5 py-3.5 text-right font-extrabold text-brand-red text-sm">
                            {parseFloat(converted.toFixed(6)).toLocaleString("en-IN", { maximumFractionDigits: 6 })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick converter chips */}
            <div className="mt-10 space-y-4">
              <h2 className="text-xl font-extrabold text-brand-black">Common Conversions Used in Hyderabad</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { from: "1000 sq ft", to: "92.9 sq m", note: "Typical 2BHK unit size" },
                  { from: "1 cent", to: "435.56 sq ft", note: "Used in South Indian land listings" },
                  { from: "1 guntha", to: "1,089 sq ft", note: "Used in agricultural land in Telangana" },
                  { from: "1 acre", to: "43,560 sq ft", note: "Used in large plot and farm land deals" },
                ].map(c => (
                  <div key={c.from} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-1">
                    <div className="flex items-center gap-2 text-sm font-extrabold text-brand-black">
                      <span>{c.from}</span>
                      <ArrowLeftRight size={12} className="text-brand-red" />
                      <span>{c.to}</span>
                    </div>
                    <p className="text-xs text-gray-400 font-medium">{c.note}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
