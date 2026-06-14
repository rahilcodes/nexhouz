"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  ShieldCheck,
  Zap,
  ArrowRight,
  ChevronDown,
  Star,
  Check,
  Info,
  Building,
  Heart,
  User,
  PhoneCall,
  CheckCircle,
  X,
  Compass,
  Sparkles,
  Crown,
  Home,
  Clock,
  Users,
  TrendingUp,
  FileText,
  BadgeCheck,
  Car,
  GraduationCap,
  Phone,
  MessageCircle,
  ChevronRight,
  BrainCircuit,
  CalendarCheck,
  HeartHandshake,
  ScanSearch,
  UserCheck,
  BadgeDollarSign,
  AlertTriangle
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { fetchAllProperties, submitLead } from "@/lib/db";
import { properties as defaultProperties, Property } from "@/data/properties";
import { supabase } from "@/lib/supabaseClient";


// ─────────────────────────────────────────────────────────────────────────────
// HeroSection — upgraded left column + layout wrapper
// ─────────────────────────────────────────────────────────────────────────────
function HeroSection({ onCloseDropdowns }: { onCloseDropdowns: () => void }) {
  const personas = [
    "IT professionals in Gachibowli.",
    "NRI investors in Hyderabad.",
    "first-time homebuyers.",
    "families upgrading in Kokapet.",
    "HNIs seeking luxury villas.",
  ];
  const [personaIdx, setPersonaIdx] = useState(0);
  const [displayedPersona, setDisplayedPersona] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);

  // Typewriter for persona cycling
  useEffect(() => {
    const target = personas[personaIdx];
    let timeout: ReturnType<typeof setTimeout>;
    if (!isDeleting && displayedPersona.length < target.length) {
      timeout = setTimeout(() => setDisplayedPersona(target.slice(0, displayedPersona.length + 1)), 45);
    } else if (!isDeleting && displayedPersona.length === target.length) {
      timeout = setTimeout(() => setIsDeleting(true), 1800);
    } else if (isDeleting && displayedPersona.length > 0) {
      timeout = setTimeout(() => setDisplayedPersona(displayedPersona.slice(0, -1)), 22);
    } else if (isDeleting && displayedPersona.length === 0) {
      setIsDeleting(false);
      setPersonaIdx(i => (i + 1) % personas.length);
    }
    return () => clearTimeout(timeout);
  }, [displayedPersona, isDeleting, personaIdx]);

  // Trigger stats counter when section mounts
  useEffect(() => {
    const t = setTimeout(() => setStatsVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  const stats = [
    { value: "1,500+", label: "Properties Scanned" },
    { value: "130+", label: "Families Served" },
    { value: "98%", label: "Satisfaction Rate" },
  ];

  const mobileTrustCards = [
    { icon: BrainCircuit, label: "AI Matched" },
    { icon: ShieldCheck, label: "RERA Verified" },
    { icon: UserCheck, label: "Expert Reviewed" },
    { icon: CheckCircle, label: "Visit Booked" },
  ];

  return (
    <section
      className="relative h-screen overflow-hidden"
      onClick={onCloseDropdowns}
      style={{ background: "#ffffff" }}
    >
      {/* Dynamic styles to ensure visual perfection on smaller heights/100% zoom */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-height: 820px) {
          .hero-title {
            font-size: clamp(1.8rem, 3.5vw + 0.5rem, 3rem) !important;
            margin-bottom: 0.75rem !important;
          }
          .hero-sub {
            margin-bottom: 0.5rem !important;
          }
          .hero-stats {
            margin-bottom: 1rem !important;
          }
          .hero-pillars {
            gap: 0.75rem !important;
          }
          .hero-pillar-desc {
            display: none !important;
          }
        }
        @media (max-height: 700px) {
          .hero-title {
            font-size: clamp(1.5rem, 3vw + 0.5rem, 2.5rem) !important;
            margin-bottom: 0.5rem !important;
          }
          .hero-stats {
            margin-bottom: 0.75rem !important;
          }
        }
      `}} />

      {/* Animated soft gradient background — left side breathing glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        animate={{
          background: [
            "radial-gradient(ellipse 70% 60% at 15% 50%, rgba(201,23,30,0.04) 0%, transparent 70%)",
            "radial-gradient(ellipse 70% 60% at 20% 45%, rgba(201,23,30,0.07) 0%, transparent 70%)",
            "radial-gradient(ellipse 70% 60% at 15% 55%, rgba(201,23,30,0.04) 0%, transparent 70%)",
          ],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Right side: Animated panel */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] z-0">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(150deg, #f3f3f6 0%, #eaeaee 100%)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/10 lg:to-transparent" />
        <div
          className="relative z-10 w-full h-full hidden lg:flex items-center justify-center"
          style={{ paddingLeft: "8%", paddingRight: "4%" }}
        >
          <HeroLivePanel />
        </div>
      </div>

      {/* Left side: Content */}
      <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 lg:px-10 flex flex-col justify-center pt-16">
        <div className="max-w-[520px]">

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/5 border border-brand-red/20 rounded-full mb-4"
          >
            <Home size={10} className="text-brand-red" />
            <span className="text-xs font-extrabold tracking-[0.18em] uppercase text-brand-red">
              100% Legal Clear Curation
            </span>
          </motion.div>

          {/* Headline with animated Hyderabad underline */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.08 }}
            className="hero-title font-extrabold text-brand-black leading-[1.03] tracking-tight mb-4"
            style={{ fontSize: "clamp(2rem, 4.2vw + 0.5rem, 3.75rem)" }}
          >
            Discover<br />
            <span className="relative inline-block text-brand-red">
              Hyderabad&apos;s
              {/* Animated underline draws from left to right */}
              <motion.span
                className="absolute left-0 bottom-0 h-[3px] bg-brand-red rounded-full"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              />
            </span><br />
            Premium Properties.
          </motion.h1>

          {/* Typewriter subheadline cycling through personas */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.16 }}
            className="hero-sub mb-2"
          >
            <p className="text-xs text-brand-black/55 leading-relaxed font-medium max-w-[400px]">
              Find your next home with 100% peace of mind — perfect for{" "}
              <span className="text-brand-black font-bold">
                {displayedPersona}
                <motion.span
                  className="inline-block align-middle ml-px"
                  style={{ width: 2, height: 12, background: "#C9171E", borderRadius: 1 }}
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                />
              </span>
            </p>
          </motion.div>

          {/* Live stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.22 }}
            className="hero-stats flex items-center gap-5 mb-5"
          >
            {stats.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2">
                {i > 0 && <div className="w-px h-6 bg-gray-200" />}
                <div>
                  <motion.p
                    className="text-sm font-extrabold text-brand-black leading-none"
                    initial={{ opacity: 0 }}
                    animate={statsVisible ? { opacity: 1 } : {}}
                    transition={{ delay: 0.3 + i * 0.1 }}
                  >
                    {s.value}
                  </motion.p>
                  <p className="text-xs text-brand-black/40 font-semibold uppercase tracking-wider leading-tight mt-0.5">
                    {s.label}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Three trust pillars */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.28 }}
            className="hero-pillars grid grid-cols-3 gap-4"
          >
            {[
              { icon: FileText, title: "Builder Pre-Audited", desc: "RERA & GHMC verified every listing." },
              { icon: ShieldCheck, title: "Zero Broker Pressure", desc: "No commission, no spam, no push." },
              { icon: Car, title: "Commute-Optimised", desc: "Mapped to your Hitec City hub." }
            ].map((pillar) => {
              const Icon = pillar.icon;
              return (
                <div key={pillar.title} className="space-y-1">
                  <div className="w-7 h-7 rounded-lg bg-brand-red/5 flex items-center justify-center text-brand-red">
                    <Icon size={12} className="stroke-[2]" />
                  </div>
                  <h4 className="text-xs font-extrabold text-brand-black uppercase tracking-wide leading-tight">
                    {pillar.title}
                  </h4>
                  <p className="hero-pillar-desc text-xs text-brand-black/50 leading-snug font-medium">
                    {pillar.desc}
                  </p>
                </div>
              );
            })}
          </motion.div>

          {/* Mobile-only horizontal trust-card strip */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.36 }}
            className="flex lg:hidden items-center gap-3 mt-6 overflow-x-auto pb-1 -mx-1 px-1"
            style={{ scrollbarWidth: "none" }}
          >
            {mobileTrustCards.map((card, i) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.label}
                  className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-100 bg-gray-50"
                >
                  <div className="w-5 h-5 rounded-lg bg-brand-red/8 flex items-center justify-center">
                    <Icon size={10} className="text-brand-red" strokeWidth={2} />
                  </div>
                  <span className="text-xs font-extrabold text-brand-black uppercase tracking-wide whitespace-nowrap">
                    {card.label}
                  </span>
                  {i < mobileTrustCards.length - 1 && (
                    <ArrowRight size={8} className="text-brand-red ml-1" />
                  )}
                </div>
              );
            })}
          </motion.div>

        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// HeroLivePanel — self-running 4-stage animated process dashboard (v2)

// ─────────────────────────────────────────────────────────────────────────────
function HeroLivePanel() {
  const [stage, setStage] = useState(0);
  const [visibleRows, setVisibleRows] = useState<number[]>([]);
  const [typedText, setTypedText] = useState("");
  const [mapPins, setMapPins] = useState<number[]>([]);

  const STAGE_DURATION = 4600;

  useEffect(() => {
    const t = setInterval(() => setStage(s => (s + 1) % 4), STAGE_DURATION);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setVisibleRows([]);
    setTypedText("");
    setMapPins([]);

    if (stage === 0) {
      // Stagger scan rows
      [0, 1, 2, 3, 4].forEach(i =>
        setTimeout(() => setVisibleRows(p => [...p, i]), 180 + i * 430)
      );
      // Drop map pins with slight delay
      [0, 1, 2].forEach(i =>
        setTimeout(() => setMapPins(p => [...p, i]), 600 + i * 550)
      );
    }

    if (stage === 2) {
      const msg =
        "I've reviewed your shortlist. Kokapet Summit Villa is 14% below current market — that's a strong buy. I'd recommend moving fast.";
      let i = 0;
      const t = setInterval(() => {
        i++;
        setTypedText(msg.slice(0, i));
        if (i >= msg.length) clearInterval(t);
      }, 24);
      return () => clearInterval(t);
    }
  }, [stage]);

  const scanProperties = [
    { name: "Kokapet Summit Villa", loc: "Kokapet", pass: true },
    { name: "Jubilee Heights Tower A", loc: "Jubilee Hills", pass: true },
    { name: "Legacy Realty Phase 2", loc: "Bandlaguda", pass: false },
    { name: "Narsingi Green Villas", loc: "Narsingi", pass: true },
    { name: "HiTech Signature Apt.", loc: "Gachibowli", pass: true },
  ];

  // Map pin positions [top%, left%]
  const pinPositions = [
    { top: "38%", left: "48%", label: "Kokapet" },
    { top: "28%", left: "35%", label: "Jubilee" },
    { top: "55%", left: "58%", label: "Narsingi" },
  ];

  const matchedProps = [
    { name: "Kokapet Summit Villa", price: "₹2.4Cr", bhk: "3 BHK", score: 97, area: "2,150 sqft", best: true },
    { name: "Narsingi Green Villas", price: "₹1.85Cr", bhk: "3 BHK", score: 91, area: "1,920 sqft", best: false },
    { name: "Jubilee Heights", price: "₹3.1Cr", bhk: "4 BHK", score: 88, area: "2,800 sqft", best: false },
  ];

  const stageMeta = [
    { label: "AI Scan", hint: "Scanning" },
    { label: "Matches", hint: "Matched" },
    { label: "Expert", hint: "Reviewed" },
    { label: "Booked", hint: "Confirmed" },
  ];

  // Social proof avatars (coloured initials)
  const avatarColors = ["#C9171E", "#2563eb", "#16a34a", "#d97706"];
  const avatarInitials = ["SR", "PK", "AM", "VR"];

  return (
    <motion.div
      className="relative w-full max-w-[420px]"
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      style={{
        transformOrigin: "center center",
        transform: "scale(clamp(0.8, calc((100vh - 80px) / 440px), 1))",
      }}
    >
      {/* Ambient glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          inset: "-30px",
          borderRadius: "3rem",
          background: "radial-gradient(ellipse at center, rgba(201,23,30,0.2) 0%, transparent 68%)",
        }}
      />

      {/* Floating trust badge — top right */}
      <motion.div
        className="absolute -top-3 -right-3 z-20 flex items-center gap-2 px-2.5 py-1.5 rounded-xl"
        initial={{ opacity: 0, scale: 0.8, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5, type: "spring" }}
        style={{
          background: "rgba(255,255,255,0.96)",
          border: "1px solid rgba(0,0,0,0.06)",
          boxShadow: "0 6px 24px rgba(0,0,0,0.1)",
        }}
      >
        {/* Overlapping avatars */}
        <div className="flex -space-x-1.5">
          {avatarInitials.map((init, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full flex items-center justify-center text-[6px] font-extrabold text-white border-2 border-white"
              style={{ background: avatarColors[i] }}
            >
              {init}
            </div>
          ))}
        </div>
        <div>
          <p className="text-xs font-extrabold text-gray-800 leading-tight">130+ families</p>
          <p className="text-xs text-gray-400 font-medium leading-tight">trust NexHouz</p>
        </div>
      </motion.div>

      {/* Floating live visits pill — bottom left */}
      <motion.div
        className="absolute -bottom-2.5 -left-2.5 z-20 flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.1, duration: 0.5 }}
        style={{
          background: "rgba(8,8,12,0.96)",
          border: "1px solid rgba(201,23,30,0.3)",
          boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
        }}
      >
        <motion.div
          className="w-1.5 h-1.5 rounded-full bg-brand-red"
          animate={{ opacity: [1, 0.2, 1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
        />
        <span className="text-xs font-extrabold text-white/70 uppercase tracking-widest">156 visits this week</span>
      </motion.div>

      {/* Glass card */}
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: "1.5rem",
          background: "rgba(8,8,12,0.97)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow:
            "0 32px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(255,255,255,0.07)",
        }}
      >
        {/* Top bar */}
        <div
          className="flex items-center justify-between px-4 py-2"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          <div className="flex items-center gap-1.5">
            <motion.div
              className="w-1.5 h-1.5 rounded-full bg-brand-red"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.4, repeat: Infinity }}
            />
            <span className="text-xs font-extrabold uppercase tracking-[0.2em] text-white/45">
              NexHouz Process · Buy Real Estate Smartly
            </span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 rounded-full" style={{ background: "#ff5f57" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#febc2e" }} />
            <div className="w-2 h-2 rounded-full" style={{ background: "#28c840" }} />
          </div>
        </div>

        {/* Stage content */}
        <div className="px-4 pt-4 pb-2" style={{ minHeight: 280 }}>
          <AnimatePresence mode="wait">

            {/* ── STAGE 0: AI SCAN (with map background pins) ── */}
            {stage === 0 && (
              <motion.div
                key="scan"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                {/* Mini map with animated pins */}
                <div
                  className="relative w-full h-12 rounded-lg mb-2 overflow-hidden"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(201,23,30,0.04) 0%, rgba(37,99,235,0.04) 100%)",
                    border: "1px solid rgba(255,255,255,0.05)",
                  }}
                >
                  {/* Grid lines mimicking a map */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                      backgroundSize: "20px 20px",
                    }}
                  />
                  <span
                    className="absolute top-1 left-2 text-xs font-bold uppercase tracking-widest"
                    style={{ color: "rgba(255,255,255,0.2)" }}
                  >
                    Hyderabad · Live Scan
                  </span>
                  {/* Animated map pins */}
                  {pinPositions.map((pin, i) => (
                    <AnimatePresence key={i}>
                      {mapPins.includes(i) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0, y: -8 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ type: "spring", stiffness: 300, damping: 18 }}
                          className="absolute flex flex-col items-center"
                          style={{ top: pin.top, left: pin.left }}
                        >
                          <MapPin size={11} className="text-brand-red" fill="rgba(201,23,30,0.4)" />
                          <span
                            className="text-[5.5px] font-bold mt-0.5 px-0.5 rounded"
                            style={{
                              background: "rgba(201,23,30,0.2)",
                              color: "rgba(201,23,30,0.9)",
                            }}
                          >
                            {pin.label}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  ))}
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(201,23,30,0.14)" }}
                  >
                    <motion.div
                      className="w-1 h-1 rounded-full bg-brand-red"
                      animate={{ opacity: [1, 0.2, 1] }}
                      transition={{ duration: 0.9, repeat: Infinity }}
                    />
                    <span className="text-xs font-extrabold text-brand-red uppercase tracking-widest">
                      LIVE · 4,847 Properties
                    </span>
                  </div>
                  <span className="text-xs text-white/25 font-medium">47-point audit…</span>
                </div>

                <div className="space-y-1">
                  {scanProperties.map((p, i) => (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, x: -12 }}
                      animate={visibleRows.includes(i) ? { opacity: 1, x: 0 } : { opacity: 0, x: -12 }}
                      transition={{ duration: 0.28 }}
                      className="flex items-center justify-between px-2.5 py-1.5 rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.03)",
                        border: "1px solid rgba(255,255,255,0.045)",
                      }}
                    >
                      <div>
                        <p className="text-xs font-bold text-white/85 leading-tight">{p.name}</p>
                        <p className="text-xs text-white/28 font-medium">{p.loc}</p>
                      </div>
                      {p.pass ? (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.14)" }}>
                          <Check size={7} className="text-green-400" strokeWidth={3} />
                          <span className="text-[6.5px] font-bold text-green-400">CLEAR</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-full" style={{ background: "rgba(239,68,68,0.14)" }}>
                          <X size={7} className="text-red-400" strokeWidth={3} />
                          <span className="text-[6.5px] font-bold text-red-400">SKIP</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STAGE 1: MATCHES ── */}
            {stage === 1 && (
              <motion.div
                key="matches"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.14)" }}>
                    <CheckCircle size={8} className="text-green-400" />
                    <span className="text-xs font-extrabold text-green-400 uppercase tracking-widest">3 Perfect Matches</span>
                  </div>
                  <span className="text-xs text-white/28 font-semibold">AI Score ↑</span>
                </div>
                <div className="space-y-1.5">
                  {matchedProps.map((p, i) => (
                    <motion.div
                      key={p.name}
                      initial={{ opacity: 0, x: 22 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.36, delay: i * 0.11 }}
                      className="relative px-3 py-2 rounded-xl"
                      style={{
                        background: p.best ? "rgba(201,23,30,0.09)" : "rgba(255,255,255,0.03)",
                        border: p.best ? "1px solid rgba(201,23,30,0.28)" : "1px solid rgba(255,255,255,0.06)",
                      }}
                    >
                      {p.best && (
                        <span
                          className="absolute -top-2 left-2.5 text-xs font-extrabold uppercase tracking-widest px-1.5 py-0.5 rounded-full text-brand-red"
                          style={{ background: "rgba(201,23,30,0.16)" }}
                        >
                          ★ Best Match
                        </span>
                      )}
                      <div className="flex items-start justify-between mt-0.5">
                        <div>
                          <p className="text-xs font-bold text-white/90 leading-tight">{p.name}</p>
                          <p className="text-xs text-white/35 font-medium mt-0.5">{p.bhk} · {p.area}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-extrabold text-white leading-tight">{p.price}</p>
                          <p className="text-xs font-bold" style={{ color: "#4ade80" }}>{p.score}% match</p>
                        </div>
                      </div>
                      <div className="mt-1 flex items-center gap-1">
                        <span className="text-xs font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(22,163,74,0.12)", color: "#4ade80" }}>RERA CLEAR</span>
                        <span className="text-xs font-extrabold px-1.5 py-0.5 rounded-full" style={{ background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.38)" }}>GHMC APPROVED</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* ── STAGE 2: EXPERT REVIEW ── */}
            {stage === 2 && (
              <motion.div
                key="expert"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
              >
                <div className="flex items-center gap-1 px-2 py-0.5 rounded-full mb-2 w-fit" style={{ background: "rgba(37,99,235,0.14)" }}>
                  <div className="w-1 h-1 rounded-full bg-blue-400" />
                  <span className="text-xs font-extrabold text-blue-400 uppercase tracking-widest">Expert Review</span>
                </div>
                <div className="flex items-center gap-2.5 p-2 rounded-xl mb-2" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #C9171E, #7f1d1d)" }}>
                    <User size={14} className="text-white" strokeWidth={1.5} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-extrabold text-white">Priya Sharma</p>
                    <p className="text-xs text-white/38 font-medium">Senior Advisor · 8 yrs Hyderabad</p>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {[...Array(5)].map((_, i) => <Star key={i} size={6} className="fill-brand-red text-brand-red" />)}
                    </div>
                  </div>
                  <span className="text-xs font-extrabold px-1.5 py-0.5 rounded-full flex-shrink-0" style={{ background: "rgba(22,163,74,0.12)", color: "#4ade80" }}>Online</span>
                </div>
                <div className="p-3 rounded-xl rounded-tl-sm" style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="text-xs text-white/78 leading-relaxed font-medium min-h-[2.8rem]">
                    {typedText}
                    <motion.span
                      className="inline-block align-middle ml-0.5"
                      style={{ width: 2, height: 10, background: "#C9171E", borderRadius: 1 }}
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity }}
                    />
                  </p>
                </div>
                <p className="text-xs text-white/22 mt-2 font-semibold">Zero broker pressure · Human-verified · 100% private</p>
              </motion.div>
            )}

            {/* ── STAGE 3: VISIT BOOKED (with social proof) ── */}
            {stage === 3 && (
              <motion.div
                key="booked"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col items-center justify-center text-center py-1"
              >
                <motion.div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-2.5"
                  initial={{ scale: 0, rotate: -15 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 280, damping: 18, delay: 0.15 }}
                  style={{ background: "linear-gradient(135deg, #C9171E, #7f1d1d)", boxShadow: "0 0 24px rgba(201,23,30,0.4)" }}
                >
                  <CheckCircle size={20} className="text-white" strokeWidth={1.5} />
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32 }}>
                  <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-brand-red mb-0">Site Visit Confirmed</p>
                  <p className="text-base font-extrabold text-white mb-2.5">Sat, 7 June · 11:00 AM</p>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.48 }} className="w-full space-y-1 mb-2.5">
                  {[
                    { label: "Property", value: "Kokapet Summit Villa" },
                    { label: "Advisor", value: "Priya Sharma" },
                    { label: "Mode", value: "Private tour · No crowds" },
                  ].map(item => (
                    <div key={item.label} className="flex items-center justify-between px-3 py-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.05)" }}>
                      <span className="text-xs text-white/30 uppercase tracking-widest font-bold">{item.label}</span>
                      <span className="text-xs text-white/75 font-semibold">{item.value}</span>
                    </div>
                  ))}
                </motion.div>

                {/* Social proof: others booked this week */}
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.68 }}
                  className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg"
                  style={{ background: "rgba(22,163,74,0.08)", border: "1px solid rgba(22,163,74,0.15)" }}
                >
                  <div className="flex -space-x-1">
                    {["#C9171E","#2563eb","#d97706"].map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full border border-black/20 flex items-center justify-center text-[5.5px] font-extrabold text-white" style={{ background: c }}>
                        {["SR","PK","AM"][i]}
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-green-400 font-semibold">156 families visited properties this week</p>
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Stage progress dots with labels */}
        <div className="px-4 py-2" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          <div className="flex items-center justify-center gap-2.5 mb-1">
            {stageMeta.map((s, i) => (
              <button
                key={i}
                onClick={() => setStage(i)}
                className="flex flex-col items-center gap-1 cursor-pointer group"
                title={`Jump to: ${s.hint}`}
              >
                <motion.div
                  className="rounded-full"
                  animate={
                    stage === i
                      ? { width: 20, background: "#C9171E" }
                      : { width: 5, background: "rgba(255,255,255,0.16)" }
                  }
                  style={{ height: 4 }}
                  transition={{ duration: 0.35 }}
                />
              </button>
            ))}
          </div>
          <p className="text-center text-xs text-white/22 font-semibold uppercase tracking-widest">
            Click dots to explore · {stageMeta[stage]?.hint}
          </p>
        </div>

        {/* Bottom CTA strip */}
        <Link
          href="/contact"
          className="flex items-center justify-center gap-1.5 px-4 py-2 transition-all"
          style={{
            background: "linear-gradient(90deg, rgba(201,23,30,0.12), rgba(201,23,30,0.06))",
            borderTop: "1px solid rgba(201,23,30,0.18)",
          }}
          onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(90deg, rgba(201,23,30,0.2), rgba(201,23,30,0.1))"; }}
          onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = "linear-gradient(90deg, rgba(201,23,30,0.12), rgba(201,23,30,0.06))"; }}
        >
          <span className="text-xs font-extrabold text-brand-red uppercase tracking-widest">Start your search with NexHouz</span>
          <ArrowRight size={10} className="text-brand-red" />
        </Link>
      </div>
    </motion.div>
  );
}

export default function HomePage() {
  const [heroSearch, setHeroSearch] = useState({
    location: "",
    type: "Select Type",
    priceRange: "₹ 50L - ₹ 5Cr+",
    bhk: "Any"
  });

  const [activeSearchTab, setActiveSearchTab] = useState("Buy");
  const [showLocationPopover, setShowLocationPopover] = useState(false);
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showBudgetDropdown, setShowBudgetDropdown] = useState(false);
  const [showBhkDropdown, setShowBhkDropdown] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);
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

  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "", location: "Kokapet" });
  const [isCallbackSubmitted, setIsCallbackSubmitted] = useState(false);

  const [activeComparisonTab, setActiveComparisonTab] = useState<"properties" | "advisors">("properties");
  const displayProperties = liveProperties;

  const suggestedDestinations = [
    { name: "Kokapet & Financial District", desc: "High-growth commercial expansion node", icon: Building },
    { name: "Jubilee & Banjara Hills", desc: "Timeless prime premium residential hills", icon: Compass },
    { name: "Narsingi & Tellapur", desc: "Green residential suburbs popular with tech families", icon: MapPin },
    { name: "Osman & Himayat Sagar's", desc: "Quiet lakeside villa enclaves with clean air", icon: Building }
  ];

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
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
      leadType: "property_inquiry"
    });
    if (success) {
      setIsInquirySubmitted(true);
      setTimeout(() => { setSelectedProperty(null); setIsInquirySubmitted(false); setInquiryForm({ name: "", email: "", phone: "", notes: "" }); }, 2500);
    }
  };

  const handleCallbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitLead({
      name: callbackForm.name,
      email: "",
      phone: callbackForm.phone,
      notes: `Requested callback from homepage for location: ${callbackForm.location}`,
      leadType: "callback"
    });
    if (success) {
      setIsCallbackSubmitted(true);
      setTimeout(() => { setIsCallbackSubmitted(false); setCallbackForm({ name: "", phone: "", location: "Kokapet" }); }, 2500);
    }
  };

  useEffect(() => {
    const handler = () => {
      setShowLocationPopover(false);
      setShowTypeDropdown(false);
      setShowBudgetDropdown(false);
      setShowBhkDropdown(false);
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-grow bg-white">

        {/* ============================================================ */}
        {/* SECTION 1: FULL-BLEED HERO  (v2 — fully upgraded)            */}
        {/* ============================================================ */}
        <HeroSection
          onCloseDropdowns={() => {
            setShowLocationPopover(false);
            setShowTypeDropdown(false);
            setShowBudgetDropdown(false);
            setShowBhkDropdown(false);
          }}
        />

        {/* ============================================================ */}
        {/* SECTION 2: SEARCH CONSOLE                                    */}
        {/* ============================================================ */}
        <section className="bg-white py-0 relative z-20">
          <div className="max-w-5xl mx-auto px-6 pt-12 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white rounded-3xl shadow-[0_8px_40px_-8px_rgba(0,0,0,0.15)] border border-black/8 p-6"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Tab row */}
              <div className="flex items-center gap-1 border-b border-gray-100 pb-4 mb-5">
                {[
                  { name: "Buy", icon: Home },
                  { name: "Commercial", icon: Building },
                  { name: "New Launch", icon: Sparkles }
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeSearchTab === tab.name;
                  return (
                    <button
                      key={tab.name}
                      onClick={() => setActiveSearchTab(tab.name)}
                      className={`relative flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        isActive ? "text-brand-red" : "text-brand-black/50 hover:text-brand-black"
                      }`}
                    >
                      <Icon size={13} className={isActive ? "text-brand-red" : "text-brand-black/40"} />
                      <span>{tab.name}</span>
                      {isActive && (
                        <motion.div
                          layoutId="searchTabUnderline"
                          className="absolute bottom-[-17px] left-0 right-0 h-[2px] bg-brand-red rounded-full"
                        />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Input row */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                {/* Location */}
                <div className="sm:col-span-4 space-y-1 relative">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-black/50">Search by Location</label>
                  <div className="flex items-center gap-2 border border-gray-200 bg-gray-50/50 px-3 py-2.5 rounded-xl hover:border-gray-300 focus-within:border-brand-red transition-all">
                    <input
                      type="text"
                      placeholder="e.g. Kokapet, Gachibowli"
                      value={heroSearch.location}
                      onChange={(e) => { setHeroSearch({ ...heroSearch, location: e.target.value }); setShowLocationPopover(true); }}
                      onFocus={() => setShowLocationPopover(true)}
                      className="flex-1 bg-transparent text-xs font-semibold text-brand-black placeholder-gray-400 focus:outline-none"
                    />
                    <MapPin size={13} className="text-gray-400 shrink-0 cursor-pointer" onClick={() => setShowLocationPopover(!showLocationPopover)} />
                  </div>
                  <AnimatePresence>
                    {showLocationPopover && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} transition={{ duration: 0.15 }} className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-2xl p-3 z-50">
                        <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 px-2 mb-2">Suggested Hotspots</p>
                        {suggestedDestinations.map((d) => (
                          <button key={d.name} onClick={() => { setHeroSearch({ ...heroSearch, location: d.name }); setShowLocationPopover(false); }} className="w-full text-left px-2 py-2 flex items-center gap-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <MapPin size={11} className="text-brand-red shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-brand-black">{d.name}</p>
                              <p className="text-xs text-gray-400">{d.desc}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Type */}
                <div className="sm:col-span-2 space-y-1 relative">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-black/50">Property Type</label>
                  <button onClick={(e) => { e.stopPropagation(); setShowTypeDropdown(!showTypeDropdown); setShowBudgetDropdown(false); setShowBhkDropdown(false); }} className="w-full flex items-center justify-between border border-gray-200 bg-gray-50/50 px-3 py-2.5 rounded-xl text-xs font-semibold text-brand-black hover:border-gray-300 transition-all cursor-pointer">
                    <span>{heroSearch.type}</span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform ${showTypeDropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showTypeDropdown && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 z-50">
                        {["Select Type", "Villa", "Apartment", "Plot", "Commercial"].map((t) => (
                          <button key={t} onClick={() => { setHeroSearch({ ...heroSearch, type: t }); setShowTypeDropdown(false); }} className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${heroSearch.type === t ? "bg-brand-black text-white" : "hover:bg-gray-50 text-brand-black"}`}>{t}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Budget */}
                <div className="sm:col-span-2 space-y-1 relative">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-black/50">Budget Range</label>
                  <button onClick={(e) => { e.stopPropagation(); setShowBudgetDropdown(!showBudgetDropdown); setShowTypeDropdown(false); setShowBhkDropdown(false); }} className="w-full flex items-center justify-between border border-gray-200 bg-gray-50/50 px-3 py-2.5 rounded-xl text-xs font-semibold text-brand-black hover:border-gray-300 transition-all cursor-pointer">
                    <span>{heroSearch.priceRange}</span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform ${showBudgetDropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showBudgetDropdown && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 z-50">
                        {["₹ 50L - ₹ 5Cr+", "₹ 50L - ₹ 2Cr", "₹ 2Cr - ₹ 5Cr", "₹ 5Cr - ₹ 10Cr", "₹ 10Cr+"].map((b) => (
                          <button key={b} onClick={() => { setHeroSearch({ ...heroSearch, priceRange: b }); setShowBudgetDropdown(false); }} className={`w-full text-left px-3 py-2 text-xs font-semibold rounded-xl transition-colors ${heroSearch.priceRange === b ? "bg-brand-black text-white" : "hover:bg-gray-50 text-brand-black"}`}>{b}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* BHK */}
                <div className="sm:col-span-1 space-y-1 relative">
                  <label className="text-xs font-bold uppercase tracking-widest text-brand-black/50">BHK</label>
                  <button onClick={(e) => { e.stopPropagation(); setShowBhkDropdown(!showBhkDropdown); setShowTypeDropdown(false); setShowBudgetDropdown(false); }} className="w-full flex items-center justify-between border border-gray-200 bg-gray-50/50 px-3 py-2.5 rounded-xl text-xs font-semibold text-brand-black hover:border-gray-300 transition-all cursor-pointer">
                    <span>{heroSearch.bhk}</span>
                    <ChevronDown size={12} className={`text-gray-400 transition-transform ${showBhkDropdown ? "rotate-180" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {showBhkDropdown && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-100 shadow-xl rounded-2xl p-2 z-50 min-w-[80px]">
                        {["Any", "2", "3", "4", "5+"].map((k) => (
                          <button key={k} onClick={() => { setHeroSearch({ ...heroSearch, bhk: k }); setShowBhkDropdown(false); }} className={`w-full text-center py-1.5 text-xs font-semibold rounded-lg transition-colors ${heroSearch.bhk === k ? "bg-brand-black text-white" : "hover:bg-gray-50 text-brand-black"}`}>{k}</button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Search Button */}
                <div className="sm:col-span-3">
                  <Link
                    href={`/properties?location=${encodeURIComponent(heroSearch.location || "Kokapet")}&type=${heroSearch.type}&price=${encodeURIComponent(heroSearch.priceRange)}&bhk=${heroSearch.bhk}`}
                    className="w-full py-3 px-5 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-extrabold uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-brand-red/25 hover:-translate-y-0.5 active:translate-y-0 whitespace-nowrap"
                  >
                    <Search size={14} className="stroke-[2.5]" />
                    <span>Search Properties</span>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 3: SOVEREIGN CURATION STATS                          */}
        {/* ============================================================ */}
        <section className="bg-gray-50/50 py-16 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left */}
              <div className="lg:col-span-4 space-y-4">
                <h2 className="text-3xl md:text-4xl font-extrabold text-brand-black leading-tight">
                  Exceptional Properties<br />in Hyderabad
                </h2>
                <p className="text-brand-red font-extrabold text-sm uppercase tracking-wide">Sovereign Curation</p>
                <p className="text-sm text-gray-500 font-medium">Exceptional Properties Located in Stunning Surroundings.</p>
                <Link href="/properties" className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-red text-brand-red text-xs font-extrabold uppercase tracking-wide rounded-full hover:bg-brand-red hover:text-white transition-all">
                  Show Top-Curated Properties <ArrowRight size={12} />
                </Link>
              </div>

              {/* Right: Stats */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { count: "1,500+", label: "Verified Scanned Properties", icon: ShieldCheck, color: "bg-red-50 text-brand-red border-red-100" },
                  { count: "130+", label: "Families Guided & Served", icon: Star, color: "bg-red-50 text-brand-red border-red-100" }
                ].map((stat) => {
                  const Icon = stat.icon;
                  return (
                    <motion.div
                      key={stat.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5 }}
                      className="bg-white border border-gray-100 rounded-3xl p-8 flex items-center gap-5 shadow-sm hover:shadow-md transition-all group"
                    >
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center border ${stat.color} shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon size={22} className="stroke-[1.5]" />
                      </div>
                      <div>
                        <p className="text-4xl font-extrabold text-brand-black tracking-tight">{stat.count}</p>
                        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide mt-1">{stat.label}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 4: AI & EXPERT ADVISORY ADVANTAGE                    */}
        {/* ============================================================ */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            {/* Header */}
            <div className="text-center mb-14 space-y-3">
              <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-gray-400">Why NexHouz is Special</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight">
                Our <span className="text-brand-red">AI</span> & Expert Advisory Advantage
              </h2>
              <p className="text-sm text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                We combine artificial intelligence and certified real estate specialists to deliver Hyderabad's most transparent, frictionless property buying experience.
              </p>
            </div>

            {/* Three cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

              {/* Card 1: AI Property Match Making */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4 }}
                className="border border-gray-100 rounded-3xl p-7 bg-white shadow-sm hover:shadow-lg hover:border-brand-red/20 transition-all relative overflow-hidden flex flex-col group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-red/5 border border-brand-red/15 rounded-full text-xs font-extrabold uppercase tracking-wider text-brand-red">
                    <Sparkles size={9} /> AI Powered
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 flex-1">
                  <div className="flex-1 pr-4 space-y-3">
                    <h3 className="text-xl font-extrabold text-brand-black leading-tight">AI Property Match Making</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      Experience intelligent property assistance with our AI-powered bots available on both web and WhatsApp. Get instant responses, property recommendations, and expert guidance 24/7 to help you find your right home.
                    </p>
                  </div>
                  <div className="w-28 h-40 rounded-2xl bg-gray-50/80 border border-gray-150 shrink-0 overflow-hidden relative flex items-end justify-center group-hover:border-brand-red/20 transition-all duration-300">
                    <img
                      src="/images/robot_advisor_mascot.png?v=2"
                      alt="AI Robot Mascot"
                      className="w-full h-full object-contain pointer-events-none filter brightness-[1.05] contrast-[1.05] mix-blend-multiply group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex items-center gap-5 py-4 border-t border-gray-100 mt-4">
                  {[{ icon: Zap, label: "Instant Response" }, { icon: Clock, label: "24/7 Available" }, { icon: Sparkles, label: "Smart AI" }].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                          <Icon size={13} className="text-gray-500" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-400 leading-tight">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-4 pt-2">
                  <Link href="/chat?bot=AI Chat" className="py-2.5 px-5 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-extrabold rounded-lg transition-all text-center">
                    AI Chat
                  </Link>
                  <Link href="/chat?bot=NexHouz Genie" className="text-xs font-bold text-gray-600 hover:text-brand-red flex items-center gap-1 transition-colors">
                    AI NexHouz Genie <ArrowRight size={11} />
                  </Link>
                </div>
              </motion.div>

              {/* Card 2: Expert Property Guidance */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="border border-gray-100 rounded-3xl p-7 bg-white shadow-sm hover:shadow-lg hover:border-brand-red/20 transition-all relative overflow-hidden flex flex-col group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-red/5 border border-brand-red/15 rounded-full text-xs font-extrabold uppercase tracking-wider text-brand-red">
                    <Users size={9} /> Human Expertise
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 flex-1">
                  <div className="flex-1 pr-4 space-y-3">
                    <h3 className="text-xl font-extrabold text-brand-black leading-tight">Expert Property Guidance</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      Consult with our certified real estate experts to find the perfect property that matches your needs and budget with personalized advice, expert local market insights, end-to-end buying assistance, and complete post-purchase support.
                    </p>
                  </div>
                  <div className="w-28 h-40 rounded-2xl bg-gray-50/80 border border-gray-150 shrink-0 overflow-hidden relative flex items-end justify-center group-hover:border-brand-red/20 transition-all duration-300">
                    <img
                      src="/images/real_estate_advisor_portrait.png?v=2"
                      alt="Real Estate Expert"
                      className="w-full h-full object-contain pointer-events-none filter brightness-[1.05] contrast-[1.05] mix-blend-multiply group-hover:scale-105 transition-all duration-500"
                    />
                  </div>
                </div>

                {/* Highlights */}
                <div className="flex items-center gap-5 py-4 border-t border-gray-100 mt-4">
                  {[{ icon: BadgeCheck, label: "Free Consultation" }, { icon: ShieldCheck, label: "No Pressure" }].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                          <Icon size={13} className="text-gray-500" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-400 leading-tight">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-4 pt-2">
                  <button
                    onClick={() => { const el = document.getElementById("callback-form-section"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                    className="py-2.5 px-5 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-extrabold rounded-lg transition-all cursor-pointer"
                  >
                    Certified Consultations
                  </button>
                  <button
                    onClick={() => { const el = document.getElementById("callback-form-section"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                    className="text-xs font-bold text-gray-600 hover:text-brand-red flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    Book a free expert session <ArrowRight size={11} />
                  </button>
                </div>
              </motion.div>

              {/* Card 3: End-to-End Process */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="border border-gray-100 rounded-3xl p-7 bg-white shadow-sm hover:shadow-lg hover:border-brand-red/20 transition-all relative overflow-hidden flex flex-col group"
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-red/5 border border-brand-red/15 rounded-full text-xs font-extrabold uppercase tracking-wider text-brand-red">
                    <Compass size={9} /> Full Lifecycle
                  </span>
                </div>

                <div className="flex items-start justify-between gap-4 flex-1">
                  <div className="flex-1 space-y-3">
                    <h3 className="text-xl font-extrabold text-brand-black leading-tight">End-to-End Process Support</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">
                      At NexHouz, we guide you through every step of the property buying journey—from personalized property shortlisting and legal checks to loan assistance, registration, and post-purchase support.
                    </p>
                  </div>
                  <img
                    src="/images/obsidian_pavilion.png"
                    alt="Modern Property"
                    className="w-28 h-40 object-cover rounded-2xl shrink-0 border border-gray-150 group-hover:scale-105 transition-transform duration-500"
                  />
                </div>

                {/* Highlights */}
                <div className="flex items-center gap-5 py-4 border-t border-gray-100 mt-4">
                  {[{ icon: ShieldCheck, label: "Full Support" }, { icon: FileText, label: "Legal Assistance" }, { icon: TrendingUp, label: "Loan Guidance" }].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.label} className="flex flex-col items-center gap-1.5 text-center">
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center">
                          <Icon size={13} className="text-gray-500" />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-wide text-gray-400 leading-tight">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-4 pt-2">
                  <Link href="/contact" className="py-2.5 px-5 border border-brand-red text-brand-red hover:bg-brand-red hover:text-white text-xs font-extrabold rounded-lg transition-all flex items-center gap-1">
                    End-to-End process <ArrowRight size={11} />
                  </Link>
                  <Link href="/contact" className="text-xs font-bold text-gray-600 hover:text-brand-red flex items-center gap-1 transition-colors">
                    Purchase Process
                  </Link>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 5: BUILDER AUDIT + SMARTER SELECTIONS                */}
        {/* ============================================================ */}
        <section className="bg-gray-50/50 py-20 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

              {/* Builder Track Record Card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm relative overflow-hidden flex flex-col justify-between min-h-[340px]"
              >
                <div className="space-y-4 relative z-10 max-w-[55%]">
                  <h3 className="text-2xl font-extrabold text-brand-black leading-tight">Builder Track-Record Auditing</h3>
                  <p className="text-sm font-bold text-brand-black/70">We pre-screen Hyderabad's leading developers so you don't have to.</p>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">We audit developers on past project delivery timelines, structural quality clearances, legal encumbrance claims, and municipal GHMC approvals. You only see listings from partners with verified track records of delivery.</p>
                  <Link href="/about" className="inline-flex items-center gap-2 px-5 py-2.5 border border-brand-red text-brand-red text-xs font-extrabold uppercase tracking-wide rounded-full hover:bg-brand-red hover:text-white transition-all">
                    Learn Our Audit Process <ArrowRight size={11} />
                  </Link>
                </div>
                {/* Background illustration */}
                <div className="absolute right-0 bottom-0 w-[48%] h-full">
                  <img src="/images/obsidian_pavilion.png" alt="Audit" className="w-full h-full object-cover opacity-80 rounded-l-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-r from-white via-white/20 to-transparent rounded-l-3xl" />
                </div>
              </motion.div>

              {/* Smarter Selections */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm"
              >
                <div className="space-y-2 mb-7">
                  <h3 className="text-2xl font-extrabold text-brand-black">Smarter Selections</h3>
                  <p className="text-sm text-gray-500 font-medium">Smart property recommendations based on your needs.</p>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  {[
                    {
                      num: "1",
                      icon: Car,
                      title: "Your Daily Commute",
                      desc: "Matching your location with your daily work hub (Hitec City, Wipro Circle, or Gachibowli) to minimize your hours spent in daily city traffic."
                    },
                    {
                      num: "2",
                      icon: Users,
                      title: "Your Family's Lifestyle",
                      desc: "Filtering for clean local parks, international school districts in Tellapur/Narsingi, reliable water clearance zones, and safe secure complexes."
                    },
                    {
                      num: "3",
                      icon: TrendingUp,
                      title: "Growth Corridor Appreciation",
                      desc: "Highlighting properties positioned in high-infrastructure growth areas to ensure long-term capital safety and appreciation."
                    }
                  ].map((step) => {
                    const Icon = step.icon;
                    return (
                      <div key={step.num} className="text-center space-y-3">
                        <div className="relative inline-block">
                          <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mx-auto border border-gray-100">
                            <Icon size={22} className="text-gray-600" />
                          </div>
                          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-red text-white text-xs font-extrabold flex items-center justify-center">{step.num}</div>
                        </div>
                        <h4 className="text-xs font-extrabold text-brand-black leading-tight">{step.title}</h4>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 6: PROPERTY GRID                                     */}
        {/* ============================================================ */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-end justify-between mb-12">
              <div className="space-y-2">
                <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-brand-red">Curated Collection</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight">Verified Properties Ready for Review.</h2>
              </div>
              <Link href="/properties" className="hidden md:flex items-center gap-2 text-xs font-bold text-brand-black hover:text-brand-red border-b border-brand-black hover:border-brand-red pb-0.5 transition-all">
                Browse All <ArrowRight size={13} />
              </Link>
            </div>

            {isOffline && (
              <div className="col-span-full border border-amber-200 bg-amber-50/50 rounded-3xl py-4 px-6 flex items-center justify-between gap-4 shadow-sm w-full mb-6 text-left animate-fadeIn">
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
                  <div className="text-[10px] text-red-650 font-mono bg-red-50 border border-red-100 p-2 rounded-xl max-w-xs overflow-x-auto truncate">
                    {dbError}
                  </div>
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displayProperties.length === 0 ? (
                <div className="col-span-full border border-gray-200/60 rounded-3xl py-12 px-6 flex flex-col items-center justify-center text-center space-y-4 bg-white shadow-sm w-full">
                  <div className="w-10 h-10 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-gray-500 font-bold tracking-widest uppercase">Loading Estates...</p>
                </div>
              ) : (
                <>
                  {displayProperties.slice(0, 3).map((property, idx) => (
                    <motion.div
                      key={property.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.1 }}
                      className="bg-white border border-gray-100 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-brand-red/15 transition-all group"
                    >
                      <Link href={`/properties/${property.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-gray-100">
                        <img src={property.image} alt={property.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute top-3 left-3 bg-emerald-500 text-white text-xs font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                          <ShieldCheck size={9} /> 100% Legal Clear
                        </div>
                        <button onClick={(e) => toggleFavorite(property.id, e)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                          <Heart size={13} className={favorites.includes(property.id) ? "fill-brand-red text-brand-red" : "text-gray-500"} />
                        </button>
                      </Link>
                      <div className="p-6 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{property.location.split(",")[0]}</span>
                          <span className="text-base font-extrabold text-brand-red">₹{(property.price / 10000000).toFixed(1)} Cr</span>
                        </div>
                        <h3 className="text-lg font-extrabold text-brand-black leading-tight group-hover:text-brand-red transition-colors">
                          <Link href={`/properties/${property.slug}`}>{property.title}</Link>
                        </h3>
                        <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-medium">{property.description}</p>
                        <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold uppercase tracking-widest text-gray-400">
                          <span>{property.bhk} BHK</span>
                          <span className="text-gray-200">|</span>
                          <span>{property.area}</span>
                          <span className="text-gray-200">|</span>
                          <span>{property.possession}</span>
                        </div>
                        <button onClick={() => setSelectedProperty(property)} className="w-full py-3 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all">
                          Initiate Safe Inquiry
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 7: HYDERABAD LOCATION AUTHORITY                      */}
        {/* ============================================================ */}
        <section className="bg-gray-50/50 py-20 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-3 mb-12">
              <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-brand-red">Local Authority</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight">Where to invest and live in Hyderabad.</h2>
              <p className="text-sm text-gray-500 font-medium max-w-xl">We track infrastructure, municipal clearances, and developer track records across major growth corridors to help you choose the right location.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { badge: "Tech Growth Center", title: "Kokapet & Financial District", desc: "Hyderabad's core commercial expansion corridor. High-rise luxury residential properties with direct access to the Nehru ORR and high compound valuation trends.", tag: "Growth Corridor Node" },
                { badge: "Family & Schools", title: "Tellapur & Narsingi", desc: "Rapidly developing, leafy residential zones. Highly popular with technology professionals due to proximity to international schools, gated villa communities, and calm streets.", tag: "Emerging Family Hub" },
                { badge: "Timeless Luxury", title: "Jubilee & Banjara Hills", desc: "The classic premium standard in Hyderabad. Extremely quiet, safe, and exclusive residential hills. High-capital value assets with tight inventory cleared through private networks.", tag: "Sovereign Estate Corridor" },
                { badge: "Lakeside Sanctuary", title: "Osman & Himayat Sagar's", desc: "Peaceful enclaves bordering the lake reserve. Perfect for buyers seeking to escape noise while remaining within a short drive of Hitec City office hubs.", tag: "Eco-Residential Sanctuary" }
              ].map((area) => (
                <motion.div key={area.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm flex flex-col justify-between h-72 hover:border-brand-red/20 hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <span className="inline-block text-xs font-extrabold uppercase tracking-wider text-brand-red bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">{area.badge}</span>
                    <h3 className="text-lg font-extrabold text-brand-black leading-tight">{area.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{area.desc}</p>
                  </div>
                  <p className="text-xs font-extrabold uppercase tracking-widest text-gray-500">{area.tag}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* SECTION 8: ANIMATED JOURNEY FLOW                            */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* ============================================================ */}
        {/* SECTION 8: ANIMATED JOURNEY FLOW (LIGHT THEME)              */}
        {/* ============================================================ */}
        <section id="process-section" className="relative py-28 overflow-hidden bg-gray-50/60 border-y border-gray-100">
          {/* Background radial glow */}
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(201,23,30,0.04) 0%, transparent 70%)" }} />
          <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse 60% 40% at 50% 100%, rgba(201,23,30,0.02) 0%, transparent 60%)" }} />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.4]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.02) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />

          <div className="relative max-w-6xl mx-auto px-6">
            {/* Section header */}
            <motion.div
              className="text-center mb-20"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <div className="inline-flex items-center gap-2 mb-5">
                <div className="w-6 h-px bg-brand-red" />
                <p className="text-xs font-extrabold uppercase tracking-[0.4em] text-brand-red">The NexHouz Journey</p>
                <div className="w-6 h-px bg-brand-red" />
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight leading-tight">
                From your first question<br />
                <span style={{ background: "linear-gradient(90deg, #C9171E, #E53E3E)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>to your future asset.</span>
              </h2>
              <p className="text-sm text-gray-500 font-medium max-w-md mx-auto mt-4 leading-relaxed">
                Nine precision-crafted touchpoints. One seamless experience. Your property, secured with confidence.
              </p>
            </motion.div>

            {/* Journey steps — zigzag layout */}
            <div className="relative">
              {[
                {
                  step: "01",
                  icon: User,
                  title: "You Share Your Needs",
                  desc: "Tell us your budget, preferred location, commute zone, family size and lifestyle requirements. One conversation. No forms, no pressure.",
                  side: "left",
                  tag: "Discovery"
                },
                {
                  step: "02",
                  icon: BrainCircuit,
                  title: "AI + Data-Backed Matching",
                  desc: "Our AI engine scans 1,500+ Hyderabad properties, trained on 2 years of market data, price trends, and neighbourhood intelligence. In minutes, not days.",
                  side: "right",
                  tag: "Intelligence"
                },
                {
                  step: "03",
                  icon: UserCheck,
                  title: "Expert Review & Refinement",
                  desc: "Our veteran Hyderabad advisors personally review every AI-shortlisted match against your profile — filtering out anything that doesn't meet our 47-point audit.",
                  side: "left",
                  tag: "Verification"
                },
                {
                  step: "04",
                  icon: CalendarCheck,
                  title: "Discovery Meeting Scheduled",
                  desc: "A structured 45-minute consultation — virtual or in-person — where we walk you through the curated shortlist, explain pros and cons, and answer every question.",
                  side: "right",
                  tag: "Consultation"
                },
                {
                  step: "05",
                  icon: MapPin,
                  title: "Live Site Visits",
                  desc: "Private, guided tours of your shortlisted properties at your convenience. Our advisor is with you on every visit, pointing out what brochures never show you.",
                  side: "left",
                  tag: "Experience"
                },
                {
                  step: "06",
                  icon: ScanSearch,
                  title: "Educate & Compare Properties",
                  desc: "We place every option side-by-side: construction quality, developer credibility, RERA compliance, appreciation potential, and honest risk flags.",
                  side: "right",
                  tag: "Comparison"
                },
                {
                  step: "07",
                  icon: BadgeDollarSign,
                  title: "Beat the Market Price",
                  desc: "We negotiate directly with developers using live market benchmarks. Our clients consistently secure prices 5–15% below what the market publicly lists.",
                  side: "left",
                  tag: "Negotiation"
                },
                {
                  step: "08",
                  icon: ShieldCheck,
                  title: "Legal, Registration & Full Paperwork",
                  desc: "Every deed, RERA timeline, GHMC clearance, sale agreement, loan documentation, and registration — handled in full. Zero surprises at the table.",
                  side: "right",
                  tag: "Security"
                },
                {
                  step: "09",
                  icon: HeartHandshake,
                  title: "Continued Support & Future Projects",
                  desc: "Our relationship doesn't end at registration. Resale guidance and priority access to future launches — for life.",
                  side: "left",
                  tag: "Partnership"
                }
              ].map((node, idx) => {
                const Icon = node.icon;
                const isLeft = node.side === "left";
                return (
                  <div key={node.step} className="relative">
                    {/* Connector line between steps */}
                    {idx < 8 && (
                      <div className="hidden md:flex justify-center">
                        <motion.div
                          className="w-px bg-gradient-to-b from-brand-red/40 to-brand-red/5"
                          style={{ height: "56px" }}
                          initial={{ scaleY: 0, originY: 0 }}
                          whileInView={{ scaleY: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.3 }}
                        />
                      </div>
                    )}

                    <motion.div
                      className={`flex flex-col md:flex-row items-center gap-6 md:gap-10 ${
                        isLeft ? "md:flex-row" : "md:flex-row-reverse"
                      }`}
                      initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
                    >
                      {/* Card */}
                      <div className={`flex-1 group relative rounded-3xl p-7 border transition-all duration-500 shadow-sm ${
                        isLeft ? "md:text-left" : "md:text-right"
                      }`}
                        style={{
                          background: "#ffffff",
                          borderColor: "#e5e7eb",
                        }}
                        onMouseEnter={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = "rgba(201,23,30,0.02)";
                          (e.currentTarget as HTMLDivElement).style.borderColor = "rgba(201,23,30,0.15)";
                        }}
                        onMouseLeave={(e) => {
                          (e.currentTarget as HTMLDivElement).style.background = "#ffffff";
                          (e.currentTarget as HTMLDivElement).style.borderColor = "#e5e7eb";
                        }}
                      >
                        {/* Tag pill */}
                        <span className={`inline-flex items-center text-xs font-extrabold uppercase tracking-[0.3em] px-2.5 py-1 rounded-full mb-4 ${
                          isLeft ? "" : "md:ml-auto"
                        }`}
                          style={{ background: "rgba(201,23,30,0.08)", color: "#C9171E" }}
                        >
                          {node.tag}
                        </span>
                        <h3 className="text-lg font-extrabold text-brand-black mb-2 leading-snug">{node.title}</h3>
                        <p className="text-sm text-gray-600 leading-relaxed font-medium">{node.desc}</p>
                      </div>

                      {/* Centre icon node */}
                      <div className="relative flex-shrink-0 flex flex-col items-center">
                        {/* Outer pulse ring */}
                        <motion.div
                          className="absolute rounded-full"
                          style={{ width: 80, height: 80, background: "rgba(201,23,30,0.08)", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}
                          animate={{ scale: [1, 1.35, 1], opacity: [0.7, 0, 0.7] }}
                          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: idx * 0.4 }}
                        />
                        {/* Icon circle */}
                        <div
                          className="relative z-10 flex items-center justify-center rounded-2xl"
                          style={{
                            width: 60,
                            height: 60,
                            background: "linear-gradient(135deg, #C9171E, #A6141A)",
                            boxShadow: "0 0 16px rgba(201,23,30,0.25)"
                          }}
                        >
                          <Icon size={24} className="text-white" strokeWidth={1.5} />
                        </div>
                        {/* Step number */}
                        <span className="mt-2 text-xs font-extrabold tracking-widest" style={{ color: "rgba(201,23,30,0.9)" }}>{node.step}</span>
                      </div>

                      {/* Spacer for opposite side */}
                      <div className="flex-1 hidden md:block" />
                    </motion.div>
                  </div>
                );
              })}
            </div>

            {/* Bottom CTA */}
            <motion.div
              className="text-center mt-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest mb-5">Ready to begin?</p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-bold text-sm text-white transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #C9171E, #A6141A)",
                  boxShadow: "0 4px 20px rgba(201,23,30,0.3)"
                }}
              >
                Start Your Journey
                <ArrowRight size={16} />
              </Link>
            </motion.div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 9: TESTIMONIAL + TRUST                               */}
        {/* ============================================================ */}
        <section className="bg-gray-50/50 py-20 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Testimonial card */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm border-l-4 border-l-brand-red flex flex-col justify-between">
                <div className="space-y-5">
                  <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-brand-red">Hyderabad Stories</p>
                  <blockquote className="text-xl italic font-light text-brand-black leading-relaxed">
                    "We were extremely worried about GHMC clearances and legal safety in Kokapet. The NexHouz team personally verified the developer's paperwork, cleared our escrow, and made our transition entirely stress-free."
                  </blockquote>
                </div>
                <div className="pt-6 space-y-3">
                  <div className="flex items-center gap-0.5 text-brand-red">
                    {[...Array(5)].map((_, i) => <Star key={i} size={14} className="fill-brand-red" />)}
                  </div>
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-widest text-brand-black">Srinivas R.</p>
                    <p className="text-xs uppercase tracking-widest text-gray-400 font-medium">Technology Director in Gachibowli</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats grid */}
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-2 gap-5">
                {[
                  { number: "1,500+", label: "Verified Properties Scanned", color: "text-brand-red" },
                  { number: "130+", label: "Families Guided & Served", color: "text-brand-red" },
                  { number: "98%", label: "Client Satisfaction Rate", color: "text-emerald-600" },
                  { number: "2 Years", label: "Hyderabad Market Authority", color: "text-blue-600" }
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm flex flex-col justify-center space-y-2 text-center hover:shadow-md transition-all">
                    <p className={`text-4xl font-extrabold ${stat.color} tracking-tight`}>{stat.number}</p>
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </motion.div>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 10: NRI SERVICES                                     */}
        {/* ============================================================ */}
        <section className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-3 mb-12">
              <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-brand-red">Global Investor Desk</p>
              <h2 className="text-4xl font-extrabold text-brand-black tracking-tight">NRI Property Services in Hyderabad</h2>
              <p className="text-sm text-gray-500 font-medium max-w-2xl">Specialized real estate services for Non-Resident Indians looking to invest or purchase property in Hyderabad. Simplify property buying with expert guidance and specialized NRI support.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: "Virtual Property Tours", desc: "Live video tours of properties with a dedicated NexHouz advisor to help you explore properties remotely." },
                { title: "Dedicated NRI Advisors", desc: "Specialized consultants who understand the unique needs, tax frameworks, and regulations of NRI investors." },
                { title: "Property Guidance & Support", desc: "Formal support and guidance for your property, helping you navigate post-purchase steps and administration." }
              ].map((service) => (
                <motion.div key={service.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-gray-50 border border-gray-100 rounded-3xl p-8 flex flex-col justify-between h-60 hover:border-brand-red/20 hover:bg-white hover:shadow-sm transition-all">
                  <div className="space-y-3">
                    <span className="w-2 h-2 rounded-full bg-brand-red block" />
                    <h3 className="text-lg font-extrabold text-brand-black">{service.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{service.desc}</p>
                  </div>
                  <Link href="/contact" className="inline-flex items-center gap-1 text-xs font-bold text-brand-black hover:text-brand-red transition-colors">
                    Request Details <ArrowRight size={11} />
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 11: CALLBACK CTA                                     */}
        {/* ============================================================ */}
        <section id="callback-form-section" className="bg-brand-black py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-5 text-white">
                <p className="text-sm font-extrabold uppercase tracking-[0.3em] text-brand-red">Free Expert Callback</p>
                <h2 className="text-4xl md:text-5xl font-extrabold leading-tight">Talk to a Hyderabad Property Expert Today.</h2>
                <p className="text-sm text-white/60 leading-relaxed font-medium">No spam, no pressure, no follow-up. A single, expert conversation to help you make the right call for your property search.</p>
                <div className="space-y-4 pt-4">
                  {["100% free, no commitments", "RERA & GHMC verified properties only", "Response within 4 business hours", "Dedicated advisor, not a call center"].map((item) => (
                    <div key={item} className="flex items-center gap-3 text-sm font-medium text-white/80">
                      <CheckCircle size={15} className="text-brand-red shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-2xl">
                <AnimatePresence mode="wait">
                  {!isCallbackSubmitted ? (
                    <motion.form key="form" onSubmit={handleCallbackSubmit} className="space-y-5" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <div>
                        <h3 className="text-xl font-extrabold text-brand-black mb-1">Book Your Free Session</h3>
                        <p className="text-xs text-gray-500 font-medium">Our property advisor will call you within 4 hours.</p>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Full Name</label>
                        <input type="text" required value={callbackForm.name} onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })} placeholder="e.g. Siddharth Reddy" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-red transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                        <input type="tel" required value={callbackForm.phone} onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-red transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Preferred Location</label>
                        <select value={callbackForm.location} onChange={(e) => setCallbackForm({ ...callbackForm, location: e.target.value })} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-red transition-all cursor-pointer">
                          {["Kokapet", "Narsingi", "Tellapur", "Jubilee Hills", "Gachibowli", "Anywhere in Hyderabad"].map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <button type="submit" className="w-full py-4 bg-brand-red hover:bg-brand-red/90 text-white font-extrabold uppercase tracking-wider text-sm rounded-xl transition-all shadow-lg shadow-brand-red/20">
                        Request Free Callback
                      </button>
                      <p className="text-xs text-gray-400 text-center font-medium">No spam. Zero pressure. Just expert guidance.</p>
                    </motion.form>
                  ) : (
                    <motion.div key="success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-10 text-center space-y-4">
                      <div className="w-14 h-14 rounded-full bg-brand-red flex items-center justify-center">
                        <Check size={24} className="text-white" />
                      </div>
                      <h4 className="text-xl font-extrabold text-brand-black">Callback Confirmed!</h4>
                      <p className="text-sm text-gray-500 font-medium max-w-xs">A senior Hyderabad property advisor will call you within 4 hours with curated options.</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />

      {/* ============================================================ */}
      {/* INQUIRY MODAL                                                 */}
      {/* ============================================================ */}
      <AnimatePresence>
        {selectedProperty && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }} onClick={() => setSelectedProperty(null)} className="absolute inset-0 bg-black" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} transition={{ type: "spring", damping: 30, stiffness: 220 }} className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 z-10 border border-gray-100 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-extrabold text-brand-black">Safe Property Inquiry</h3>
                <button onClick={() => setSelectedProperty(null)} className="p-2 hover:bg-gray-100 rounded-full transition-colors cursor-pointer"><X size={18} /></button>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-2xl mb-6 border border-gray-100">
                <img src={selectedProperty.image} alt={selectedProperty.title} className="w-14 h-14 object-cover rounded-xl shrink-0" />
                <div>
                  <p className="text-sm font-extrabold text-brand-black">{selectedProperty.title}</p>
                  <p className="text-xs text-gray-500">{selectedProperty.location}</p>
                  <p className="text-sm font-extrabold text-brand-red mt-0.5">₹{(selectedProperty.price / 10000000).toFixed(1)} Cr</p>
                </div>
              </div>
              <AnimatePresence mode="wait">
                {!isInquirySubmitted ? (
                  <motion.form key="inquiry-form" onSubmit={handleInquirySubmit} className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                    {[{ label: "Full Name", field: "name", type: "text", placeholder: "e.g. Siddharth Reddy" }, { label: "Email Address", field: "email", type: "email", placeholder: "siddharth@email.com" }, { label: "Phone Number", field: "phone", type: "tel", placeholder: "+91 99889 98899" }].map((f) => (
                      <div key={f.field} className="space-y-1">
                        <label className="text-xs font-bold uppercase tracking-wider text-gray-500">{f.label}</label>
                        <input type={f.type} required value={(inquiryForm as any)[f.field]} onChange={(e) => setInquiryForm({ ...inquiryForm, [f.field]: e.target.value })} placeholder={f.placeholder} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-medium rounded-xl focus:outline-none focus:border-brand-red transition-all" />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Your Specific Needs</label>
                      <textarea rows={3} value={inquiryForm.notes} onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-medium rounded-xl focus:outline-none focus:border-brand-red transition-all resize-none" placeholder="Share your budget, commute needs, or any specific questions…" />
                    </div>
                    <button type="submit" className="w-full py-4 bg-brand-red hover:bg-brand-red/90 text-white font-extrabold uppercase tracking-wider text-sm rounded-xl transition-all">Submit Consultation Request</button>
                    <div className="flex items-start gap-2 text-xs text-gray-400 pt-2">
                      <Info size={12} className="shrink-0 mt-0.5" />
                      <span>All consultations are completely confidential, private, and free. No spam guaranteed.</span>
                    </div>
                  </motion.form>
                ) : (
                  <motion.div key="inquiry-success" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                    <div className="w-14 h-14 rounded-full bg-brand-red flex items-center justify-center mx-auto">
                      <Check size={22} className="text-white" />
                    </div>
                    <h4 className="text-xl font-extrabold text-brand-black">Inquiry Verified!</h4>
                    <p className="text-sm text-gray-500 font-medium">A senior Hyderabad property advisor will call you within 4 hours with RERA clearances and structural documents.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


    </>
  );
}
