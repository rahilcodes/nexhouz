"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  Building,
  ArrowRight,
  ShieldCheck,
  Calendar,
  MapPin,
  Trash2,
  Check,
  AlertTriangle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Eyebrow } from "@/components/ui/theme";
import { properties as defaultProperties, Property } from "@/data/properties";
import { fetchAllProperties, submitLead } from "@/lib/db";
import { supabase } from "@/lib/supabaseClient";

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<"listings" | "compare" | "visit">("listings");
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
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
    const propertyTitles = savedProperties.map((p) => p.title).join(", ");
    const success = await submitLead({
      name: bookingForm.name,
      email: bookingForm.email,
      phone: bookingForm.phone,
      notes: `Consolidated Curation Tour Request for: [${propertyTitles}]. Date: ${bookingForm.date}. Instructions: ${bookingForm.notes}`,
      leadType: "callback",
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

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${parseFloat((price / 10000000).toFixed(2))} Cr`;
    } else {
      return `₹${parseFloat((price / 100000).toFixed(2))} Lakhs`;
    }
  };

  const tabs: { key: "listings" | "compare" | "visit"; label: string }[] = [
    { key: "listings", label: `Saved (${savedProperties.length})` },
    { key: "compare", label: "Compare" },
    { key: "visit", label: "Request Tour" },
  ];

  const bookingInput =
    "w-full border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-3.5 text-base text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors bg-white";
  const bookingLabel = "text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c] mb-1.5 block";

  if (!mounted) {
    return (
      <div className="font-archivo bg-white">
        <Navbar />
        <main className="min-h-[60vh] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#D31E28] border-t-transparent animate-spin" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="font-archivo bg-[#FAF7F1] min-h-screen">
      <Navbar />
      <main className={`${SECTION_X} py-12 lg:py-16`}>
        <div className={CONTAINER}>
          {/* Header */}
          <div className="border-b border-[#EEE9E0] pb-8 mb-8 lg:mb-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <Eyebrow>Your Saved Registry</Eyebrow>
                <h1 className="font-display font-semibold text-[30px] md:text-[44px] leading-[1.12] text-[#0A0A0A] mt-2.5">
                  Your saved collection.
                </h1>
                <p className="text-[15px] text-[#57534a] mt-2 max-w-lg">
                  Listings saved directly in your browser. No account needed — they persist automatically.
                </p>
              </div>

              {savedProperties.length > 0 && (
                <div className="flex items-center gap-1.5 p-1 bg-white border border-[#EEE9E0] rounded-full w-fit">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2.5 text-[12px] font-semibold uppercase tracking-wider rounded-full transition-colors cursor-pointer ${
                        activeTab === tab.key ? "bg-[#0A0A0A] text-white" : "text-[#57534a] hover:bg-[#f4efe6]"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Offline banner */}
          {isOffline && (
            <div className="max-w-xl mx-auto border border-amber-200 bg-amber-50/60 rounded-2xl py-3.5 px-5 flex items-center gap-3 mb-8">
              <AlertTriangle size={17} className="text-amber-600 shrink-0" />
              <p className="text-[13.5px] text-amber-900 font-medium">
                Live data is temporarily unavailable — showing our verified local collection.
              </p>
              {isDebugMode && dbError && (
                <span className="text-[11px] text-red-700 font-mono bg-red-50 border border-red-100 px-2 py-1 rounded-lg max-w-xs truncate">
                  {dbError}
                </span>
              )}
            </div>
          )}

          {savedProperties.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-xl mx-auto text-center py-16 lg:py-20 px-6 bg-white border border-[#EEE9E0] rounded-2xl shadow-[0_1px_3px_rgba(30,25,15,0.04)]"
            >
              <div className="w-16 h-16 rounded-full bg-[#D31E28]/5 flex items-center justify-center mx-auto text-[#D31E28]">
                <Heart size={26} className="stroke-[1.8]" />
              </div>
              <h3 className="text-[22px] font-semibold text-[#0A0A0A] mt-5">Your collection is empty</h3>
              <p className="text-[15px] text-[#57534a] leading-relaxed max-w-sm mx-auto mt-2">
                Tap the heart on any property card to save it here. It stays in your browser — no login needed.
              </p>
              <Link
                href="/properties"
                className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-sm font-semibold rounded-lg transition-colors mt-6"
              >
                Explore verified properties <ArrowRight size={15} />
              </Link>
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              {/* TAB 1: LISTINGS GRID */}
              {activeTab === "listings" && (
                <motion.div
                  key="listings"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6"
                >
                  {savedProperties.map((property) => (
                    <motion.div
                      key={property.id}
                      layout
                      className="bg-white border border-[#EEE9E0] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,25,15,0.04)] hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] transition-shadow group flex flex-col h-full"
                    >
                      {/* Image */}
                      <div className="relative aspect-[4/3] bg-[#efeae1] overflow-hidden shrink-0">
                        <img
                          src={property.image}
                          alt={property.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <span className="absolute left-3.5 top-3.5 bg-emerald-500 text-white rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                          <ShieldCheck size={11} /> 100% Legal Clear
                        </span>
                        <button
                          onClick={() => removeFavorite(property.id)}
                          className="absolute top-3.5 right-3.5 w-9 h-9 rounded-full bg-white/95 shadow-sm text-[#D31E28] flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
                          aria-label="Remove favorite"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>

                      {/* Content */}
                      <div className="p-5 lg:p-6 flex flex-col flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c] flex items-center gap-1">
                            <MapPin size={10} /> {property.location.split(",")[0]}
                          </span>
                          <span className="text-[17px] lg:text-lg font-bold text-[#D31E28] whitespace-nowrap">
                            {formatPrice(property.price)}
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
                            <span>{property.scores.investmentYield}% yield</span>
                          </div>
                          <Link
                            href={`/properties/${property.slug}`}
                            className="w-full flex items-center justify-center gap-1.5 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-full transition-colors mt-4"
                          >
                            View details <ArrowRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* TAB 2: COMPARE MATRIX */}
              {activeTab === "compare" && (
                <motion.div
                  key="compare"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="bg-white border border-[#EEE9E0] rounded-2xl overflow-hidden shadow-[0_1px_3px_rgba(30,25,15,0.04)]"
                >
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead>
                        <tr className="border-b border-[#EEE9E0] bg-[#FAF7F1]">
                          <th className="py-5 px-6 text-left w-1/4">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-[#948d7c]">Spec Metric</span>
                          </th>
                          {savedProperties.map((prop) => (
                            <th key={prop.id} className="py-5 px-6 text-center border-l border-[#EEE9E0] w-1/4">
                              <span className="text-[13px] font-semibold text-[#0A0A0A] block line-clamp-1">{prop.title}</span>
                              <span className="text-[13px] font-bold text-[#D31E28] mt-0.5 block">{formatPrice(prop.price)}</span>
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
                          ["Flats/Acre / Automation", (p: Property) => (p.type === "Apartment" ? `${p.udsPerAcre ?? 100} Flats/Acre` : p.scores.automationTier)],
                          ["Architect Firm", (p: Property) => p.architect.split(" & ")[0]],
                        ].map(([label, getValue], rIdx) => {
                          const fn = getValue as (p: Property) => string;
                          return (
                            <tr key={String(label)} className={`border-b border-[#f0ebe1] ${rIdx % 2 === 0 ? "bg-white" : "bg-[#FAF7F1]/40"}`}>
                              <td className="py-4 px-6 text-[13px] font-semibold text-[#57534a]">{label as string}</td>
                              {savedProperties.map((prop) => (
                                <td key={prop.id} className="py-4 px-6 text-center border-l border-[#EEE9E0] text-[13px] font-semibold text-[#0A0A0A]">
                                  {fn(prop)}
                                </td>
                              ))}
                            </tr>
                          );
                        })}
                        <tr className="bg-[#FAF7F1]/30">
                          <td className="py-5 px-6" />
                          {savedProperties.map((prop) => (
                            <td key={prop.id} className="py-5 px-6 text-center border-l border-[#EEE9E0] space-y-2">
                              <Link
                                href={`/properties/${prop.slug}`}
                                className="inline-flex items-center gap-1 px-4 py-2 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-[11px] font-bold uppercase tracking-widest rounded-full transition-colors"
                              >
                                View
                              </Link>
                              <button
                                onClick={() => removeFavorite(prop.id)}
                                className="block mx-auto text-[12px] font-semibold text-[#948d7c] hover:text-[#D31E28] transition-colors"
                              >
                                Remove
                              </button>
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}

              {/* TAB 3: BOOK SITE VISIT */}
              {activeTab === "visit" && (
                <motion.div
                  key="visit"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="max-w-2xl mx-auto bg-white border border-[#EEE9E0] rounded-2xl p-6 md:p-10 shadow-[0_1px_3px_rgba(30,25,15,0.04)]"
                >
                  <div className="text-center">
                    <div className="w-12 h-12 rounded-full bg-[#D31E28]/5 flex items-center justify-center mx-auto text-[#D31E28]">
                      <Calendar size={20} className="stroke-[1.8]" />
                    </div>
                    <h2 className="font-display font-semibold text-[26px] lg:text-[30px] text-[#0A0A0A] mt-3">Request a curation tour.</h2>
                    <p className="text-[14px] text-[#57534a] leading-relaxed max-w-sm mx-auto mt-2">
                      Schedule one private guided site tour covering all{" "}
                      <span className="font-semibold text-[#0A0A0A]">{savedProperties.length}</span> saved properties in a single trip.
                    </p>
                  </div>

                  <AnimatePresence mode="wait">
                    {!bookingSubmitted ? (
                      <motion.form
                        key="booking-form"
                        onSubmit={handleBookingSubmit}
                        className="mt-7"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className={bookingLabel}>Full name</label>
                            <input
                              type="text"
                              required
                              value={bookingForm.name}
                              onChange={(e) => setBookingForm({ ...bookingForm, name: e.target.value })}
                              placeholder="Your full name"
                              className={bookingInput}
                            />
                          </div>
                          <div>
                            <label className={bookingLabel}>Phone number</label>
                            <input
                              type="tel"
                              required
                              value={bookingForm.phone}
                              onChange={(e) => setBookingForm({ ...bookingForm, phone: e.target.value })}
                              placeholder="+91 85858 54853"
                              className={bookingInput}
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                          <div>
                            <label className={bookingLabel}>Email address</label>
                            <input
                              type="email"
                              required
                              value={bookingForm.email}
                              onChange={(e) => setBookingForm({ ...bookingForm, email: e.target.value })}
                              placeholder="you@example.com"
                              className={bookingInput}
                            />
                          </div>
                          <div>
                            <label className={bookingLabel}>Preferred date</label>
                            <input
                              type="date"
                              required
                              value={bookingForm.date}
                              onChange={(e) => setBookingForm({ ...bookingForm, date: e.target.value })}
                              className={bookingInput}
                            />
                          </div>
                        </div>
                        <div className="mt-4">
                          <label className={bookingLabel}>Special instructions / requests</label>
                          <textarea
                            rows={3}
                            value={bookingForm.notes}
                            onChange={(e) => setBookingForm({ ...bookingForm, notes: e.target.value })}
                            placeholder="e.g. Schedule back-to-back visits, provide RERA documents, focus on NRI taxation, etc."
                            className={`${bookingInput} resize-none`}
                          />
                        </div>

                        {/* Assets list */}
                        <div className="p-4 bg-[#FAF7F1] border border-[#EEE9E0] rounded-xl mt-4">
                          <span className="text-[11px] font-bold uppercase tracking-widest text-[#948d7c] block">Properties in this tour</span>
                          <div className="flex flex-wrap gap-2 pt-2.5">
                            {savedProperties.map((p) => (
                              <span key={p.id} className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#2b2823] bg-white border border-[#EEE9E0] px-2.5 py-1 rounded-full">
                                <Building size={10} className="text-[#D31E28] shrink-0" />
                                {p.title}
                              </span>
                            ))}
                          </div>
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full py-[18px] bg-[#D31E28] hover:bg-[#B8171F] disabled:bg-[#D31E28]/40 text-white text-[16px] font-semibold rounded-[10px] transition-colors shadow-[0_6px_18px_rgba(211,30,40,0.25)] cursor-pointer mt-5"
                        >
                          {isSubmitting ? "Scheduling tour…" : "Request curation tour"}
                        </button>
                      </motion.form>
                    ) : (
                      <motion.div
                        key="success-booking"
                        className="p-8 flex flex-col items-center justify-center text-center mt-4"
                        initial={{ opacity: 0, scale: 0.96 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <div className="w-14 h-14 rounded-full bg-[#D31E28] text-white flex items-center justify-center">
                          <Check size={24} strokeWidth={3} />
                        </div>
                        <h4 className="text-[22px] font-semibold text-[#0A0A0A] mt-4">Tour requested</h4>
                        <p className="text-[15px] text-[#57534a] leading-relaxed max-w-xs mx-auto mt-2">
                          An expert advisor will coordinate back-to-back site visits and confirm within 4 hours.
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
    </div>
  );
}
