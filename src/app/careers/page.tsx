"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, Check, ChevronDown, ChevronUp, Target, Handshake, Coins, Home, GraduationCap, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, Reveal, Eyebrow } from "@/components/ui/theme";

const openings = [
  {
    id: "role-1", title: "Senior Property Advisor", department: "Advisory", type: "Full-time", location: "Hyderabad (Hybrid)", experience: "5–12 Years",
    description: "Lead client relationships, conduct property site visits, advise on legal due diligence, and close high-value property transactions for our premium client base.",
    requirements: ["5+ years Hyderabad real estate experience", "RERA certification preferred", "Strong Telugu & English communication", "Proven deal closure track record"],
    perks: ["₹12–25 LPA + performance bonus", "Medical insurance for family", "Flexible hybrid schedule", "Direct access to exclusive off-market listings"],
  },
  {
    id: "role-2", title: "Legal & RERA Analyst", department: "Legal", type: "Full-time", location: "Hyderabad (On-site)", experience: "3–8 Years",
    description: "Conduct thorough RERA verification, title deed audits, GHMC clearance checks, and encumbrance certificate reviews for all properties in our pipeline.",
    requirements: ["LLB degree with property law specialization", "RERA filing experience", "Knowledge of GHMC regulations", "3+ years property legal experience"],
    perks: ["₹8–18 LPA", "Professional development budget", "Health & dental insurance", "Research library and legal tool access"],
  },
  {
    id: "role-3", title: "AI / Product Engineer", department: "Technology", type: "Full-time", location: "Hyderabad (Remote-first)", experience: "3–7 Years",
    description: "Build and improve our AI-powered property matching engine, client recommendation systems, and data analytics infrastructure.",
    requirements: ["Strong Python / Node.js background", "Experience with ML recommendation models", "API design and system architecture", "Real estate domain knowledge is a bonus"],
    perks: ["₹18–35 LPA", "Remote-first culture", "Equity participation", "Latest MacBook and tools budget"],
  },
  {
    id: "role-4", title: "NRI Client Specialist", department: "Advisory", type: "Full-time", location: "Hyderabad (Remote-OK)", experience: "2–6 Years",
    description: "Manage the full NRI client journey — from virtual tours and remote buying assistance to loan coordination, legal representation, and property management.",
    requirements: ["Experience with NRI transaction process", "Familiarity with FEMA regulations for NRI purchases", "Excellent written and video communication", "Availability to work across time zones"],
    perks: ["₹8–16 LPA + commission", "Flexible hours across time zones", "Travel allowance for client site visits", "Premium property access"],
  },
];

const culture = [
  { icon: Target, title: "Impact from Day One", desc: "No six-month onboarding queues. You will handle real clients and make real decisions from your first week." },
  { icon: Handshake, title: "Radical Transparency", desc: "No politics, no back channels. Everyone knows the company's numbers, direction, and priorities." },
  { icon: Coins, title: "Exceptional Compensation", desc: "We pay top-quartile salaries because great people deserve great pay — without performance games." },
  { icon: Home, title: "Market Access", desc: "Work on Hyderabad's most exclusive off-market properties and learn the real estate business from the inside." },
  { icon: GraduationCap, title: "Continuous Learning", desc: "Annual learning budget, RERA certification support, legal training, and regular expert workshops." },
  { icon: Heart, title: "Work-Life Balance", desc: "Flexible hybrid and remote options. We measure output, not hours spent pretending to be busy." },
];

export default function CareersPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applied, setApplied] = useState<string[]>([]);

  return (
    <div className="font-archivo bg-white">
      <Navbar />
      <main>

        {/* ================================================================ */}
        {/* HERO — warm split layout with stat tiles                          */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
          <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}>
            <Reveal>
              <div className="inline-flex items-center gap-2.5 bg-white border border-[#eadfd0] rounded-lg px-4 py-2.5 text-[13px] font-semibold tracking-[0.14em] uppercase text-[#8A6D2F] shadow-[0_2px_8px_rgba(30,25,15,0.06)]">
                <Briefcase size={13} className="text-[#8A6D2F]" />
                We&apos;re Hiring
              </div>
              <h1 className="font-display font-semibold text-[34px] md:text-[46px] lg:text-[54px] leading-[1.15] lg:leading-[1.1] text-[#0A0A0A] mt-5 text-balance">
                Build the future of <span className="text-[#D31E28]">Hyderabad real estate.</span>
              </h1>
              <p className="text-[15.5px] lg:text-[17px] leading-[1.7] text-[#57534a] mt-4 lg:mt-5 max-w-[540px]">
                Join a small, high-impact team that is rewriting how people buy, sell, and invest in Hyderabad
                property. We value deep expertise, honest thinking, and genuine care for our clients.
              </p>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="grid grid-cols-2 gap-3 lg:gap-[18px]">
                {[
                  { value: "20+", label: "Team Members" },
                  { value: "4.9★", label: "Glassdoor Rating" },
                  { value: "100%", label: "Commission Free Culture" },
                  { value: "₹8–35L", label: "Compensation Range" },
                ].map((s) => (
                  <div
                    key={s.label}
                    className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-[30px] lg:px-[26px] text-center shadow-[0_1px_3px_rgba(30,25,15,0.04)]"
                  >
                    <div className="text-[26px] lg:text-[32px] leading-none font-semibold text-[#0A0A0A]">{s.value}</div>
                    <div className="text-[13px] lg:text-[14.5px] leading-normal text-[#6b6659] mt-2">{s.label}</div>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CULTURE                                                           */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-white">
          <div className={CONTAINER}>
            <Reveal className="text-center max-w-[720px] mx-auto mb-6 lg:mb-12">
              <Eyebrow>Our Culture</Eyebrow>
              <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
                Why people love working at NexHouz
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-6">
              {culture.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <Reveal key={item.title} delay={(idx % 3) * 0.08}>
                    <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-8 h-full shadow-[0_1px_3px_rgba(30,25,15,0.04)]">
                      <div className="w-12 h-12 rounded-[14px] bg-[#faf0f0] flex items-center justify-center text-[#D31E28]">
                        <Icon size={20} className="stroke-[1.8]" />
                      </div>
                      <h3 className="text-[17px] lg:text-[19px] font-semibold text-[#0A0A0A] mt-5">{item.title}</h3>
                      <p className="text-[14.5px] lg:text-[15px] leading-[1.65] text-[#57534a] mt-2.5">{item.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* OPEN ROLES                                                        */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
          <div className={`${CONTAINER} max-w-[980px]`}>
            <Reveal className="mb-6 lg:mb-10">
              <Eyebrow>Open Positions</Eyebrow>
              <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4">
                {openings.length} open roles
              </h2>
            </Reveal>

            <div className="space-y-4">
              {openings.map((role, idx) => {
                const isOpen = expanded === role.id;
                const hasApplied = applied.includes(role.id);
                return (
                  <Reveal key={role.id} delay={idx * 0.06}>
                    <div
                      className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                        isOpen
                          ? "border-[#D31E28]/40 shadow-[0_10px_30px_rgba(30,25,15,0.08)]"
                          : "border-[#EEE9E0] shadow-[0_1px_3px_rgba(30,25,15,0.04)] hover:border-[#d8d2c6]"
                      }`}
                    >
                      <button
                        onClick={() => setExpanded(isOpen ? null : role.id)}
                        className="w-full flex items-center justify-between gap-4 p-5 lg:p-6 text-left cursor-pointer group"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-11 h-11 rounded-xl bg-[#FAF7F1] flex items-center justify-center shrink-0 group-hover:bg-[#faf0f0] transition-colors">
                            <Briefcase size={17} className="text-[#948d7c] group-hover:text-[#D31E28] transition-colors" />
                          </div>
                          <div>
                            <h3 className="text-[17px] lg:text-[18px] font-semibold text-[#0A0A0A] group-hover:text-[#D31E28] transition-colors">
                              {role.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1.5">
                              <span className="text-[12.5px] font-bold text-[#D31E28] bg-[#faf0f0] border border-[#D31E28]/15 px-2.5 py-0.5 rounded-full">
                                {role.department}
                              </span>
                              <span className="flex items-center gap-1 text-[13px] font-medium text-[#948d7c]">
                                <MapPin size={11} />
                                {role.location}
                              </span>
                              <span className="flex items-center gap-1 text-[13px] font-medium text-[#948d7c]">
                                <Clock size={11} />
                                {role.experience}
                              </span>
                              <span className="text-[13px] font-medium text-[#948d7c]">{role.type}</span>
                            </div>
                          </div>
                        </div>
                        {isOpen ? (
                          <ChevronUp size={18} className="text-[#D31E28] shrink-0" />
                        ) : (
                          <ChevronDown size={18} className="text-[#948d7c] shrink-0" />
                        )}
                      </button>

                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="border-t border-[#EEE9E0] px-5 lg:px-6 pb-7 space-y-6"
                        >
                          <div className="pt-5">
                            <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#948d7c] mb-2">About the Role</p>
                            <p className="text-[15px] leading-[1.7] text-[#57534a]">{role.description}</p>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#948d7c]">Requirements</p>
                              {role.requirements.map((r) => (
                                <div key={r} className="flex items-start gap-2.5 text-[14.5px] font-medium text-[#0A0A0A]">
                                  <Check size={14} className="text-[#D31E28] shrink-0 mt-0.5" strokeWidth={3} />
                                  {r}
                                </div>
                              ))}
                            </div>
                            <div className="space-y-3">
                              <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#948d7c]">What You Get</p>
                              {role.perks.map((p) => (
                                <div key={p} className="flex items-start gap-2.5 text-[14.5px] font-medium text-[#0A0A0A]">
                                  <Check size={14} className="text-emerald-500 shrink-0 mt-0.5" strokeWidth={3} />
                                  {p}
                                </div>
                              ))}
                            </div>
                          </div>
                          <button
                            onClick={() => setApplied(prev => [...prev, role.id])}
                            disabled={hasApplied}
                            className={`flex items-center gap-2 px-7 py-4 text-[15px] font-semibold rounded-lg transition-colors cursor-pointer ${
                              hasApplied
                                ? "bg-emerald-500 text-white"
                                : "bg-[#D31E28] hover:bg-[#B8171F] text-white shadow-[0_4px_14px_rgba(211,30,40,0.25)]"
                            }`}
                          >
                            {hasApplied ? (
                              <>
                                <Check size={15} strokeWidth={3} /> Application Received!
                              </>
                            ) : (
                              <>
                                <ArrowRight size={15} /> Apply for this Role
                              </>
                            )}
                          </button>
                        </motion.div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SPECULATIVE CTA — dark band                                       */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#0A0A0A]">
          <div className={CONTAINER}>
            <Reveal className="max-w-[760px] mx-auto text-center">
              <Eyebrow light>Don&apos;t See Your Role?</Eyebrow>
              <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-white mt-3 lg:mt-4 text-balance">
                We&apos;d still love to hear from you.
              </h2>
              <p className="text-[15px] lg:text-[17px] leading-[1.7] text-white/65 mt-4 max-w-[520px] mx-auto">
                Send your resume and a note about how you can contribute to NexHouz.
              </p>
              <a
                href="mailto:careers@nexhouz.com"
                className="inline-flex items-center justify-center gap-2 bg-[#D31E28] hover:bg-[#B8171F] text-white text-base font-semibold rounded-lg px-7 py-4 mt-7 shadow-[0_4px_14px_rgba(211,30,40,0.25)] transition-colors"
              >
                careers@nexhouz.com <ArrowRight size={15} />
              </a>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
