"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ShieldCheck, Heart, MapPin, ArrowRight, Building, Star, TrendingUp, Filter, Search, AlertTriangle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { properties as defaultProperties, Property } from "@/data/properties";
import { fetchAllProperties } from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";

export default function NewLaunchesPage() {
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

  const newLaunchProperties = liveProperties.filter(p => p.possession === "Under Construction");

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
        {/* Hero Banner */}
        <section className="relative bg-brand-black overflow-hidden pt-32 pb-20">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #D31E28 0%, transparent 60%), radial-gradient(circle at 80% 20%, #D31E28 0%, transparent 50%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/15 border border-brand-red/30 rounded-full mb-5">
                <Sparkles size={10} className="text-brand-red" />
                <span className="text-xs font-extrabold tracking-[0.2em] uppercase text-brand-red">Freshly Launched</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight mb-5">
                New Launch<br /><span className="text-brand-red">Properties</span> in Hyderabad.
              </h1>
              <p className="text-sm text-white/55 font-medium leading-relaxed max-w-xl">
                Be the first to invest in Hyderabad's freshest curated launches — pre-vetted for RERA registration, builder track records, and legal title clarity before they hit the market.
              </p>
            </motion.div>

            {/* Stats row */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-wrap items-center gap-8 mt-10 pt-10 border-t border-white/10">
              {[
                { label: "Active New Launches", value: "48+" },
                { label: "Pre-RERA Verified", value: "100%" },
                { label: "Avg. Appreciation", value: "12-18%" },
                { label: "Builders Audited", value: "30+" },
              ].map(s => (
                <div key={s.label}>
                  <p className="text-2xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40 mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Why New Launches */}
        <section className="py-16 border-b border-gray-100 bg-gray-50/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: TrendingUp, title: "Pre-Launch Pricing", desc: "Lock in the lowest possible price before commercial launch and appreciation cycles begin." },
                { icon: ShieldCheck, title: "RERA Pre-Verified", desc: "Every new launch is audited for RERA registration, builder credibility, and title deed clarity." },
                { icon: Star, title: "First Mover Advantage", desc: "Select your preferred floor, unit, and view before the general public even knows it exists." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.title} className="bg-white border border-gray-100 rounded-2xl p-7 flex gap-4 shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-brand-red/5 flex items-center justify-center text-brand-red shrink-0">
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

        {/* Property Grid */}
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-10">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-widest text-brand-red mb-2">Curated New Launches</p>
                <h2 className="text-3xl font-extrabold text-brand-black">
                  {newLaunchProperties.length > 0 ? `${newLaunchProperties.length} Properties Available` : "Launching Soon"}
                </h2>
              </div>
              <Link href="/properties" className="hidden md:flex items-center gap-1.5 text-xs font-bold text-brand-black hover:text-brand-red border-b border-brand-black hover:border-brand-red pb-0.5 transition-all">
                View All Properties <ArrowRight size={12} />
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

            {isLoading ? (
              <div className="col-span-full border border-gray-200/60 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white shadow-sm w-full">
                <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Loading Estates...</p>
              </div>
            ) : newLaunchProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {newLaunchProperties.map((property, idx) => (
                  <motion.div key={property.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-red/15 transition-all group">
                    <Link href={`/properties/${property.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
                      <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute top-3 left-3 flex items-center gap-1.5">
                        <span className="bg-brand-red text-white text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                          <Sparkles size={8} /> New Launch
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
                      <h3 className="text-base font-extrabold text-brand-black leading-tight group-hover:text-brand-red transition-colors">
                        <Link href={`/properties/${property.slug}`}>{property.title}</Link>
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-2 font-medium leading-relaxed">{property.description}</p>
                      <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                        <span>{property.bhk} BHK</span><span className="text-gray-200">|</span>
                        <span>{property.area}</span><span className="text-gray-200">|</span>
                        <span className="text-amber-600">Under Construction</span>
                      </div>
                      <Link href={`/properties/${property.slug}`} className="w-full block text-center py-3 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all">
                        View Details
                      </Link>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-24 border-2 border-dashed border-gray-200 rounded-3xl">
                <Sparkles size={36} className="text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-extrabold text-brand-black mb-2">Exciting Launches Coming Soon</h3>
                <p className="text-sm text-gray-400 mb-6 font-medium">Register your interest and be the first to know when new projects launch.</p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white text-xs font-extrabold uppercase rounded-full hover:bg-brand-red/90 transition-all">
                  Notify Me First <ArrowRight size={12} />
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-black py-20">
          <div className="max-w-3xl mx-auto px-6 text-center space-y-5">
            <h2 className="text-4xl font-extrabold text-white">Get Early Access to the Next Big Launch.</h2>
            <p className="text-sm text-white/55 font-medium">Our team pre-screens projects before they open to the public. Register now to get exclusive pre-launch pricing and first selection rights.</p>
            <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-brand-red hover:bg-brand-red/90 text-white text-sm font-extrabold uppercase tracking-wider rounded-full transition-all shadow-lg shadow-brand-red/20 hover:scale-105">
              Register for Early Access <ArrowRight size={14} />
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
