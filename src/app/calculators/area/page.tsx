"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeftRight } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Reveal, Eyebrow } from "@/components/ui/theme";

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

  const selectClass =
    "w-full border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-base font-medium text-[#0A0A0A] bg-white focus:outline-none focus:border-[#D31E28] transition-colors cursor-pointer";

  return (
    <div className="font-archivo bg-white">
      <Navbar />
      <main className="min-h-screen">
        {/* Page header band */}
        <section className={`${SECTION_X} pt-12 pb-12 lg:pt-16 lg:pb-16 bg-[#FAF7F1]`}>
          <div className={CONTAINER}>
            <Eyebrow>Tools · Property Tool</Eyebrow>
            <h1 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
              Area Unit Converter
            </h1>
            <p className="text-[15px] lg:text-[17px] leading-[1.7] text-[#57534a] mt-3 lg:mt-4 max-w-xl">
              Convert between square feet, square metres, square yards, cent, acre, and guntha — all commonly used in Hyderabad property listings.
            </p>
          </div>
        </section>

        <section className={`${SECTION_X} py-14 lg:py-20 bg-white`}>
          <div className={CONTAINER}>
            <div className="max-w-[900px] mx-auto">
              {/* Main converter card */}
              <Reveal>
                <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-8 space-y-8">
                  <h2 className="text-[20px] lg:text-[22px] font-semibold text-[#0A0A0A]">Convert Area Units</h2>

                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-4 items-end">
                    {/* From */}
                    <div className="space-y-3">
                      <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">From</label>
                      <select value={fromUnit} onChange={e => setFromUnit(e.target.value as Unit)} className={selectClass}>
                        {unitOptions.map(([key, { label, abbr }]) => <option key={key} value={key}>{label} ({abbr})</option>)}
                      </select>
                      <input
                        type="number"
                        value={inputValue}
                        onChange={e => setInputValue(e.target.value)}
                        className="w-full border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-[28px] font-semibold text-[#0A0A0A] placeholder-[#948d7c] bg-white focus:outline-none focus:border-[#D31E28] transition-colors"
                        placeholder="Enter value"
                        min="0"
                      />
                      <p className="text-[13px] text-[#948d7c] text-center">{unitLabels[fromUnit].label}</p>
                    </div>

                    {/* Swap */}
                    <div className="flex items-center justify-center pb-8">
                      <motion.button
                        onClick={swap}
                        whileTap={{ scale: 0.9, rotate: 180 }}
                        transition={{ duration: 0.3 }}
                        className="w-12 h-12 rounded-full bg-[#D31E28] hover:bg-[#B8171F] text-white flex items-center justify-center transition-colors shadow-[0_6px_18px_rgba(211,30,40,0.28)] cursor-pointer"
                      >
                        <ArrowLeftRight size={18} />
                      </motion.button>
                    </div>

                    {/* To */}
                    <div className="space-y-3">
                      <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">To</label>
                      <select value={toUnit} onChange={e => setToUnit(e.target.value as Unit)} className={selectClass}>
                        {unitOptions.map(([key, { label, abbr }]) => <option key={key} value={key}>{label} ({abbr})</option>)}
                      </select>
                      <div className="bg-[#F6F1E7] border border-[#EEE9E0] rounded-[10px] px-[18px] py-4 text-center">
                        <p className="text-[28px] leading-[1.2] font-semibold text-[#D31E28]">
                          {isNaN(result) ? "—" : result < 0.0001 ? result.toExponential(4) : parseFloat(result.toFixed(6)).toLocaleString("en-IN", { maximumFractionDigits: 6 })}
                        </p>
                        <p className="text-[11px] text-[#8A6D2F] font-semibold uppercase tracking-[0.1em] mt-1">{unitLabels[toUnit].abbr}</p>
                      </div>
                      <p className="text-[13px] text-[#948d7c] text-center">{unitLabels[toUnit].label}</p>
                    </div>
                  </div>

                  {/* Formula */}
                  <div className="p-4 lg:p-5 bg-[#FAF7F1] border border-[#EEE9E0] rounded-2xl">
                    <p className="text-[11px] font-semibold text-[#948d7c] uppercase tracking-[0.1em] mb-1.5">Formula</p>
                    <p className="text-[15px] font-semibold text-[#0A0A0A]">{inputValue || "1"} {unitLabels[fromUnit].abbr} = {parseFloat((rawValue * conversions[fromUnit] / conversions[toUnit]).toFixed(6)).toLocaleString()} {unitLabels[toUnit].abbr}</p>
                    <p className="text-[13px] text-[#948d7c] mt-1">via: 1 {unitLabels[fromUnit].abbr} = {conversions[fromUnit]} sq ft</p>
                  </div>
                </div>
              </Reveal>

              {/* Conversion Reference Table */}
              <Reveal className="mt-10 lg:mt-14">
                <h2 className="font-display font-semibold text-[24px] md:text-[30px] lg:text-[34px] leading-[1.25] text-[#0A0A0A] mb-6 text-balance">Complete Reference Table — all relative to 1 {unitLabels[fromUnit].label}</h2>
                <div className="overflow-x-auto rounded-2xl border border-[#EEE9E0]">
                  <table className="w-full">
                    <thead className="bg-[#0A0A0A] text-white">
                      <tr>
                        <th className="text-left px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.1em]">Unit</th>
                        <th className="text-left px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.1em]">Abbreviation</th>
                        <th className="text-right px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap">= 1 {unitLabels[fromUnit].abbr}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {unitOptions.filter(([key]) => key !== fromUnit).map(([key, { label, abbr }], i) => {
                        const converted = conversions[fromUnit] / conversions[key as Unit];
                        return (
                          <tr key={key} className={i % 2 === 0 ? "bg-[#FAF7F1]" : "bg-white"}>
                            <td className="px-5 py-3.5 font-semibold text-[#0A0A0A] text-sm">{label}</td>
                            <td className="px-5 py-3.5 text-[#6b6659] text-sm">{abbr}</td>
                            <td className="px-5 py-3.5 text-right font-semibold text-[#D31E28] text-sm">
                              {parseFloat(converted.toFixed(6)).toLocaleString("en-IN", { maximumFractionDigits: 6 })}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </Reveal>

              {/* Quick converter chips */}
              <Reveal className="mt-10 lg:mt-14 space-y-5">
                <h2 className="font-display font-semibold text-[24px] md:text-[28px] lg:text-[30px] leading-[1.25] text-[#0A0A0A]">Common Conversions Used in Hyderabad</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                  {[
                    { from: "1000 sq ft", to: "92.9 sq m", note: "Typical 2BHK unit size" },
                    { from: "1 cent", to: "435.56 sq ft", note: "Used in South Indian land listings" },
                    { from: "1 guntha", to: "1,089 sq ft", note: "Used in agricultural land in Telangana" },
                    { from: "1 acre", to: "43,560 sq ft", note: "Used in large plot and farm land deals" },
                  ].map(c => (
                    <div key={c.from} className="bg-white border border-[#EEE9E0] rounded-2xl p-5 space-y-1.5">
                      <div className="flex items-center gap-2.5 text-[15px] font-semibold text-[#0A0A0A]">
                        <span>{c.from}</span>
                        <ArrowLeftRight size={13} className="text-[#D31E28]" />
                        <span>{c.to}</span>
                      </div>
                      <p className="text-[13.5px] text-[#6b6659]">{c.note}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
