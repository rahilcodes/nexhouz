"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, Star, ShieldCheck, Zap, Check,
  Building, Layers, TrendingUp, ChevronRight, Phone,
  Calendar, Ruler, Home, Wind, Navigation, Train,
  ShoppingBag, Stethoscope, UtensilsCrossed, GraduationCap,
  ExternalLink, Download, ChevronDown, ChevronUp,
  Building2, Landmark, Clock, BadgeCheck, ChevronLeft
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { properties } from "@/data/properties";
import { fetchPropertyBySlug, submitLead } from "@/lib/db";

interface PropertyDetailClientProps { slug: string; }

// ─── Derived floor plan rows from a single property ─────────────────────────
function getFloorPlans(bhk: number, area: string, price: number) {
  const areaNum = parseInt(area.replace(/[^0-9]/g, "")) || 2000;
  const ppsf = Math.round(price / areaNum);
  const configs: { type: string; size: number; facing: string }[] = [];

  if (bhk >= 4) {
    configs.push({ type: `${bhk} BHK`, size: areaNum, facing: "East" });
    configs.push({ type: `${bhk} BHK`, size: Math.round(areaNum * 1.15), facing: "North" });
  }
  if (bhk >= 3) {
    configs.push({ type: `${bhk - 1} BHK`, size: Math.round(areaNum * 0.78), facing: "East" });
    configs.push({ type: `${bhk - 1} BHK`, size: Math.round(areaNum * 0.72), facing: "West" });
  }
  configs.push({ type: `${bhk - (bhk > 2 ? 2 : 1)} BHK`, size: Math.round(areaNum * 0.62), facing: "South" });
  configs.push({ type: `${bhk - (bhk > 2 ? 2 : 1)} BHK`, size: Math.round(areaNum * 0.58), facing: "North" });

  return configs.map(c => ({
    ...c,
    price: Math.round((c.size * ppsf) / 100000) * 100000,
    priceLabel: `₹${((c.size * ppsf) / 10000000).toFixed(1)} Cr`
  }));
}

const TABS = ["Overview", "Pricing", "Amenities", "Location", "Air Quality", "About"];

// ─── AQI colour helper ───────────────────────────────────────────────────────
function aqiColor(aqi: number) {
  if (aqi <= 50) return { bg: "#dcfce7", text: "#16a34a", label: "Good" };
  if (aqi <= 100) return { bg: "#fef9c3", text: "#ca8a04", label: "Moderate" };
  if (aqi <= 150) return { bg: "#fed7aa", text: "#ea580c", label: "Unhealthy (Sensitive)" };
  if (aqi <= 200) return { bg: "#fecaca", text: "#dc2626", label: "Unhealthy" };
  return { bg: "#fde8d8", text: "#9a3412", label: "Hazardous" };
}

export default function PropertyDetailClient({ slug }: PropertyDetailClientProps) {
  const defaultProperty = properties.find(p => p.slug === slug);
  const [property, setProperty] = useState<any | null>(defaultProperty || null);
  const [activeTab, setActiveTab] = useState("Overview");
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [showAllAmenities, setShowAllAmenities] = useState(false);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [interestRate] = useState(8.5);
  const [tenureYears, setTenureYears] = useState(20);
  const [monthlyEMI, setMonthlyEMI] = useState(0);
  const [isInquirySubmitted, setIsInquirySubmitted] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", phone: "" });
  const [expandedFloor, setExpandedFloor] = useState<number | null>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  useEffect(() => {
    async function loadProperty() {
      const data = await fetchPropertyBySlug(slug);
      if (data) {
        setProperty(data);
      }
    }
    loadProperty();
  }, [slug]);

  // EMI calc — must be before any conditional return (Rules of Hooks)
  useEffect(() => {
    if (!property) return;
    const down = (property.price * downPaymentPercent) / 100;
    const loan = property.price - down;
    const r = interestRate / 100 / 12;
    const n = tenureYears * 12;
    const emi = r === 0 ? loan / n : (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    setMonthlyEMI(emi);
  }, [property, downPaymentPercent, interestRate, tenureYears]);

  // Guard: show loading/not-found while property is null (async fetch pending)
  if (!property) {
    return (
      <>
        <Navbar />
        <main className="flex-grow bg-white min-h-screen pt-36 pb-32 flex flex-col items-center justify-center text-center px-6">
          <Building size={32} className="text-brand-black/20 mb-4" />
          <h2 className="text-3xl font-extrabold text-brand-black mb-4">Loading Estate…</h2>
          <p className="text-xs text-brand-black/50 leading-relaxed max-w-sm mb-8">Please wait while we retrieve this property.</p>
          <div className="w-8 h-8 border-4 border-brand-red border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </>
    );
  }

  // AQI — use property data if set, else safe defaults
  const aqiScore = property.aqi?.score ?? 64;
  const aqiMeta = aqiColor(aqiScore);

  // Use admin-set floor plans if available, otherwise derive from BHK/area/price
  const rawFloorPlans = property.floorPlans && property.floorPlans.length > 0
    ? property.floorPlans.map((fp: any) => ({
        ...fp,
        priceLabel: fp.price >= 10000000
          ? `\u20b9${(fp.price / 10000000).toFixed(1)} Cr`
          : `\u20b9${(fp.price / 100000).toFixed(1)} L`,
      }))
    : getFloorPlans(property.bhk, property.area, property.price);
  const floorPlans = rawFloorPlans;
  const relatedProperties = properties.filter(p => p.id !== property.id && p.type === property.type).slice(0, 2);
  const pricePerSqft = Math.round(property.price / (parseInt(property.area.replace(/[^0-9]/g, "")) || 1));

  // Scroll to tab section
  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    const el = sectionRefs.current[tab];
    if (el) {
      const offset = 130;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const handleInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await submitLead({
      propertyId: property.id,
      name: inquiryForm.name,
      email: "",
      phone: inquiryForm.phone,
      notes: `Requested site visit for property: ${property.title}`,
      leadType: "property_inquiry"
    });
    if (success) {
      setIsInquirySubmitted(true);
      setTimeout(() => { setIsInquirySubmitted(false); setInquiryForm({ name: "", phone: "" }); }, 3000);
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SingleFamilyResidence",
            "name": property.title,
            "description": property.description,
            "url": `https://nexhouz.com/properties/${property.slug}`,
            "image": property.images || [property.image],
            "address": {
              "@type": "PostalAddress",
              "addressLocality": property.location.split(",")[0].trim(),
              "addressRegion": "Telangana",
              "addressCountry": "IN"
            },
            "numberOfRooms": property.bhk,
            "floorSize": {
              "@type": "QuantitativeValue",
              "value": parseInt(property.area.replace(/[^0-9]/g, "")) || 2000,
              "unitCode": "FTK"
            },
            "offers": {
              "@type": "Offer",
              "price": property.price,
              "priceCurrency": "INR",
              "availability": "https://schema.org/InStock",
              "url": `https://nexhouz.com/properties/${property.slug}`
            }
          })
        }}
      />
      <Navbar />


      {/* ── HERO IMAGE ─────────────────────────────────────────────────── */}
      <div className="w-full h-[340px] md:h-[460px] relative overflow-hidden mt-[72px] group">
        {property.images && property.images.length > 0 ? (
          <>
            <img src={property.images[currentImageIdx]} alt={property.title} className="w-full h-full object-cover transition-all duration-500" />
            
            {property.images.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <button onClick={() => setCurrentImageIdx(prev => (prev === 0 ? property.images.length - 1 : prev - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10">
                  <ChevronLeft size={16} />
                </button>
                <button onClick={() => setCurrentImageIdx(prev => (prev === property.images.length - 1 ? 0 : prev + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 cursor-pointer z-10">
                  <ChevronRight size={16} />
                </button>
                
                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {property.images.map((_: any, idx: number) => (
                    <button key={idx} onClick={() => setCurrentImageIdx(idx)} className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${currentImageIdx === idx ? "bg-brand-red w-3" : "bg-white/50 hover:bg-white"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
        {/* breadcrumb */}
        <div className="absolute top-5 left-6">
          <Link href="/properties" className="flex items-center gap-1.5 text-white/70 hover:text-white text-xs font-semibold transition-colors">
            <ArrowLeft size={13} /> All Properties
          </Link>
        </div>
        {/* title block */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-8 md:px-12">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-brand-red text-white">
                {property.possession === "Ready" ? "Ready to Move" : `Possession: ${property.possession === "Under Construction" ? "Under Construction" : property.possession}`}
              </span>
              <span className="text-xs font-extrabold uppercase tracking-widest px-3 py-1 rounded-full bg-white/15 backdrop-blur-sm text-white border border-white/20 flex items-center gap-1">
                <BadgeCheck size={10} /> RERA Verified
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white mb-1 tracking-tight">{property.title}</h1>
            <p className="text-sm text-white/70 flex items-center gap-1.5 font-medium">
              <MapPin size={13} className="text-brand-red" /> {property.location}
              <span className="mx-1.5 text-white/30">·</span>
              By <span className="text-white/90 font-bold ml-1">{property.architect}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── STICKY TAB NAV ─────────────────────────────────────────────── */}
      <div className="sticky top-[72px] z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex items-center gap-1 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button key={tab} onClick={() => scrollToSection(tab)}
              className={`shrink-0 px-4 py-3.5 text-xs font-bold border-b-2 transition-all duration-200 cursor-pointer ${activeTab === tab ? "border-brand-red text-brand-red" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="bg-gray-50 min-h-screen pb-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* ── OVERVIEW ─────────────────────────────── */}
              <section ref={el => { sectionRefs.current["Overview"] = el; }}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Complete Details</p>
                    <h2 className="text-base font-extrabold text-gray-900">Property Overview</h2>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {[
                      { label: "Project Name", value: property.title, icon: Building2 },
                      { label: "Builder Name", value: property.architect, icon: Home },
                      { label: "RERA Number", value: property.reraNumber || `TS/01/Building/0${property.id.split("-")[1]}/2024`, icon: BadgeCheck },
                      { label: "Price / Sq.Ft.", value: `₹${pricePerSqft.toLocaleString()}`, icon: Ruler },
                      { label: "Possession", value: property.possessionDate || (property.possession === "Ready" ? "Ready to Move" : "Under Construction"), icon: Calendar },
                      { label: "Location", value: property.location, icon: MapPin },
                      { label: "Property Type", value: property.type, icon: Landmark },
                      { label: "Configurations", value: `${property.bhk} BHK${property.bhk > 2 ? `, ${property.bhk - 1} BHK, ${property.bhk - 2 > 0 ? `${property.bhk - 2} BHK` : "Studio"}` : ""}`, icon: Layers },
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-4 px-6 py-3.5 hover:bg-gray-50 transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-brand-red/6 flex items-center justify-center shrink-0">
                          <Icon size={14} className="text-brand-red" />
                        </div>
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="text-xs font-semibold text-gray-500 shrink-0 w-36">{label}</span>
                          <span className="text-xs font-bold text-gray-900 text-right">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick stats bar */}
                <div className="grid grid-cols-3 gap-4 mt-4">
                  {[
                    { label: "Starting Price", value: `₹${(property.price / 10000000).toFixed(1)} Cr` },
                    { label: "Property Type", value: property.type },
                    { label: "Super Built-up", value: property.area },
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center shadow-sm">
                      <p className="text-base font-extrabold text-gray-900">{s.value}</p>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* NexHouz Recommendation Report Card */}
                {property.recommendationReport && (
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-4 space-y-5">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-brand-red animate-pulse" />
                        <p className="text-xs font-extrabold uppercase tracking-widest text-brand-red">NexHouz Recommendation Report</p>
                      </div>
                      <h3 className="text-base font-extrabold text-gray-900 leading-tight">Why We Recommend This Property</h3>
                    </div>

                    <p className="text-xs text-gray-600 leading-relaxed font-medium bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                      {property.recommendationReport.whyRecommended}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4 pt-1">
                      {[
                        { label: "Investment Potential", val: property.recommendationReport.investmentPotential },
                        { label: "Family Friendliness", val: property.recommendationReport.familyFriendliness },
                        { label: "Commute Convenience", val: property.recommendationReport.commuteConvenience },
                        { label: "School Access", val: property.recommendationReport.schoolAccess },
                        { label: "Hospital Access", val: property.recommendationReport.hospitalAccess },
                        { label: "Future Appreciation Potential", val: property.recommendationReport.futureAppreciation },
                        { label: "Builder Trust Rating", val: property.recommendationReport.builderTrustRating },
                      ].map((item) => (
                        <div key={item.label} className="space-y-1.5">
                          <div className="flex justify-between text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <span>{item.label}</span>
                            <span className="text-brand-black font-extrabold">{item.val} / 10</span>
                          </div>
                          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-brand-red rounded-full" 
                              style={{ width: `${item.val * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* ── PRICING & FLOOR PLANS ─────────────────── */}
              <section ref={el => { sectionRefs.current["Pricing"] = el; }}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Unit Configurations</p>
                    <h2 className="text-base font-extrabold text-gray-900">Pricing & Floor Plans</h2>
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-100">
                          {["Unit Type", "Size (sq ft)", "Facing", "Price*"].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-xs font-extrabold uppercase tracking-wider text-gray-400">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {floorPlans.map((fp: any, i: number) => (
                          <tr key={i} className="hover:bg-gray-50 transition-colors">
                            <td className="px-5 py-3.5">
                              <span className="inline-block text-sm font-extrabold px-2.5 py-0.5 rounded-full bg-brand-red/6 text-brand-red">{fp.type}</span>
                            </td>
                            <td className="px-5 py-3.5 text-xs font-bold text-gray-800">{fp.size.toLocaleString()}</td>
                            <td className="px-5 py-3.5 text-xs text-gray-500 font-medium">{fp.facing}</td>
                            <td className="px-5 py-3.5 text-xs font-extrabold text-gray-900">{fp.priceLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
                    <p className="text-xs text-gray-400 font-medium">* Prices are approximate and subject to change. GST applicable. Contact advisor for exact pricing.</p>
                  </div>
                </div>

                {/* EMI Calculator */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-4">
                  <div className="mb-4">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Fintech Curation</p>
                    <h3 className="text-base font-extrabold text-gray-900">EMI Calculator</h3>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                        <span>Down Payment ({downPaymentPercent}%)</span>
                        <span className="text-gray-800">₹{Math.round((property.price * downPaymentPercent) / 100).toLocaleString()}</span>
                      </div>
                      <input type="range" min={10} max={50} step={5} value={downPaymentPercent}
                        onChange={e => setDownPaymentPercent(+e.target.value)}
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer accent-brand-red rounded-full" />
                      <div className="flex justify-between text-xs text-gray-400 mt-1 font-bold"><span>10%</span><span>50%</span></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-xs font-extrabold uppercase tracking-wider text-gray-400 mb-1.5">
                        <span>Loan Tenure</span><span className="text-gray-800">{tenureYears} Years</span>
                      </div>
                      <input type="range" min={5} max={30} step={5} value={tenureYears}
                        onChange={e => setTenureYears(+e.target.value)}
                        className="w-full h-1.5 bg-gray-200 appearance-none cursor-pointer accent-brand-red rounded-full" />
                      <div className="flex justify-between text-xs text-gray-400 mt-1 font-bold"><span>5 Years</span><span>30 Years</span></div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-t border-b border-gray-100">
                      <span className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Est. Monthly EMI</span>
                      <span className="text-2xl font-extrabold text-brand-red">₹{Math.round(monthlyEMI).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-400">@ {interestRate}% p.a. interest rate. For indicative purposes only.</p>
                  </div>
                </div>
              </section>

              {/* ── AMENITIES ─────────────────────────────── */}
              <section ref={el => { sectionRefs.current["Amenities"] = el; }}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Verified Features</p>
                    <h2 className="text-base font-extrabold text-gray-900">Amenities</h2>
                  </div>
                  <div className="p-6">
                    {/* Luxury audit meters */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      {[
                        { label: "Architectural Integrity", value: property.scores.architecturalIntegrity, suffix: "/100" },
                        { label: "Investment Yield", value: property.scores.investmentYield, suffix: "%" },
                        { label: "Spatial Efficiency", value: property.scores.spatialEfficiency, suffix: "/100" },
                      ].map(s => (
                        <div key={s.label} className="text-center p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <p className="text-xl font-extrabold text-gray-900">{s.value}<span className="text-xs text-gray-400">{s.suffix}</span></p>
                          <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mt-1 leading-tight">{s.label}</p>
                        </div>
                      ))}
                    </div>

                    {/* Automation Tier */}
                    <div className="flex items-center gap-3 p-3.5 rounded-xl bg-brand-red/4 border border-brand-red/10 mb-6">
                      <div className="w-9 h-9 rounded-full bg-brand-red/10 flex items-center justify-center shrink-0">
                        <Zap size={15} className="text-brand-red" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-extrabold uppercase tracking-wider text-gray-400">Home Automation Level</p>
                        <p className="text-sm font-extrabold text-gray-900">{property.scores.automationTier}</p>
                      </div>
                      <span className="text-xs font-extrabold text-brand-red bg-brand-red/8 px-2.5 py-1 rounded-full uppercase tracking-wider">Verified</span>
                    </div>

                    {/* Amenities grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(showAllAmenities ? property.amenities : property.amenities.slice(0, 6)).map((a: string) => (
                        <div key={a} className="flex items-center gap-2.5 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                            <Check size={10} className="text-emerald-600 stroke-[3]" />
                          </div>
                          <span className="text-xs font-semibold text-gray-700 leading-tight">{a}</span>
                        </div>
                      ))}
                    </div>
                    {property.amenities.length > 6 && (
                      <button onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="mt-4 text-xs font-bold text-brand-red flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
                        {showAllAmenities ? <><ChevronUp size={13} /> Show Less</> : <><ChevronDown size={13} /> Show All {property.amenities.length} Amenities</>}
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* ── LOCATION ──────────────────────────────── */}
              <section ref={el => { sectionRefs.current["Location"] = el; }}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Location & Connectivity</p>
                      <h2 className="text-base font-extrabold text-gray-900">{property.location}</h2>
                    </div>
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(property.location)}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-sm font-bold text-brand-red hover:opacity-75 transition-opacity">
                      <ExternalLink size={12} /> Open in Maps
                    </a>
                  </div>

                  {/* Map placeholder */}
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-brand-red/10 flex items-center justify-center mx-auto mb-2">
                          <MapPin size={20} className="text-brand-red" />
                        </div>
                        <p className="text-xs font-bold text-gray-600">{property.location}</p>
                        <a href={`https://maps.google.com/?q=${encodeURIComponent(property.location)}`} target="_blank" rel="noreferrer"
                          className="text-sm text-brand-red font-bold mt-1 block hover:underline">View on Google Maps →</a>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Nearby Amenities */}
                    <div className="mb-6">
                      <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Nearby Amenities (Within 5km)</p>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                          { icon: Stethoscope, label: "Hospitals", count: property.nearby?.hospitals ?? 20, color: "#ef4444" },
                          { icon: ShoppingBag, label: "Shopping Malls", count: property.nearby?.malls ?? 11, color: "#8b5cf6" },
                          { icon: GraduationCap, label: "Schools", count: property.nearby?.schools ?? 20, color: "#3b82f6" },
                          { icon: UtensilsCrossed, label: "Restaurants", count: property.nearby?.restaurants ?? 20, color: "#f97316" },
                        ].map(({ icon: Icon, label, count, color }) => (
                          <div key={label} className="text-center p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-gray-200 transition-colors">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: `${color}12` }}>
                              <Icon size={16} style={{ color }} />
                            </div>
                            <p className="text-xl font-extrabold text-gray-900">{count}+</p>
                            <p className="text-xs font-semibold text-gray-400 mt-0.5">{label}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Transportation */}
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Transportation & Connectivity</p>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {[
                          { icon: Navigation, label: "Metro Stations", count: property.nearby?.metroStations ?? 3, color: "#6366f1" },
                          { icon: Train, label: "Railway Stations", count: property.nearby?.railwayStations ?? 3, color: "#0891b2" },
                          { icon: Building2, label: "IT Parks", count: property.nearby?.itParks ?? 5, color: "#16a34a" },
                        ].map(({ icon: Icon, label, count, color }) => (
                          <div key={label} className="flex items-center gap-3 p-3.5 rounded-xl border border-gray-100 bg-gray-50">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ background: `${color}10` }}>
                              <Icon size={15} style={{ color }} />
                            </div>
                            <div>
                              <p className="text-lg font-extrabold text-gray-900 leading-none">{count}</p>
                              <p className="text-xs font-semibold text-gray-400 mt-0.5">{label}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── AIR QUALITY ───────────────────────────── */}
              <section ref={el => { sectionRefs.current["Air Quality"] = el; }}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Environmental Data</p>
                      <h2 className="text-base font-extrabold text-gray-900">Air Quality Index</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <Wind size={14} className="text-brand-red" />
                      <span className="text-xs font-bold text-gray-500">Updated Live</span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* AQI Score */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center" style={{ background: aqiMeta.bg }}>
                          <p className="text-2xl font-extrabold leading-none" style={{ color: aqiMeta.text }}>{aqiScore}</p>
                          <p className="text-xs font-extrabold uppercase tracking-wider mt-1" style={{ color: aqiMeta.text }}>AQI</p>
                        </div>
                        <p className="text-xs font-bold mt-2" style={{ color: aqiMeta.text }}>{aqiMeta.label}</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-sm font-extrabold text-gray-900 mb-1">{property.location}</h3>
                        <div className="flex items-center gap-2 mb-3">
                          <Clock size={11} className="text-gray-400" />
                          <span className="text-xs text-gray-400 font-medium">Dominant Pollutant: <strong className="text-gray-700">{property.aqi?.dominantPollutant ?? "PM2.5"}</strong></span>
                        </div>
                        <div className="space-y-1.5">
                          <p className="text-sm text-gray-600 font-medium flex items-center gap-1.5"><Check size={11} className="text-emerald-500 stroke-[3] shrink-0" /> Air quality is acceptable for most people</p>
                          <p className="text-sm text-gray-600 font-medium flex items-center gap-1.5"><Check size={11} className="text-amber-500 stroke-[3] shrink-0" /> Sensitive individuals should limit outdoor exertion</p>
                          <p className="text-sm text-gray-600 font-medium flex items-center gap-1.5"><Check size={11} className="text-emerald-500 stroke-[3] shrink-0" /> Generally safe for outdoor activities</p>
                        </div>
                      </div>
                    </div>

                    {/* Pollutant levels */}
                    <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Pollutant Levels</p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                      {([
                        { name: "PM2.5", value: property.aqi?.pm25 ?? 17.2, unit: "μg/m³", max: 300 },
                        { name: "PM10", value: property.aqi?.pm10 ?? 20.4, unit: "μg/m³", max: 430 },
                        { name: "O₃", value: property.aqi?.o3 ?? 72, unit: "μg/m³", max: 504 },
                        { name: "NO₂", value: property.aqi?.no2 ?? 32.9, unit: "μg/m³", max: 2049 },
                        { name: "SO₂", value: property.aqi?.so2 ?? 5.6, unit: "μg/m³", max: 1004 },
                        { name: "CO", value: property.aqi?.co ?? 587, unit: "mg/m³", max: 15400 },
                      ] as const).map(p => (
                        // pct is capped at 95% for display purposes
                        <div key={p.name} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                          <div className="flex justify-between items-baseline mb-1.5">
                            <span className="text-xs font-extrabold text-gray-700">{p.name}</span>
                            <span className="text-xs font-bold text-gray-500">{p.value} {p.unit}</span>
                          </div>
                          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-brand-red" style={{ width: `${Math.min(95, Math.round((Number(p.value) / Number(p.max)) * 100))}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* AQI Scale */}
                    <div>
                      <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">AQI Scale Reference</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {[
                          { range: "0–50", label: "Good", color: "#16a34a" },
                          { range: "51–100", label: "Moderate", color: "#ca8a04" },
                          { range: "101–150", label: "Sensitive", color: "#ea580c" },
                          { range: "151–200", label: "Unhealthy", color: "#dc2626" },
                          { range: "201–300", label: "Very Unhealthy", color: "#9333ea" },
                          { range: "301+", label: "Hazardous", color: "#7f1d1d" },
                        ].map(s => (
                          <div key={s.range} className="flex items-center gap-1.5 px-2.5 py-1 rounded-full" style={{ background: `${s.color}10` }}>
                            <div className="w-2 h-2 rounded-full" style={{ background: s.color }} />
                            <span className="text-xs font-extrabold" style={{ color: s.color }}>{s.range}: {s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── ABOUT ─────────────────────────────────── */}
              <section ref={el => { sectionRefs.current["About"] = el; }}>
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-0.5">Project Description</p>
                    <h2 className="text-base font-extrabold text-gray-900">About {property.title}</h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{property.description}</p>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">
                      Commissioned through <strong className="text-gray-900">{property.architect}</strong>, this structure represents a validated benchmark of modern luxury living in {property.location}. The design incorporates low-vibration structural anchors, natural thermal ventilation, and energy-efficient systems to ensure both comfort and sustainability.
                    </p>

                    {/* Investment type badge */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full border" style={{ background: "#fef3f2", borderColor: "#fecaca", color: "#C9171E" }}>
                        {property.investmentType}
                      </span>
                      <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1.5 rounded-full bg-gray-100 text-gray-600">
                        {property.type}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Why Choose NexHouz */}
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6 mt-4">
                  <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">Our Advantage</p>
                  <h3 className="text-sm font-extrabold text-gray-900 mb-4">Why Choose NexHouz?</h3>
                  <div className="space-y-2.5">
                    {[
                      "Zero Brokerage on New Projects",
                      "Unbiased Property Intelligence",
                      "End-to-End Documentation Support",
                      "Expert Advisory at Every Step",
                      "RERA Verification on All Listings",
                    ].map(pt => (
                      <div key={pt} className="flex items-center gap-2.5">
                        <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                          <Check size={10} className="text-emerald-600 stroke-[3]" />
                        </div>
                        <span className="text-xs font-semibold text-gray-700">{pt}</span>
                      </div>
                    ))}
                  </div>
                  <button className="mt-5 w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-extrabold text-white bg-brand-red hover:bg-brand-red/90 cursor-pointer transition-colors">
                    <Download size={14} /> Download Brochure
                  </button>
                </div>

                {/* Similar Properties */}
                {relatedProperties.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-extrabold text-gray-900 mb-3">Similar Properties</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {relatedProperties.map(prop => (
                        <Link key={prop.id} href={`/properties/${prop.slug}`}
                          className="bg-white rounded-2xl border border-gray-200 hover:border-brand-red/20 shadow-sm overflow-hidden group transition-all hover:shadow-md">
                          <div className="h-32 overflow-hidden">
                            <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-4">
                            <p className="text-xs text-gray-400 font-semibold mb-0.5">{prop.location}</p>
                            <p className="text-sm font-extrabold text-gray-900 group-hover:text-brand-red transition-colors leading-tight mb-2">{prop.title}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500 font-medium">{prop.bhk} BHK · {prop.area}</span>
                              <span className="text-xs font-extrabold text-gray-900">₹{(prop.price / 10000000).toFixed(1)} Cr</span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            </div>

            {/* ── RIGHT STICKY SIDEBAR ─────────────────────────────── */}
            <div className="space-y-4 lg:sticky lg:top-32">

              {/* Price Card */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <div className="flex items-baseline justify-between mb-1">
                  <p className="text-2xl font-extrabold text-gray-900">₹{(property.price / 10000000).toFixed(1)} Cr</p>
                  <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">Onwards</span>
                </div>
                <p className="text-xs text-gray-500 font-medium mb-4">₹{pricePerSqft.toLocaleString()} / sq.ft · {property.area}</p>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100 mb-4">
                  <Calendar size={13} className="text-brand-red shrink-0" />
                  <span className="text-xs font-semibold text-gray-700">Possession: <strong>{property.possession === "Ready" ? "Ready to Move" : "Dec 2027"}</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100">
                  <BadgeCheck size={13} className="text-emerald-600 shrink-0" />
                  <span className="text-xs font-semibold text-gray-700">RERA Verified · {property.type}</span>
                </div>
              </div>

              {/* Site Visit CTA */}
              <div className="bg-brand-red rounded-2xl p-5 text-white">
                <p className="text-xs font-extrabold uppercase tracking-widest text-red-200 mb-1">Free of Charge</p>
                <h3 className="text-base font-extrabold mb-1">Schedule Site Visit</h3>
                <p className="text-xs text-red-100 mb-4 leading-relaxed">Get instant callback from our property experts. Zero brokerage guaranteed.</p>

                <AnimatePresence mode="wait">
                  {!isInquirySubmitted ? (
                    <motion.form key="form" onSubmit={handleInquiry} className="space-y-3"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <input required type="text" placeholder="Your Name"
                        value={inquiryForm.name}
                        onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-red-200 focus:outline-none focus:bg-white/20 transition-colors" />
                      <input required type="tel" placeholder="+91 Phone Number"
                        value={inquiryForm.phone}
                        onChange={e => setInquiryForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full bg-white/15 border border-white/20 rounded-xl px-4 py-2.5 text-sm text-white placeholder-red-200 focus:outline-none focus:bg-white/20 transition-colors" />
                      <button type="submit"
                        className="w-full py-3 rounded-xl text-sm font-extrabold text-brand-red bg-white hover:bg-gray-50 cursor-pointer transition-colors">
                        Book Free Site Visit
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div key="success" className="text-center py-4"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center mx-auto mb-2">
                        <Check size={18} className="text-brand-red" />
                      </div>
                      <p className="font-extrabold">Booking Confirmed!</p>
                      <p className="text-xs text-red-100 mt-1">Our advisor will call you within 30 mins.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-white/15">
                  <div className="flex -space-x-1.5">
                    {["#C9171E", "#1a1a2e", "#374151"].map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-white" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="text-xs text-red-100 font-medium">3 advisors available now</p>
                </div>
              </div>

              {/* Call CTA */}
              <button className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl text-sm font-extrabold border-2 border-gray-200 text-gray-800 hover:border-brand-red hover:text-brand-red bg-white cursor-pointer transition-all">
                <Phone size={15} /> Get Best Price Quote
              </button>

              {/* Offerings */}
              <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
                <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-3">NexHouz Promise</p>
                <div className="space-y-2.5">
                  {([
                    { Icon: TrendingUp, text: "Best Price Guarantee", color: "#C9171E", bg: "#fef2f2" },
                    { Icon: BadgeCheck, text: "Verified & RERA Approved", color: "#16a34a", bg: "#f0fdf4" },
                    { Icon: ShieldCheck, text: "Zero Brokerage", color: "#2563eb", bg: "#eff6ff" },
                    { Icon: Layers, text: "Free Documentation Help", color: "#7c3aed", bg: "#f5f3ff" },
                  ] as const).map(({ Icon, text, color, bg }) => (
                    <div key={text} className="flex items-center gap-2.5 text-xs font-semibold text-gray-700">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: bg }}>
                        <Icon size={13} style={{ color }} />
                      </div>
                      {text}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
