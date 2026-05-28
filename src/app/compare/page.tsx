"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, Plus, ArrowRight, ShieldCheck, Star, TrendingUp, Check, ChevronDown, Info } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { properties, Property } from "@/data/properties";

export default function ComparePage() {
  const [selected, setSelected] = useState<(Property | null)[]>([null, null, null]);
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const filteredProps = properties.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.location.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (prop: Property, slotIdx: number) => {
    const updated = [...selected];
    updated[slotIdx] = prop;
    setSelected(updated);
    setOpenSlot(null);
    setSearch("");
  };

  const handleRemove = (slotIdx: number) => {
    const updated = [...selected];
    updated[slotIdx] = null;
    setSelected(updated);
  };

  const activeProps = selected.filter(Boolean) as Property[];
  const hasComparison = activeProps.length >= 2;

  const compareFields = [
    { key: "price", label: "Price", format: (p: Property) => `₹${(p.price / 10000000).toFixed(1)} Cr` },
    { key: "type", label: "Property Type", format: (p: Property) => p.type },
    { key: "bhk", label: "Bedrooms", format: (p: Property) => `${p.bhk} BHK` },
    { key: "area", label: "Built-up Area", format: (p: Property) => p.area },
    { key: "possession", label: "Possession", format: (p: Property) => p.possession },
    { key: "investmentType", label: "Investment Type", format: (p: Property) => p.investmentType },
    { key: "investmentYield", label: "Projected Yield", format: (p: Property) => `${p.scores.investmentYield}% p.a.` },
    { key: "architecturalIntegrity", label: "Architecture Score", format: (p: Property) => `${p.scores.architecturalIntegrity}/100` },
    { key: "automationTier", label: "Smart Home Tier", format: (p: Property) => p.scores.automationTier },
    { key: "architect", label: "Design Firm", format: (p: Property) => p.architect },
  ];

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Header */}
        <section className="relative pt-28 pb-14 bg-brand-black overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #D31E28, transparent 60%)" }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-5">
              <Scale size={10} className="text-white" />
              <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-white">Side-by-Side Comparison</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-4">
              Compare Properties.<br />Make the Right Call.
            </h1>
            <p className="text-sm text-white/55 font-medium max-w-xl">Select up to 3 properties and compare them across price, yield, architecture, possession status, and more — all in one clear view.</p>
          </div>
        </section>

        {/* Selection Row */}
        <section className="py-10 border-b border-gray-100 bg-gray-50/40 sticky top-16 z-30 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-3 gap-4">
              {selected.map((prop, idx) => (
                <div key={idx} className="relative">
                  {prop ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-4 flex items-center gap-3 shadow-sm">
                      <img src={prop.image} alt={prop.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-extrabold text-brand-black truncate">{prop.title}</p>
                        <p className="text-[10px] text-gray-400 font-medium">{prop.location.split(",")[0]}</p>
                        <p className="text-sm font-extrabold text-brand-red mt-0.5">₹{(prop.price / 10000000).toFixed(1)} Cr</p>
                      </div>
                      <button onClick={() => handleRemove(idx)} className="w-6 h-6 rounded-full bg-gray-100 hover:bg-red-50 hover:text-brand-red flex items-center justify-center transition-colors shrink-0 cursor-pointer">
                        <X size={11} />
                      </button>
                    </div>
                  ) : (
                    <button onClick={() => setOpenSlot(openSlot === idx ? null : idx)} className="w-full bg-white border-2 border-dashed border-gray-200 hover:border-brand-red/40 rounded-2xl p-4 flex items-center justify-center gap-2 text-gray-400 hover:text-brand-red transition-all cursor-pointer group">
                      <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                      <span className="text-xs font-bold">Add Property {idx + 1}</span>
                    </button>
                  )}

                  {/* Property picker popover */}
                  <AnimatePresence>
                    {openSlot === idx && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-2xl z-50 overflow-hidden">
                        <div className="p-3 border-b border-gray-100">
                          <input type="text" placeholder="Search properties…" value={search} onChange={e => setSearch(e.target.value)} className="w-full text-xs bg-gray-50 border border-gray-200 px-3 py-2 rounded-xl focus:outline-none focus:border-brand-red font-medium" autoFocus />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredProps.map(p => {
                            const alreadySelected = selected.some(s => s?.id === p.id);
                            return (
                              <button key={p.id} disabled={alreadySelected} onClick={() => handleSelect(p, idx)} className={`w-full text-left flex items-center gap-3 px-3 py-2.5 hover:bg-gray-50 transition-colors ${alreadySelected ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}>
                                <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                <div>
                                  <p className="text-xs font-bold text-brand-black">{p.title}</p>
                                  <p className="text-[10px] text-gray-400">{p.location.split(",")[0]} · ₹{(p.price / 10000000).toFixed(1)} Cr</p>
                                </div>
                                {alreadySelected && <Check size={12} className="ml-auto text-brand-red" />}
                              </button>
                            );
                          })}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6">
            {!hasComparison ? (
              <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
                <Scale size={40} className="text-gray-200 mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-brand-black mb-2">Select at least 2 properties to compare</h3>
                <p className="text-sm text-gray-400 font-medium">Use the slots above to pick properties from our verified collection.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr>
                      <th className="text-left py-4 pr-8 w-48">
                        <span className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Feature</span>
                      </th>
                      {activeProps.map(p => (
                        <th key={p.id} className="py-4 px-4 text-left">
                          <div className="space-y-1">
                            <p className="text-sm font-extrabold text-brand-black">{p.title}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{p.location.split(",")[0]}</p>
                          </div>
                        </th>
                      ))}
                    </tr>
                    {/* Property images */}
                    <tr className="border-b border-gray-100">
                      <td className="py-4 pr-8" />
                      {activeProps.map(p => (
                        <td key={p.id} className="py-4 px-4">
                          <img src={p.image} alt={p.title} className="w-full h-36 object-cover rounded-2xl" />
                        </td>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareFields.map((field, fIdx) => {
                      const values = activeProps.map(p => field.format(p));
                      const allSame = values.every(v => v === values[0]);
                      return (
                        <tr key={field.key} className={`border-b border-gray-100 ${fIdx % 2 === 0 ? "bg-gray-50/30" : "bg-white"}`}>
                          <td className="py-4 pr-8">
                            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">{field.label}</span>
                          </td>
                          {activeProps.map((p, pIdx) => {
                            const val = field.format(p);
                            const isBest = field.key === "investmentYield"
                              ? p.scores.investmentYield === Math.max(...activeProps.map(ap => ap.scores.investmentYield))
                              : field.key === "architecturalIntegrity"
                              ? p.scores.architecturalIntegrity === Math.max(...activeProps.map(ap => ap.scores.architecturalIntegrity))
                              : field.key === "price"
                              ? p.price === Math.min(...activeProps.map(ap => ap.price))
                              : false;
                            return (
                              <td key={p.id} className="py-4 px-4">
                                <div className="flex items-center gap-2">
                                  <span className={`text-sm font-bold ${isBest ? "text-emerald-600" : "text-brand-black"}`}>{val}</span>
                                  {isBest && <span className="text-[8px] font-extrabold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 px-1.5 py-0.5 rounded-full">Best</span>}
                                </div>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                    {/* Amenities */}
                    <tr className="border-b border-gray-100">
                      <td className="py-4 pr-8"><span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Key Amenities</span></td>
                      {activeProps.map(p => (
                        <td key={p.id} className="py-4 px-4">
                          <div className="space-y-1">
                            {p.amenities.slice(0, 4).map(a => (
                              <div key={a} className="flex items-center gap-1.5 text-xs text-gray-600 font-medium">
                                <Check size={11} className="text-emerald-500 shrink-0" />{a}
                              </div>
                            ))}
                          </div>
                        </td>
                      ))}
                    </tr>
                    {/* CTA */}
                    <tr>
                      <td className="py-6 pr-8"><span className="text-xs font-bold text-gray-400">Interested?</span></td>
                      {activeProps.map(p => (
                        <td key={p.id} className="py-6 px-4">
                          <Link href={`/properties/${p.slug}`} className="flex items-center justify-center gap-2 px-4 py-3 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase rounded-xl transition-all">
                            View Details <ArrowRight size={12} />
                          </Link>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>

        {/* Expert CTA */}
        <section className="bg-brand-black py-16">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-4">
            <h2 className="text-3xl font-extrabold text-white">Still undecided? Talk to a human expert.</h2>
            <p className="text-sm text-white/55 font-medium">Our advisors give you a neutral, commission-free second opinion on any shortlist — no pressure, just facts.</p>
            <Link href="/second-opinion" className="inline-flex items-center gap-2 px-7 py-3.5 bg-brand-red hover:bg-brand-red/90 text-white text-sm font-extrabold uppercase tracking-wide rounded-full transition-all hover:scale-105">
              Get a Second Opinion <ArrowRight size={13} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
