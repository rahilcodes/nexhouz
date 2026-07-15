"use client";

import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Reveal, Eyebrow } from "@/components/ui/theme";

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
    if (n >= 10000000) return `₹${parseFloat((n / 10000000).toFixed(2))} Cr`;
    if (n >= 100000) return `₹${parseFloat((n / 100000).toFixed(2))} Lakhs`;
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
    <div className="font-archivo bg-white">
      <Navbar />
      <main className="min-h-screen">
        {/* Page header band */}
        <section className={`${SECTION_X} pt-12 pb-12 lg:pt-16 lg:pb-16 bg-[#FAF7F1]`}>
          <div className={CONTAINER}>
            <Eyebrow>Tools · EMI Calculator</Eyebrow>
            <h1 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
              Property EMI Calculator
            </h1>
            <p className="text-[15px] lg:text-[17px] leading-[1.7] text-[#57534a] mt-3 lg:mt-4 max-w-xl">
              Calculate your exact monthly EMI, total interest outgo, and view a year-by-year repayment schedule for any property loan.
            </p>
          </div>
        </section>

        <section className={`${SECTION_X} py-14 lg:py-20 bg-white`}>
          <div className={CONTAINER}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start max-w-[1180px] mx-auto">
              {/* Sliders */}
              <Reveal>
                <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-8 space-y-7">
                  <h2 className="text-[20px] lg:text-[22px] font-semibold text-[#0A0A0A]">Loan Parameters</h2>
                  {[
                    { label: "Loan Amount", value: principal, setter: setPrincipal, min: 1000000, max: 50000000, step: 100000, format: (v: number) => formatCr(v) },
                    { label: "Interest Rate (% p.a.)", value: rate, setter: setRate, min: 6, max: 15, step: 0.1, format: (v: number) => `${v.toFixed(1)}%` },
                    { label: "Loan Tenure (Years)", value: tenure, setter: setTenure, min: 1, max: 30, step: 1, format: (v: number) => `${v} Years` },
                  ].map(field => (
                    <div key={field.label} className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <label className="text-[13px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">{field.label}</label>
                        <span className="text-sm font-semibold text-[#D31E28] bg-[#FAF7F1] border border-[#EEE9E0] px-3 py-1 rounded-full whitespace-nowrap">{field.format(field.value)}</span>
                      </div>
                      <input type="range" min={field.min} max={field.max} step={field.step} value={field.value} onChange={e => field.setter(parseFloat(e.target.value))} className="w-full h-2 bg-[#EEE9E0] rounded-full appearance-none cursor-pointer accent-[#D31E28]" />
                      <div className="flex justify-between text-xs font-medium text-[#948d7c]">
                        <span>{field.format(field.min)}</span><span>{field.format(field.max)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Reveal>

              {/* Results */}
              <Reveal delay={0.08}>
                <div className="space-y-4 lg:space-y-5">
                  <div className="bg-[#0A0A0A] rounded-2xl p-6 lg:p-8 text-white text-center space-y-2">
                    <p className="text-[13px] font-semibold tracking-[0.1em] uppercase text-white/50">Monthly EMI</p>
                    <p className="font-display font-semibold text-[48px] lg:text-[56px] leading-none">{formatCr(emi)}</p>
                    <p className="text-[13px] text-white/45">per month for {tenure} years</p>
                  </div>

                  <div className="grid grid-cols-2 gap-3 lg:gap-4">
                    {[
                      { label: "Principal Amount", value: formatCr(principal), color: "text-[#0A0A0A]" },
                      { label: "Total Interest", value: formatCr(totalInterest), color: "text-[#D31E28]" },
                      { label: "Total Payable", value: formatCr(totalPayable), color: "text-[#0A0A0A]" },
                      { label: "Interest %", value: `${interestPercent}%`, color: "text-[#8A6D2F]" },
                    ].map(stat => (
                      <div key={stat.label} className="bg-white border border-[#EEE9E0] rounded-2xl p-5 text-center">
                        <p className="text-[11px] font-semibold tracking-[0.1em] uppercase text-[#948d7c]">{stat.label}</p>
                        <p className={`text-lg lg:text-[22px] font-semibold ${stat.color} mt-1.5`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Donut chart proxy */}
                  <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 flex items-center gap-6">
                    <div className="relative w-24 h-24 shrink-0">
                      <svg viewBox="0 0 36 36" className="w-24 h-24 -rotate-90">
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#EEE9E0" strokeWidth="3" />
                        <circle cx="18" cy="18" r="15.9" fill="none" stroke="#D31E28" strokeWidth="3" strokeDasharray={`${interestPercent} ${100 - interestPercent}`} />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <p className="text-[11px] font-semibold tracking-[0.08em] uppercase text-[#948d7c]">Interest</p>
                        <p className="text-sm font-semibold text-[#D31E28]">{interestPercent}%</p>
                      </div>
                    </div>
                    <div className="space-y-2.5">
                      <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-[#e0d9cb]" /><span className="text-sm font-medium text-[#57534a]">Principal: {principalPercent}%</span></div>
                      <div className="flex items-center gap-2.5"><div className="w-2.5 h-2.5 rounded-full bg-[#D31E28]" /><span className="text-sm font-medium text-[#57534a]">Interest: {interestPercent}%</span></div>
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Amortisation Table */}
            <Reveal className="mt-12 lg:mt-16 max-w-[1180px] mx-auto">
              <h2 className="font-display font-semibold text-[24px] md:text-[30px] lg:text-[34px] leading-[1.2] text-[#0A0A0A] mb-6">Year-by-Year Repayment Schedule</h2>
              <div className="overflow-x-auto rounded-2xl border border-[#EEE9E0]">
                <table className="w-full text-sm">
                  <thead className="bg-[#0A0A0A] text-white">
                    <tr>
                      {["Year", "Principal Paid", "Interest Paid", "Outstanding Balance"].map(h => (
                        <th key={h} className="text-left px-5 py-4 text-[11px] font-semibold uppercase tracking-[0.1em] whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {yearlyData.map((row, i) => (
                      <tr key={row.year} className={i % 2 === 0 ? "bg-[#FAF7F1]" : "bg-white"}>
                        <td className="px-5 py-3 font-semibold text-[#0A0A0A] whitespace-nowrap">Year {row.year}</td>
                        <td className="px-5 py-3 font-medium text-[#8A6D2F] whitespace-nowrap">{formatCr(row.principal)}</td>
                        <td className="px-5 py-3 font-medium text-[#D31E28] whitespace-nowrap">{formatCr(row.interest)}</td>
                        <td className="px-5 py-3 font-semibold text-[#0A0A0A] whitespace-nowrap">{formatCr(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
