"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ShieldCheck, Heart, ArrowRight, Clock, Zap, AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, Reveal, Eyebrow } from "@/components/ui/theme";
import { properties as defaultProperties, Property } from "@/data/properties";
import { fetchAllProperties } from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";

export default function ReadyToMovePage() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
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
    const saved = localStorage.getItem("nexhouz_favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }

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

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${parseFloat((price / 10000000).toFixed(2))} Cr`;
    } else {
      return `₹${parseFloat((price / 100000).toFixed(2))} Lakhs`;
    }
  };

  const readyProperties = liveProperties.filter(p => p.possession === "Ready");

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem("nexhouz_favorites", JSON.stringify(next));
      return next;
    });
  };

  return (
    <div className="font-archivo bg-white">
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Page header band */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
          <div className={CONTAINER}>
            <Reveal className="max-w-[760px]">
              <Eyebrow>Immediate Possession</Eyebrow>
              <h1 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
                Ready-to-move homes in Hyderabad.
              </h1>
              <p className="text-[15.5px] lg:text-[17px] leading-[1.7] text-[#57534a] mt-4 max-w-[560px]">
                Skip the wait. Every property listed here is fully constructed, legally cleared, and ready for immediate
                possession — no delays, no construction risk.
              </p>
            </Reveal>

            {/* Stats row */}
            <Reveal delay={0.1}>
              <div className="flex flex-wrap items-center gap-8 lg:gap-12 mt-8 lg:mt-12 pt-8 lg:pt-10 border-t border-[#EEE9E0]">
                {[
                  { label: "Ready Inventory", value: `${readyProperties.length}+`, red: false },
                  { label: "100% Legal Clear", value: "RERA ✓", red: true },
                  { label: "Avg Move-In Time", value: "< 30 Days", red: false },
                  { label: "Verified Builders", value: "30+", red: false },
                ].map(s => (
                  <div key={s.label}>
                    <p className={`text-[26px] lg:text-[30px] leading-none font-semibold ${s.red ? "text-[#D31E28]" : "text-[#0A0A0A]"}`}>{s.value}</p>
                    <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c] mt-2">{s.label}</p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* Benefits */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-white">
          <div className={CONTAINER}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
              {[
                { icon: Zap, title: "Move In Immediately", desc: "No waiting for construction. Your keys, your home — on your timeline.", color: "text-[#D31E28] bg-[#faf0f0]" },
                { icon: ShieldCheck, title: "Zero Construction Risk", desc: "Fully built, GHMC-approved, and structurally inspected before you see it.", color: "text-[#8A6D2F] bg-[#faf6ee]" },
                { icon: Clock, title: "Fast Loan Disbursal", desc: "Banks release home loan funds faster for ready properties — less paperwork, less stress.", color: "text-[#3d5a3d] bg-[#f2f4f0]" },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={i * 0.08}>
                    <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-7 flex gap-4 h-full">
                      <div className={`w-12 h-12 rounded-[14px] flex items-center justify-center shrink-0 ${item.color}`}>
                        <Icon size={19} className="stroke-[1.8]" />
                      </div>
                      <div>
                        <h3 className="text-[17px] font-semibold text-[#0A0A0A]">{item.title}</h3>
                        <p className="text-[14px] leading-[1.6] text-[#57534a] mt-1.5">{item.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
          <div className={CONTAINER}>
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 lg:mb-10">
              <Reveal>
                <Eyebrow>Ready Inventory</Eyebrow>
                <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-3.5">
                  {readyProperties.length} properties ready for possession.
                </h2>
              </Reveal>
              <Link
                href="/compare"
                className="hidden lg:inline-flex items-center gap-2 text-base font-semibold text-[#0A0A0A] border-[1.5px] border-[#d8d2c6] hover:border-[#0A0A0A] rounded-lg px-6 py-4 transition-colors whitespace-nowrap"
              >
                Compare properties <ArrowRight size={15} />
              </Link>
            </div>

            {isOffline && (
              <div className="border border-amber-200 bg-amber-50/60 rounded-2xl py-3.5 px-5 flex items-center gap-3 mb-6">
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
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
              {isLoading ? (
                <div className="col-span-full border border-[#EEE9E0] bg-white rounded-2xl py-14 flex flex-col items-center justify-center gap-4">
                  <div className="w-9 h-9 border-4 border-[#D31E28] border-t-transparent rounded-full animate-spin" />
                  <p className="text-[13px] text-[#948d7c] font-semibold tracking-[0.18em] uppercase">Loading properties…</p>
                </div>
              ) : readyProperties.length === 0 ? (
                <div className="col-span-full border-2 border-dashed border-[#e0d9cb] bg-white rounded-2xl py-16 px-6 flex flex-col items-center justify-center text-center">
                  <p className="text-[13px] text-[#948d7c] font-semibold tracking-[0.18em] uppercase">
                    No ready-to-move properties found
                  </p>
                </div>
              ) : (
                <>
                  {readyProperties.map((property, idx) => (
                    <Reveal key={property.id} delay={(idx % 3) * 0.08}>
                      <div className="border border-[#EEE9E0] rounded-2xl overflow-hidden bg-white h-full flex flex-col group shadow-[0_1px_3px_rgba(30,25,15,0.04)] hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] transition-shadow">
                        <Link
                          href={`/properties/${property.slug}`}
                          className="relative block aspect-[4/3] overflow-hidden bg-[#efeae1]"
                        >
                          <img
                            src={property.image}
                            alt={property.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                           <span className="absolute left-3.5 top-3.5 bg-emerald-500 text-white rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                            <ShieldCheck size={11} /> Ready To Move
                          </span>
                          {/* Bottom overlay badges */}
                          <div className="absolute left-3.5 bottom-3.5 bg-[#D31E28] text-white rounded-full px-3.5 py-1.5 text-[9.5px] font-black uppercase tracking-widest leading-none z-10 shadow-sm">
                            {property.possession === "Ready" ? "READY TO MOVE" : "UNDER CONSTRUCTION"}
                          </div>
                          <div className="absolute right-3.5 bottom-3.5 bg-[#0A0A0A]/95 text-white rounded-full px-3.5 py-1.5 text-[10.5px] font-extrabold tracking-wide leading-none z-10 shadow-sm">
                            {property.type}
                          </div>
                          <button
                            onClick={(e) => toggleFavorite(property.id, e)}
                            aria-label="Save property"
                            className="absolute right-3.5 top-3.5 w-9 h-9 rounded-full bg-white/95 shadow-sm flex items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                          >
                            <Heart
                              size={15}
                              className={favorites.includes(property.id) ? "fill-[#D31E28] text-[#D31E28]" : "text-[#57534a]"}
                            />
                          </button>
                        </Link>
                        <div className="p-5 lg:p-6 flex flex-col flex-1">
                          <div className="flex items-center justify-between gap-3">
                            <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c]">
                              {property.location.split(",")[0]}
                            </span>
                            <span className="text-[17px] lg:text-lg font-bold text-[#D31E28] whitespace-nowrap">
                              {formatPrice(property.price)} Onwards
                            </span>
                          </div>
                          <Link
                            href={`/properties/${property.slug}`}
                            className="text-[17px] lg:text-[19px] font-bold leading-snug text-[#D31E28] hover:text-[#B8171F] transition-colors mt-2.5 line-clamp-2"
                          >
                            {property.title}
                          </Link>
                          <p className="text-[13.5px] lg:text-sm text-[#6b6659] leading-relaxed line-clamp-2 mt-2">
                            {property.description}
                          </p>
                          <div className="mt-auto pt-4">
                            <div className="border-t border-[#EEE9E0] pt-3.5 flex items-center justify-between text-[11.5px] lg:text-xs font-bold uppercase tracking-widest text-[#948d7c]">
                              <span>{property.bhk} BHK</span>
                              <span className="text-[#e0d9cb]">|</span>
                              <span>{property.area}</span>
                              <span className="text-[#e0d9cb]">|</span>
                              <span>{property.type === "Apartment" ? `${property.udsPerAcre ?? 100} Flats/Acre` : "Ready"}</span>
                            </div>
                            <Link
                              href={`/properties/${property.slug}`}
                              className="block w-full text-center bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-full transition-colors mt-4"
                            >
                              View Details
                            </Link>
                          </div>
                        </div>
                      </div>
                    </Reveal>
                  ))}
                </>
              )}
            </div>

            <Link
              href="/compare"
              className="lg:hidden flex items-center justify-center gap-2 border-[1.5px] border-[#d8d2c6] text-[#0A0A0A] text-base font-semibold py-4 rounded-[10px] mt-4"
            >
              Compare properties <ArrowRight size={15} />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#0A0A0A]">
          <div className={CONTAINER}>
            <Reveal className="text-center max-w-[760px] mx-auto">
              <Eyebrow light>Same-Day Site Visits</Eyebrow>
              <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-white mt-3 lg:mt-4 text-balance">
                Ready to move in this month?
              </h2>
              <p className="text-base lg:text-lg leading-[1.7] text-white/65 mt-4 max-w-[560px] mx-auto">
                Our advisors can arrange same-day site visits for all ready-possession properties. No pressure, no
                obligation.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-[18px] bg-[#D31E28] hover:bg-[#B8171F] text-white text-[17px] font-semibold rounded-lg mt-7 shadow-[0_6px_18px_rgba(211,30,40,0.28)] transition-colors"
              >
                Book a Free Site Visit <ArrowRight size={15} />
              </Link>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
