"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Globe, ShieldCheck, FileText, AlertTriangle, ArrowRight, Check, Star, Users } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function SecondOpinionPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden">
          <div className="absolute inset-0 opacity-20" style={{ backgroundImage: "radial-gradient(circle at 30% 60%, #D31E28, transparent 55%)" }} />
          <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full">
                <Globe size={10} className="text-white" />
                <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-white">Neutral Expert Review</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight tracking-tight">
                Someone Already Showed You a Property?<br />
                <span className="text-brand-red">Get a Second Opinion.</span>
              </h1>
              <p className="text-sm text-white/60 font-medium leading-relaxed">
                Before you sign anything — let our certified, commission-free advisors review the legal documents, builder track record, and pricing fairness of any property you've been shown.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-brand-red hover:bg-brand-red/90 text-white text-sm font-extrabold uppercase tracking-wider rounded-full transition-all hover:scale-105 shadow-lg shadow-brand-red/20">
                  Request Free Review <ArrowRight size={14} />
                </Link>
                <Link href="/expert-advisory" className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white/10 hover:bg-white/20 text-white text-sm font-bold uppercase tracking-wider rounded-full transition-all border border-white/20">
                  Meet Our Advisors
                </Link>
              </div>
            </motion.div>

            {/* Risk signals card */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} className="bg-white/5 border border-white/10 rounded-3xl p-8 space-y-4 backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-6">
                <AlertTriangle size={16} className="text-amber-400" />
                <p className="text-sm font-extrabold text-white">Common Red Flags We Catch</p>
              </div>
              {[
                "Title deed disputes and pending litigations",
                "Unregistered or lapsed RERA projects",
                "Inflated pricing above actual market value",
                "Pending GHMC completion certificates",
                "Unclear property tax or encumbrance history",
                "Developer track record of delayed delivery",
              ].map((flag) => (
                <div key={flag} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-brand-red/20 flex items-center justify-center shrink-0 mt-0.5">
                    <AlertTriangle size={10} className="text-brand-red" />
                  </div>
                  <p className="text-xs text-white/70 font-medium">{flag}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-14 space-y-3">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">The Process</p>
              <h2 className="text-4xl font-extrabold text-brand-black">How Our Second Opinion Works</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
              {[
                { num: "01", title: "Share Property Details", desc: "Send us the builder name, property address, and any documents you've received." },
                { num: "02", title: "Legal Audit", desc: "We run title deed checks, RERA verification, and GHMC clearance audits." },
                { num: "03", title: "Market Valuation", desc: "Our team benchmarks the quoted price against current comparable transactions." },
                { num: "04", title: "Clear Written Report", desc: "You receive an honest, jargon-free report with a clear Go / Proceed with Caution / Avoid recommendation." },
              ].map(step => (
                <motion.div key={step.num} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }} className="bg-gray-50 border border-gray-100 rounded-3xl p-7 space-y-3 hover:border-brand-red/20 hover:bg-white transition-all">
                  <span className="text-5xl font-extrabold text-brand-red/15 block">{step.num}</span>
                  <h3 className="text-sm font-extrabold text-brand-black">{step.title}</h3>
                  <p className="text-xs text-gray-500 leading-relaxed font-medium">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What's Included */}
        <section className="py-20 bg-gray-50/40">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-4">
                <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">What You Get</p>
                <h2 className="text-4xl font-extrabold text-brand-black">A complete, unbiased property health check.</h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">Unlike brokers who earn commissions on your deal, our advisors are paid only by you — which means their only goal is to protect your interests.</p>
                {[
                  "Full RERA registration verification",
                  "Title deed and encumbrance certificate check",
                  "Builder track record and litigation scan",
                  "Fair market price benchmarking",
                  "GHMC completion certificate status",
                  "Written recommendation within 48 hours",
                  "One follow-up consultation included",
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-brand-red flex items-center justify-center shrink-0">
                      <Check size={10} className="text-white" />
                    </div>
                    <span className="text-sm font-semibold text-brand-black">{item}</span>
                  </div>
                ))}
              </div>
              <div className="bg-white border border-gray-100 rounded-3xl p-10 shadow-sm space-y-6">
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-brand-red">Pricing</p>
                  <p className="text-5xl font-extrabold text-brand-black">₹5,999</p>
                  <p className="text-xs text-gray-400 font-medium">One-time fee per property review</p>
                </div>
                <div className="border-t border-gray-100 pt-6 space-y-3">
                  {["Delivery within 48 hours", "100% commission-free advice", "Covers any property in Hyderabad", "No follow-up sales pressure"].map(f => (
                    <div key={f} className="flex items-center gap-2.5 text-sm font-medium text-brand-black">
                      <Check size={14} className="text-emerald-500" />{f}
                    </div>
                  ))}
                </div>
                <Link href="/contact" className="w-full flex items-center justify-center gap-2 py-4 bg-brand-red hover:bg-brand-red/90 text-white font-extrabold uppercase tracking-wide text-sm rounded-xl transition-all shadow-lg shadow-brand-red/20">
                  Request Second Opinion <ArrowRight size={14} />
                </Link>
                <p className="text-[10px] text-center text-gray-400">Satisfaction guaranteed. Full refund if we can't assess your property.</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
