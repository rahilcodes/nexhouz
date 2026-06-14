"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Phone, Mail, Check, Info, Send, Landmark, ShieldAlert } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { submitLead } from "@/lib/db";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agree) return;
    
    setIsSubmitting(true);
    const success = await submitLead({
      name: `${form.firstName} ${form.lastName}`,
      email: form.email,
      phone: form.mobile,
      notes: form.message,
      leadType: "general"
    });
    setIsSubmitting(false);
    if (success) {
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        setForm({ firstName: "", lastName: "", email: "", mobile: "", message: "" });
        setAgree(false);
      }, 3500);
    }
  };

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-white min-h-screen pt-36 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="max-w-2xl space-y-4 mb-16 border-b border-brand-gray-dark pb-10">
            <span className="text-xs tracking-[0.3em] font-bold text-brand-red uppercase">Corporate Touchpoints</span>
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
                <span className="text-xs tracking-widest text-brand-black/40 font-bold uppercase block">Headquarters Node</span>
                
                {/* Office Address */}
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-white border border-black/5 flex items-center justify-center text-brand-red shadow-luxury flex-shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div className="space-y-1 text-xs">
                    <span className="font-bold text-xs uppercase text-brand-black/40 block">Corporate Address</span>
                    <p className="font-light text-brand-black/70 leading-relaxed font-sans">
                      B 609, 6th Floor, B-BLOCK Asian Sun City,<br />
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
                    <span className="font-bold text-xs uppercase text-brand-black/40 block">Active Phone Channels</span>
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
                    <span className="font-bold text-xs uppercase text-brand-black/40 block">Digital Sourcing Inbox</span>
                    <a href="mailto:Info@nexhouz.com" className="font-semibold text-brand-black hover:text-brand-red transition-all duration-300">
                      Info@nexhouz.com
                    </a>
                  </div>
                </div>

              </div>

              {/* GOOGLE MAPS EMBED */}
              <div className="border border-black/5 bg-brand-gray/10 shadow-luxury overflow-hidden p-6 space-y-4">
                <span className="text-xs tracking-widest text-brand-black/40 font-bold uppercase block">Corporate Location Map</span>
                <div className="w-full h-64 bg-white border border-black/5 relative overflow-hidden">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3806.024320935778!2d78.3630342!3d17.45855!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x83caa45fc340abd9%3A0xee9b39daa6d27739!2sNexdesk%20Coworking%20spaces!5e0!3m2!1sen!2sin!4v1781446910793!5m2!1sen!2sin" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={true} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>

            </div>

            {/* ========================================== */}
            {/* RIGHT COLUMN: CONTACT FORM BRIEFING        */}
            {/* ========================================== */}
            <div className="lg:col-span-7 bg-white border border-black/5 p-8 md:p-12 shadow-luxury space-y-8">
              
              <div className="space-y-2">
                <span className="text-xs tracking-widest text-brand-black/40 font-bold uppercase block">Acquisition Protocol</span>
                <h2 className="text-serif text-3xl font-light text-brand-black">Register Curation Query</h2>
                <p className="text-sm font-light text-brand-black/50 font-sans leading-relaxed">
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
                        <label className="text-xs tracking-[0.2em] uppercase font-bold text-brand-black/50">First Name*</label>
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
                        <label className="text-xs tracking-[0.2em] uppercase font-bold text-brand-black/50">Last Name*</label>
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
                        <label className="text-xs tracking-[0.2em] uppercase font-bold text-brand-black/50">Email Address*</label>
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
                        <label className="text-xs tracking-[0.2em] uppercase font-bold text-brand-black/50">Mobile Number*</label>
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
                      <label className="text-xs tracking-[0.2em] uppercase font-bold text-brand-black/50">Message Query</label>
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
                      <label htmlFor="privacy-agree" className="text-xs leading-relaxed text-brand-black/50 cursor-pointer select-none">
                        I understand that by submitting my details, I may receive promotional emails. I can opt out whenever I choose, and my information will remain private and never be sold.
                      </label>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting || !agree}
                      className="w-full py-4 bg-brand-black hover:bg-brand-red disabled:bg-brand-black/35 text-white text-xs tracking-[0.3em] font-extrabold uppercase transition-all duration-300 flex items-center justify-center space-x-2 shadow-luxury focus:outline-none"
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
