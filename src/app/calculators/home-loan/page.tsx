"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, ArrowRight, TrendingUp, Info } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Reveal, Eyebrow } from "@/components/ui/theme";

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
    <div className="font-archivo bg-white">
      <Navbar />
      <main className="min-h-screen">
        {/* Page header band */}
        <section className={`${SECTION_X} pt-12 pb-12 lg:pt-16 lg:pb-16 bg-[#FAF7F1]`}>
          <div className={CONTAINER}>
            <Eyebrow>Tools · Free Calculator</Eyebrow>
            <h1 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
              Home Loan Eligibility Calculator
            </h1>
            <p className="text-[15px] lg:text-[17px] leading-[1.7] text-[#57534a] mt-3 lg:mt-4 max-w-xl">
              Find out exactly how much home loan you qualify for based on your income, existing obligations, and preferred tenure.
            </p>
          </div>
        </section>

        <section className={`${SECTION_X} py-14 lg:py-20 bg-white`}>
          <div className={CONTAINER}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start max-w-[1180px] mx-auto">
              {/* Controls */}
              <Reveal>
                <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-8 space-y-7">
                  <h2 className="text-[20px] lg:text-[22px] font-semibold text-[#0A0A0A]">Enter Your Details</h2>

                  {[
                    { label: "Monthly Net Income (₹)", value: income, setter: setIncome, min: 30000, max: 1000000, step: 5000, format: (v: number) => `₹${v.toLocaleString("en-IN")}` },
                    { label: "Existing Monthly EMIs (₹)", value: existingEmi, setter: setExistingEmi, min: 0, max: 200000, step: 1000, format: (v: number) => `₹${v.toLocaleString("en-IN")}` },
                    { label: "Loan Tenure (Years)", value: tenure, setter: setTenure, min: 5, max: 30, step: 1, format: (v: number) => `${v} Years` },
                    { label: "Interest Rate (% p.a.)", value: rate, setter: setRate, min: 6, max: 15, step: 0.1, format: (v: number) => `${v.toFixed(1)}%` },
                  ].map(field => (
                    <div key={field.label} className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">{field.label}</label>
                        <span className="text-sm font-semibold text-[#D31E28] bg-[#FAF7F1] border border-[#EEE9E0] px-3 py-1 rounded-full whitespace-nowrap">{field.format(field.value)}</span>
                      </div>
                      <input
                        type="range" min={field.min} max={field.max} step={field.step} value={field.value}
                        onChange={e => { field.setter(parseFloat(e.target.value)); setCalculated(true); }}
                        className="w-full h-2 bg-[#EEE9E0] rounded-full appearance-none cursor-pointer accent-[#D31E28]"
                      />
                      <div className="flex justify-between text-xs font-medium text-[#948d7c]">
                        <span>{field.format(field.min)}</span><span>{field.format(field.max)}</span>
                      </div>
                    </div>
                  ))}

                  <div className="p-4 bg-[#F6F1E7] border border-[#EEE9E0] rounded-2xl flex gap-3">
                    <Info size={15} className="text-[#8A6D2F] shrink-0 mt-0.5" />
                    <p className="text-sm text-[#57534a] leading-relaxed">Based on RBI&apos;s standard FOIR (Fixed Obligation to Income Ratio) of 40%. Actual eligibility may vary by bank.</p>
                  </div>
                </div>
              </Reveal>

              {/* Results */}
              <Reveal delay={0.08}>
                <div className="space-y-4 lg:space-y-5">
                  <motion.div animate={{ scale: calculated ? [1, 1.02, 1] : 1 }} transition={{ duration: 0.3 }} className="bg-[#0A0A0A] rounded-2xl p-6 lg:p-8 text-white space-y-2">
                    <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-white/50">Maximum Loan Eligibility</p>
                    <p className="font-display font-semibold text-[44px] lg:text-[52px] leading-none text-white">{formatCr(eligibleLoan)}</p>
                    <p className="text-[13px] text-white/45">Based on your income and existing obligations</p>
                  </motion.div>

                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    {[
                      { label: "Monthly EMI", value: formatCr(monthlyEmi), sub: "approx." },
                      { label: "Total Interest Payable", value: formatCr(totalInterest), sub: "over loan tenure" },
                      { label: "Total Amount Payable", value: formatCr(totalPayable), sub: "principal + interest" },
                      { label: "FOIR Available", value: `₹${Math.max(0, maxEmi).toLocaleString("en-IN")}`, sub: "per month for EMI" },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white border border-[#EEE9E0] rounded-2xl p-5 text-center space-y-1">
                        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">{stat.label}</p>
                        <p className="text-lg lg:text-[20px] font-semibold text-[#0A0A0A]">{stat.value}</p>
                        <p className="text-xs text-[#6b6659]">{stat.sub}</p>
                      </div>
                    ))}
                  </div>

                  <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 space-y-3">
                    <p className="text-[15px] font-semibold text-[#0A0A0A]">Properties within your eligibility</p>
                    <div className="space-y-2">
                      {["Up to ₹1 Cr — Narsingi Apartments", "₹1–3 Cr — Tellapur Villas", "₹3–5 Cr — Kokapet Premium Residences"].map(r => (
                        <div key={r} className="flex items-center gap-2.5 text-sm text-[#57534a]">
                          <Check size={14} className="text-[#D31E28] shrink-0" strokeWidth={3} />{r}
                        </div>
                      ))}
                    </div>
                    <Link href="/properties" className="w-full flex items-center justify-center gap-2 bg-[#D31E28] hover:bg-[#B8171F] text-white text-[15px] font-semibold rounded-lg px-7 py-4 transition-colors mt-2">
                      Browse Matching Properties <ArrowRight size={14} />
                    </Link>
                  </div>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* Tips */}
        <section className={`${SECTION_X} py-14 lg:py-20 bg-[#FAF7F1]`}>
          <div className={CONTAINER}>
            <Reveal>
              <Eyebrow>Expert Guidance</Eyebrow>
              <h2 className="font-display font-semibold text-[26px] md:text-[34px] lg:text-[40px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 mb-6 lg:mb-10">
                Tips to Maximise Your Loan Eligibility
              </h2>
            </Reveal>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-5">
              {[
                { title: "Close Existing Loans First", desc: "Reducing or eliminating existing EMIs directly increases your eligible loan amount under FOIR calculations." },
                { title: "Add a Co-Applicant", desc: "Adding a working spouse or parent significantly increases combined income and thus boosts eligibility by 30–60%." },
                { title: "Choose Longer Tenure", desc: "Extending tenure from 15 to 25 years reduces monthly EMI, increasing the eligible principal amount substantially." },
              ].map((tip, i) => (
                <Reveal key={tip.title} delay={i * 0.07}>
                  <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-7 space-y-2.5 h-full">
                    <TrendingUp size={20} className="text-[#D31E28]" />
                    <h3 className="text-[17px] font-semibold text-[#0A0A0A]">{tip.title}</h3>
                    <p className="text-[14.5px] text-[#6b6659] leading-[1.6]">{tip.desc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
