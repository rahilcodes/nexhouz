"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeftRight, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function EmiCalculatorPage() {
  const [principal, setPrincipal] = useState(5000000);
  const [rate, setRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const monthlyRate = rate / 1200;
  const n = tenure * 12;
  const emi = Math.round(principal * monthlyRate * Math.pow(1 + monthlyRate, n) / (Math.pow(1 + monthlyRate, n) - 1));
  const totalPayable = emi * n;
  const totalInterest = totalPayable - principal;
  const principalPercent = Math.round((principal / totalPayable) * 100);
  const interestPercent = 100 - principalPercent;

  const formatCr = (n: number) => {
    if (n >= 10000000) return `₹${(n / 10000000).toFixed(2)} Cr`;
    if (n >= 100000) return `₹${(n / 100000).toFixed(2)} L`;
    return `₹${n.toLocaleString("en-IN")}`;
  };

  // Build amortisation table (yearly summary)
  const yearlyData: { year: number; principal: number; interest: number; balance: number }[] = [];
  let balance = principal;
  for (let y = 1; y <= Math.min(tenure, 30); y++) {
    let yearPrincipal = 0, yearInterest = 0;
    for (let m = 0; m < 12; m++) {
      if (balance <= 0) break;
      const iPayment = Math.round(balance * monthlyRate);
      const pPayment = Math.min(emi - iPayment, balance);
      yearInterest += iPayment;
      yearPrincipal += pPayment;
      balance = Math.max(0, balance - pPayment);
    }
    yearlyData.push({ year: y, principal: yearPrincipal, interest: yearInterest, balance: Math.max(0, balance) });
  }

  return (
    <>
      <Navbar />
      <main className="bg-white min-h-screen">
        <section className="pt-28 pb-12 bg-brand-black overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #D31E28, transparent 60%)" }} />
          <div className="relative max-w-7xl mx-auto px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 border border-white/20 rounded-full mb-4">
              <ArrowLeftRight size={10} className="text-white" />
              <span className="text-[9px] font-extrabold tracking-[0.2em] uppercase text-white">EMI Calculator</span>
            </div>
            <h1 className="text-5xl font-extrabold text-white tracking-tight mb-4">Property EMI Calculator</h1>
            <p className="text-sm text-white/55 font-medium max-w-xl">Calculate your exact monthly EMI, total interest outgo, and view a year-by-year repayment schedule for any property loan.</p>
          </div>
        </section>

        <section className="py-16">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
              {/* Sliders */}
              <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm space-y-7">
                <h2 className="text-xl font-extrabold text-brand-black">Loan Parameters</h2>
                {[
                  { label: "Loan Amount", value: principal, setter: setPrincipal, min: 1000000, max: 50000000, step: 100000, format: (v: number) => formatCr(v) },
                  { label: "Interest Rate (% p.a.)", value: rate, setter: setRate, min: 6, max: 15, step: 0.1, format: (v: number) => `${v.toFixed(1)}%` },
                  { label: "Loan Tenure (Years)", value: tenure, setter: setTenure, min: 1, max: 30, step: 1, format: (v: number) => `${v} Years` },
                ].map(field => (
                  <div key={field.label} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-brand-black uppercase tracking-wide">{field.label}</label>
                      <span className="text-sm font-extrabold text-brand-red bg-brand-red/5 px-3 py-1 rounded-full">{field.format(field.value)}</span>
                    </div>
                    <input type="range" min={field.min} max={field.max} step={field.step} value={field.value} onChange={e => field.setter(parseFloat(e.target.value))} className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-brand-red" />
                    <div className="flex justify-between text-[9px] font-bold text-gray-400">
                      <span>{field.format(field.min)}</span><span>{field.format(field.max)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Results */}
              <div className="space-y-5">
                <div className="bg-brand-black rounded-3xl p-8 text-white text-center space-y-1">
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-white/50">Monthly EMI</p>
                  <p className="text-6xl font-extrabold">{formatCr(emi)}</p>
                  <p className="text-xs text-white/40 font-medium">per month for {tenure} years</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Principal Amount", value: formatCr(principal), color: "text-brand-black" },
                    { label: "Total Interest", value: formatCr(totalInterest), color: "text-brand-red" },
                    { label: "Total Payable", value: formatCr(totalPayable), color: "text-brand-black" },
                    { label: "Interest %", value: `${interestPercent}%`, color: "text-amber-600" },
                  ].map(stat => (
                    <div key={stat.label} className="bg-gray-50 border border-gray-100 rounded-2xl p-5">
                      <p className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400">{stat.label}</p>
                      <p className={`text-xl font-extrabold ${stat.color} mt-1`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Donut chart proxy */}
                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm flex items-center gap-6">
                  <div className="relative w-24 h-24 shrink-0">
                    <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f3f4f6" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D31E28" strokeWidth="3" strokeDasharray={`${interestPercent} ${100 - interestPercent}`} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <p className="text-[10px] font-extrabold text-gray-400">Interest</p>
                      <p className="text-sm font-extrabold text-brand-red">{interestPercent}%</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-gray-200" /><span className="text-xs font-bold text-gray-600">Principal: {principalPercent}%</span></div>
                    <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full bg-brand-red" /><span className="text-xs font-bold text-gray-600">Interest: {interestPercent}%</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Amortisation Table */}
            <div className="mt-12">
              <h2 className="text-2xl font-extrabold text-brand-black mb-6">Year-by-Year Repayment Schedule</h2>
              <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
                <table className="w-full text-sm">
                  <thead className="bg-brand-black text-white">
                    <tr>
                      {["Year", "Principal Paid", "Interest Paid", "Outstanding Balance"].map(h => (
                        <th key={h} className="text-left px-5 py-4 text-[10px] font-extrabold uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyData.map((row, i) => (
                      <tr key={row.year} className={i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}>
                        <td className="px-5 py-3 font-bold text-brand-black">Year {row.year}</td>
                        <td className="px-5 py-3 font-semibold text-emerald-600">{formatCr(row.principal)}</td>
                        <td className="px-5 py-3 font-semibold text-brand-red">{formatCr(row.interest)}</td>
                        <td className="px-5 py-3 font-bold text-brand-black">{formatCr(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
