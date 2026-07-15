"use client";

import { useState } from "react";
import { UserCheck, Star, Check, Clock, Shield, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Reveal, Eyebrow } from "@/components/ui/theme";

const advisors = [
  {
    name: "Senior Property Consultant",
    title: "Residential Curation Specialist",
    specialization: "Luxury Villas & Kokapet Corridor",
    experience: "14 Years",
    deals: "340+",
    rating: 4.9,
    image: "/images/real_estate_advisor_portrait.png",
    languages: ["Telugu", "English", "Hindi"],
    available: true,
  },
  {
    name: "NRI Investment Specialist",
    title: "Overseas Portfolio Advisor",
    specialization: "NRI Investments & Financial District",
    experience: "11 Years",
    deals: "280+",
    rating: 4.8,
    image: "/images/expert_advisory_visual.png",
    languages: ["Telugu", "English"],
    available: true,
  },
  {
    name: "Legal & RERA Advisor",
    title: "Property Law Specialist",
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

  const inputClass =
    "w-full border-[1.5px] border-[#e0d9cb] rounded-[10px] px-[18px] py-3.5 text-base text-[#0A0A0A] placeholder-[#948d7c] focus:outline-none focus:border-[#D31E28] transition-colors bg-white";
  const labelClass = "text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c] mb-1.5 block";

  return (
    <div className="font-archivo bg-white">
      <Navbar />

      {/* Hero */}
      <section className={`${SECTION_X} pt-12 pb-12 lg:pt-16 lg:pb-16 bg-[#FAF7F1] border-b border-[#EEE9E0]`}>
        <div className={`${CONTAINER} text-center`}>
          <Reveal className="max-w-[820px] mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-white border border-[#eadfd0] rounded-full mb-5">
              <UserCheck size={12} className="text-[#D31E28]" />
              <span className="text-[12px] font-semibold tracking-[0.2em] uppercase text-[#8A6D2F]">Certified Human Advisors</span>
            </div>
            <h1 className="font-display font-semibold text-[32px] md:text-[46px] lg:text-[54px] leading-[1.12] text-[#0A0A0A] text-balance">
              Your dedicated property expert in Hyderabad.
            </h1>
            <p className="text-base lg:text-lg text-[#57534a] max-w-2xl mx-auto leading-[1.7] mt-4">
              Work one-on-one with a certified Hyderabad real estate advisor. No sales targets, no commission pressure —
              just honest, personalized guidance from people who know the city.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: Award, label: "RERA Certified Advisors" },
              { icon: Shield, label: "100% Commission Free" },
              { icon: Clock, label: "4-Hour Response Time" },
              { icon: Star, label: "4.9★ Average Rating" },
            ].map((badge) => {
              const Icon = badge.icon;
              return (
                <div key={badge.label} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-[#EEE9E0] rounded-full">
                  <Icon size={14} className="text-[#D31E28]" />
                  <span className="text-[13px] font-semibold text-[#2b2823]">{badge.label}</span>
                </div>
              );
            })}
          </Reveal>
        </div>
      </section>

      {/* Advisor cards */}
      <section className={`${SECTION_X} py-14 lg:py-20 bg-white`}>
        <div className={CONTAINER}>
          <Reveal className="mb-8 lg:mb-12">
            <Eyebrow>Meet the Team</Eyebrow>
            <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.15] text-[#0A0A0A] mt-3">
              Our certified property advisors.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            {advisors.map((advisor, idx) => (
              <Reveal key={advisor.name} delay={idx * 0.08}>
                <div
                  className={`bg-white border rounded-2xl overflow-hidden h-full flex flex-col transition-all hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] ${
                    selectedAdvisor === advisor.name ? "border-[#D31E28]" : "border-[#EEE9E0]"
                  }`}
                >
                  <div className="relative aspect-[4/3] bg-[#efeae1] overflow-hidden">
                    <img src={advisor.image} alt={advisor.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/55 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${advisor.available ? "bg-emerald-500 text-white" : "bg-[#57534a] text-white"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${advisor.available ? "bg-white animate-pulse" : "bg-white/50"}`} />
                        {advisor.available ? "Available Today" : "Next Available"}
                      </div>
                    </div>
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-white/95 px-2.5 py-1 rounded-full">
                      <Star size={11} className="fill-[#8A6D2F] text-[#8A6D2F]" />
                      <span className="text-[12px] font-bold text-[#0A0A0A]">{advisor.rating}</span>
                    </div>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold text-[#0A0A0A]">{advisor.name}</h3>
                    <p className="text-[13px] text-[#D31E28] font-semibold mt-0.5">{advisor.title}</p>
                    <p className="text-[13px] text-[#6b6659] mt-0.5">{advisor.specialization}</p>
                    <div className="grid grid-cols-2 gap-3 mt-4">
                      <div className="bg-[#FAF7F1] rounded-xl p-3 text-center">
                        <p className="text-xl font-semibold text-[#0A0A0A]">{advisor.experience}</p>
                        <p className="text-[11px] text-[#948d7c] font-bold uppercase tracking-wide mt-0.5">Experience</p>
                      </div>
                      <div className="bg-[#FAF7F1] rounded-xl p-3 text-center">
                        <p className="text-xl font-semibold text-[#0A0A0A]">{advisor.deals}</p>
                        <p className="text-[11px] text-[#948d7c] font-bold uppercase tracking-wide mt-0.5">Deals Closed</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1.5 mt-4">
                      {advisor.languages.map((l) => (
                        <span key={l} className="px-2.5 py-1 bg-[#f4efe6] rounded-full text-[12px] font-semibold text-[#57534a]">{l}</span>
                      ))}
                    </div>
                    <a
                      href="#book"
                      onClick={() => setSelectedAdvisor(selectedAdvisor === advisor.name ? null : advisor.name)}
                      className="w-full mt-4 py-3.5 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-xs font-bold uppercase tracking-wider rounded-full transition-colors cursor-pointer text-center"
                    >
                      {selectedAdvisor === advisor.name ? "✓ Selected" : "Book This Advisor"}
                    </a>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section id="book" className={`${SECTION_X} py-14 lg:py-20 bg-[#FAF7F1] scroll-mt-4`}>
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start`}>
          <Reveal>
            <Eyebrow>Free Consultation</Eyebrow>
            <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.15] text-[#0A0A0A] mt-3 text-balance">
              Book your expert session.
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#57534a] mt-4">
              One free 45-minute strategy call with a senior Hyderabad advisor. No obligation. No spam. Just expert
              guidance on your next best move.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              {[
                "Personalized property shortlist within 24 hours",
                "Deep-dive into your budget and commute needs",
                "Legal briefing on your shortlisted area",
                "Post-session written summary of recommendations",
              ].map((item) => (
                <div key={item} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-[#D31E28] flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[15px] font-medium text-[#2b2823]">{item}</span>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-8 shadow-[0_1px_3px_rgba(30,25,15,0.04)]">
              {!submitted ? (
                <form onSubmit={handleSubmit}>
                  <h3 className="text-[20px] lg:text-[22px] font-semibold text-[#0A0A0A]">Request your free session</h3>
                  {selectedAdvisor && (
                    <div className="flex items-center gap-2 p-3 bg-[#D31E28]/5 border border-[#D31E28]/20 rounded-xl mt-4">
                      <UserCheck size={14} className="text-[#D31E28]" />
                      <span className="text-[13px] font-semibold text-[#D31E28]">Booking with: {selectedAdvisor}</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-3.5 mt-4">
                    {[
                      { label: "Your Name", field: "name", type: "text", placeholder: "e.g. Siddharth Reddy" },
                      { label: "Phone Number", field: "phone", type: "tel", placeholder: "+91 99889 98899" },
                      { label: "Your Budget", field: "budget", type: "text", placeholder: "e.g. ₹1.5 Cr – ₹3 Cr" },
                      { label: "Preferred Location", field: "location", type: "text", placeholder: "e.g. Kokapet or anywhere in Hyderabad" },
                    ].map((f) => (
                      <div key={f.field}>
                        <label className={labelClass}>{f.label}</label>
                        <input
                          type={f.type}
                          required
                          value={(form as any)[f.field]}
                          onChange={(e) => setForm({ ...form, [f.field]: e.target.value })}
                          placeholder={f.placeholder}
                          className={inputClass}
                        />
                      </div>
                    ))}
                    <div>
                      <label className={labelClass}>Anything specific?</label>
                      <textarea
                        rows={3}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        placeholder="Any questions, property concerns, or requirements…"
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-[18px] bg-[#D31E28] hover:bg-[#B8171F] text-white font-semibold text-[17px] rounded-[10px] transition-colors shadow-[0_6px_18px_rgba(211,30,40,0.25)]"
                    >
                      Book free expert session
                    </button>
                  </div>
                </form>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mx-auto">
                    <Check size={26} className="text-white" strokeWidth={3} />
                  </div>
                  <h4 className="text-[22px] font-semibold text-[#0A0A0A] mt-4">Session booked</h4>
                  <p className="text-[15px] text-[#57534a] mt-2">Your advisor will reach out within 4 hours to confirm your session time.</p>
                </div>
              )}
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
