"use client";

import { useState } from "react";
import { UserCheck, Check, Clock, Shield, Award } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Reveal, Eyebrow } from "@/components/ui/theme";


export default function ExpertAdvisoryPage() {
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
