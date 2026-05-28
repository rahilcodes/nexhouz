"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Home, ShieldCheck, Heart, MapPin, ArrowRight, Clock, CheckCircle, Zap } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { properties } from "@/data/properties";

const readyProperties = properties.filter(p => p.possession === "Ready");

export default function ReadyToMovePage() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("nexhouz_favorites");
    if (saved) {
      try {
        setFavorites(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

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
                <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-emerald-700">Immediate Possession</span>
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
                  <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mt-0.5">{s.label}</p>
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
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600 mb-2">Ready Inventory</p>
                <h2 className="text-3xl font-extrabold text-brand-black">{readyProperties.length} Properties Ready for Possession</h2>
              </div>
              <Link href="/compare" className="hidden md:flex items-center gap-1.5 text-xs font-bold text-brand-black hover:text-brand-red border-b border-brand-black hover:border-brand-red pb-0.5 transition-all">
                Compare Properties <ArrowRight size={12} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {readyProperties.map((property, idx) => (
                <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all group">
                  <Link href={`/properties/${property.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
                    <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3">
                      <span className="bg-emerald-500 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                        <CheckCircle size={8} /> Ready To Move
                      </span>
                    </div>
                    <button onClick={(e) => toggleFavorite(property.id, e)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <Heart size={13} className={favorites.includes(property.id) ? "fill-brand-red text-brand-red" : "text-gray-500"} />
                    </button>
                  </Link>
                  <div className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 flex items-center gap-1"><MapPin size={9} /> {property.location.split(",")[0]}</span>
                      <span className="text-lg font-extrabold text-brand-red">₹{(property.price / 10000000).toFixed(1)} Cr</span>
                    </div>
                    <h3 className="text-base font-extrabold text-brand-black leading-tight group-hover:text-brand-red transition-colors">
                      <Link href={`/properties/${property.slug}`}>{property.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-500 line-clamp-2 font-medium">{property.description}</p>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      <span>{property.bhk} BHK</span><span className="text-gray-200">|</span>
                      <span>{property.area}</span><span className="text-gray-200">|</span>
                      <span className="text-emerald-600">Immediate Possession</span>
                    </div>
                    <Link href={`/properties/${property.slug}`} className="w-full block text-center py-3 bg-brand-black hover:bg-emerald-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all">
                      View Details
                    </Link>
                  </div>
                </motion.div>
              ))}
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
