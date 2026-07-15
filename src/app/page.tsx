"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  Star,
  Heart,
  X,
  ArrowRight,
  Info,
  AlertTriangle,
  Building,
  Compass,
  ShieldCheck,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, Reveal, Eyebrow, PHONE_DISPLAY, PHONE_TEL } from "@/components/ui/theme";
import { fetchAllProperties, submitLead } from "@/lib/db";
import { properties as defaultProperties, Property } from "@/data/properties";
import { supabase } from "@/lib/supabaseClient";

// ─────────────────────────────────────────────────────────────────────────────
// Design tokens (NexHouz Web Style Guide)
//   Primary Red #D31E28 (hover #B8171F) · Near-Black #0A0A0A · Warm White #FAF7F1
//   Champagne #F6F1E7 · Gold #8A6D2F · Border #EEE9E0
//   Display: Cormorant Garamond 600 · UI/body: Archivo
// ─────────────────────────────────────────────────────────────────────────────

const HERO_SLIDES = [
  { src: "/images/hyderabad_skyline_facade.png", alt: "Kokapet skyline — gated community towers" },
  { src: "/images/hero_modernist_villa.png", alt: "Luxury villa exterior, Tellapur" },
  { src: "/images/vanguard_penthouse.png", alt: "Premium residence interiors" },
];

const scrollToCallback = () => {
  document.getElementById("callback-form-section")?.scrollIntoView({ behavior: "smooth" });
};

const formatCr = (price: number) => `₹${parseFloat((price / 10000000).toFixed(2))} Cr`;


const possessionLabel = (p: Property) =>
  p.possessionDate || (p.possession === "Ready" ? "Ready to move" : "Under construction");

// ─────────────────────────────────────────────────────────────────────────────
// HERO — crossfade slider + search console (desktop) / search CTA (mobile)
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection() {
  const [slide, setSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setSlide((s) => (s + 1) % HERO_SLIDES.length), 5000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const go = (n: number) => {
    startTimer();
    setSlide(((n % HERO_SLIDES.length) + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Search console state
  const [activeTab, setActiveTab] = useState<"Buy" | "Commercial" | "New Launch">("Buy");
  const [search, setSearch] = useState({ location: "", type: "Apartment", priceRange: "₹ 50L - ₹ 5Cr+", bhk: "3" });
  const [openField, setOpenField] = useState<null | "location" | "type" | "budget" | "bhk">(null);

  useEffect(() => {
    const close = () => setOpenField(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, []);

  const suggestedDestinations = [
    { name: "Kokapet & Financial District", desc: "High-growth commercial expansion node", icon: Building },
    { name: "Jubilee & Banjara Hills", desc: "Timeless prime premium residential hills", icon: Compass },
    { name: "Narsingi & Tellapur", desc: "Green suburbs popular with tech families", icon: MapPin },
    { name: "Osman & Himayat Sagar's", desc: "Quiet lakeside villa enclaves", icon: Building },
  ];

  const searchHref =
    activeTab === "New Launch"
      ? "/new-launches"
      : `/properties?location=${encodeURIComponent(search.location || "Kokapet")}&type=${encodeURIComponent(
          activeTab === "Commercial" ? "Commercial" : search.type
        )}&price=${encodeURIComponent(search.priceRange)}&bhk=${encodeURIComponent(search.bhk)}`;

  const fieldLabel = "text-[13px] font-semibold tracking-[0.1em] text-[#948d7c] mb-2";
  const fieldValue = "flex items-center justify-between gap-2 text-[17px] font-medium text-[#0A0A0A] cursor-pointer";

  return (
    <section className="relative">
      {/* ── Desktop hero — fills the viewport below the header, console included ── */}
      <div className="hidden lg:block relative h-[calc(100vh-132px)] min-h-[560px] max-h-[820px] bg-[#efeae1] z-20">
        {HERO_SLIDES.map((s, i) => (
          <div
            key={s.src}
            className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
            style={{ opacity: slide === i ? 1 : 0 }}
          >
            <img src={s.src} alt={s.alt} className="w-full h-full object-cover" />
          </div>
        ))}
        {/* Readability gradient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(94deg, rgba(255,255,255,0.97) 0%, rgba(255,255,255,0.93) 34%, rgba(255,255,255,0.55) 56%, rgba(255,255,255,0) 78%)",
          }}
        />

        {/* Content layer — centered container keeps copy/console aligned on wide screens */}
        <div className="absolute inset-0">
        <div className={`relative h-full ${CONTAINER} px-6 xl:px-[60px]`}>
        <div className="h-full flex flex-col justify-center pb-[160px] pointer-events-none">
          <div className="max-w-[680px]">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 bg-white border border-[#eadfd0] rounded-lg px-4 py-2.5 text-[15px] font-semibold text-[#8A6D2F] shadow-[0_2px_8px_rgba(30,25,15,0.06)]"
            >
              <Star size={14} className="fill-[#8A6D2F] text-[#8A6D2F]" />
              Hyderabad&apos;s Trusted Buying Advisory · 130+ Families Served
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="font-display font-semibold leading-[1.08] text-[#0A0A0A] mt-5 text-balance"
              style={{ fontSize: "clamp(38px, 6.6vh, 64px)" }}
            >
              Buy your dream home with complete confidence.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.16 }}
              className="leading-[1.6] text-[#44403a] mt-4 max-w-[560px]"
              style={{ fontSize: "clamp(15px, 2.1vh, 19px)" }}
            >
              Every property we show is RERA-verified, builder-audited across 47 points and 100% legal-clear — with
              expert advisors guiding you from search to registration. Zero brokerage.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.24 }}
              className="flex gap-4 mt-7 pointer-events-auto"
            >
              <button
                onClick={scrollToCallback}
                className="bg-[#D31E28] hover:bg-[#B8171F] text-white text-[17px] font-semibold px-8 py-[18px] rounded-lg cursor-pointer shadow-[0_6px_18px_rgba(211,30,40,0.28)] transition-colors"
              >
                Book Free Expert Session
              </button>
              <a
                href={PHONE_TEL}
                className="flex items-center gap-2 bg-white text-[#0A0A0A] text-[17px] font-semibold px-8 py-[18px] rounded-lg border-[1.5px] border-[#d8d2c6] hover:border-[#0A0A0A] transition-colors"
              >
                <Phone size={16} /> Talk to an Advisor
              </a>
            </motion.div>
          </div>
        </div>

        {/* Slider controls */}
        <div className="absolute right-6 xl:right-[60px] bottom-[178px] flex items-center gap-3.5 z-10">
          <button
            onClick={() => go(slide - 1)}
            aria-label="Previous slide"
            className="w-12 h-12 rounded-full bg-white text-[#0A0A0A] hover:bg-[#D31E28] hover:text-white flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(30,25,15,0.18)] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          {HERO_SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => go(i)}
              aria-label={`Go to slide ${i + 1}`}
              className="w-3 h-3 rounded-full cursor-pointer transition-colors"
              style={{ background: slide === i ? "#D31E28" : "rgba(255,255,255,0.85)" }}
            />
          ))}
          <button
            onClick={() => go(slide + 1)}
            aria-label="Next slide"
            className="w-12 h-12 rounded-full bg-white text-[#0A0A0A] hover:bg-[#D31E28] hover:text-white flex items-center justify-center cursor-pointer shadow-[0_4px_14px_rgba(30,25,15,0.18)] transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Search console */}
        <div className="absolute left-6 right-6 xl:left-[60px] xl:right-[60px] bottom-0 z-20">
          <div
            className="bg-white border border-[#EEE9E0] border-b-0 rounded-t-2xl shadow-[0_-8px_30px_rgba(30,25,15,0.08)] px-6 pb-5 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Tabs */}
            <div className="flex gap-1 py-2.5">
              {(["Buy", "Commercial", "New Launch"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`text-base px-6 py-3 rounded-lg cursor-pointer transition-colors ${
                    activeTab === tab
                      ? "font-semibold text-white bg-[#0A0A0A]"
                      : "font-medium text-[#57534a] hover:bg-[#f4efe6]"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
            {/* Fields */}
            <div className="grid grid-cols-[1.3fr_1fr_1fr_1fr_auto] items-stretch">
              {/* Location */}
              <div className="relative py-2 pr-6 pl-1 border-r border-[#EEE9E0]">
                <div className={fieldLabel}>LOCATION</div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Kokapet, Gachibowli…"
                    value={search.location}
                    onChange={(e) => {
                      setSearch({ ...search, location: e.target.value });
                      setOpenField("location");
                    }}
                    onFocus={() => setOpenField("location")}
                    className="w-full bg-transparent text-[17px] font-medium text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none"
                  />
                  <MapPin size={15} className="text-[#948d7c] shrink-0" />
                </div>
                <AnimatePresence>
                  {openField === "location" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 w-[340px] mt-2 bg-white border border-[#EEE9E0] shadow-[0_18px_50px_rgba(30,25,15,0.14)] rounded-2xl p-3 z-50"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#948d7c] px-2 mb-2">
                        Suggested hotspots
                      </p>
                      {suggestedDestinations.map((d) => (
                        <button
                          key={d.name}
                          onClick={() => {
                            setSearch({ ...search, location: d.name });
                            setOpenField(null);
                          }}
                          className="w-full text-left px-2 py-2 flex items-center gap-2.5 rounded-lg hover:bg-[#FAF7F1] transition-colors cursor-pointer"
                        >
                          <MapPin size={12} className="text-[#D31E28] shrink-0" />
                          <div>
                            <p className="text-[14px] font-semibold text-[#0A0A0A]">{d.name}</p>
                            <p className="text-[12.5px] text-[#948d7c]">{d.desc}</p>
                          </div>
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Type */}
              <div className="relative py-2 px-6 border-r border-[#EEE9E0]">
                <div className={fieldLabel}>PROPERTY TYPE</div>
                <button
                  onClick={() => setOpenField(openField === "type" ? null : "type")}
                  className={`w-full ${fieldValue}`}
                >
                  <span>{search.type}</span>
                  <ChevronDown size={14} className={`text-[#948d7c] transition-transform ${openField === "type" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openField === "type" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-4 right-4 mt-2 bg-white border border-[#EEE9E0] shadow-[0_18px_50px_rgba(30,25,15,0.14)] rounded-2xl p-2 z-50"
                    >
                      {["Apartment", "Villa", "Plot", "Commercial"].map((t) => (
                        <button
                          key={t}
                          onClick={() => {
                            setSearch({ ...search, type: t });
                            setOpenField(null);
                          }}
                          className={`w-full text-left px-3 py-2.5 text-[15px] font-medium rounded-xl transition-colors cursor-pointer ${
                            search.type === t ? "bg-[#0A0A0A] text-white" : "hover:bg-[#FAF7F1] text-[#0A0A0A]"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Budget */}
              <div className="relative py-2 px-6 border-r border-[#EEE9E0]">
                <div className={fieldLabel}>BUDGET</div>
                <button
                  onClick={() => setOpenField(openField === "budget" ? null : "budget")}
                  className={`w-full ${fieldValue}`}
                >
                  <span className="whitespace-nowrap">{search.priceRange}</span>
                  <ChevronDown size={14} className={`text-[#948d7c] transition-transform ${openField === "budget" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openField === "budget" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-4 right-4 mt-2 bg-white border border-[#EEE9E0] shadow-[0_18px_50px_rgba(30,25,15,0.14)] rounded-2xl p-2 z-50"
                    >
                      {["₹ 50L - ₹ 5Cr+", "₹ 50L - ₹ 2Cr", "₹ 2Cr - ₹ 5Cr", "₹ 5Cr - ₹ 10Cr", "₹ 10Cr+"].map((b) => (
                        <button
                          key={b}
                          onClick={() => {
                            setSearch({ ...search, priceRange: b });
                            setOpenField(null);
                          }}
                          className={`w-full text-left px-3 py-2.5 text-[15px] font-medium rounded-xl transition-colors cursor-pointer whitespace-nowrap ${
                            search.priceRange === b ? "bg-[#0A0A0A] text-white" : "hover:bg-[#FAF7F1] text-[#0A0A0A]"
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* BHK */}
              <div className="relative py-2 px-6">
                <div className={fieldLabel}>BHK</div>
                <button
                  onClick={() => setOpenField(openField === "bhk" ? null : "bhk")}
                  className={`w-full ${fieldValue}`}
                >
                  <span>{search.bhk === "Any" ? "Any BHK" : `${search.bhk} BHK`}</span>
                  <ChevronDown size={14} className={`text-[#948d7c] transition-transform ${openField === "bhk" ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence>
                  {openField === "bhk" && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-4 right-4 mt-2 bg-white border border-[#EEE9E0] shadow-[0_18px_50px_rgba(30,25,15,0.14)] rounded-2xl p-2 z-50"
                    >
                      {["Any", "2", "3", "4", "5+"].map((k) => (
                        <button
                          key={k}
                          onClick={() => {
                            setSearch({ ...search, bhk: k });
                            setOpenField(null);
                          }}
                          className={`w-full text-left px-3 py-2.5 text-[15px] font-medium rounded-xl transition-colors cursor-pointer ${
                            search.bhk === k ? "bg-[#0A0A0A] text-white" : "hover:bg-[#FAF7F1] text-[#0A0A0A]"
                          }`}
                        >
                          {k === "Any" ? "Any BHK" : `${k} BHK`}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              {/* Search */}
              <div className="flex items-center pl-2">
                <Link
                  href={searchHref}
                  className="flex items-center gap-2 bg-[#D31E28] hover:bg-[#B8171F] text-white text-[17px] font-semibold px-9 py-[19px] rounded-lg transition-colors"
                >
                  <Search size={16} strokeWidth={2.5} /> Search
                </Link>
              </div>
            </div>
          </div>
        </div>
        </div>
        </div>
      </div>

      {/* ── Mobile hero ── */}
      <div className="lg:hidden">
        <div className="relative h-[400px] overflow-hidden bg-[#efeae1]">
          {HERO_SLIDES.map((s, i) => (
            <div
              key={s.src}
              className="absolute inset-0 transition-opacity duration-1000 ease-in-out"
              style={{ opacity: slide === i ? 1 : 0 }}
            >
              <img src={s.src} alt={s.alt} className="w-full h-full object-cover" />
            </div>
          ))}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.85) 26%, rgba(255,255,255,0) 60%)",
            }}
          />
          <div className="absolute left-0 right-0 top-0 px-5 pt-7 text-center pointer-events-none">
            <div className="text-xs font-semibold tracking-[0.22em] text-[#8A6D2F]">
              HYDERABAD&apos;S TRUSTED ADVISORY
            </div>
            <h1 className="font-display font-semibold text-[34px] leading-[1.2] text-[#0A0A0A] mt-3 text-balance">
              Buy your dream home with complete confidence.
            </h1>
          </div>
          <div className="absolute left-0 right-0 bottom-3.5 flex justify-center gap-2.5">
            {HERO_SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => go(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="w-3 h-3 rounded-full cursor-pointer shadow-[0_1px_4px_rgba(0,0,0,0.3)] transition-colors"
                style={{ background: slide === i ? "#D31E28" : "rgba(255,255,255,0.85)" }}
              />
            ))}
          </div>
        </div>

        {/* Mobile CTAs */}
        <div className="px-4 pt-4">
          <p className="text-base leading-relaxed text-[#44403a] text-center">
            RERA-verified · 47-point audited · 100% legal-clear · ₹0 brokerage
          </p>
          <Link
            href="/properties"
            className="flex items-center justify-center gap-2 bg-[#0A0A0A] active:bg-[#D31E28] text-white text-[17px] font-semibold py-[18px] rounded-[10px] mt-4 transition-colors"
          >
            <Search size={16} strokeWidth={2.5} /> Search all properties
          </Link>
          <p className="text-[13.5px] text-[#6b6659] text-center mt-2.5">
            No spam · No pressure · Response within 4 hours
          </p>
        </div>

        {/* Mobile mini stats */}
        <div className="grid grid-cols-3 gap-2 px-4 py-4">
          {[
            { v: "1,500+", l: "audited", red: false },
            { v: "130+", l: "families", red: false },
            { v: "₹0", l: "brokerage", red: true },
          ].map((s) => (
            <div key={s.l} className="text-center bg-[#fcfaf6] border border-[#EEE9E0] rounded-xl py-3.5 px-1.5">
              <div className={`text-xl font-semibold ${s.red ? "text-[#D31E28]" : "text-[#0A0A0A]"}`}>{s.v}</div>
              <div className="text-xs text-[#6b6659] mt-1">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATS BAR (desktop)
// ─────────────────────────────────────────────────────────────────────────────
function StatsBar() {
  const stats = [
    { v: "1,500+", l: "Properties scanned & audited", red: false },
    { v: "130+", l: "Families served end-to-end", red: false },
    { v: "98%", l: "Client satisfaction", red: false },
    { v: "₹0", l: "Brokerage · buyer-side only", red: true },
  ];
  return (
    <div className="hidden lg:block border-t border-[#EEE9E0] bg-white">
      <div className={`${CONTAINER} grid grid-cols-4`}>
        {stats.map((s, i) => (
          <div key={s.l} className={`text-center py-7 px-5 ${i < 3 ? "border-r border-[#EEE9E0]" : ""}`}>
            <div className={`text-[32px] leading-none font-semibold ${s.red ? "text-[#D31E28]" : "text-[#0A0A0A]"}`}>
              {s.v}
            </div>
            <div className="text-[15px] leading-normal text-[#6b6659] mt-2">{s.l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// WHY NEXHOUZ
// ─────────────────────────────────────────────────────────────────────────────
function WhySection() {
  const cards = [
    {
      badge: "AI",
      badgeBg: "#faf0f0",
      badgeColor: "#D31E28",
      title: "AI Matchmaking",
      body: "Tell us your needs on the web or our WhatsApp bot — our engine matches you across 1,500+ audited Hyderabad properties in minutes, not weeks.",
    },
    {
      badge: "✓",
      badgeBg: "#faf6ee",
      badgeColor: "#8A6D2F",
      title: "Certified Expert Guidance",
      body: "A dedicated, certified advisor reviews every match and guides every decision. Buyer-side only — no broker pressure, no commissions, no spam.",
    },
    {
      badge: "∞",
      badgeBg: "#f2f4f0",
      badgeColor: "#3d5a3d",
      title: "End-to-End Support",
      body: "Private site visits, negotiation 5–15% below market, legal, loan & registration — through to lifetime post-purchase support.",
    },
  ];
  return (
    <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
      <div className={CONTAINER}>
      <Reveal className="text-center max-w-[760px] mx-auto">
        <Eyebrow>Why NexHouz</Eyebrow>
        <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[48px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
          Not a listing portal. A buying advisory that works only for you.
        </h2>
      </Reveal>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3.5 lg:gap-6 mt-6 lg:mt-[52px]">
        {cards.map((c, i) => (
          <Reveal key={c.title} delay={i * 0.08}>
            <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-9 lg:px-8 h-full">
              <div
                className="w-14 h-14 rounded-[14px] flex items-center justify-center text-[22px] font-bold"
                style={{ background: c.badgeBg, color: c.badgeColor }}
              >
                {c.badge}
              </div>
              <div className="text-[19px] lg:text-[22px] font-semibold text-[#0A0A0A] mt-5 lg:mt-[22px]">{c.title}</div>
              <div className="text-[15px] lg:text-[16.5px] leading-[1.65] text-[#57534a] mt-3">{c.body}</div>
            </div>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// TRUST & VERIFICATION — dark band
// ─────────────────────────────────────────────────────────────────────────────
function TrustBand() {
  const audits = [
    { n: "01", t: "47-Point Builder Audit", d: "Track record, delivery history, litigation, financial health." },
    { n: "02", t: "RERA & GHMC Verified", d: "Registration, approvals and permissions checked at source." },
    { n: "03", t: "100% Legal-Clear Title", d: "Title, encumbrance and link documents vetted by our legal team." },
    { n: "04", t: "Price Intelligence", d: "Real transaction data — we negotiate 5–15% below quoted price." },
  ];
  return (
    <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#0A0A0A]">
      <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-[70px] items-start`}>
        <Reveal>
          <Eyebrow light>Trust &amp; Verification</Eyebrow>
          <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[48px] leading-[1.2] lg:leading-[1.15] text-white mt-3 lg:mt-4 text-balance">
            Verified before you ever see it.
          </h2>
          <p className="text-[16px] lg:text-lg leading-[1.7] text-white/65 mt-4 lg:mt-[18px] max-w-[480px]">
            Most buyers discover legal problems after they&apos;ve fallen in love with a property. We reverse that:
            nothing enters your shortlist until it clears our full audit.
          </p>
          <div className="flex flex-wrap gap-8 lg:gap-10 mt-8 lg:mt-10">
            {[
              { v: "1,500+", l: "properties scanned" },
              { v: "47", l: "audit checkpoints" },
              { v: "100%", l: "legal-clear promise" },
            ].map((s) => (
              <div key={s.l}>
                <div className="text-[26px] lg:text-[30px] leading-none font-semibold text-white">{s.v}</div>
                <div className="text-sm text-white/50 mt-2">{s.l}</div>
              </div>
            ))}
          </div>
        </Reveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-[18px]">
          {audits.map((a, i) => (
            <Reveal key={a.n} delay={i * 0.07}>
              <div className="border border-white/[0.14] rounded-[14px] p-5 lg:p-[26px] lg:px-6 h-full">
                <div className="text-[17px] font-bold text-[#D31E28]">{a.n}</div>
                <div className="text-[17px] lg:text-lg font-semibold leading-[1.35] text-white mt-3">{a.t}</div>
                <div className="text-[14px] lg:text-[15px] leading-[1.6] text-white/55 mt-2">{a.d}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FEATURED PROPERTIES — live data
// ─────────────────────────────────────────────────────────────────────────────
function FeaturedSection({
  properties,
  favorites,
  onToggleFavorite,
  onEnquire,
  isOffline,
  isDebugMode,
  dbError,
}: {
  properties: Property[];
  favorites: string[];
  onToggleFavorite: (id: string, e: React.MouseEvent) => void;
  onEnquire: (p: Property) => void;
  isOffline: boolean;
  isDebugMode: boolean;
  dbError: string | null;
}) {
  const featured = [...properties]
    .sort((a, b) => Number(b.featured) - Number(a.featured))
    .slice(0, 3);

  return (
    <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-white">
      <div className={CONTAINER}>
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-6 lg:mb-10">
        <Reveal>
          <Eyebrow>Featured &amp; Verified</Eyebrow>
          <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[48px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-3.5">
            Homes that cleared the audit.
          </h2>
        </Reveal>
        <Link
          href="/properties"
          className="hidden lg:inline-flex items-center gap-2 text-base font-semibold text-[#0A0A0A] border-[1.5px] border-[#d8d2c6] hover:border-[#0A0A0A] rounded-lg px-6 py-4 transition-colors whitespace-nowrap"
        >
          View all properties <ArrowRight size={15} />
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
        {featured.length === 0 ? (
          <div className="col-span-full border border-[#EEE9E0] rounded-2xl py-14 flex flex-col items-center justify-center gap-4">
            <div className="w-9 h-9 border-4 border-[#D31E28] border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] text-[#948d7c] font-semibold tracking-[0.18em] uppercase">Loading properties…</p>
          </div>
        ) : (
          featured.map((property, idx) => (
            <Reveal key={property.id} delay={idx * 0.08}>
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
                    <ShieldCheck size={11} /> 100% Legal Clear
                  </span>
                  <button
                    onClick={(e) => onToggleFavorite(property.id, e)}
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
                      {formatCr(property.price)}
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
                      <span>{property.possession === "Ready" ? "Ready" : possessionLabel(property)}</span>
                    </div>
                    <button
                      onClick={() => onEnquire(property)}
                      className="w-full bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-full cursor-pointer transition-colors mt-4"
                    >
                      Initiate Safe Inquiry
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          ))
        )}
      </div>

      <Link
        href="/properties"
        className="lg:hidden flex items-center justify-center gap-2 border-[1.5px] border-[#d8d2c6] text-[#0A0A0A] text-base font-semibold py-4 rounded-[10px] mt-4"
      >
        View all properties <ArrowRight size={15} />
      </Link>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MICRO-MARKETS
// ─────────────────────────────────────────────────────────────────────────────
function MicroMarkets() {
  const markets = [
    {
      name: "Kokapet & Financial District",
      meta: "12 verified residences · ₹1.8 – 5 Cr",
      img: "/images/hyderabad_luxury_towers.png",
      href: "/properties?location=Kokapet",
    },
    {
      name: "Tellapur & Narsingi",
      meta: "9 verified residences · ₹1.2 – 2.8 Cr",
      img: "/images/hero_modernist_villa.png",
      href: "/properties?location=Tellapur",
    },
    {
      name: "Jubilee & Banjara Hills",
      meta: "6 verified residences · ₹3 – 15 Cr",
      img: "/images/obsidian_pavilion.png",
      href: "/properties?location=Jubilee Hills",
    },
    {
      name: "Lakeside Enclaves",
      meta: "5 verified residences · ₹1.5 – 4 Cr",
      img: "/images/vanguard_penthouse.png",
      href: "/properties?location=Lakeside",
    },
  ];
  return (
    <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
      <div className={CONTAINER}>
      <Reveal className="text-center max-w-[720px] mx-auto mb-6 lg:mb-10">
        <Eyebrow>Hyderabad Micro-Markets</Eyebrow>
        <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[48px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4">
          We know these streets house by house.
        </h2>
      </Reveal>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-5">
        {markets.map((m, i) => (
          <Reveal key={m.name} delay={i * 0.06}>
            <Link href={m.href} className="block rounded-xl lg:rounded-2xl overflow-hidden bg-white border border-[#EEE9E0] group h-full">
              <div className="hidden md:block h-[170px] overflow-hidden">
                <img
                  src={m.img}
                  alt={m.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-4 lg:p-5 lg:px-[22px]">
                <div className="text-[15px] lg:text-lg font-semibold leading-[1.35] text-[#0A0A0A] group-hover:text-[#D31E28] transition-colors">
                  {m.name}
                </div>
                <div className="text-[13px] lg:text-[14.5px] leading-[1.55] text-[#6b6659] mt-1.5">{m.meta}</div>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BUYING JOURNEY — nine steps
// ─────────────────────────────────────────────────────────────────────────────
function JourneySection() {
  const steps = [
    { t: "Share your needs", d: "Web form or WhatsApp — 5 minutes." },
    { t: "AI match", d: "Shortlist from 1,500+ audited homes." },
    { t: "Expert review", d: "Your advisor pressure-tests every match." },
    { t: "Consultation", d: "Free session — goals, budget, timelines." },
    { t: "Private site visits", d: "Scheduled around you. No sales staff." },
    { t: "Comparison report", d: "Side-by-side data on your finalists." },
    { t: "Negotiation", d: "We close 5–15% below quoted price." },
    { t: "Legal & registration", d: "Loan, documentation, registration — handled." },
    { t: "Lifetime support", d: "Rentals, resale, tax — we stay with you." },
  ];
  return (
    <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-white">
      <div className={CONTAINER}>
      <Reveal className="text-center max-w-[720px] mx-auto mb-6 lg:mb-10">
        <Eyebrow>The NexHouz Journey</Eyebrow>
        <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[48px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4">
          Nine steps. One advisor. Zero stress.
        </h2>
      </Reveal>

      {/* Desktop / tablet: card grid */}
      <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-3 lg:gap-[18px] max-w-[1180px] mx-auto">
        {steps.map((s, i) => {
          const last = i === steps.length - 1;
          return (
            <Reveal key={s.t} delay={(i % 3) * 0.06}>
              <div
                className={`rounded-[14px] p-6 px-[26px] flex gap-[18px] items-start h-full ${
                  last ? "border-[1.5px] border-[#D31E28] bg-[#fdf6f6]" : "border border-[#EEE9E0]"
                }`}
              >
                <span className="text-[15px] font-bold text-[#D31E28] pt-[3px]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>
                  <span className="block text-[17.5px] font-semibold leading-[1.3] text-[#0A0A0A]">{s.t}</span>
                  <span className="block text-[14.5px] leading-[1.55] text-[#6b6659] mt-1.5">{s.d}</span>
                </span>
              </div>
            </Reveal>
          );
        })}
      </div>

      {/* Mobile: numbered list */}
      <div className="md:hidden flex flex-col">
        {steps.map((s, i) => (
          <div
            key={s.t}
            className={`flex gap-4 py-3 ${i < steps.length - 1 ? "border-b border-[#f0ebe1]" : ""}`}
          >
            <span className="text-sm font-bold text-[#D31E28] min-w-6 leading-normal">
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="text-base font-medium leading-normal text-[#0A0A0A]">
              {s.t} — <span className="font-normal text-[#57534a]">{s.d}</span>
            </span>
          </div>
        ))}
      </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SOCIAL PROOF — testimonials + stat tiles
// ─────────────────────────────────────────────────────────────────────────────
function SocialProof() {
  const tiles = [
    { v: "98%", l: "client satisfaction", red: false },
    { v: "−9.2%", l: "avg. below quoted price", red: true },
    { v: "130+", l: "families served", red: false },
    { v: "4 hrs", l: "max response time", red: false },
  ];
  return (
    <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
      <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-8 lg:gap-[60px] items-center`}>
        <Reveal>
          <Eyebrow>Families who trusted us</Eyebrow>
          <blockquote className="font-display italic font-medium text-[22px] md:text-[28px] lg:text-[34px] leading-[1.45] text-[#0A0A0A] mt-4 lg:mt-[22px]">
            &ldquo;NexHouz negotiated ₹22 lakhs below the quoted price and personally handled every document up to
            registration. We never once felt sold to.&rdquo;
          </blockquote>
          <div className="text-[15px] font-semibold text-[#0A0A0A] mt-5 lg:mt-6 tracking-wide">
            RAVI &amp; DEEPTHI KUMAR
          </div>
          <div className="text-sm text-[#6b6659] mt-1.5">3 BHK, Kokapet · relocated from Bengaluru</div>
          <blockquote className="font-display italic font-medium text-[19px] md:text-[24px] lg:text-[28px] leading-[1.5] text-[#2b2823] mt-8 lg:mt-10">
            &ldquo;As an NRI in Dubai, I bought a villa in Tellapur entirely over virtual tours. Their audit report gave
            me more confidence than my own site visit would have.&rdquo;
          </blockquote>
          <div className="text-[15px] font-semibold text-[#0A0A0A] mt-4 lg:mt-5 tracking-wide">
            SANDEEP REDDY · NRI INVESTOR, DUBAI
          </div>
        </Reveal>
        <div className="grid grid-cols-2 gap-3 lg:gap-[18px]">
          {tiles.map((t, i) => (
            <Reveal key={t.l} delay={i * 0.06}>
              <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-[30px] lg:px-[26px] text-center h-full">
                <div className={`text-[26px] lg:text-[34px] leading-none font-semibold ${t.red ? "text-[#D31E28]" : "text-[#0A0A0A]"}`}>
                  {t.v}
                </div>
                <div className="text-[13px] lg:text-[14.5px] leading-normal text-[#6b6659] mt-2">{t.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// NRI DESK
// ─────────────────────────────────────────────────────────────────────────────
function NriDesk() {
  const points = [
    "Live virtual tours of every shortlisted property",
    "Dedicated NRI tax & regulation advisors (FEMA, TDS, repatriation)",
    "Power-of-attorney and remote registration guidance",
    "Post-purchase management — rentals, maintenance, resale",
  ];
  return (
    <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-white">
      <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-[1fr_520px] gap-8 lg:gap-16 items-center`}>
        <Reveal>
          <Eyebrow>NRI Investor Desk</Eyebrow>
          <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[48px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
            Buying from abroad? We&apos;re your eyes on the ground.
          </h2>
          <div className="flex flex-col gap-3 lg:gap-4 mt-5 lg:mt-7">
            {points.map((p) => (
              <div key={p} className="flex gap-3.5 text-[15.5px] lg:text-[17px] leading-[1.6] text-[#44403a]">
                <Check size={18} className="text-[#D31E28] shrink-0 mt-1" strokeWidth={3} />
                {p}
              </div>
            ))}
          </div>
          <button
            onClick={scrollToCallback}
            className="inline-block bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-base lg:text-[17px] font-semibold px-8 py-[17px] lg:py-[19px] rounded-lg mt-6 lg:mt-8 cursor-pointer transition-colors w-full sm:w-auto"
          >
            Schedule a virtual consultation
          </button>
        </Reveal>
        <Reveal delay={0.1} className="hidden lg:block">
          <div className="h-[420px] rounded-[20px] overflow-hidden">
            <img
              src="/images/expert_advisory_visual.png"
              alt="Video call — NexHouz advisor walking a villa"
              className="w-full h-full object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// FINAL CONVERSION — free expert session + callback form
// ─────────────────────────────────────────────────────────────────────────────
function ConversionSection({
  form,
  setForm,
  submitted,
  onSubmit,
}: {
  form: { name: string; phone: string; location: string };
  setForm: (f: { name: string; phone: string; location: string }) => void;
  submitted: boolean;
  onSubmit: (e: React.FormEvent) => void;
}) {
  const locations = ["Kokapet", "Narsingi", "Tellapur", "Jubilee Hills", "Gachibowli", "Anywhere in Hyderabad"];
  const inputClass =
    "w-full border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-base font-normal text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors bg-white";

  return (
    <section id="callback-form-section" className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#0A0A0A] scroll-mt-4">
      <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-[1fr_560px] gap-8 lg:gap-[70px] items-center`}>
        <Reveal>
          <Eyebrow light>Free Expert Session</Eyebrow>
          <h2 className="font-display font-semibold text-[28px] md:text-[42px] lg:text-[52px] leading-[1.2] lg:leading-[1.15] text-white mt-3 lg:mt-4 text-balance">
            Talk to a certified advisor. It costs nothing.
          </h2>
          <p className="text-base lg:text-lg leading-[1.7] text-white/65 mt-4 lg:mt-[18px] max-w-[480px]">
            Tell us what you&apos;re looking for and an advisor will call you back with a verified shortlist — no spam,
            no pressure, no obligation.
          </p>
          <div className="flex flex-wrap gap-4 lg:gap-[30px] mt-6 lg:mt-[30px] text-[15px] font-medium text-white/75">
            <span className="flex items-center gap-2">
              <Check size={14} className="text-[#D31E28]" strokeWidth={3} /> Response within 4 hours
            </span>
            <span className="flex items-center gap-2">
              <Check size={14} className="text-[#D31E28]" strokeWidth={3} /> ₹0 fees, always
            </span>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="bg-white rounded-[18px] p-6 lg:p-[34px] lg:px-8">
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.form
                  key="callback-form"
                  onSubmit={onSubmit}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="text-[20px] lg:text-[22px] font-semibold leading-[1.3] text-[#0A0A0A]">
                    Request a free callback
                  </div>
                  <div className="flex flex-col gap-3.5 mt-5">
                    <input
                      type="text"
                      required
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      placeholder="Your name"
                      className={inputClass}
                    />
                    <input
                      type="tel"
                      required
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Phone / WhatsApp number"
                      className={inputClass}
                    />
                    <div className="relative">
                      <select
                        value={form.location}
                        onChange={(e) => setForm({ ...form, location: e.target.value })}
                        className={`${inputClass} appearance-none cursor-pointer pr-10`}
                      >
                        {locations.map((l) => (
                          <option key={l} value={l}>
                            {l}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        size={16}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#948d7c] pointer-events-none"
                      />
                    </div>
                    <button
                      type="submit"
                      className="bg-[#D31E28] hover:bg-[#B8171F] text-white text-[17px] font-semibold py-[19px] rounded-[10px] cursor-pointer shadow-[0_6px_18px_rgba(211,30,40,0.3)] transition-colors"
                    >
                      Get my free expert callback
                    </button>
                    <p className="text-[13.5px] text-[#948d7c] text-center">
                      No spam. A certified advisor responds within 4 hours.
                    </p>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="callback-success"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-10 text-center"
                >
                  <div className="w-14 h-14 rounded-full bg-[#D31E28] flex items-center justify-center">
                    <Check size={24} className="text-white" strokeWidth={3} />
                  </div>
                  <div className="text-[22px] font-semibold text-[#0A0A0A] mt-4">Callback confirmed</div>
                  <p className="text-[15px] leading-relaxed text-[#57534a] mt-2 max-w-xs">
                    A certified advisor will call you within 4 hours with a verified shortlist.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MOBILE STICKY ACTION BAR
// ─────────────────────────────────────────────────────────────────────────────
function StickyActionBar() {
  return (
    <div className="lg:hidden fixed left-0 right-0 bottom-0 z-40 flex gap-2.5 px-4 py-3.5 border-t border-[#EEE9E0] bg-white shadow-[0_-8px_24px_rgba(30,25,15,0.1)]">
      <a
        href={PHONE_TEL}
        className="flex-1 flex items-center justify-center gap-1.5 bg-white border-[1.5px] border-[#d8d2c6] text-[#0A0A0A] text-base font-semibold py-[15px] rounded-xl"
      >
        <Phone size={15} /> Call
      </a>
      <button
        onClick={scrollToCallback}
        className="flex-[2.2] bg-[#D31E28] active:bg-[#B8171F] text-white text-base font-semibold py-[15px] rounded-xl cursor-pointer shadow-[0_6px_16px_rgba(211,30,40,0.25)]"
      >
        Book Free Expert Session
      </button>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const [isDebugMode, setIsDebugMode] = useState(false);

  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", notes: "" });

  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "", location: "Kokapet" });
  const [isCallbackSubmitted, setIsCallbackSubmitted] = useState(false);

  useEffect(() => {
    const isDev = process.env.NODE_ENV === "development";
    const params = new URLSearchParams(window.location.search);
    if (isDev || params.get("debug") === "true") setIsDebugMode(true);
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
          if (error) setDbError(`Supabase connection failed: ${error.message}`);
        }
      } catch (e: any) {
        setIsOffline(true);
        setLiveProperties(defaultProperties);
        setDbError(`Connection failed: ${e.message}`);
      }
    }
    loadProperties();
  }, []);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites((prev) => {
      const next = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("nexhouz_favorites", JSON.stringify(next));
      return next;
    });
  };

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitLead({
      propertyId: selectedProperty?.id,
      name: inquiryForm.name,
      email: inquiryForm.email,
      phone: inquiryForm.phone,
      notes: inquiryForm.notes,
      leadType: "property_inquiry",
    });
    if (success) {
      setIsInquirySubmitted(true);
      setTimeout(() => {
        setSelectedProperty(null);
        setIsInquirySubmitted(false);
        setInquiryForm({ name: "", email: "", phone: "", notes: "" });
      }, 2500);
    }
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitLead({
      name: callbackForm.name,
      email: "",
      phone: callbackForm.phone,
      notes: `Requested callback from homepage for location: ${callbackForm.location}`,
      leadType: "callback",
    });
    if (success) {
      setIsCallbackSubmitted(true);
      setTimeout(() => {
        setIsCallbackSubmitted(false);
        setCallbackForm({ name: "", phone: "", location: "Kokapet" });
      }, 2500);
    }
  };

  return (
    <div className="font-archivo bg-white">
      {/* Lift the floating chat above the mobile sticky action bar */}
      <style
        dangerouslySetInnerHTML={{
          __html: `@media (max-width: 1023.98px) { .floating-chat-root { bottom: 92px !important; } }`,
        }}
      />

      <Navbar />

      <main>
        <HeroSection />
        <StatsBar />
        <WhySection />
        <TrustBand />
        <FeaturedSection
          properties={liveProperties}
          favorites={favorites}
          onToggleFavorite={toggleFavorite}
          onEnquire={(p) => setSelectedProperty(p)}
          isOffline={isOffline}
          isDebugMode={isDebugMode}
          dbError={dbError}
        />
        <MicroMarkets />
        <JourneySection />
        <SocialProof />
        <NriDesk />
        <ConversionSection
          form={callbackForm}
          setForm={setCallbackForm}
          submitted={isCallbackSubmitted}
          onSubmit={handleCallbackSubmit}
        />
      </main>

      <Footer />
      {/* Clearance for the mobile sticky action bar */}
      <div className="h-20 lg:hidden bg-[#F6F1E7]" />
      <StickyActionBar />

      {/* Inquiry modal */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.55 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedProperty(null)}
              className="absolute inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              transition={{ type: "spring", damping: 30, stiffness: 220 }}
              className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 lg:p-8 z-10 border border-[#EEE9E0] max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-[20px] lg:text-[22px] font-semibold text-[#0A0A0A]">Enquire about this home</h3>
                <button
                  onClick={() => setSelectedProperty(null)}
                  aria-label="Close"
                  className="p-2 hover:bg-[#FAF7F1] rounded-full transition-colors cursor-pointer"
                >
                  <X size={18} />
                </button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-[#FAF7F1] rounded-xl mb-6 border border-[#EEE9E0]">
                <img
                  src={selectedProperty.image}
                  alt={selectedProperty.title}
                  className="w-14 h-14 object-cover rounded-lg shrink-0"
                />
                <div>
                  <p className="text-[15px] font-semibold text-[#0A0A0A]">{selectedProperty.title}</p>
                  <p className="text-[13px] text-[#6b6659]">{selectedProperty.location}</p>
                  <p className="text-[15px] font-bold text-[#D31E28] mt-0.5">{formatCr(selectedProperty.price)}</p>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {!isInquirySubmitted ? (
                  <motion.form
                    key="inquiry-form"
                    onSubmit={handleInquirySubmit}
                    className="space-y-3.5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {[
                      { field: "name", type: "text", placeholder: "Your name" },
                      { field: "email", type: "email", placeholder: "Email address" },
                      { field: "phone", type: "tel", placeholder: "Phone / WhatsApp number" },
                    ].map((f) => (
                      <input
                        key={f.field}
                        type={f.type}
                        required
                        value={(inquiryForm as any)[f.field]}
                        onChange={(e) => setInquiryForm({ ...inquiryForm, [f.field]: e.target.value })}
                        placeholder={f.placeholder}
                        className="w-full border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-base text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors"
                      />
                    ))}
                    <textarea
                      rows={3}
                      value={inquiryForm.notes}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })}
                      placeholder="Share your budget, commute needs, or any specific questions…"
                      className="w-full border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-4 text-base text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors resize-none"
                    />
                    <button
                      type="submit"
                      className="w-full bg-[#D31E28] hover:bg-[#B8171F] text-white text-[17px] font-semibold py-[18px] rounded-[10px] cursor-pointer shadow-[0_6px_18px_rgba(211,30,40,0.3)] transition-colors"
                    >
                      Request advisor callback
                    </button>
                    <div className="flex items-start gap-2 text-[13px] text-[#948d7c] pt-1">
                      <Info size={13} className="shrink-0 mt-0.5" />
                      <span>Completely confidential, private and free. No spam, ever.</span>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div
                    key="inquiry-success"
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="w-14 h-14 rounded-full bg-[#D31E28] flex items-center justify-center mx-auto">
                      <Check size={22} className="text-white" strokeWidth={3} />
                    </div>
                    <div className="text-[22px] font-semibold text-[#0A0A0A] mt-4">Enquiry received</div>
                    <p className="text-[15px] leading-relaxed text-[#57534a] mt-2">
                      A certified advisor will call you within 4 hours with the full audit report for this property.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
