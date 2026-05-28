"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Check, Info, Send, Landmark, ShieldAlert } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ContactPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
    message: ""
  });
  const [agree, setAgree] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ firstName: "", lastName: "", email: "", mobile: "", message: "" });
        setAgree(false);
      }, 3500);
    }, 1500);
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-white min-h-screen pt-36 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="max-w-2xl space-y-4 mb-16 border-b border-brand-gray-dark pb-10">
            <span className="text-[10px] tracking-[0.3em] font-bold text-brand-red uppercase">Corporate Touchpoints</span>
            <h1 className="text-serif text-4xl md:text-5xl font-light tracking-tight text-brand-black">
              Get in Touch
            </h1>
            <p className="text-xs font-light text-brand-black/50 leading-relaxed font-sans max-w-lg">
              Whether you have an investment query, need spatial guidance, or are ready to take the next step in Hyderabad, our team is here to support you.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* ========================================== */}
            {/* LEFT COLUMN: HYDERABAD CONTACT INFO        */}
            {/* ========================================== */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="glass-panel p-8 md:p-10 shadow-luxury space-y-8 bg-brand-gray/10">
                <span className="text-[9px] tracking-widest text-brand-black/40 font-bold uppercase block">Headquarters Node</span>
                
                {/* Office Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white border border-black/5 flex items-center justify-center text-brand-red shadow-luxury flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[9px] uppercase text-brand-black/40 block">Corporate Address</span>
                    <p className="font-light text-brand-black/70 leading-relaxed font-sans">
                      B 109, B-BLOCK Asian Sun City,<br />
                      Behind AMB Mall, Forest Dept Colony,<br />
                      Kothaguda X Road, Kondapur,<br />
                      Hyderabad, Telangana 500084
                    </p>
                  </div>
                </div>

                {/* Direct Telephone Lines */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white border border-black/5 flex items-center justify-center text-brand-red shadow-luxury flex-shrink-0">
                    <Phone size={18} />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[9px] uppercase text-brand-black/40 block">Active Phone Channels</span>
                    <p className="font-semibold text-brand-black space-y-1">
                      <a href="tel:+918585854853" className="block hover:text-brand-red transition-all duration-300">
                        +91 8585854853
                      </a>
                      <a href="tel:+919966998665" className="block hover:text-brand-red transition-all duration-300">
                        +91 9966998665
                      </a>
                    </p>
                  </div>
                </div>

                {/* Email Sourcing */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white border border-black/5 flex items-center justify-center text-brand-red shadow-luxury flex-shrink-0">
                    <Mail size={18} />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-[9px] uppercase text-brand-black/40 block">Digital Sourcing Inbox</span>
                    <a href="mailto:Info@nexhouz.com" className="font-semibold text-brand-black hover:text-brand-red transition-all duration-300">
                      Info@nexhouz.com
                    </a>
                  </div>
                </div>

              </div>

              {/* STYLISH CUSTOM VECTOR SVG ABSTRACT MAP */}
              <div className="border border-black/5 bg-brand-gray/10 shadow-luxury overflow-hidden p-6 space-y-4">
                <span className="text-[9px] tracking-widest text-brand-black/40 font-bold uppercase block">Kondapur / Kothaguda Node Map</span>
                <div className="w-full h-44 bg-white border border-black/5 relative overflow-hidden flex items-center justify-center">
                  
                  {/* Abstract Street Grid */}
                  <svg className="w-full h-full opacity-60" viewBox="0 0 300 150">
                    {/* Roads */}
                    <line x1="0" y1="75" x2="300" y2="75" stroke="#EAEAEA" strokeWidth="24" /> {/* Kothaguda Road */}
                    <line x1="120" y1="0" x2="120" y2="150" stroke="#EAEAEA" strokeWidth="20" /> {/* Kondapur X Road */}
                    <line x1="0" y1="30" x2="300" y2="100" stroke="#F3F3F5" strokeWidth="10" />
                    
                    {/* Parcels */}
                    <rect x="15" y="15" width="80" height="35" fill="#F9F9FB" stroke="#EAEAEA" strokeWidth="1" />
                    <rect x="150" y="15" width="130" height="40" fill="#F9F9FB" stroke="#EAEAEA" strokeWidth="1" /> {/* AMB Mall Area */}
                    <rect x="150" y="90" width="120" height="45" fill="#F9F9FB" stroke="#EAEAEA" strokeWidth="1" /> {/* Asian Sun City */}
                    
                    {/* Text tags */}
                    <text x="185" y="38" className="text-[7px] font-sans font-bold fill-brand-black/30 tracking-widest uppercase">AMB MALL</text>
                    <text x="165" y="115" className="text-[7px] font-sans font-bold fill-brand-black/30 tracking-widest uppercase">ASIAN SUN CITY</text>
                    <text x="10" y="80" className="text-[6px] font-sans font-bold fill-brand-black/30 tracking-wider uppercase">Kothaguda Road</text>
                    
                    {/* Pin indicator */}
                    <circle cx="160" cy="100" r="6" fill="#D31E28" className="animate-ping opacity-75" />
                    <circle cx="160" cy="100" r="4" fill="#D31E28" />
                  </svg>
                  
                  <div className="absolute bottom-2 left-2 bg-brand-black text-white px-2 py-0.5 text-[8px] font-bold uppercase tracking-wider">
                    Asian Sun City Site
                  </div>
                </div>
              </div>

            </div>

            {/* ========================================== */}
            {/* RIGHT COLUMN: CONTACT FORM BRIEFING        */}
            {/* ========================================== */}
            <div className="lg:col-span-7 bg-white border border-black/5 p-8 md:p-12 shadow-luxury space-y-8">
              
              <div className="space-y-2">
                <span className="text-[8px] tracking-widest text-brand-black/40 font-bold uppercase block">Acquisition Protocol</span>
                <h2 className="text-serif text-3xl font-light text-brand-black">Register Curation Query</h2>
                <p className="text-[11px] font-light text-brand-black/50 font-sans leading-relaxed">
                  Provide your active contact coordinates and spatial parameters. A certified regional advisor will respond within 4 hours.
                </p>
              </div>

              <AnimatePresence mode="wait">
                {!submitted ? (
                  <motion.form
                    key="form"
                    onSubmit={handleSubmit}
                    className="space-y-6 text-xs font-sans"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Field: First Name */}
                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] uppercase font-bold text-brand-black/50">First Name*</label>
                        <input
                          type="text"
                          required
                          value={form.firstName}
                          onChange={(e) => setForm({ ...form, firstName: e.target.value })}
                          className="w-full bg-brand-gray border border-black/5 px-4 py-3 text-xs font-light focus:outline-none focus:border-brand-red text-brand-black"
                          placeholder="Sterling"
                        />
                      </div>

                      {/* Field: Last Name */}
                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] uppercase font-bold text-brand-black/50">Last Name*</label>
                        <input
                          type="text"
                          required
                          value={form.lastName}
                          onChange={(e) => setForm({ ...form, lastName: e.target.value })}
                          className="w-full bg-brand-gray border border-black/5 px-4 py-3 text-xs font-light focus:outline-none focus:border-brand-red text-brand-black"
                          placeholder="Kemp"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Field: Email */}
                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] uppercase font-bold text-brand-black/50">Email Address*</label>
                        <input
                          type="email"
                          required
                          value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                          className="w-full bg-brand-gray border border-black/5 px-4 py-3 text-xs font-light focus:outline-none focus:border-brand-red text-brand-black"
                          placeholder="info@nexhouz.com"
                        />
                      </div>

                      {/* Field: Mobile */}
                      <div className="space-y-1">
                        <label className="text-[8px] tracking-[0.2em] uppercase font-bold text-brand-black/50">Mobile Number*</label>
                        <input
                          type="tel"
                          required
                          value={form.mobile}
                          onChange={(e) => setForm({ ...form, mobile: e.target.value })}
                          className="w-full bg-brand-gray border border-black/5 px-4 py-3 text-xs font-light focus:outline-none focus:border-brand-red text-brand-black"
                          placeholder="+91 8585854853"
                        />
                      </div>
                    </div>

                    {/* Field: Message */}
                    <div className="space-y-1">
                      <label className="text-[8px] tracking-[0.2em] uppercase font-bold text-brand-black/50">Message Query</label>
                      <textarea
                        rows={4}
                        required
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        className="w-full bg-brand-gray border border-black/5 px-4 py-3 text-xs font-light focus:outline-none focus:border-brand-red text-brand-black resize-none"
                        placeholder="State your property timeline, budget limits, or dynamic location parameters in Hyderabad under consideration."
                      />
                    </div>

                    {/* Checkbox Agreement */}
                    <div className="flex items-start space-x-3 pt-2">
                      <input
                        type="checkbox"
                        required
                        id="privacy-agree"
                        checked={agree}
                        onChange={(e) => setAgree(e.target.checked)}
                        className="mt-0.5 cursor-pointer accent-brand-red"
                      />
                      <label htmlFor="privacy-agree" className="text-[10px] leading-relaxed text-brand-black/50 cursor-pointer select-none">
                        I understand that by submitting my details, I may receive promotional emails. I can opt out whenever I choose, and my information will remain private and never be sold.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !agree}
                      className="w-full py-4 bg-brand-black hover:bg-brand-red disabled:bg-brand-black/35 text-white text-[10px] tracking-[0.3em] font-extrabold uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-luxury focus:outline-none"
                    >
                      {isSubmitting ? (
                        <span>TRANSMITTING Briefing...</span>
                      ) : (
                        <>
                          <span>Send Email</span>
                          <Send size={12} />
                        </>
                      )}
                    </button>
                  </motion.form>
                ) : (
                  <motion.div
                    key="success"
                    className="p-8 border border-brand-red/20 bg-brand-red/5 flex flex-col items-center justify-center text-center space-y-4"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="w-12 h-12 rounded-full bg-brand-red text-white flex items-center justify-center shadow-luxury">
                      <Check size={20} />
                    </div>
                    <h4 className="text-serif text-2xl font-light text-brand-black">Transmitted Successfully</h4>
                    <p className="text-xs text-brand-black/60 leading-relaxed font-sans max-w-sm">
                      Dossier briefing sent to info@nexhouz.com. Your security verification logs cleared. A trusted advisor will connect with you shortly.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </>
  );
}
