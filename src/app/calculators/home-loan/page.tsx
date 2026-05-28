"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calculator, Check, ArrowRight, TrendingUp, Info } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function HomeLoanCalculatorPage() {
  const [income, setIncome] = useState(150000);
  const [existingEmi, setExistingEmi] = useState(0);
  const [tenure, setTenure] = useState(20);
  const [rate, setRate] = useState(8.5);
  const [calculated, setCalculated] = useState(false);

  // Maximum EMI = 40% of net income (industry FOIR standard)
  const maxEmi = (income * 0.40) - existingEmi;
  const eligibleLoan = maxEmi > 0 ? Math.floor((maxEmi * (Math.pow(1 + rate / 1200, tenure * 12) - 1)) / ((rate / 1200) * Math.pow(1 + rate / 1200, tenure * 12))) : 0;
  const monthlyEmi = eligibleLoan > 0 ? Math.floor(eligibleLoan * (rate / 1200) * Math.pow(1 + rate / 1200, tenure * 12) / (Math.pow(1 + rate / 1200, tenure * 12) - 1)) : 0;
  const totalPayable = monthlyEmi * tenure * 12;
  const totalInterest = totalPayable - eligibleLoan;

  const formatCr = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        <section className="pt-28 pb-12 bg-brand-black overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #D31E28, transparent 60%)" }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-4">
              <Calculator size={10} className="text-white" />
              <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-white">Free Calculator</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">Home Loan Eligibility Calculator</h1>
            <p className="text-sm text-white/55 font-medium max-w-xl">Find out exactly how much home loan you qualify for based on your income, existing obligations, and preferred tenure.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Controls */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-7">
                <h2 className="text-xl font-extrabold text-brand-black">Enter Your Details</h2>

                {[
                  { label: "Monthly Net Income (₹)", value: income, setter: setIncome, min: 30000, max: 1000000, step: 5000, format: (v: number) => `₹${v.toLocaleString("en-IN")}` },
                  { label: "Existing Monthly EMIs (₹)", value: existingEmi, setter: setExistingEmi, min: 0, max: 200000, step: 1000, format: (v: number) => `₹${v.toLocaleString("en-IN")}` },
                  { label: "Loan Tenure (Years)", value: tenure, setter: setTenure, min: 5, max: 30, step: 1, format: (v: number) => `${v} Years` },
                  { label: "Interest Rate (% p.a.)", value: rate, setter: setRate, min: 6, max: 15, step: 0.1, format: (v: number) => `${v.toFixed(1)}%` },
                ].map(field => (
                  <div key={field.label} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-brand-black uppercase tracking-wide">{field.label}</label>
                      <span className="text-sm font-extrabold text-brand-red bg-brand-red/5 px-3 py-1 rounded-full">{field.format(field.value)}</span>
                    </div>
                    <input
                      type="range" min={field.min} max={field.max} step={field.step} value={field.value}
                      onChange={e => { field.setter(parseFloat(e.target.value)); setCalculated(true); }}
                      className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-red"
                    />
                    <div className="flex justify-between text-[9px] font-bold text-gray-400">
                      <span>{field.format(field.min)}</span><span>{field.format(field.max)}</span>
                    </div>
                  </div>
                ))}

                <div className="p-4 bg-blue-50 border border-blue-100 rounded-2xl flex gap-3">
                  <Info size={14} className="text-blue-500 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-blue-700 font-medium leading-relaxed">Based on RBI's standard FOIR (Fixed Obligation to Income Ratio) of 40%. Actual eligibility may vary by bank.</p>
                </div>
              </div>

              {/* Results */}
              <div className="space-y-5">
                <motion.div animate={{ scale: calculated ? [1, 1.02, 1] : 1 }} transition={{ duration: 0.3 }} className="bg-brand-black rounded-3xl p-8 text-white space-y-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">Maximum Loan Eligibility</p>
                  <p className="text-5xl font-extrabold text-white">{formatCr(eligibleLoan)}</p>
                  <p className="text-xs text-white/40 font-medium">Based on your income and existing obligations</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Monthly EMI", value: formatCr(monthlyEmi), sub: "approx." },
                    { label: "Total Interest Payable", value: formatCr(totalInterest), sub: "over loan tenure" },
                    { label: "Total Amount Payable", value: formatCr(totalPayable), sub: "principal + interest" },
                    { label: "FOIR Available", value: `₹${Math.max(0, maxEmi).toLocaleString("en-IN")}`, sub: "per month for EMI" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 space-y-1">
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{stat.label}</p>
                      <p className="text-lg font-extrabold text-brand-black">{stat.value}</p>
                      <p className="text-[9px] text-gray-400 font-medium">{stat.sub}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-3 shadow-sm">
                  <p className="text-xs font-extrabold text-brand-black">Properties within your eligibility</p>
                  <div className="space-y-2">
                    {["Up to ₹1 Cr — Narsingi Apartments", "₹1–3 Cr — Tellapur Villas", "₹3–5 Cr — Kokapet Premium Residences"].map(r => (
                      <div key={r} className="flex items-center gap-2 text-xs font-medium text-gray-600">
                        <Check size={12} className="text-emerald-500 shrink-0" />{r}
                      </div>
                    ))}
                  </div>
                  <Link href="/properties" className="w-full flex items-center justify-center gap-2 py-3 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-extrabold uppercase rounded-xl transition-all mt-2">
                    Browse Matching Properties <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className="py-16 bg-gray-50/40 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-extrabold text-brand-black mb-8">Tips to Maximise Your Loan Eligibility</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { title: "Close Existing Loans First", desc: "Reducing or eliminating existing EMIs directly increases your eligible loan amount under FOIR calculations." },
                { title: "Add a Co-Applicant", desc: "Adding a working spouse or parent significantly increases combined income and thus boosts eligibility by 30–60%." },
                { title: "Choose Longer Tenure", desc: "Extending tenure from 15 to 25 years reduces monthly EMI, increasing the eligible principal amount substantially." },
              ].map(tip => (
                <div key={tip.title} className="bg-white border border-gray-100 rounded-2xl p-7 space-y-2 shadow-sm">
                  <TrendingUp size={18} className="text-brand-red" />
                  <h3 className="text-sm font-extrabold text-brand-black">{tip.title}</h3>
                  <p className="text-xs text-gray-500 font-medium leading-relaxed">{tip.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
