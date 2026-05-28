"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  Star,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Zap,
  Info,
  Check,
  Building,
  Calendar,
  Layers,
  Compass,
  Key,
  Globe,
  User,
  ShieldAlert,
  ArrowUpRight,
  X
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { properties, Property } from "@/data/properties";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = use(params);
  const property = properties.find((p) => p.slug === slug);

  // Mortgage parameters
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20);
  const [interestRate, setInterestRate] = useState<number>(8.5);
  const [tenureYears, setTenureYears] = useState<number>(20);
  const [monthlyEMI, setMonthlyEMI] = useState<number>(0);
  const [downPaymentAmount, setDownPaymentAmount] = useState<number>(0);
  const [loanAmount, setLoanAmount] = useState<number>(0);

  // Inquiry Form States
  const [isInquirySubmitted, setIsInquirySubmitted] = useState<boolean>(false);
  const [inquiryForm, setInquiryForm] = useState({ name: "", email: "", phone: "", notes: "" });

  // Calculate local mortgage
  useEffect(() => {
    if (!property) return;
    const down = (property.price * downPaymentPercent) / 100;
    const loan = property.price - down;
    const r = (interestRate / 100) / 12;
    const n = tenureYears * 12;

    let emi = 0;
    if (r === 0) {
      emi = loan / n;
    } else {
      emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    setDownPaymentAmount(down);
    setLoanAmount(loan);
    setMonthlyEMI(emi);
  }, [property, downPaymentPercent, interestRate, tenureYears]);

  // Fallback if property not found
  if (!property) {
    return (
      <>
        <Navbar />
        <main className="flex-grow bg-white min-h-screen pt-36 pb-32 flex flex-col items-center justify-center text-center px-6">
          <Building size={32} className="text-brand-black/20 mb-4" />
          <h2 className="text-serif text-3xl font-light text-brand-black mb-4">Estate Not Registered</h2>
          <p className="text-xs text-brand-black/50 leading-relaxed font-sans max-w-sm mb-8">
            The requested estate under consideration is currently private or has been successfully acquired.
          </p>
          <Link
            href="/properties"
            className="px-6 py-3 bg-brand-black text-white text-[9px] tracking-widest font-extrabold uppercase rounded-full"
          >
            Return to Properties
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  // Related properties suggestions
  const relatedProperties = properties.filter((p) => p.id !== property.id).slice(0, 2);

  const handleInquirySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsInquirySubmitted(true);
    setTimeout(() => {
      setIsInquirySubmitted(false);
      setInquiryForm({ name: "", email: "", phone: "", notes: "" });
    }, 2500);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-white min-h-screen pt-32 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Back button link */}
          <Link
            href="/properties"
            className="inline-flex items-center space-x-2 text-[10px] tracking-[0.2em] font-extrabold text-gray-400 hover:text-brand-red uppercase mb-8 group transition-colors font-sans"
          >
            <ArrowLeft size={12} className="transform transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span>Back to Properties Registry</span>
          </Link>

          {/* Panoramic Cinematic Gallery Showcase Banner */}
          <div className="relative aspect-[16/7] w-full bg-gray-100 rounded-[2.5rem] overflow-hidden shadow-luxury border border-gray-200/40 mb-12 group">
            <img
              src={property.image}
              alt={property.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-103"
            />
            {/* Gradient Overlay for legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 via-brand-black/20 to-transparent" />
            
            {/* Top Left Badges */}
            <div className="absolute top-6 left-6 flex items-center gap-2">
              <span className="text-[9px] tracking-widest font-extrabold text-brand-red bg-white/95 backdrop-blur-sm border border-white px-4 py-1.5 rounded-full uppercase shadow-sm font-sans">
                {property.possession === "Ready" ? "Ready to Move" : property.possession}
              </span>
              <span className="text-[9px] tracking-widest font-extrabold text-emerald-600 bg-white/95 backdrop-blur-sm border border-white px-4 py-1.5 rounded-full uppercase shadow-sm flex items-center space-x-1 font-sans">
                <ShieldCheck size={10} className="fill-current text-emerald-500" />
                <span>TS-RERA Clear</span>
              </span>
            </div>

            {/* Bottom Info Panels */}
            <div className="absolute bottom-8 left-8 right-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2 text-white">
                <span className="text-[9px] tracking-[0.2em] uppercase font-extrabold text-white/70 block font-sans">Appraisal Valuation</span>
                <div className="flex items-baseline space-x-2">
                  <span className="text-3xl md:text-5xl font-extrabold tracking-tight font-sans">
                    ₹{(property.price / 10000000).toFixed(1)} Cr
                  </span>
                </div>
              </div>

              {/* Floating Rating Badge */}
              <div className="bg-white/95 backdrop-blur-sm border border-white px-5 py-3 rounded-2xl flex items-center gap-3 shadow-md max-w-xs shrink-0 self-start md:self-auto">
                <div className="w-10 h-10 rounded-full bg-brand-red/10 flex items-center justify-center text-brand-red">
                  <Star size={16} className="fill-current text-brand-red" />
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider font-sans">NexHouz Rating</p>
                  <p className="text-xs font-extrabold text-brand-black font-sans">{property.scores.architecturalIntegrity} AQ Integrity Score</p>
                </div>
              </div>
            </div>
          </div>

          {/* ========================================== */}
          {/* CONTENT SECTION                            */}
          {/* ========================================== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Panel: Sourcing Specs, Score Audit, Description, Amenities (7/12 column) */}
            <div className="lg:col-span-7 space-y-12 text-left">
              
              <div className="space-y-4">
                <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-brand-black leading-tight">
                  {property.title}
                </h1>
                <div className="flex items-center space-x-2 text-xs font-bold text-gray-500 font-sans">
                  <MapPin size={14} className="text-brand-red shrink-0" />
                  <span>{property.location}</span>
                </div>
              </div>

              {/* Verify Dossier CTA Button */}
              <button
                onClick={() => {
                  const inquiryEl = document.getElementById("inquiry-section");
                  if (inquiryEl) inquiryEl.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full flex items-center justify-between border border-gray-200/80 bg-white hover:border-gray-300 pl-6 pr-2 py-2 rounded-2xl shadow-luxury hover:shadow-luxury-hover transition-all duration-300 group cursor-pointer"
              >
                <span className="text-xs font-bold text-brand-black font-sans">Verify RERA Clearances & Spatial Dossier</span>
                <div className="w-10 h-10 rounded-xl bg-brand-black group-hover:bg-brand-red text-white flex items-center justify-center transition-all duration-300 shrink-0 shadow-md">
                  <ShieldCheck size={16} />
                </div>
              </button>

              {/* Specs Dashboard Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 font-sans">
                {[
                  { label: "Spatial Layout", value: `${property.bhk} BHK Suite`, icon: Building },
                  { label: "Super Area", value: property.area, icon: Layers },
                  { label: "Luxury Score", value: `${property.scores.architecturalIntegrity} / 100`, icon: Star },
                  { label: "Investment style", value: property.investmentType, icon: TrendingUp }
                ].map((spec) => {
                  const Icon = spec.icon;
                  return (
                    <div key={spec.label} className="bg-white border border-gray-150 p-5 rounded-2xl shadow-sm flex flex-col justify-between min-h-[110px] hover:border-gray-200 transition-colors">
                      <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-brand-red">
                        <Icon size={14} />
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-[8px] font-extrabold uppercase tracking-wider text-gray-400 block">{spec.label}</span>
                        <span className="text-xs font-extrabold text-brand-black block truncate" title={spec.value}>{spec.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ========================================== */}
              {/* INTERACTIVE LUXURY AUDIT METER              */}
              {/* ========================================== */}
              <div className="bg-brand-gray/10 border border-gray-150 p-6 rounded-3xl shadow-sm space-y-6">
                <div className="space-y-1">
                  <span className="text-[8px] tracking-[0.2em] uppercase font-extrabold text-gray-400 block font-sans">Audited Metrics</span>
                  <h3 className="text-xl font-extrabold text-brand-black">Interactive Luxury Quality Audit</h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 font-sans">
                  {[
                    { label: "Architectural Integrity", score: property.scores.architecturalIntegrity, desc: "RERA structural clear", suffix: "/100" },
                    { label: "Investment Yield", score: property.scores.investmentYield, desc: "High projected returns", suffix: "%" },
                    { label: "Spatial Efficiency", score: property.scores.spatialEfficiency, desc: "Zero wasted voids", suffix: "/100" }
                  ].map((item) => (
                    <div key={item.label} className="bg-white border border-gray-100 p-4 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden group hover:border-brand-red/10 transition-colors">
                      <div className="space-y-1 z-10">
                        <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-400 block">{item.label}</span>
                        <p className="text-2xl font-extrabold text-brand-black tracking-tight">{item.score}{item.suffix}</p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-gray-50 flex items-center justify-between text-[8px] text-gray-400 font-bold uppercase tracking-wider z-10">
                        <span>{item.desc}</span>
                        <ShieldCheck size={10} className="text-emerald-500 fill-current" />
                      </div>
                      {/* Progress bar overlay on the left border */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-brand-red/5 group-hover:bg-brand-red transition-all duration-300" style={{ height: '100%' }} />
                    </div>
                  ))}
                </div>

                {/* Automation Tier Indicator */}
                <div className="bg-white border border-gray-100 p-4 rounded-2xl flex items-center justify-between shadow-sm font-sans">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-brand-red/5 flex items-center justify-center text-brand-red">
                      <Zap size={15} />
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-extrabold uppercase tracking-wider">Home Automation Level</p>
                      <p className="text-xs font-extrabold text-brand-black">{property.scores.automationTier}</p>
                    </div>
                  </div>
                  <span className="text-[8px] font-extrabold text-brand-red bg-brand-red/5 px-2.5 py-1 rounded-full uppercase tracking-wider">Verified Tier</span>
                </div>
              </div>

              {/* Spatial Dossier */}
              <div className="space-y-4">
                <h3 className="text-lg font-extrabold text-brand-black border-b border-gray-150 pb-3">
                  Spatial Dossier & Architecture
                </h3>
                <div className="text-xs md:text-sm text-gray-600 leading-relaxed space-y-4 font-medium font-sans">
                  <p>{property.description}</p>
                  <p>
                    Commissioned through the highly recognized studio <strong className="font-extrabold text-brand-black">{property.architect}</strong>, this structure stands as a verified validation of modern living. The foundation utilizes low-vibration structural anchors, while natural thermal ventilation channels bypass operational noise columns.
                  </p>
                </div>
              </div>

              {/* Sourcing Amenities Grid */}
              <div className="space-y-6">
                <h4 className="text-[9px] font-extrabold tracking-widest uppercase text-gray-400 font-sans">
                  Verified Sourcing Amenities
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-sans">
                  {property.amenities.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-3 text-xs font-medium text-gray-600 bg-gray-50 border border-gray-100 p-3 rounded-xl hover:border-gray-200 transition-colors">
                      <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Check size={10} className="stroke-[3]" />
                      </div>
                      <span>{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Panel: Styled Mortgage Calculator & Inquiry Form (5/12 column) */}
            <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
              
              {/* Styled Mortgage Calculator */}
              <div className="bg-white border border-gray-150 p-6 rounded-3xl shadow-luxury space-y-6">
                <div className="space-y-1">
                  <span className="text-[8px] tracking-widest text-gray-400 font-extrabold uppercase block font-sans">Fintech Curation</span>
                  <h4 className="text-lg font-extrabold text-brand-black">Advisory Mortgage Calculator</h4>
                </div>

                <div className="space-y-5 text-xs font-sans">
                  {/* Parameter: Down Payment Allocation */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] tracking-widest uppercase font-extrabold text-gray-400">
                      <span>Down Payment ({downPaymentPercent}%)</span>
                      <span className="font-extrabold text-brand-black">₹{Math.round(downPaymentAmount).toLocaleString()}</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={50}
                      step={5}
                      value={downPaymentPercent}
                      onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-brand-red rounded-full"
                    />
                    <div className="flex justify-between text-[7px] text-gray-400 font-extrabold">
                      <span>10%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  {/* Parameter: Tenure Years (BUG RESOLVED) */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-[9px] tracking-widest uppercase font-extrabold text-gray-400">
                      <span>Loan Tenure</span>
                      <span className="font-extrabold text-brand-black">{tenureYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min={10}
                      max={30}
                      step={5}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(parseInt(e.target.value))}
                      className="w-full h-1 bg-gray-200 appearance-none cursor-pointer accent-brand-red rounded-full"
                    />
                    <div className="flex justify-between text-[7px] text-gray-400 font-extrabold">
                      <span>10 Years</span>
                      <span>30 Years</span>
                    </div>
                  </div>

                  <div className="h-px bg-gray-105" />

                  {/* Calculated Output Row */}
                  <div className="flex items-center justify-between py-2">
                    <span className="text-[9px] tracking-widest uppercase font-extrabold text-gray-400">Estimated Monthly EMI</span>
                    <span className="text-2xl font-extrabold text-brand-red">
                      ₹{Math.round(monthlyEMI).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Inquiry Sourcing Form */}
              <div
                id="inquiry-section"
                className="bg-white border border-gray-150 p-6 rounded-3xl shadow-luxury space-y-6"
              >
                <div className="space-y-1">
                  <span className="text-[8px] tracking-widest text-gray-400 font-extrabold uppercase block font-sans">Secure Verification</span>
                  <h4 className="text-lg font-extrabold text-brand-black">Request Trust Audit Dossier</h4>
                </div>

                <AnimatePresence mode="wait">
                  {!isInquirySubmitted ? (
                    <motion.form
                      key="form"
                      onSubmit={handleInquirySubmit}
                      className="space-y-4 text-xs font-sans"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] uppercase font-extrabold text-gray-400">Full Name</label>
                        <input
                          type="text"
                          required
                          value={inquiryForm.name}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs font-semibold rounded-xl focus:outline-none focus:border-brand-red focus:bg-white transition-all"
                          placeholder="e.g. Siddharth Reddy"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] uppercase font-extrabold text-gray-400">Email Address</label>
                        <input
                          type="email"
                          required
                          value={inquiryForm.email}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs font-semibold rounded-xl focus:outline-none focus:border-brand-red focus:bg-white transition-all"
                          placeholder="e.g. siddharth@nexhouz.com"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] uppercase font-extrabold text-gray-400">Secure Telephone</label>
                        <input
                          type="tel"
                          required
                          value={inquiryForm.phone}
                          onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                          className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-xs font-semibold rounded-xl focus:outline-none focus:border-brand-red focus:bg-white transition-all"
                          placeholder="e.g. +91 99889 98899"
                        />
                      </div>

                      <button
                        type="submit"
                        className="w-full py-4 bg-brand-black hover:bg-brand-red text-white text-[9px] tracking-[0.25em] font-extrabold uppercase transition-all duration-300 text-center rounded-xl shadow-md cursor-pointer hover:scale-101"
                      >
                        Submit Sourcing Request
                      </button>
                    </motion.form>
                  ) : (
                    <motion.div
                      key="success"
                      className="p-6 border border-brand-red/20 bg-brand-red/5 flex flex-col items-center justify-center text-center space-y-3 rounded-2xl"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="w-10 h-10 rounded-full bg-brand-red text-white flex items-center justify-center shadow-lg">
                        <Check size={16} />
                      </div>
                      <h4 className="text-serif text-lg font-extrabold text-brand-black">Inquiry Authenticated</h4>
                      <p className="text-[11px] text-gray-500 leading-relaxed max-w-xs font-medium">
                        Acquisition dossier locked. Your dedicated partner advisor will coordinate directly within 4 hours.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* ========================================== */}
          {/* RELATED CURATIONS                          */}
          {/* ========================================== */}
          <div className="border-t border-gray-200 pt-16 mt-24">
            <h3 className="text-2xl font-extrabold text-brand-black mb-10">
              Related Property Curations
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {relatedProperties.map((prop) => (
                <Link
                  key={prop.id}
                  href={`/properties/${prop.slug}`}
                  className="bg-brand-gray/5 border border-black/5 group relative shadow-luxury hover:shadow-luxury-hover transition-all duration-300 flex flex-col md:flex-row h-full overflow-hidden rounded-3xl"
                >
                  <div className="md:w-[40%] overflow-hidden bg-brand-gray relative aspect-[4/3] md:aspect-auto">
                    <img
                      src={prop.image}
                      alt={prop.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-6 flex-grow flex flex-col justify-between space-y-4 md:w-[60%] bg-white">
                    <div className="space-y-2">
                      <span className="text-[8px] tracking-widest text-brand-black/40 font-bold uppercase font-sans">{prop.location}</span>
                      <h4 className="text-serif text-lg font-extrabold text-brand-black group-hover:text-brand-red transition-colors duration-300">
                        {prop.title}
                      </h4>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100 text-[9px] text-brand-black/50 font-bold uppercase font-sans">
                      <span>{prop.bhk} BHK • {prop.area}</span>
                      <span className="text-xs font-extrabold text-brand-black">₹{(prop.price / 10000000).toFixed(1)} Cr</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
