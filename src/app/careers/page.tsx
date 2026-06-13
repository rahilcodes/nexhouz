"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, MapPin, Clock, ArrowRight, Check, ChevronDown, ChevronUp, Target, Handshake, Coins, Home, GraduationCap, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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

export default function CareersPage() {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [applied, setApplied] = useState<string[]>([]);

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-brand-black overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 70% 30%, #D31E28, transparent 60%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
                <Briefcase size={10} className="text-white" />
                <span className="text-xs font-extrabold tracking-[0.2em] uppercase text-white">We're Hiring</span>
              </div>
              <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight">
                Build the Future of<br /><span className="text-brand-red">Hyderabad Real Estate.</span>
              </h1>
              <p className="text-sm text-white/55 font-medium leading-relaxed">
                Join a small, high-impact team that is rewriting how people buy, sell, and invest in Hyderabad property. We value deep expertise, honest thinking, and genuine care for our clients.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }} className="grid grid-cols-2 gap-4">
              {[
                { value: "20+", label: "Team Members" },
                { value: "4.9★", label: "Glassdoor Rating" },
                { value: "100%", label: "Commission Free Culture" },
                { value: "₹8–35L", label: "Compensation Range" },
              ].map(s => (
                <div key={s.label} className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center space-y-1 backdrop-blur-sm">
                  <p className="text-3xl font-extrabold text-white">{s.value}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/40">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Culture */}
        <section className="py-16 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-10 space-y-2">
              <p className="text-xs font-extrabold uppercase tracking-widest text-brand-red">Our Culture</p>
              <h2 className="text-3xl font-extrabold text-brand-black">Why people love working at NexHouz</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { icon: Target, title: "Impact from Day One", desc: "No six-month onboarding queues. You will handle real clients and make real decisions from your first week." },
                { icon: Handshake, title: "Radical Transparency", desc: "No politics, no back channels. Everyone knows the company's numbers, direction, and priorities." },
                { icon: Coins, title: "Exceptional Compensation", desc: "We pay top-quartile salaries because great people deserve great pay — without performance games." },
                { icon: Home, title: "Market Access", desc: "Work on Hyderabad's most exclusive off-market properties and learn the real estate business from the inside." },
                { icon: GraduationCap, title: "Continuous Learning", desc: "Annual learning budget, RERA certification support, legal training, and regular expert workshops." },
                { icon: Heart, title: "Work-Life Balance", desc: "Flexible hybrid and remote options. We measure output, not hours spent pretending to be busy." },
              ].map(item => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-gray-50 border border-gray-100 rounded-2xl p-7 space-y-4 hover:bg-white hover:border-brand-red/15 hover:shadow-md transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand-red/5 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all duration-300">
                      <Icon size={20} className="stroke-[1.8]" />
                    </div>
                    <h3 className="text-sm font-extrabold text-brand-black">{item.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{item.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Open Roles */}
        <section className="py-20">
          <div className="max-w-4xl mx-auto px-6">
            <div className="space-y-3 mb-10">
              <p className="text-xs font-extrabold uppercase tracking-widest text-brand-red">Open Positions</p>
              <h2 className="text-4xl font-extrabold text-brand-black">{openings.length} Open Roles</h2>
            </div>
            <div className="space-y-4">
              {openings.map((role, idx) => {
                const isOpen = expanded === role.id;
                const hasApplied = applied.includes(role.id);
                return (
                  <motion.div key={role.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.3, delay: idx * 0.08 }} className={`border rounded-2xl overflow-hidden transition-all ${isOpen ? "border-brand-red/30 shadow-md" : "border-gray-100 shadow-sm hover:border-gray-200"}`}>
                    <button onClick={() => setExpanded(isOpen ? null : role.id)} className="w-full flex items-center justify-between p-6 text-left cursor-pointer group">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center shrink-0 group-hover:bg-brand-red/5 transition-colors">
                          <Briefcase size={16} className="text-gray-500 group-hover:text-brand-red transition-colors" />
                        </div>
                        <div>
                          <h3 className="text-base font-extrabold text-brand-black group-hover:text-brand-red transition-colors">{role.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 mt-1">
                            <span className="text-xs font-bold text-brand-red bg-brand-red/5 border border-brand-red/15 px-2.5 py-0.5 rounded-full">{role.department}</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-gray-400"><MapPin size={9} />{role.location}</span>
                            <span className="flex items-center gap-1 text-xs font-bold text-gray-400"><Clock size={9} />{role.experience}</span>
                            <span className="text-xs font-bold text-gray-400">{role.type}</span>
                          </div>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={18} className="text-brand-red shrink-0" /> : <ChevronDown size={18} className="text-gray-400 shrink-0" />}
                    </button>

                    {isOpen && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="border-t border-gray-100 px-6 pb-7 space-y-6">
                        <div className="pt-5">
                          <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400 mb-2">About the Role</p>
                          <p className="text-sm text-gray-600 leading-relaxed font-medium">{role.description}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-3">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Requirements</p>
                            {role.requirements.map(r => (
                              <div key={r} className="flex items-start gap-2.5 text-sm font-medium text-brand-black">
                                <Check size={13} className="text-brand-red shrink-0 mt-0.5" />{r}
                              </div>
                            ))}
                          </div>
                          <div className="space-y-3">
                            <p className="text-xs font-extrabold uppercase tracking-widest text-gray-400">What You Get</p>
                            {role.perks.map(p => (
                              <div key={p} className="flex items-start gap-2.5 text-sm font-medium text-brand-black">
                                <Check size={13} className="text-emerald-500 shrink-0 mt-0.5" />{p}
                              </div>
                            ))}
                          </div>
                        </div>
                        <button
                          onClick={() => setApplied(prev => [...prev, role.id])}
                          disabled={hasApplied}
                          className={`flex items-center gap-2 px-7 py-3.5 text-sm font-extrabold uppercase tracking-wider rounded-full transition-all cursor-pointer ${hasApplied ? "bg-emerald-500 text-white" : "bg-brand-red hover:bg-brand-red/90 text-white hover:scale-105 shadow-lg shadow-brand-red/20"}`}
                        >
                          {hasApplied ? <><Check size={14} /> Application Received!</> : <><ArrowRight size={14} /> Apply for this Role</>}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-12 bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center space-y-3">
              <p className="text-lg font-extrabold text-brand-black">Don't see your role? We'd still love to hear from you.</p>
              <p className="text-sm text-gray-500 font-medium">Send your resume and a note about how you can contribute to NexHouz.</p>
              <a href="mailto:careers@nexhouz.com" className="inline-flex items-center gap-2 text-sm font-bold text-brand-red hover:underline">
                careers@nexhouz.com <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
