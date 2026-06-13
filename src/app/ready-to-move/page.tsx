"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShieldCheck, Heart, MapPin, ArrowRight, Clock, CheckCircle, Zap, AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
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
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="relative overflow-hidden pt-32 pb-20 bg-gradient-to-br from-emerald-50 via-white to-white">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-emerald-100/40 blur-3xl -translate-y-1/2 translate-x-1/3" />
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-full mb-5">
                <CheckCircle size={10} className="text-emerald-600" />
                <span className="text-xs font-extrabold tracking-[0.2em] uppercase text-emerald-700">Immediate Possession</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-brand-black leading-tight tracking-tight mb-5">
                Ready To Move<br /><span className="text-emerald-600">Homes</span> in Hyderabad.
              </h1>
              <p className="text-sm text-brand-black/55 font-medium leading-relaxed max-w-xl">
                Skip the wait. Every property listed here is fully constructed, legally cleared, and ready for immediate possession — no delays, no construction risk.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-wrap items-center gap-8 mt-10 pt-10 border-t border-gray-100">
              {[
                { label: "Ready Inventory", value: `${readyProperties.length}+` },
                { label: "100% Legal Clear", value: "RERA ✓" },
                { label: "Avg Move-In Time", value: "< 30 Days" },
                { label: "Verified Builders", value: "30+" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-brand-black">{s.value}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-gray-400 mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-14 border-b border-gray-100 bg-gray-50/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: Zap, title: "Move In Immediately", desc: "No waiting for construction. Your keys, your home — on your timeline.", color: "text-brand-red bg-brand-red/5" },
                { icon: ShieldCheck, title: "Zero Construction Risk", desc: "Fully built, GHMC-approved, and structurally inspected before you see it.", color: "text-emerald-600 bg-emerald-50" },
                { icon: Clock, title: "Fast Loan Disbursal", desc: "Banks release home loan funds faster for ready properties — less paperwork, less stress.", color: "text-blue-600 bg-blue-50" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-7 flex gap-4 shadow-sm">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon size={18} className="stroke-[1.8]" />
                    </div>
                    <div>
                      <h3 className="text-sm font-extrabold text-brand-black mb-1">{item.title}</h3>
                      <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Properties Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-emerald-600 mb-2">Ready Inventory</p>
                <h2 className="text-3xl font-extrabold text-brand-black">{readyProperties.length} Properties Ready for Possession</h2>
              </div>
              <Link href="/compare" className="hidden md:flex items-center gap-1.5 text-xs font-bold text-brand-black hover:text-brand-red border-b border-brand-black hover:border-brand-red pb-0.5 transition-all">
                Compare Properties <ArrowRight size={12} />
              </Link>
            </div>

            {isOffline && (
              <div className="col-span-full border border-amber-200 bg-amber-50/50 rounded-3xl py-4 px-6 flex items-center justify-between gap-4 shadow-sm w-full mb-8 text-left animate-fadeIn">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-inner">
                    <AlertTriangle size={18} className="stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-amber-950">Database Offline Preview</h3>
                    <p className="text-xs text-amber-805 font-medium mt-0.5 leading-relaxed">
                      We are currently experiencing connection latency with our database server. Displaying verified local properties.
                    </p>
                  </div>
                </div>
                {isDebugMode && dbError && (
                  <div className="text-[10px] text-red-655 font-mono bg-red-50 border border-red-100 p-2 rounded-xl max-w-sm overflow-x-auto truncate">
                    {dbError}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {isLoading ? (
                <div className="col-span-full border border-gray-200/60 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white shadow-sm w-full">
                  <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Loading Estates...</p>
                </div>
              ) : readyProperties.length === 0 ? (
                <div className="col-span-full border border-gray-200/60 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white shadow-sm w-full">
                  <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">No Ready To Move Estates Found</p>
                </div>
              ) : (
                <>
                  {readyProperties.map((property, idx) => (
                    <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group">
                      <Link href={`/properties/${property.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3">
                          <span className="bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                            <CheckCircle size={8} /> Ready To Move
                          </span>
                        </div>
                        <button onClick={(e) => toggleFavorite(property.id, e)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                          <Heart size={13} className={favorites.includes(property.id) ? "fill-brand-red text-brand-red" : "text-gray-500"} />
                        </button>
                      </Link>
                      <div className="p-6 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1"><MapPin size={9} /> {property.location.split(",")[0]}</span>
                          <span className="text-lg font-extrabold text-brand-red">₹{(property.price / 10000000).toFixed(1)} Cr</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-brand-black leading-tight group-hover:text-brand-red transition-colors">
                          <Link href={`/properties/${property.slug}`}>{property.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-medium">{property.description}</p>
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                          <span>{property.bhk} BHK</span>
                          <span className="text-gray-100">|</span>
                          <span>{property.area}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-emerald-700 py-20">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-5">
            <h2 className="text-4xl font-extrabold text-white">Ready to Move In This Month?</h2>
            <p className="text-sm text-white/70 font-medium">Our advisors can arrange same-day site visits for all ready-possession properties. No pressure, no obligation.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white hover:bg-gray-50 text-emerald-700 text-sm font-extrabold uppercase tracking-wider rounded-full transition-all shadow-lg hover:scale-105">
              Book a Free Site Visit <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
