"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Building,
  TrendingUp,
  Clock,
  ArrowRight,
  ShieldCheck,
  Scale,
  Calendar,
  Sparkles,
  MapPin,
  Trash2,
  Phone,
  Mail,
  Send,
  Check,
  CheckCircle,
  HelpCircle,
  FileText
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { properties as defaultProperties, Property } from "@/data/properties";
import { fetchAllProperties, submitLead } from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";
import { AlertTriangle } from "lucide-react";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"listings" | "compare" | "visit">("listings");
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);
  
  // Site visit booking state
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "", date: "", notes: "" });
  const [bookingSubmitted, setBookingSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const params = new URLSearchParams(window.location.search);
    const hasDebug = params.get("debug") === "true";
    if (isDev || hasDebug) {
      setIsDebugMode(true);
    }
  }, []);

  useEffect(() => {
    setMounted(true);
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

  const removeFavorite = (id: string) => {
    const next = favorites.filter((f) => f !== id);
    setFavorites(next);
    localStorage.setItem("nexhouz_favorites", JSON.stringify(next));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const propertyTitles = savedProperties.map(p => p.title).join(", ");
    const success = await submitLead({
      name: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone,
      notes: `Consolidated Curation Tour Request for: [${propertyTitles}]. Date: ${bookingForm.date}. Instructions: ${bookingForm.notes}`,
      leadType: "callback"
    });
    setIsSubmitting(false);
    if (success) {
      setBookingSubmitted(true);
      setTimeout(() => {
        setBookingSubmitted(false);
        setBookingForm({ name: "", phone: "", email: "", date: "", notes: "" });
      }, 3500);
    }
  };

  // Filter actual properties that are favorited
  const savedProperties = liveProperties.filter((p) => favorites.includes(p.id));

  // Format price helper
  const formatPrice = (price: number) => {
    return `₹${(price / 10000000).toFixed(1)} Cr`;
  };

  if (!mounted) {
    return (
      <>
        <Navbar />
        <main className="bg-white min-h-screen flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-brand-red border-t-transparent animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="bg-brand-gray/10 min-h-screen pt-32 pb-24">
        <div className="max-w-7xl mx-auto px-6">

          {/* Header Section */}
          <div className="border-b border-gray-200/60 pb-8 mb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-2 h-2 rounded-full bg-brand-red animate-ping" />
                  <span className="text-xs font-extrabold tracking-[0.25em] uppercase text-brand-black/45">
                    Session Curation Registry Active
                  </span>
                </div>
                <h1 className="text-3xl md:text-4xl font-extrabold text-brand-black tracking-tight leading-tight">
                  Your Saved Collections
                </h1>
                <p className="text-xs text-gray-500 font-medium">
                  Direct browser-saved listings. No account registration required. Persists automatically in your current browser.
                </p>
              </div>

              {savedProperties.length > 0 && (
                <div className="flex items-center gap-1.5 p-1 bg-gray-50 border border-gray-200/50 rounded-full w-fit">
                  <button
                    onClick={() => setActiveTab("listings")}
                    className={`px-4 py-2 text-xs font-extrabold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                      activeTab === "listings"
                        ? "bg-brand-black text-white shadow-sm"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    Saved Cards ({savedProperties.length})
                  </button>
                  <button
                    onClick={() => setActiveTab("compare")}
                    className={`px-4 py-2 text-xs font-extrabold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                      activeTab === "compare"
                        ? "bg-brand-black text-white shadow-sm"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    Compare Matrix
                  </button>
                  <button
                    onClick={() => setActiveTab("visit")}
                    className={`px-4 py-2 text-xs font-extrabold uppercase tracking-widest rounded-full transition-all cursor-pointer ${
                      activeTab === "visit"
                        ? "bg-brand-black text-white shadow-sm"
                        : "text-gray-400 hover:text-gray-700"
                    }`}
                  >
                    Request Curation Tour
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* EMPTY STATE                                                    */}
          {/* ============================================================== */}
          {isOffline && (
            <div className="max-w-xl mx-auto border border-amber-200 bg-amber-50/50 rounded-3xl py-4 px-6 flex items-center justify-between gap-4 shadow-sm w-full mb-8 text-left animate-fadeIn">
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
                <div className="text-[10px] text-red-655 font-mono bg-red-50 border border-red-100 p-2 rounded-xl max-w-xs overflow-x-auto truncate">
                  {dbError}
                </div>
              )}
            </div>
          )}

          {savedProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto text-center py-20 px-6 bg-white border border-gray-150 rounded-3xl shadow-luxury space-y-6"
            >
              <div className="w-16 h-16 rounded-full bg-brand-red/5 flex items-center justify-center mx-auto text-brand-red shadow-inner">
                <Heart size={26} className="stroke-[1.8] animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-extrabold text-brand-black">Your Collection is Empty</h3>
                <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                  Favoriting a listing by clicking the heart button on any card saves it locally in your Chrome or Safari browser. No credentials needed.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-wider rounded-full transition-all hover:scale-105 shadow-md shadow-brand-red/10"
                >
                  Explore Verified Properties <ArrowRight size={13} />
                </Link>
              </div>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {/* ============================================================== */}
              {/* TAB 1: LISTINGS GRID                                           */}
              {/* ============================================================== */}
              {activeTab === "listings" && (
                <motion.div
                  key="listings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                  {savedProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      layout
                      className="bg-white border border-gray-150 rounded-3xl overflow-hidden shadow-luxury hover:shadow-luxury-hover hover:border-brand-red/15 transition-all group flex flex-col h-full"
                    >
                      {/* Image container */}
                      <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden shrink-0">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                        
                        {/* Remove favorite button */}
                        <button
                          onClick={() => removeFavorite(property.id)}
                          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/90 backdrop-blur-md hover:bg-white text-brand-red hover:text-brand-red/80 flex items-center justify-center shadow-md transition-all hover:scale-110 cursor-pointer"
                          aria-label="Remove favorite"
                        >
                          <Trash2 size={13} />
                        </button>

                        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                          <span className="text-xs font-extrabold uppercase tracking-widest text-white bg-brand-red px-2.5 py-0.5 rounded-full">
                            {property.possession}
                          </span>
                          <span className="text-xs font-extrabold text-white bg-black/45 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                            {property.type}
                          </span>
                        </div>
                      </div>

                      {/* Content details */}
                      <div className="p-6 flex flex-col flex-grow justify-between space-y-4">
                        <div className="space-y-2">
                          <div className="flex items-center gap-1 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-red bg-brand-red/5 border border-brand-red/10 px-2 py-0.5 rounded-full w-fit">
                            <ShieldCheck size={9} />
                            <span>14-Point Legal Vetted Clear</span>
                          </div>
                          <h3 className="text-lg font-extrabold text-brand-black tracking-tight leading-tight line-clamp-1">
                            {property.title}
                          </h3>
                          <p className="text-xs text-gray-400 font-bold uppercase tracking-wider flex items-center gap-1">
                            <MapPin size={9} />
                            {property.location}
                          </p>
                          <p className="text-xs text-gray-500 font-medium leading-relaxed line-clamp-2">
                            {property.description}
                          </p>
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100 flex-grow-0">
                          {/* Specs */}
                          <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl">
                              <p className="font-extrabold text-brand-black">{property.bhk} BHK</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Layout</p>
                            </div>
                            <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl">
                              <p className="font-extrabold text-brand-black">{property.area.split(" ")[0]}</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sq Ft</p>
                            </div>
                            <div className="p-2 bg-gray-50 border border-gray-100 rounded-xl">
                              <p className="font-extrabold text-brand-black">{property.scores.investmentYield}%</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Est Yield</p>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-1">
                            <div>
                              <p className="text-lg font-extrabold text-brand-black leading-none">{formatPrice(property.price)}</p>
                              <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Onwards</p>
                            </div>
                            <Link
                              href={`/properties/${property.slug}`}
                              className="inline-flex items-center gap-1.5 px-4.5 py-2 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-widest rounded-full transition-all hover:scale-105"
                            >
                              Details <ArrowRight size={10} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* ============================================================== */}
              {/* TAB 2: SIDE-BY-SIDE COMPARE MATRIX                             */}
              {/* ============================================================== */}
              {activeTab === "compare" && (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-gray-150 rounded-3xl shadow-luxury overflow-hidden"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="border-b border-gray-100 bg-gray-50/50">
                          <th className="py-5 px-6 text-left w-1/4">
                            <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Spec Metric</span>
                          </th>
                          {savedProperties.map((prop) => (
                            <th key={prop.id} className="py-5 px-6 text-center border-l border-gray-100 w-1/4">
                              <span className="text-xs font-extrabold text-brand-black block line-clamp-1">{prop.title}</span>
                              <span className="text-xs font-bold text-brand-red mt-0.5 block">{formatPrice(prop.price)}</span>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          ["Location Area", (p: Property) => p.location.split(",")[0]],
                          ["Total Sizing", (p: Property) => p.area],
                          ["BHK Design", (p: Property) => `${p.bhk} Bedroom Suites`],
                          ["Possession State", (p: Property) => p.possession],
                          ["Curation Score", (p: Property) => `${p.scores.architecturalIntegrity}/100`],
                          ["Rental Yield Est.", (p: Property) => `${p.scores.investmentYield}% Projected`],
                          ["Flats/Acre / Automation", (p: Property) => p.type === "Apartment" ? `${p.udsPerAcre ?? 100} Flats/Acre` : p.scores.automationTier],
                          ["Architect Firm", (p: Property) => p.architect.split(" & ")[0]],
                        ].map(([label, getValue], rIdx) => {
                          const fn = getValue as (p: Property) => string;
                          return (
                            <tr
                              key={String(label)}
                              className={`border-b border-gray-150/40 ${rIdx % 2 === 0 ? "bg-white" : "bg-gray-50/30"}`}
                            >
                              <td className="py-4 px-6 text-xs font-bold text-gray-500">{label as string}</td>
                              {savedProperties.map((prop) => (
                                <td key={prop.id} className="py-4 px-6 text-center border-l border-gray-100 text-xs font-semibold text-brand-black">
                                  {fn(prop)}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                        {/* Action links */}
                        <tr className="bg-gray-50/20">
                          <td className="py-5 px-6" />
                          {savedProperties.map((prop) => (
                            <td key={prop.id} className="py-5 px-6 text-center border-l border-gray-100 space-y-2">
                              <Link
                                href={`/properties/${prop.slug}`}
                                className="inline-flex items-center gap-1 px-3 py-1.5 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-widest rounded-full transition-all"
                              >
                                View Curation
                              </Link>
                              <button
                                onClick={() => removeFavorite(prop.id)}
                                className="block mx-auto text-xs font-bold text-gray-400 hover:text-brand-red transition-colors"
                              >
                                Remove Saved
                              </button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* ============================================================== */}
              {/* TAB 3: BOOK SITE VISIT FORM                                    */}
              {/* ============================================================== */}
              {activeTab === "visit" && (
                <motion.div
                  key="visit"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-2xl mx-auto bg-white border border-gray-150 rounded-3xl p-8 md:p-10 shadow-luxury space-y-8"
                >
                  <div className="text-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-brand-red/5 flex items-center justify-center mx-auto text-brand-red">
                      <Calendar size={20} className="stroke-[1.8]" />
                    </div>
                    <h2 className="text-2xl font-extrabold text-brand-black tracking-tight">Request Curation Tour</h2>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed max-w-sm mx-auto">
                      Schedule a private guided structural site tour for all **{savedProperties.length}** favorited properties in a single consolidated trip.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {!bookingSubmitted ? (
                      <motion.form
                        key="booking-form"
                        onSubmit={handleBookingSubmit}
                        className="space-y-5 text-xs text-brand-black font-sans"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1">
                            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Full Name*</label>
                            <input
                              type="text"
                              required
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                              placeholder="Your full name"
                              className="w-full bg-gray-50 border border-gray-200/70 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Phone Number*</label>
                            <input
                              type="tel"
                              required
                              value={bookingForm.phone}
                              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                              placeholder="+91 85858 54853"
                              className="w-full bg-gray-50 border border-gray-200/70 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                          <div className="space-y-1">
                            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Email Address*</label>
                            <input
                              type="email"
                              required
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              placeholder="you@example.com"
                              className="w-full bg-gray-50 border border-gray-200/70 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-xs font-semibold"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Preferred Date*</label>
                            <input
                              type="date"
                              required
                              value={bookingForm.date}
                              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                              className="w-full bg-gray-50 border border-gray-200/70 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-xs font-semibold"
                            />
                          </div>
                        </div>

                        <div className="space-y-1">
                          <label className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Special Instructions / Requests</label>
                          <textarea
                            rows={3}
                            value={bookingForm.notes}
                            onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                            placeholder="e.g. Schedule back-to-back site visits, provide RERA structural documents, focus on NRI taxation, etc."
                            className="w-full bg-gray-50 border border-gray-200/70 px-4 py-3 rounded-xl focus:outline-none focus:border-brand-red focus:bg-white text-xs font-semibold resize-none"
                          />
                        </div>

                        {/* List of assets to be sent */}
                        <div className="p-4 bg-gray-50 border border-gray-150 rounded-2xl space-y-2">
                          <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400 block">Requested Properties Curation List</span>
                          <div className="flex flex-wrap gap-2 pt-1">
                            {savedProperties.map((p) => (
                              <span key={p.id} className="inline-flex items-center gap-1 text-xs font-bold text-gray-700 bg-white border border-gray-200 px-2.5 py-1 rounded-full">
                                <Building size={9} className="text-brand-red shrink-0" />
                                {p.title}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-4 bg-brand-black hover:bg-brand-red disabled:bg-black/30 text-white text-xs tracking-[0.25em] font-extrabold uppercase transition-all duration-300 flex items-center justify-center gap-2 rounded-xl shadow-luxury hover:scale-101 cursor-pointer"
                        >
                          {isSubmitting ? (
                            <span>Scheduling Curation Tour...</span>
                          ) : (
                            <>
                              <span>Request Curation Tour</span>
                              <Send size={11} />
                            </>
                          )}
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success-booking"
                        className="p-8 border border-brand-red/10 bg-brand-red/5 flex flex-col items-center justify-center text-center space-y-4 rounded-2xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg shadow-brand-red/20">
                          <Check size={20} />
                        </div>
                        <h4 className="text-xl font-extrabold text-brand-black">Curation Tour Requested</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-semibold max-w-xs mx-auto">
                          Briefing sent to our Kokapet / Kondapur central hub. An expert advisor will verify structural access and coordinate back-to-back site visits within 4 hours.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}
            </AnimatePresence>
          )}

        </div>
      </main>
      <Footer />
    </>
  );
}
