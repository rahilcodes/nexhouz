"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, MapPin, ShieldCheck, Check,
  Building, Layers, TrendingUp, ChevronRight, Phone,
  Calendar, Home, Wind, Navigation, Train,
  ShoppingBag, Stethoscope, UtensilsCrossed, GraduationCap,
  ExternalLink, Download, ChevronDown, ChevronUp,
  Building2, Landmark, BadgeCheck, ChevronLeft
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X } from "@/components/ui/theme";
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

  return configs.map(c => {
    const cost = Math.round((c.size * ppsf) / 100000) * 100000;
    return {
      ...c,
      price: cost,
      priceLabel: cost >= 10000000
        ? `₹${parseFloat((cost / 10000000).toFixed(2))} Cr`
        : `₹${parseFloat((cost / 100000).toFixed(2))} Lakhs`
    };
  });
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

// ─── Shared card header (gold eyebrow + serif heading) ──────────────────────
function CardHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A6D2F] mb-1">{eyebrow}</p>
      <h2 className="font-display font-semibold text-[22px] md:text-[24px] leading-[1.2] text-[#0A0A0A]">{title}</h2>
    </div>
  );
}

export default function PropertyDetailClient({ slug: propSlug }: PropertyDetailClientProps) {
  const params = useParams();
  const pathname = usePathname();
  const [slug, setSlug] = useState(propSlug);
  const [prevSlug, setPrevSlug] = useState(propSlug);

  useEffect(() => {
    let resolvedSlug = propSlug;
    if (typeof window !== "undefined") {
      const match = window.location.pathname.match(/\/properties\/([^/]+)/);
      if (match && match[1]) {
        resolvedSlug = decodeURIComponent(match[1]);
      }
    } else if (params?.slug) {
      resolvedSlug = params.slug as string;
    }

    if (resolvedSlug && resolvedSlug !== slug) {
      setSlug(resolvedSlug);
    }
  }, [params, pathname, slug, propSlug]);

  const defaultProperty = properties.find(p => p.slug === slug);
  const [property, setProperty] = useState<any | null>(defaultProperty || null);

  if (slug !== prevSlug) {
    setPrevSlug(slug);
    setProperty(properties.find(p => p.slug === slug) || null);
  }

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
      <div className="font-archivo bg-white">
        <Navbar />
        <main className="flex-grow bg-white min-h-screen py-28 flex flex-col items-center justify-center text-center px-6">
          <Building size={32} className="text-[#0A0A0A]/20 mb-4" />
          <h2 className="font-display font-semibold text-[32px] md:text-[40px] text-[#0A0A0A] mb-4">Loading Estate…</h2>
          <p className="text-sm text-[#6b6659] leading-relaxed max-w-sm mb-8">Please wait while we retrieve this property.</p>
          <div className="w-8 h-8 border-4 border-[#D31E28] border-t-transparent rounded-full animate-spin" />
        </main>
        <Footer />
      </div>
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
          ? `₹${parseFloat((fp.price / 10000000).toFixed(2))} Cr`
          : `₹${parseFloat((fp.price / 100000).toFixed(2))} Lakhs`,
      }))
    : getFloorPlans(property.bhk, property.area, property.price);
  const floorPlans = rawFloorPlans;
  const relatedProperties = properties.filter(p => p.id !== property.id && p.type === property.type).slice(0, 2);

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${parseFloat((price / 10000000).toFixed(2))} Cr`;
    } else {
      return `₹${parseFloat((price / 100000).toFixed(2))} Lakhs`;
    }
  };

  const nearbyItems: { key: string; count: number }[] = [];
  if (property.nearby) {
    Object.keys(property.nearby).forEach(key => {
      const val = (property.nearby as any)[key];
      if (val !== undefined && val !== null) {
        nearbyItems.push({ key, count: val });
      }
    });
  }

  const FACILITY_MAP: Record<string, { icon: any; label: string; color: string }> = {
    hospitals: { icon: Stethoscope, label: "Hospitals", color: "#ef4444" },
    malls: { icon: ShoppingBag, label: "Shopping Malls", color: "#8b5cf6" },
    schools: { icon: GraduationCap, label: "Schools", color: "#3b82f6" },
    restaurants: { icon: UtensilsCrossed, label: "Restaurants", color: "#f97316" },
    metroStations: { icon: Navigation, label: "Metro Stations", color: "#6366f1" },
    railwayStations: { icon: Train, label: "Railway Stations", color: "#0891b2" },
    itParks: { icon: Building2, label: "IT Parks", color: "#16a34a" },
  };

  const getFacilityMeta = (key: string) => {
    if (FACILITY_MAP[key]) return FACILITY_MAP[key];
    const label = key
      .replace(/([A-Z])/g, " $1")
      .replace(/^./, str => str.toUpperCase())
      .trim();
    return {
      icon: MapPin,
      label,
      color: "#948d7c"
    };
  };

  // Scroll to tab section
  const scrollToSection = (tab: string) => {
    setActiveTab(tab);
    const el = sectionRefs.current[tab];
    if (el) {
      const offset = 64;
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
    <div className="font-archivo bg-white">
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
      <div className="w-full h-[340px] md:h-[460px] relative overflow-hidden bg-[#efeae1] group">
        {property.images && property.images.length > 0 ? (
          <>
            <img src={property.images[currentImageIdx]} alt={property.title} className="w-full h-full object-cover transition-all duration-500" />

            {property.images.length > 1 && (
              <>
                {/* Navigation Arrows */}
                <button onClick={() => setCurrentImageIdx(prev => (prev === 0 ? property.images.length - 1 : prev - 1))} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#0A0A0A] hover:bg-[#D31E28] hover:text-white flex items-center justify-center shadow-[0_4px_14px_rgba(30,25,15,0.18)] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-10">
                  <ChevronLeft size={17} />
                </button>
                <button onClick={() => setCurrentImageIdx(prev => (prev === property.images.length - 1 ? 0 : prev + 1))} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white text-[#0A0A0A] hover:bg-[#D31E28] hover:text-white flex items-center justify-center shadow-[0_4px_14px_rgba(30,25,15,0.18)] transition-colors opacity-0 group-hover:opacity-100 cursor-pointer z-10">
                  <ChevronRight size={17} />
                </button>

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  {property.images.map((_: any, idx: number) => (
                    <button key={idx} onClick={() => setCurrentImageIdx(idx)} className={`w-1.5 h-1.5 rounded-full transition-all cursor-pointer ${currentImageIdx === idx ? "bg-[#D31E28] w-3" : "bg-white/50 hover:bg-white"}`} />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <img src={property.image} alt={property.title} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-transparent pointer-events-none" />
        {/* breadcrumb */}
        <div className={`absolute top-5 left-0 right-0 ${SECTION_X}`}>
          <div className={CONTAINER}>
            <Link href="/properties" className="inline-flex items-center gap-1.5 text-white/75 hover:text-white text-[13px] font-semibold transition-colors">
              <ArrowLeft size={13} /> All Properties
            </Link>
          </div>
        </div>
        {/* title block */}
        <div className={`absolute bottom-0 left-0 right-0 ${SECTION_X} pb-8`}>
          <div className={CONTAINER}>
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="bg-[#D31E28] text-white rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider">
                {property.possession === "Ready" ? "Ready to Move" : `Possession: ${property.possession === "Under Construction" ? "Under Construction" : property.possession}`}
              </span>
              <span className="bg-emerald-500 text-white rounded-full px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck size={11} /> RERA Verified
              </span>
            </div>
            <h1 className="font-display font-semibold text-[32px] md:text-[48px] leading-[1.1] text-white mb-2 text-balance">{property.title}</h1>
            <p className="text-sm md:text-[15px] text-white/75 flex items-center gap-1.5 font-medium">
              <MapPin size={13} className="text-[#D31E28]" /> {property.location}
              <span className="mx-1.5 text-white/30">·</span>
              By <span className="text-white font-semibold ml-1">{property.architect}</span>
            </p>
          </div>
        </div>
      </div>

      {/* ── STICKY TAB NAV ─────────────────────────────────────────────── */}
      <div className="sticky top-0 z-30 bg-white border-b border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)]">
        <div className={`${CONTAINER} ${SECTION_X} flex items-center gap-1 overflow-x-auto no-scrollbar`}>
          {TABS.map(tab => (
            <button key={tab} onClick={() => scrollToSection(tab)}
              className={`shrink-0 px-4 py-3.5 text-[13px] font-semibold border-b-2 transition-all duration-200 cursor-pointer ${activeTab === tab ? "border-[#D31E28] text-[#D31E28]" : "border-transparent text-[#6b6659] hover:text-[#0A0A0A]"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <main className="bg-[#FAF7F1] min-h-screen pb-24">
        <div className={`${CONTAINER} ${SECTION_X} pt-8`}>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

            {/* ── LEFT COLUMN ──────────────────────────────────────────── */}
            <div className="space-y-6">

              {/* ── OVERVIEW ─────────────────────────────── */}
              <section ref={el => { sectionRefs.current["Overview"] = el; }}>
                <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#f0ebe1]">
                    <CardHeader eyebrow="Complete Details" title="Property Overview" />
                  </div>
                  <div className="divide-y divide-[#f0ebe1]">
                    {[
                      { label: "Project Name", value: property.title, icon: Building2 },
                      { label: "Builder Name", value: property.architect, icon: Home },
                      { label: "RERA Number", value: property.reraNumber || `TS/01/Building/0${property.id.split("-")[1]}/2024`, icon: BadgeCheck },
                      { label: "Possession", value: property.possessionDate || (property.possession === "Ready" ? "Ready to Move" : "Under Construction"), icon: Calendar },
                      { label: "Location", value: property.location, icon: MapPin },
                      { label: "Property Type", value: property.type, icon: Landmark },
                      ...(property.type !== "Plot" ? [{ label: "Configurations", value: `${property.bhk} BHK${property.bhk > 2 ? `, ${property.bhk - 1} BHK, ${property.bhk - 2 > 0 ? `${property.bhk - 2} BHK` : "Studio"}` : ""}`, icon: Layers }] : []),
                      ...(property.plotSize ? [{ label: "Plot Size", value: `${property.plotSize} ${property.plotSizeUnit || "sq yds"}`, icon: Landmark }] : [])
                    ].map(({ label, value, icon: Icon }) => (
                      <div key={label} className="flex items-center gap-4 px-6 py-3.5 hover:bg-[#FAF7F1] transition-colors">
                        <div className="w-8 h-8 rounded-lg bg-[#faf0f0] flex items-center justify-center shrink-0">
                          <Icon size={14} className="text-[#D31E28]" />
                        </div>
                        <div className="flex items-center justify-between flex-1 min-w-0">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#948d7c] shrink-0 w-36">{label}</span>
                          <span className="text-[13px] font-semibold text-[#0A0A0A] text-right">{value}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick stats bar */}
                <div className={`grid gap-4 mt-4 ${property.type === "Villa" && property.plotSize ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"}`}>
                  {[
                    { label: "Starting Price", value: formatPrice(property.price), red: true },
                    { label: "Property Type", value: property.type, red: false },
                    ...(property.type === "Plot"
                      ? [{ label: "Plot Size", value: property.area, red: false }]
                      : [
                          { label: "Super Built-up", value: property.area, red: false },
                          ...(property.plotSize ? [{ label: "Plot Size", value: `${property.plotSize} ${property.plotSizeUnit || "sq yds"}`, red: false }] : [])
                        ])
                  ].map(s => (
                    <div key={s.label} className="bg-white rounded-2xl border border-[#EEE9E0] p-4 text-center shadow-[0_1px_3px_rgba(30,25,15,0.04)]">
                      <p className={`text-base md:text-lg font-bold ${s.red ? "text-[#D31E28]" : "text-[#0A0A0A]"}`}>{s.value}</p>
                      <p className="text-[11px] text-[#948d7c] font-semibold uppercase tracking-wider mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>

                {/* Project Description Card */}
                <div ref={el => { sectionRefs.current["About"] = el; }} className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] overflow-hidden mt-4">
                  <div className="px-6 py-5 border-b border-[#f0ebe1]">
                    <CardHeader eyebrow="Project Description" title={`About ${property.title}`} />
                  </div>
                  <div className="p-6 space-y-4">
                    <p className="text-[15px] text-[#57534a] leading-[1.7]">{property.description}</p>
                    <p className="text-[15px] text-[#57534a] leading-[1.7]">
                      Commissioned through <strong className="text-[#0A0A0A] font-semibold">{property.architect}</strong>, this structure represents a validated benchmark of modern luxury living in {property.location}. The design incorporates low-vibration structural anchors, natural thermal ventilation, and energy-efficient systems to ensure both comfort and sustainability.
                    </p>

                    {/* Property type badge */}
                    <div className="flex items-center gap-2 pt-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-full bg-[#F6F1E7] text-[#8A6D2F]">
                        {property.type}
                      </span>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── PRICING & FLOOR PLANS ─────────────────── */}
              <section ref={el => { sectionRefs.current["Pricing"] = el; }}>
                <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#f0ebe1]">
                    <CardHeader eyebrow="Unit Configurations" title="Pricing & Floor Plans" />
                  </div>

                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="bg-[#FAF7F1] border-b border-[#f0ebe1]">
                          {["Unit Type", "Size (sq ft)", "Facing", "Price*"].map(h => (
                            <th key={h} className="text-left px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-[#948d7c]">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0ebe1]">
                        {floorPlans.map((fp: any, i: number) => (
                          <tr key={i} className="hover:bg-[#FAF7F1] transition-colors">
                            <td className="px-5 py-3.5">
                              <span className="inline-block text-[13px] font-bold px-2.5 py-0.5 rounded-full bg-[#faf0f0] text-[#D31E28]">{fp.type}</span>
                            </td>
                            <td className="px-5 py-3.5 text-[13px] font-semibold text-[#44403a]">{fp.size.toLocaleString()}</td>
                            <td className="px-5 py-3.5 text-[13px] text-[#6b6659] font-medium">{fp.facing}</td>
                            <td className="px-5 py-3.5 text-[13px] font-bold text-[#0A0A0A]">{fp.priceLabel}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-3 bg-[#FAF7F1] border-t border-[#f0ebe1]">
                    <p className="text-xs text-[#948d7c] font-medium">* Prices are approximate and subject to change. GST applicable. Contact advisor for exact pricing.</p>
                  </div>
                </div>

                {/* EMI Calculator */}
                <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] p-6 mt-4">
                  <div className="mb-5">
                    <CardHeader eyebrow="Fintech Curation" title="EMI Calculator" />
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-[#948d7c] mb-1.5">
                        <span>Down Payment ({downPaymentPercent}%)</span>
                        <span className="text-[#0A0A0A]">₹{Math.round((property.price * downPaymentPercent) / 100).toLocaleString()}</span>
                      </div>
                      <input type="range" min={10} max={50} step={5} value={downPaymentPercent}
                        onChange={e => setDownPaymentPercent(+e.target.value)}
                        className="w-full h-1.5 bg-[#EEE9E0] appearance-none cursor-pointer accent-[#D31E28] rounded-full" />
                      <div className="flex justify-between text-[11px] text-[#948d7c] mt-1 font-semibold"><span>10%</span><span>50%</span></div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[11px] font-semibold uppercase tracking-wider text-[#948d7c] mb-1.5">
                        <span>Loan Tenure</span><span className="text-[#0A0A0A]">{tenureYears} Years</span>
                      </div>
                      <input type="range" min={5} max={30} step={5} value={tenureYears}
                        onChange={e => setTenureYears(+e.target.value)}
                        className="w-full h-1.5 bg-[#EEE9E0] appearance-none cursor-pointer accent-[#D31E28] rounded-full" />
                      <div className="flex justify-between text-[11px] text-[#948d7c] mt-1 font-semibold"><span>5 Years</span><span>30 Years</span></div>
                    </div>
                    <div className="flex items-center justify-between py-3 border-t border-b border-[#f0ebe1]">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#948d7c]">Est. Monthly EMI</span>
                      <span className="text-2xl font-bold text-[#D31E28]">₹{Math.round(monthlyEMI).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-[#948d7c]">@ {interestRate}% p.a. interest rate. For indicative purposes only.</p>
                  </div>
                </div>
              </section>

              {/* ── AMENITIES ─────────────────────────────── */}
              <section ref={el => { sectionRefs.current["Amenities"] = el; }}>
                <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#f0ebe1]">
                    <CardHeader eyebrow="Verified Features" title="Amenities" />
                  </div>
                  <div className="p-6">
                    {/* Amenities grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                      {(showAllAmenities ? property.amenities : property.amenities.slice(0, 6)).map((a: string) => (
                        <div key={a} className="flex items-center gap-2.5 p-3 rounded-xl bg-[#FAF7F1] border border-[#EEE9E0] hover:border-[#d8d2c6] transition-colors">
                          <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0">
                            <Check size={10} className="text-emerald-600 stroke-[3]" />
                          </div>
                          <span className="text-[13px] font-medium text-[#44403a] leading-tight">{a}</span>
                        </div>
                      ))}
                    </div>
                    {property.amenities.length > 6 && (
                      <button onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="mt-4 text-[13px] font-semibold text-[#D31E28] hover:text-[#B8171F] flex items-center gap-1 cursor-pointer transition-colors">
                        {showAllAmenities ? <><ChevronUp size={13} /> Show Less</> : <><ChevronDown size={13} /> Show All {property.amenities.length} Amenities</>}
                      </button>
                    )}
                  </div>
                </div>
              </section>

              {/* ── LOCATION ──────────────────────────────── */}
              <section ref={el => { sectionRefs.current["Location"] = el; }}>
                <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#f0ebe1] flex items-center justify-between gap-3">
                    <CardHeader eyebrow="Location & Connectivity" title={property.location} />
                    <a href={`https://maps.google.com/?q=${encodeURIComponent(property.location)}`} target="_blank" rel="noreferrer"
                      className="flex items-center gap-1.5 text-[13px] font-semibold text-[#D31E28] hover:text-[#B8171F] transition-colors shrink-0">
                      <ExternalLink size={12} /> Open in Maps
                    </a>
                  </div>

                  {/* Map placeholder */}
                  <div className="relative h-48 bg-[#F6F1E7] overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-12 h-12 rounded-full bg-[#faf0f0] flex items-center justify-center mx-auto mb-2">
                          <MapPin size={20} className="text-[#D31E28]" />
                        </div>
                        <p className="text-[13px] font-semibold text-[#57534a]">{property.location}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {/* Dynamic Proximity Stats */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A6D2F] mb-4">Neighborhood Connectivity & Proximity Stats (Within 5km)</p>
                      {nearbyItems.length === 0 ? (
                        <p className="text-xs text-[#948d7c] italic bg-[#FAF7F1] p-4 rounded-xl border border-[#EEE9E0]">No connectivity stats listed for this neighborhood.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {nearbyItems.map(({ key, count }) => {
                            const { icon: Icon, label, color } = getFacilityMeta(key);
                            return (
                              <div key={key} className="text-center p-4 rounded-xl border border-[#EEE9E0] bg-[#FAF7F1] hover:border-[#d8d2c6] transition-colors">
                                <div className="w-9 h-9 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: `${color}12` }}>
                                  <Icon size={16} style={{ color }} />
                                </div>
                                <p className="text-xl font-bold text-[#0A0A0A]">{count}+</p>
                                <p className="text-xs font-semibold text-[#948d7c] mt-0.5">{label}</p>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </section>

              {/* ── AIR QUALITY ───────────────────────────── */}
              <section ref={el => { sectionRefs.current["Air Quality"] = el; }}>
                <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] overflow-hidden">
                  <div className="px-6 py-5 border-b border-[#f0ebe1] flex items-center justify-between gap-3">
                    <CardHeader eyebrow="Environmental Data" title="Air Quality Index" />
                    <div className="flex items-center gap-2 shrink-0">
                      <Wind size={14} className="text-[#D31E28]" />
                      <span className="text-xs font-semibold text-[#6b6659]">Updated Live</span>
                    </div>
                  </div>
                  <div className="p-6">
                    {/* AQI Score */}
                    <div className="flex items-start gap-6 mb-6">
                      <div className="text-center">
                        <div className="w-20 h-20 rounded-2xl flex flex-col items-center justify-center" style={{ background: aqiMeta.bg }}>
                          <p className="text-2xl font-bold leading-none" style={{ color: aqiMeta.text }}>{aqiScore}</p>
                          <p className="text-[11px] font-bold uppercase tracking-wider mt-1" style={{ color: aqiMeta.text }}>AQI</p>
                        </div>
                        <p className="text-xs font-bold mt-2" style={{ color: aqiMeta.text }}>{aqiMeta.label}</p>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-[15px] font-semibold text-[#0A0A0A] mb-3">{property.location}</h3>
                        <div className="space-y-1.5">
                          <p className="text-sm text-[#57534a] flex items-center gap-1.5"><Check size={11} className="text-emerald-500 stroke-[3] shrink-0" /> Air quality is acceptable for most people</p>
                          <p className="text-sm text-[#57534a] flex items-center gap-1.5"><Check size={11} className="text-amber-500 stroke-[3] shrink-0" /> Sensitive individuals should limit outdoor exertion</p>
                          <p className="text-sm text-[#57534a] flex items-center gap-1.5"><Check size={11} className="text-emerald-500 stroke-[3] shrink-0" /> Generally safe for outdoor activities</p>
                        </div>
                      </div>
                    </div>

                    {/* AQI Scale */}
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A6D2F] mb-2">AQI Scale Reference</p>
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
                            <span className="text-[11px] font-bold" style={{ color: s.color }}>{s.range}: {s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* ── ABOUT / RECOMMENDATION REPORT ─────────── */}
              <section className="space-y-4">
                {/* NexHouz Recommendation Report Card (exchanged position, placed in About tab section) */}
                {property.recommendationReport && (
                  <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] p-6 space-y-5 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="w-2 h-2 rounded-full bg-[#D31E28] animate-pulse" />
                        <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D31E28]">NexHouz Recommendation Report</p>
                      </div>
                      <h3 className="font-display font-semibold text-[22px] md:text-[24px] leading-[1.2] text-[#0A0A0A]">Why We Recommend This Property</h3>
                    </div>

                    <p className="text-sm text-[#57534a] leading-relaxed bg-[#FAF7F1] p-4 rounded-xl border border-[#EEE9E0]">
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
                          <div className="flex justify-between text-[11px] font-semibold text-[#948d7c] uppercase tracking-wider">
                            <span>{item.label}</span>
                            <span className="text-[#0A0A0A] font-bold">{item.val} / 10</span>
                          </div>
                          <div className="w-full h-1.5 bg-[#f0ebe1] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#D31E28] rounded-full"
                              style={{ width: `${item.val * 10}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                


                {/* Why Choose NexHouz */}
                <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] p-6 mt-4">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A6D2F] mb-1">Our Advantage</p>
                  <h3 className="font-display font-semibold text-[22px] leading-[1.2] text-[#0A0A0A] mb-4">Why Choose NexHouz?</h3>
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
                        <span className="text-[13.5px] font-medium text-[#44403a]">{pt}</span>
                      </div>
                    ))}
                  </div>
                  {property.brochureUrl ? (
                    <a
                      href={property.brochureUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-lg text-sm font-semibold text-white bg-[#D31E28] hover:bg-[#B8171F] shadow-[0_4px_14px_rgba(211,30,40,0.25)] cursor-pointer transition-colors"
                    >
                      <Download size={14} /> Download Brochure
                    </a>
                  ) : (
                    <button className="mt-5 w-full flex items-center justify-center gap-2 py-4 rounded-lg text-sm font-semibold text-white bg-[#D31E28] hover:bg-[#B8171F] shadow-[0_4px_14px_rgba(211,30,40,0.25)] cursor-pointer transition-colors opacity-60" disabled>
                      <Download size={14} /> Download Brochure
                    </button>
                  )}
                </div>

                {/* Similar Properties */}
                {relatedProperties.length > 0 && (
                  <div className="mt-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A6D2F] mb-1">Keep Exploring</p>
                    <h3 className="font-display font-semibold text-[22px] leading-[1.2] text-[#0A0A0A] mb-4">Similar Properties</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {relatedProperties.map(prop => (
                        <Link key={prop.id} href={`/properties/${prop.slug}`}
                          className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] overflow-hidden group transition-shadow">
                          <div className="h-32 overflow-hidden bg-[#efeae1]">
                            <img src={prop.image} alt={prop.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                          </div>
                          <div className="p-4">
                            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-[#948d7c] mb-1">{prop.location.split(",")[0]}</p>
                            <p className="text-[15px] font-semibold text-[#0A0A0A] group-hover:text-[#D31E28] transition-colors leading-snug mb-2">{prop.title}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-[#6b6659] font-medium">{prop.bhk} BHK · {prop.area}</span>
                              <span className="text-[13px] font-bold text-[#D31E28]">{formatPrice(prop.price)}</span>
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
            <div className="space-y-4 lg:sticky lg:top-20">

              {/* Price Card */}
              <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] p-5">
                <div className="flex items-baseline justify-between mb-4">
                  <p className="text-[28px] font-bold text-[#0A0A0A]">{formatPrice(property.price)}</p>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A6D2F] bg-[#F6F1E7] px-2.5 py-1 rounded-full">Onwards</span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F1] border border-[#EEE9E0] mb-3">
                  <Calendar size={13} className="text-[#D31E28] shrink-0" />
                  <span className="text-[13px] font-medium text-[#44403a]">Possession: <strong className="font-semibold text-[#0A0A0A]">{property.possession === "Ready" ? "Ready to Move" : "Dec 2027"}</strong></span>
                </div>
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FAF7F1] border border-[#EEE9E0]">
                  <BadgeCheck size={13} className="text-emerald-600 shrink-0" />
                  <span className="text-[13px] font-medium text-[#44403a]">RERA Verified · {property.type}</span>
                </div>
              </div>

              {/* Site Visit CTA */}
              <div className="bg-[#0A0A0A] rounded-2xl p-6 text-white">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#D31E28] mb-1.5">Free of Charge</p>
                <h3 className="font-display font-semibold text-[24px] leading-[1.2] mb-1.5">Schedule Site Visit</h3>
                <p className="text-[13px] text-white/60 mb-4 leading-relaxed">Get instant callback from our property experts. Zero brokerage guaranteed.</p>

                <AnimatePresence mode="wait">
                  {!isInquirySubmitted ? (
                    <motion.form key="form" onSubmit={handleInquiry} className="space-y-3"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <input required type="text" placeholder="Your Name"
                        value={inquiryForm.name}
                        onChange={e => setInquiryForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full bg-white/10 border-[1.5px] border-white/15 rounded-[10px] px-[18px] py-3.5 text-sm text-white placeholder-white/45 focus:outline-none focus:border-[#D31E28] transition-colors" />
                      <input required type="tel" placeholder="+91 Phone Number"
                        value={inquiryForm.phone}
                        onChange={e => setInquiryForm(f => ({ ...f, phone: e.target.value }))}
                        className="w-full bg-white/10 border-[1.5px] border-white/15 rounded-[10px] px-[18px] py-3.5 text-sm text-white placeholder-white/45 focus:outline-none focus:border-[#D31E28] transition-colors" />
                      <button type="submit"
                        className="w-full py-4 rounded-lg text-sm font-semibold text-white bg-[#D31E28] hover:bg-[#B8171F] shadow-[0_4px_14px_rgba(211,30,40,0.25)] cursor-pointer transition-colors">
                        Book Free Site Visit
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div key="success" className="text-center py-4"
                      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
                      <div className="w-10 h-10 rounded-full bg-[#D31E28] flex items-center justify-center mx-auto mb-2">
                        <Check size={18} className="text-white" strokeWidth={3} />
                      </div>
                      <p className="font-semibold text-[17px]">Booking Confirmed!</p>
                      <p className="text-xs text-white/60 mt-1">Our advisor will call you within 30 mins.</p>
                    </motion.div>
                  )}
                </AnimatePresence>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/10">
                  <div className="flex -space-x-1.5">
                    {["#D31E28", "#8A6D2F", "#44403a"].map((c, i) => (
                      <div key={i} className="w-6 h-6 rounded-full border-2 border-[#0A0A0A]" style={{ background: c }} />
                    ))}
                  </div>
                  <p className="text-xs text-white/60 font-medium">3 advisors available now</p>
                </div>
              </div>

              {/* Call CTA */}
              <button className="w-full flex items-center justify-center gap-2 py-4 rounded-lg text-sm font-semibold border-[1.5px] border-[#d8d2c6] text-[#0A0A0A] hover:border-[#0A0A0A] bg-white cursor-pointer transition-colors">
                <Phone size={15} /> Get Best Price Quote
              </button>

              {/* Offerings */}
              <div className="bg-white rounded-2xl border border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] p-5">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#8A6D2F] mb-3">NexHouz Promise</p>
                <div className="space-y-2.5">
                  {([
                    { Icon: TrendingUp, text: "Best Price Guarantee", color: "#D31E28", bg: "#faf0f0" },
                    { Icon: BadgeCheck, text: "Verified & RERA Approved", color: "#16a34a", bg: "#f0fdf4" },
                    { Icon: ShieldCheck, text: "Zero Brokerage", color: "#8A6D2F", bg: "#faf6ee" },
                    { Icon: Layers, text: "Free Documentation Help", color: "#3d5a3d", bg: "#f2f4f0" },
                  ] as const).map(({ Icon, text, color, bg }) => (
                    <div key={text} className="flex items-center gap-2.5 text-[13px] font-medium text-[#44403a]">
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
    </div>
  );
}
