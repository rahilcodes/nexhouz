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
  ChevronRight
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { properties } from "@/data/properties";

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

  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", notes: "" });
  const [callbackForm, setCallbackForm] = useState({ name: "", phone: "", location: "Kokapet" });
  const [isCallbackSubmitted, setIsCallbackSubmitted] = useState(false);
  const [activeAiChatbot, setActiveAiChatbot] = useState<string | null>(null);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "user" | "bot"; text: string }>>([]);
  const [chatInput, setChatInput] = useState("");
  const [isBotTyping, setIsBotTyping] = useState(false);
  const [activeComparisonTab, setActiveComparisonTab] = useState<"properties" | "advisors">("properties");

  const suggestedDestinations = [
    { name: "Kokapet & Financial District", desc: "High-growth commercial expansion node", icon: Building },
    { name: "Jubilee & Banjara Hills", desc: "Timeless prime premium residential hills", icon: Compass },
    { name: "Narsingi & Tellapur", desc: "Green residential suburbs popular with tech families", icon: MapPin },
    { name: "Gandipet Lake Vista", desc: "Quiet lakeside villa enclaves with clean air", icon: Building }
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

  const handleStartAiChat = (botName: string) => {
    setActiveAiChatbot(botName);
    setChatMessages([{ sender: "bot", text: `Hi! I'm your NexHouz ${botName === "NexHouz Genie" ? "Genie 🧞" : "Advisor 🤖"}. How can I help you find your perfect Hyderabad property today?` }]);
  };

  const handleSendChatMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatMessages(prev => [...prev, { sender: "user", text: userMsg }]);
    setChatInput("");
    setIsBotTyping(true);
    setTimeout(() => {
      setChatMessages(prev => [...prev, { sender: "bot", text: "Based on our latest data, I highly recommend Kokapet or Narsingi. Both offer excellent ROI and proximity to Hitec City. Would you like me to show you curated options in your budget?" }]);
      setIsBotTyping(false);
    }, 1000);
  };

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInquirySubmitted(true);
    setTimeout(() => { setSelectedProperty(null); setIsInquirySubmitted(false); setInquiryForm({ name: "", email: "", phone: "", notes: "" }); }, 2500);
  };

  const handleCallbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCallbackSubmitted(true);
    setTimeout(() => { setIsCallbackSubmitted(false); setCallbackForm({ name: "", phone: "", location: "Kokapet" }); }, 2500);
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
        {/* SECTION 1: FULL-BLEED HERO                                   */}
        {/* ============================================================ */}
        <section
          className="relative h-screen overflow-hidden bg-white"
          onClick={() => { setShowLocationPopover(false); setShowTypeDropdown(false); setShowBudgetDropdown(false); setShowBhkDropdown(false); }}
        >
          {/* Right side: Full bleed property image — absolute, covers right 55% */}
          <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[58%] z-0">
            <img
              src="/images/hero_modernist_villa.png"
              alt="Luxury Properties in Hyderabad"
              className="w-full h-full object-cover object-center"
            />
            {/* Left-to-right gradient so left text is always legible */}
            <div className="absolute inset-0 bg-gradient-to-r from-white via-white/75 to-transparent" />
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
                <span className="text-[9px] font-extrabold tracking-[0.18em] uppercase text-brand-red">
                  100% Legal Clear Curation
                </span>
              </motion.div>

              {/* Main headline — clamp keeps it viewport-safe at any screen height */}
              <motion.h1
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.08 }}
                className="font-extrabold text-brand-black leading-[1.03] tracking-tight mb-4"
                style={{ fontSize: "clamp(2rem, 4.2vw + 0.5rem, 3.75rem)" }}
              >
                The World's Best<br />
                Curation of<br />
                <span className="text-brand-red">Hyderabad</span> Properties.
              </motion.h1>

              {/* Subtext */}
              <motion.p
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="text-xs text-brand-black/55 leading-relaxed mb-5 font-medium max-w-[400px]"
              >
                Find your next home with 100% peace of mind. We pre-screen every builder, verify title deeds, and audit GHMC/RERA clearances.
              </motion.p>

              {/* Three trust pillars */}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="grid grid-cols-3 gap-4"
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
                      <h4 className="text-[9px] font-extrabold text-brand-black uppercase tracking-wide leading-tight">
                        {pillar.title}
                      </h4>
                      <p className="text-[9px] text-brand-black/50 leading-snug font-medium">
                        {pillar.desc}
                      </p>
                    </div>
                  );
                })}
              </motion.div>

            </div>
          </div>
        </section>

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
                  { name: "Rent", icon: Building },
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
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Search by Location</label>
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
                        <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 px-2 mb-2">Suggested Hotspots</p>
                        {suggestedDestinations.map((d) => (
                          <button key={d.name} onClick={() => { setHeroSearch({ ...heroSearch, location: d.name }); setShowLocationPopover(false); }} className="w-full text-left px-2 py-2 flex items-center gap-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                            <MapPin size={11} className="text-brand-red shrink-0" />
                            <div>
                              <p className="text-xs font-bold text-brand-black">{d.name}</p>
                              <p className="text-[9px] text-gray-400">{d.desc}</p>
                            </div>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Type */}
                <div className="sm:col-span-2 space-y-1 relative">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Property Type</label>
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
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">Budget Range</label>
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
                  <label className="text-[10px] font-bold uppercase tracking-widest text-brand-black/50">BHK</label>
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
                  Show Top-Curated Villas <ArrowRight size={12} />
                </Link>
              </div>

              {/* Right: Stats */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
                {[
                  { count: "4,800+", label: "Verified Scanned Properties", icon: ShieldCheck, color: "bg-red-50 text-brand-red border-red-100" },
                  { count: "1,300+", label: "Recommended Properties", icon: Star, color: "bg-red-50 text-brand-red border-red-100" }
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
              <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-gray-400">Why NexHouz is Special</p>
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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-red/5 border border-brand-red/15 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-brand-red">
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
                  <img
                    src="/images/robot_advisor_mascot.png"
                    alt="AI Robot Mascot"
                    className="w-28 h-36 object-contain shrink-0 filter brightness-[1.05] contrast-[1.05] mix-blend-multiply group-hover:scale-105 group-hover:-rotate-2 transition-all duration-500"
                  />
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
                        <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400 leading-tight">{item.label}</span>
                      </div>
                    );
                  })}
                </div>

                {/* CTAs */}
                <div className="flex items-center gap-4 pt-2">
                  <button onClick={() => handleStartAiChat("AI Chat")} className="py-2.5 px-5 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-extrabold rounded-lg transition-all cursor-pointer">
                    AI Chat
                  </button>
                  <button onClick={() => handleStartAiChat("NexHouz Genie")} className="text-xs font-bold text-gray-600 hover:text-brand-red flex items-center gap-1 transition-colors cursor-pointer">
                    AI NexHouz Genie <ArrowRight size={11} />
                  </button>
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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-red/5 border border-brand-red/15 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-brand-red">
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
                  <img
                    src="/images/real_estate_advisor_portrait.png"
                    alt="Real Estate Expert"
                    className="w-28 h-36 object-contain shrink-0 filter brightness-[1.05] contrast-[1.05] mix-blend-multiply group-hover:scale-105 transition-all duration-500"
                  />
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
                        <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400 leading-tight">{item.label}</span>
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
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-brand-red/5 border border-brand-red/15 rounded-full text-[9px] font-extrabold uppercase tracking-wider text-brand-red">
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
                    className="w-28 h-36 object-cover rounded-2xl shrink-0 border border-gray-100 group-hover:scale-105 transition-transform duration-500"
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
                        <span className="text-[9px] font-bold uppercase tracking-wide text-gray-400 leading-tight">{item.label}</span>
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
                          <div className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-brand-red text-white text-[9px] font-extrabold flex items-center justify-center">{step.num}</div>
                        </div>
                        <h4 className="text-xs font-extrabold text-brand-black leading-tight">{step.title}</h4>
                        <p className="text-[10px] text-gray-500 leading-relaxed font-medium">{step.desc}</p>
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
                <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-brand-red">Curated Collection</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight">Verified Properties Ready for Review.</h2>
              </div>
              <Link href="/properties" className="hidden md:flex items-center gap-2 text-xs font-bold text-brand-black hover:text-brand-red border-b border-brand-black hover:border-brand-red pb-0.5 transition-all">
                Browse All <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {properties.slice(0, 3).map((property, idx) => (
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
                    <div className="absolute top-3 left-3 bg-emerald-500 text-white text-[9px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-full flex items-center gap-1">
                      <ShieldCheck size={9} /> 100% Legal Clear
                    </div>
                    <button onClick={(e) => toggleFavorite(property.id, e)} className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-transform shadow-sm">
                      <Heart size={13} className={favorites.includes(property.id) ? "fill-brand-red text-brand-red" : "text-gray-500"} />
                    </button>
                  </Link>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">{property.location.split(",")[0]}</span>
                      <span className="text-base font-extrabold text-brand-red">₹{(property.price / 10000000).toFixed(1)} Cr</span>
                    </div>
                    <h3 className="text-lg font-extrabold text-brand-black leading-tight group-hover:text-brand-red transition-colors">
                      <Link href={`/properties/${property.slug}`}>{property.title}</Link>
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 font-medium">{property.description}</p>
                    <div className="pt-3 border-t border-gray-100 flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-gray-400">
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
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 7: HYDERABAD LOCATION AUTHORITY                      */}
        {/* ============================================================ */}
        <section className="bg-gray-50/50 py-20 border-y border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-3 mb-12">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-brand-red">Local Authority</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight">Where to invest and live in Hyderabad.</h2>
              <p className="text-sm text-gray-500 font-medium max-w-xl">We track infrastructure, municipal clearances, and developer track records across major growth corridors to help you choose the right location.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { badge: "Tech Growth Center", title: "Kokapet & Financial District", desc: "Hyderabad's core commercial expansion corridor. High-rise luxury residential properties with direct access to the Nehru ORR and high compound valuation trends.", tag: "Growth Corridor Node" },
                { badge: "Family & Schools", title: "Tellapur & Narsingi", desc: "Rapidly developing, leafy residential zones. Highly popular with technology professionals due to proximity to international schools, gated villa communities, and calm streets.", tag: "Emerging Family Hub" },
                { badge: "Timeless Luxury", title: "Jubilee & Banjara Hills", desc: "The classic premium standard in Hyderabad. Extremely quiet, safe, and exclusive residential hills. High-capital value assets with tight inventory cleared through private networks.", tag: "Sovereign Estate Corridor" },
                { badge: "Lakeside Sanctuary", title: "Gandipet Lake Vista", desc: "Peaceful enclaves bordering the lake reserve. Perfect for buyers seeking to escape noise while remaining within a short drive of Hitec City office hubs.", tag: "Eco-Residential Sanctuary" }
              ].map((area) => (
                <motion.div key={area.title} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm flex flex-col justify-between h-72 hover:border-brand-red/20 hover:shadow-md transition-all">
                  <div className="space-y-3">
                    <span className="inline-block text-[9px] font-extrabold uppercase tracking-wider text-brand-red bg-red-50 border border-red-100 px-2.5 py-1 rounded-full">{area.badge}</span>
                    <h3 className="text-lg font-extrabold text-brand-black leading-tight">{area.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{area.desc}</p>
                  </div>
                  <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-300">{area.tag}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* SECTION 8: 5-STEP BUYING PROCESS                            */}
        {/* ============================================================ */}
        <section id="process-section" className="bg-white py-20">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center space-y-3 mb-14">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-brand-red">How We Work</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight">Your journey to the right home, made simple.</h2>
              <p className="text-sm text-gray-500 font-medium max-w-lg mx-auto">No complex paperwork queues, no legacy stress. A clear, guided path to securing your property with confidence.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-5">
              {[
                { step: "01", title: "Tell Us Your Needs", desc: "Share your budget, preferred area, commute parameters, and family requirements in a quick, simple consultation." },
                { step: "02", title: "Get Curated Matches", desc: "Our team filters the entire market and handpicks 3 to 5 verified properties that perfectly fit your exact lifestyle." },
                { step: "03", title: "Private Site Visits", desc: "Tour your shortlists comfortably on your own schedule, guided by an experienced Hyderabad property advisor." },
                { step: "04", title: "Legal & Paperwork Audit", desc: "We clear developer deeds, check RERA timelines, verify GHMC approvals, and secure the legal clearances for your peace of mind." },
                { step: "05", title: "Finalize Confidently", desc: "Get hands-on help with bank loans, escrow clearances, final registration, and the safe handover of your key." }
              ].map((node, idx) => (
                <motion.div key={node.step} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.08 }} className="bg-gray-50 border border-gray-100 rounded-3xl p-6 space-y-3 text-left hover:border-brand-red/20 hover:bg-white transition-all">
                  <span className="text-5xl font-extrabold text-brand-red/15 block leading-none">{node.step}</span>
                  <h3 className="text-sm font-extrabold text-brand-black">{node.title}</h3>
                  <p className="text-[11px] text-gray-500 leading-relaxed font-medium">{node.desc}</p>
                </motion.div>
              ))}
            </div>
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
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-brand-red">Hyderabad Stories</p>
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
                    <p className="text-[9px] uppercase tracking-widest text-gray-400 font-medium">Technology Director in Gachibowli</p>
                  </div>
                </div>
              </motion.div>

              {/* Stats grid */}
              <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.1 }} className="grid grid-cols-2 gap-5">
                {[
                  { number: "4,800+", label: "Verified Properties Scanned", color: "text-brand-red" },
                  { number: "1,300+", label: "Properties Recommended", color: "text-brand-red" },
                  { number: "98%", label: "Client Satisfaction Rate", color: "text-emerald-600" },
                  { number: "5 Years", label: "Hyderabad Market Authority", color: "text-blue-600" }
                ].map((stat) => (
                  <div key={stat.label} className="bg-white border border-gray-100 rounded-3xl p-7 shadow-sm flex flex-col justify-center space-y-2 text-center hover:shadow-md transition-all">
                    <p className={`text-4xl font-extrabold ${stat.color} tracking-tight`}>{stat.number}</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">{stat.label}</p>
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
              <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-brand-red">Global Investor Desk</p>
              <h2 className="text-4xl font-extrabold text-brand-black tracking-tight">NRI Property Services in Hyderabad</h2>
              <p className="text-sm text-gray-500 font-medium max-w-2xl">Specialized real estate services for Non-Resident Indians looking to invest or purchase property in Hyderabad. Simplify property buying with expert guidance and specialized NRI support.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: "Virtual Property Tours", desc: "Live video tours of properties with a dedicated NexHouz advisor to help you explore properties remotely." },
                { title: "Dedicated NRI Advisors", desc: "Specialized consultants who understand the unique needs, tax frameworks, and regulations of NRI investors." },
                { title: "Complete Property Management", desc: "End-to-end management services including tenant search, rental collection, maintenance, and regular updates." }
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
                <p className="text-[11px] font-extrabold uppercase tracking-[0.3em] text-brand-red">Free Expert Callback</p>
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
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Your Full Name</label>
                        <input type="text" required value={callbackForm.name} onChange={(e) => setCallbackForm({ ...callbackForm, name: e.target.value })} placeholder="e.g. Siddharth Reddy" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-red transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Phone Number</label>
                        <input type="tel" required value={callbackForm.phone} onChange={(e) => setCallbackForm({ ...callbackForm, phone: e.target.value })} placeholder="+91 98765 43210" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-red transition-all" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Preferred Location</label>
                        <select value={callbackForm.location} onChange={(e) => setCallbackForm({ ...callbackForm, location: e.target.value })} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-red transition-all cursor-pointer">
                          {["Kokapet", "Narsingi", "Tellapur", "Jubilee Hills", "Gachibowli", "Anywhere in Hyderabad"].map((l) => <option key={l} value={l}>{l}</option>)}
                        </select>
                      </div>
                      <button type="submit" className="w-full py-4 bg-brand-red hover:bg-brand-red/90 text-white font-extrabold uppercase tracking-wider text-sm rounded-xl transition-all shadow-lg shadow-brand-red/20">
                        Request Free Callback
                      </button>
                      <p className="text-[10px] text-gray-400 text-center font-medium">No spam. Zero pressure. Just expert guidance.</p>
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
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{f.label}</label>
                        <input type={f.type} required value={(inquiryForm as any)[f.field]} onChange={(e) => setInquiryForm({ ...inquiryForm, [f.field]: e.target.value })} placeholder={f.placeholder} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-medium rounded-xl focus:outline-none focus:border-brand-red transition-all" />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Your Specific Needs</label>
                      <textarea rows={3} value={inquiryForm.notes} onChange={(e) => setInquiryForm({ ...inquiryForm, notes: e.target.value })} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm font-medium rounded-xl focus:outline-none focus:border-brand-red transition-all resize-none" placeholder="Share your budget, commute needs, or any specific questions…" />
                    </div>
                    <button type="submit" className="w-full py-4 bg-brand-red hover:bg-brand-red/90 text-white font-extrabold uppercase tracking-wider text-sm rounded-xl transition-all">Submit Consultation Request</button>
                    <div className="flex items-start gap-2 text-[10px] text-gray-400 pt-2">
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

      {/* ============================================================ */}
      {/* AI CHAT WINDOW                                                */}
      {/* ============================================================ */}
      <AnimatePresence>
        {activeAiChatbot && (
          <motion.div initial={{ opacity: 0, y: 100, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 100, scale: 0.95 }} className="fixed bottom-6 right-6 w-96 bg-white border border-gray-100 rounded-3xl shadow-2xl overflow-hidden z-50 flex flex-col max-h-[500px]">
            <div className="bg-brand-black text-white p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-red flex items-center justify-center"><Sparkles size={15} className="animate-pulse" /></div>
                <div>
                  <p className="text-sm font-extrabold">{activeAiChatbot}</p>
                  <p className="text-[9px] text-emerald-400 font-extrabold uppercase tracking-wider">● Active 24/7 Smart Matcher</p>
                </div>
              </div>
              <button onClick={() => setActiveAiChatbot(null)} className="p-1.5 hover:bg-white/10 rounded-full transition-colors cursor-pointer"><X size={16} /></button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto space-y-3 min-h-[250px] bg-gray-50">
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${msg.sender === "user" ? "bg-brand-red text-white rounded-tr-sm" : "bg-white border border-gray-100 text-brand-black rounded-tl-sm shadow-sm"}`}>{msg.text}</div>
                </div>
              ))}
              {isBotTyping && (
                <div className="flex justify-start">
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 flex items-center gap-1 shadow-sm">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
            </div>
            <form onSubmit={handleSendChatMessage} className="p-4 border-t border-gray-100 bg-white flex items-center gap-2">
              <input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} placeholder="Ask Genie (e.g. RERA, pricing, Kokapet)…" className="flex-1 bg-gray-50 border border-gray-200 px-4 py-2.5 text-xs rounded-full focus:outline-none focus:border-brand-red font-medium" />
              <button type="submit" className="w-9 h-9 rounded-full bg-brand-red text-white flex items-center justify-center hover:bg-brand-red/90 active:scale-95 transition-all shrink-0 cursor-pointer"><ArrowRight size={13} /></button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
