"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, X, Plus, ArrowRight, Check, AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, Reveal, Eyebrow } from "@/components/ui/theme";
import { properties as defaultProperties, Property } from "@/data/properties";
import { fetchAllProperties } from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";

export default function ComparePage() {
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selected, setSelected] = useState<(Property | null)[]>([null, null, null]);
  const [openSlot, setOpenSlot] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [isOffline, setIsOffline] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const params = new URLSearchParams(window.location.search);
    const hasDebug = params.get("debug") === "true";
    if (isDev || hasDebug) {
      setIsDebugMode(true);
    }
  }, []);

  useEffect(() => {
    async function loadProperties() {
      setIsLoading(true);
      setIsOffline(false);
      setDbError(null);
      try {
        const data = await fetchAllProperties();
        if (data && data.length > 0) {
          setLiveProperties(data);
        } else {
          setIsOffline(true);
          setLiveProperties(defaultProperties);
          const { error } = await supabase.from("properties").select("id").limit(1);
          if (error) {
            setDbError(`Supabase connection failed: ${error.message}`);
          } else {
            setDbError("Supabase reached successfully, but no properties were found.");
          }
        }
      } catch (e: any) {
        setIsOffline(true);
        setLiveProperties(defaultProperties);
        setDbError(`Connection failed: ${e.message}`);
      } finally {
        setIsLoading(false);
      }
    }
    loadProperties();
  }, []);

  const filteredProps = liveProperties.filter(p =>
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

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${parseFloat((price / 10000000).toFixed(2))} Cr`;
    } else {
      return `₹${parseFloat((price / 100000).toFixed(2))} Lakhs`;
    }
  };

  const compareFields = [
    { key: "price", label: "Price", format: (p: Property) => formatPrice(p.price) },
    { key: "type", label: "Property Type", format: (p: Property) => p.type },
    { key: "bhk", label: "Bedrooms", format: (p: Property) => `${p.bhk} BHK` },
    { key: "area", label: "Built-up Area", format: (p: Property) => p.area },
    { key: "possession", label: "Possession", format: (p: Property) => p.possession },
    { key: "investmentYield", label: "Projected Yield", format: (p: Property) => `${p.scores.investmentYield}% p.a.` },
    { key: "architecturalIntegrity", label: "Architecture Score", format: (p: Property) => `${p.scores.architecturalIntegrity}/100` },
    { key: "automationTier", label: "Flats/Acre / Auto Tier", format: (p: Property) => p.type === "Apartment" ? `${p.udsPerAcre ?? 100} Flats/Acre` : p.scores.automationTier },
    { key: "architect", label: "Design Firm", format: (p: Property) => p.architect },
  ];

  return (
    <div className="font-archivo bg-white">
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Page header band */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
          <div className={CONTAINER}>
            <Reveal className="max-w-[760px]">
              <Eyebrow>Side-by-Side Comparison</Eyebrow>
              <h1 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
                Compare properties. Make the right call.
              </h1>
              <p className="text-[15.5px] lg:text-[17px] leading-[1.7] text-[#57534a] mt-4 max-w-[560px]">
                Select up to 3 properties and compare them across price, yield, architecture, possession status, and
                more — all in one clear view.
              </p>
            </Reveal>
          </div>
        </section>

        {isOffline && (
          <div className="px-4 md:px-6 xl:px-[60px] pt-8">
            <div className={CONTAINER}>
              <div className="border border-amber-200 bg-amber-50/60 rounded-2xl py-3.5 px-5 flex items-center gap-3">
                <AlertTriangle size={17} className="text-amber-600 shrink-0" />
                <p className="text-[13.5px] text-amber-900 font-medium">
                  Live listings are temporarily unavailable — showing our verified local collection.
                </p>
                {isDebugMode && dbError && (
                  <span className="text-[11px] text-red-700 font-mono bg-red-50 border border-red-100 px-2 py-1 rounded-lg max-w-xs truncate">
                    {dbError}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Selection Row */}
        <section className="px-4 md:px-6 xl:px-[60px] py-6 lg:py-8 border-b border-[#EEE9E0] bg-white/95 backdrop-blur-sm sticky top-0 z-30">
          <div className={CONTAINER}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 lg:gap-4">
              {selected.map((prop, idx) => (
                <div key={idx} className="relative">
                  {prop ? (
                    <div className="bg-white border border-[#EEE9E0] rounded-2xl p-4 flex items-center gap-3 shadow-[0_1px_3px_rgba(30,25,15,0.04)]">
                      <img src={prop.image} alt={prop.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#0A0A0A] truncate">{prop.title}</p>
                        <p className="text-[12px] text-[#948d7c]">{prop.location.split(",")[0]}</p>
                        <p className="text-sm font-bold text-[#D31E28] mt-0.5">{formatPrice(prop.price)}</p>
                      </div>
                      <button
                        onClick={() => handleRemove(idx)}
                        aria-label="Remove property"
                        className="w-7 h-7 rounded-full bg-[#FAF7F1] hover:bg-[#faf0f0] text-[#57534a] hover:text-[#D31E28] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setOpenSlot(openSlot === idx ? null : idx)}
                      className="w-full bg-white border-2 border-dashed border-[#e0d9cb] hover:border-[#D31E28]/50 rounded-2xl p-4 py-[22px] flex items-center justify-center gap-2 text-[#948d7c] hover:text-[#D31E28] transition-all cursor-pointer group"
                    >
                      <Plus size={16} className="group-hover:rotate-90 transition-transform" />
                      <span className="text-[12px] font-bold uppercase tracking-wider">Add Property {idx + 1}</span>
                    </button>
                  )}

                  {/* Property picker popover */}
                  <AnimatePresence>
                    {openSlot === idx && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.15 }}
                        className="absolute top-full left-0 right-0 mt-2 bg-white border border-[#EEE9E0] rounded-2xl shadow-[0_18px_50px_rgba(30,25,15,0.14)] z-50 overflow-hidden"
                      >
                        <div className="p-3 border-b border-[#EEE9E0]">
                          <input
                            type="text"
                            placeholder="Search properties…"
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full text-sm bg-[#FAF7F1] border border-[#e0d9cb] px-3.5 py-2.5 rounded-xl text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors"
                            autoFocus
                          />
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {filteredProps.map(p => {
                            const alreadySelected = selected.some(s => s?.id === p.id);
                            return (
                              <button
                                key={p.id}
                                disabled={alreadySelected}
                                onClick={() => handleSelect(p, idx)}
                                className={`w-full text-left flex items-center gap-3 px-3.5 py-2.5 hover:bg-[#FAF7F1] transition-colors ${alreadySelected ? "opacity-40 cursor-not-allowed" : "cursor-pointer"}`}
                              >
                                <img src={p.image} alt={p.title} className="w-10 h-10 rounded-lg object-cover shrink-0" />
                                <div>
                                  <p className="text-[13px] font-semibold text-[#0A0A0A]">{p.title}</p>
                                  <p className="text-[12px] text-[#948d7c]">
                                    {p.location.split(",")[0]} · {formatPrice(p.price)}
                                  </p>
                                </div>
                                {alreadySelected && <Check size={12} className="ml-auto text-[#D31E28]" />}
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
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
          <div className={CONTAINER}>
            {!hasComparison ? (
              <div className="text-center py-20 lg:py-24 border-2 border-dashed border-[#e0d9cb] bg-white rounded-2xl px-6">
                <Scale size={40} className="text-[#d8d2c6] mx-auto mb-4" />
                <h3 className="font-display font-semibold text-[24px] lg:text-[28px] text-[#0A0A0A] mb-2">
                  Select at least 2 properties to compare
                </h3>
                <p className="text-[15px] text-[#6b6659]">
                  Use the slots above to pick properties from our verified collection.
                </p>
              </div>
            ) : (
              <>
                <Reveal className="mb-6 lg:mb-10">
                  <Eyebrow>Comparison Report</Eyebrow>
                  <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-3.5">
                    Your shortlist, side by side.
                  </h2>
                </Reveal>
                <div className="bg-white border border-[#EEE9E0] rounded-2xl shadow-[0_1px_3px_rgba(30,25,15,0.04)] overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px]">
                      <thead>
                        <tr>
                          <th className="text-left py-5 pl-5 lg:pl-6 pr-6 w-44 align-bottom">
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c]">Feature</span>
                          </th>
                          {activeProps.map(p => (
                            <th key={p.id} className="py-5 px-4 text-left">
                              <div className="space-y-1">
                                <p className="text-[15px] font-bold text-[#0A0A0A] leading-snug">{p.title}</p>
                                <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c]">
                                  {p.location.split(",")[0]}
                                </p>
                              </div>
                            </th>
                          ))}
                        </tr>
                        {/* Property images */}
                        <tr className="border-b border-[#EEE9E0]">
                          <td className="py-4 pl-5 lg:pl-6 pr-6" />
                          {activeProps.map(p => (
                            <td key={p.id} className="py-4 px-4">
                              <img src={p.image} alt={p.title} className="w-full h-36 object-cover rounded-xl bg-[#efeae1]" />
                            </td>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {compareFields.map((field, fIdx) => {
                          const values = activeProps.map(p => field.format(p));
                          const allSame = values.every(v => v === values[0]);
                          return (
                            <tr key={field.key} className={`border-b border-[#EEE9E0] ${fIdx % 2 === 0 ? "bg-[#FAF7F1]/60" : "bg-white"}`}>
                              <td className="py-4 pl-5 lg:pl-6 pr-6">
                                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c]">{field.label}</span>
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
                                      <span className={`text-sm font-semibold ${isBest ? "text-emerald-600" : "text-[#0A0A0A]"}`}>{val}</span>
                                      {isBest && (
                                        <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded-full">
                                          Best
                                        </span>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                        {/* Amenities */}
                        <tr className="border-b border-[#EEE9E0]">
                          <td className="py-4 pl-5 lg:pl-6 pr-6 align-top">
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c]">Key Amenities</span>
                          </td>
                          {activeProps.map(p => (
                            <td key={p.id} className="py-4 px-4 align-top">
                              <div className="space-y-1.5">
                                {p.amenities.slice(0, 4).map(a => (
                                  <div key={a} className="flex items-center gap-2 text-[13px] text-[#57534a]">
                                    <Check size={12} className="text-emerald-500 shrink-0" strokeWidth={3} />{a}
                                  </div>
                                ))}
                              </div>
                            </td>
                          ))}
                        </tr>
                        {/* CTA */}
                        <tr>
                          <td className="py-6 pl-5 lg:pl-6 pr-6">
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c]">Interested?</span>
                          </td>
                          {activeProps.map(p => (
                            <td key={p.id} className="py-6 px-4">
                              <Link
                                href={`/properties/${p.slug}`}
                                className="flex items-center justify-center gap-2 px-4 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-full transition-colors"
                              >
                                View Details <ArrowRight size={12} />
                              </Link>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}
          </div>
        </section>

        {/* Expert CTA */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#0A0A0A]">
          <div className={CONTAINER}>
            <Reveal className="text-center max-w-[760px] mx-auto">
              <Eyebrow light>Expert Second Opinion</Eyebrow>
              <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-white mt-3 lg:mt-4 text-balance">
                Still undecided? Talk to a human expert.
              </h2>
              <p className="text-base lg:text-lg leading-[1.7] text-white/65 mt-4 max-w-[560px] mx-auto">
                Our advisors give you a neutral, commission-free second opinion on any shortlist — no pressure, just
                facts.
              </p>
              <Link
                href="/second-opinion"
                className="inline-flex items-center gap-2 px-8 py-[18px] bg-[#D31E28] hover:bg-[#B8171F] text-white text-[17px] font-semibold rounded-lg mt-7 shadow-[0_6px_18px_rgba(211,30,40,0.28)] transition-colors"
              >
                Get a Second Opinion <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
