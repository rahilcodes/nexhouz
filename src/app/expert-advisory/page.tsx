"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { UserCheck, ArrowRight, Star, Check, Phone, Clock, Shield, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const advisors = [
  {
    name: "Ravi Shankar Reddy",
    title: "Senior Property Advisor",
    specialization: "Luxury Villas & Kokapet Corridor",
    experience: "14 Years",
    deals: "340+",
    rating: 4.9,
    image: "/images/real_estate_advisor_portrait.png",
    languages: ["Telugu", "English", "Hindi"],
    available: true,
  },
  {
    name: "Priya Venkatesh",
    title: "NRI Investment Specialist",
    specialization: "NRI Investments & Financial District",
    experience: "11 Years",
    deals: "280+",
    rating: 4.8,
    image: "/images/expert_advisory_visual.png",
    languages: ["Telugu", "English"],
    available: true,
  },
  {
    name: "Suresh Mohan Varma",
    title: "Legal & RERA Expert",
    specialization: "Legal Clearances & Title Deeds",
    experience: "17 Years",
    deals: "520+",
    rating: 5.0,
    image: "/images/purchase_tracker_visual.png",
    languages: ["Telugu", "English", "Hindi"],
    available: false,
  },
];

export default function ExpertAdvisoryPage() {
  const [selectedAdvisor, setSelectedAdvisor] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", phone: "", budget: "", location: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-white overflow-hidden">
          <div className="absolute inset-0 architectural-grid opacity-50" />
          <div className="relative max-w-7xl mx-auto px-6 text-center space-y-5">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/5 border border-brand-red/20 rounded-full mb-5">
                <UserCheck size={10} className="text-brand-red" />
                <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-brand-red">Certified Human Advisors</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-brand-black leading-tight tracking-tight mb-5">
                Your Dedicated<br /><span className="text-brand-red">Property Expert</span> in Hyderabad.
              </h1>
              <p className="text-sm text-gray-500 font-medium max-w-2xl mx-auto leading-relaxed">
                Work one-on-one with a certified Hyderabad real estate advisor. No sales targets, no commission pressure — just honest, personalized guidance from people who know the city like the back of their hand.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }} className="flex flex-wrap justify-center gap-6 pt-4">
              {[
                { icon: Award, label: "RERA Certified Advisors" },
                { icon: Shield, label: "100% Commission Free" },
                { icon: Clock, label: "4-Hour Response Time" },
                { icon: Star, label: "4.9★ Average Rating" },
              ].map((badge) => {
                const Icon = badge.icon;
                return (
                  <div key={badge.label} className="flex items-center gap-2 px-4 py-2 bg-gray-50 border border-gray-100 rounded-full">
                    <Icon size={13} className="text-brand-red" />
                    <span className="text-xs font-bold text-brand-black">{badge.label}</span>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </section>

        {/* Advisor Cards */}
        <section className="py-20 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="space-y-3 mb-12">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Meet the Team</p>
              <h2 className="text-4xl font-extrabold text-brand-black">Our Certified Property Advisors</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {advisors.map((advisor, idx) => (
                <motion.div key={advisor.name} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4, delay: idx * 0.1 }} className={`bg-white border rounded-3xl overflow-hidden shadow-sm hover:shadow-lg transition-all ${selectedAdvisor === advisor.name ? "border-brand-red" : "border-gray-100"}`}>
                  <div className="relative aspect-[4/3] bg-gray-100 overflow-hidden">
                    <img src={advisor.image} alt={advisor.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider ${advisor.available ? "bg-emerald-500 text-white" : "bg-gray-600 text-white"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${advisor.available ? "bg-white animate-pulse" : "bg-gray-400"}`} />
                        {advisor.available ? "Available Today" : "Next Available"}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full">
                      <Star size={11} className="fill-amber-400 text-amber-400" />
                      <span className="text-xs font-extrabold text-brand-black">{advisor.rating}</span>
                    </div>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-lg font-extrabold text-brand-black">{advisor.name}</h3>
                      <p className="text-xs text-brand-red font-bold">{advisor.title}</p>
                      <p className="text-xs text-gray-500 font-medium mt-0.5">{advisor.specialization}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-extrabold text-brand-black">{advisor.experience}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Experience</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3 text-center">
                        <p className="text-xl font-extrabold text-brand-black">{advisor.deals}</p>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">Deals Closed</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {advisor.languages.map(l => (
                        <span key={l} className="px-2.5 py-1 bg-gray-100 rounded-full text-[10px] font-bold text-gray-600">{l}</span>
                      ))}
                    </div>
                    <button
                      onClick={() => setSelectedAdvisor(selectedAdvisor === advisor.name ? null : advisor.name)}
                      className="w-full py-3 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-wider rounded-xl transition-all cursor-pointer"
                    >
                      {selectedAdvisor === advisor.name ? "✓ Selected" : "Book This Advisor"}
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Booking Form */}
        <section id="book" className="py-20 bg-gray-50/40 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
              <div className="space-y-5">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Free Consultation</p>
                <h2 className="text-4xl font-extrabold text-brand-black">Book Your Expert Session</h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">One free 45-minute strategy call with a senior Hyderabad advisor. No obligation. No spam. Just expert guidance on your next best move.</p>
                {[
                  "Personalized property shortlist within 24 hours",
                  "Deep-dive into your budget and commute needs",
                  "Legal briefing on your shortlisted area",
                  "Post-session written summary of recommendations",
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center shrink-0">
                      <Check size={10} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-brand-black">{item}</span>
                  </div>
                ))}
              </div>

              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                {!submitted ? (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-extrabold text-brand-black mb-1">Request Your Free Session</h3>
                    {selectedAdvisor && (
                      <div className="flex items-center gap-2 p-3 bg-brand-red/5 border border-brand-red/20 rounded-xl">
                        <UserCheck size={14} className="text-brand-red" />
                        <span className="text-xs font-bold text-brand-red">Booking with: {selectedAdvisor}</span>
                      </div>
                    )}
                    {[
                      { label: "Your Name", field: "name", type: "text", placeholder: "e.g. Siddharth Reddy" },
                      { label: "Phone Number", field: "phone", type: "tel", placeholder: "+91 99889 98899" },
                      { label: "Your Budget", field: "budget", type: "text", placeholder: "e.g. ₹1.5 Cr – ₹3 Cr" },
                      { label: "Preferred Location", field: "location", type: "text", placeholder: "e.g. Kokapet or anywhere in Hyderabad" },
                    ].map(f => (
                      <div key={f.field} className="space-y-1">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{f.label}</label>
                        <input type={f.type} required value={(form as any)[f.field]} onChange={e => setForm({ ...form, [f.field]: e.target.value })} placeholder={f.placeholder} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-red transition-all" />
                      </div>
                    ))}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Anything specific?</label>
                      <textarea rows={3} value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Any questions, property concerns, or requirements…" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 rounded-xl text-sm font-medium focus:outline-none focus:border-brand-red transition-all resize-none" />
                    </div>
                    <button type="submit" className="w-full py-4 bg-brand-red hover:bg-brand-red/90 text-white font-extrabold uppercase tracking-wider text-sm rounded-xl transition-all shadow-lg shadow-brand-red/15">
                      Book Free Expert Session
                    </button>
                  </form>
                ) : (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto">
                      <Check size={26} className="text-white" />
                    </div>
                    <h4 className="text-xl font-extrabold text-brand-black">Session Booked!</h4>
                    <p className="text-sm text-gray-500 font-medium">Your advisor will reach out within 4 hours to confirm your session time.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
