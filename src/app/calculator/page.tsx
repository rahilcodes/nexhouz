"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Info, ChevronDown, ChevronUp } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Eyebrow } from "@/components/ui/theme";

export default function CalculatorPage() {
  // Input parameters
  const [propertyPrice, setPropertyPrice] = useState<number>(100000000); // ₹10 Cr
  const [downPaymentPercent, setDownPaymentPercent] = useState<number>(20); // 20%
  const [interestRate, setInterestRate] = useState<number>(5.5); // 5.5%
  const [tenureYears, setTenureYears] = useState<number>(20); // 20 Years

  // Output calculations
  const [downPayment, setDownPayment] = useState<number>(2000000);
  const [loanAmount, setLoanAmount] = useState<number>(8000000);
  const [monthlyEMI, setMonthlyEMI] = useState<number>(0);
  const [totalInterest, setTotalInterest] = useState<number>(0);
  const [totalPayment, setTotalPayment] = useState<number>(0);
  const [suggestedIncome, setSuggestedIncome] = useState<number>(0);

  const [showAmortization, setShowAmortization] = useState<boolean>(false);

  // Perform financial calculations on inputs change
  useEffect(() => {
    const down = (propertyPrice * downPaymentPercent) / 100;
    const loan = propertyPrice - down;

    const r = (interestRate / 100) / 12;
    const n = tenureYears * 12;

    let emi = 0;
    if (r === 0) {
      emi = loan / n;
    } else {
      emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    const totPay = emi * n;
    const totInt = totPay - loan;
    const sugAnnual = (emi / 0.35) * 12;

    setDownPayment(down);
    setLoanAmount(loan);
    setMonthlyEMI(emi);
    setTotalInterest(totInt);
    setTotalPayment(totPay);
    setSuggestedIncome(sugAnnual);
  }, [propertyPrice, downPaymentPercent, interestRate, tenureYears]);

  const generateAmortizationSchedule = () => {
    let balance = loanAmount;
    const r = (interestRate / 100) / 12;
    const emi = monthlyEMI;
    const schedule = [];

    for (let year = 1; year <= tenureYears; year++) {
      let yearInterest = 0;
      let yearPrincipal = 0;

      for (let month = 1; month <= 12; month++) {
        const interest = balance * r;
        const principal = emi - interest;

        yearInterest += interest;
        yearPrincipal += principal;
        balance -= principal;
      }

      if (balance < 0) balance = 0;

      schedule.push({
        year,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        remainingBalance: balance,
      });
    }

    return schedule;
  };

  const amortizationData = generateAmortizationSchedule();

  // SVG Donut calculation
  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const principalPercentage = 100 - interestPercentage;

  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const interestStrokeOffset = circumference - (interestPercentage / 100) * circumference;

  const sliderClass = "w-full h-1.5 bg-[#EEE9E0] rounded-full appearance-none cursor-pointer accent-[#D31E28]";
  const sliderLabel = "flex justify-between items-center text-[13px] tracking-[0.1em] uppercase font-semibold text-[#948d7c]";
  const sliderScale = "flex justify-between text-[11px] text-[#948d7c] font-semibold";

  return (
    <div className="font-archivo bg-white">
      <Navbar />

      {/* Header band */}
      <section className={`${SECTION_X} pt-12 pb-12 lg:pt-16 lg:pb-16 bg-[#FAF7F1] border-b border-[#EEE9E0]`}>
        <div className={`${CONTAINER} max-w-[760px]`}>
          <Eyebrow>Mortgage Analytics</Eyebrow>
          <h1 className="font-display font-semibold text-[32px] md:text-[44px] lg:text-[52px] leading-[1.12] text-[#0A0A0A] mt-3 text-balance">
            Mortgage &amp; yield calculator.
          </h1>
          <p className="text-[16px] lg:text-lg leading-[1.7] text-[#57534a] mt-4 max-w-[560px]">
            Model your acquisition in real time — monthly EMI, total interest, and the income you&apos;d want to carry it
            comfortably.
          </p>
        </div>
      </section>

      <section className={`${SECTION_X} py-14 lg:py-20 bg-white`}>
        <div className={CONTAINER}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Controls */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-8 space-y-8 shadow-[0_1px_3px_rgba(30,25,15,0.04)]">
                {/* Property value */}
                <div className="space-y-3.5">
                  <div className={sliderLabel}>
                    <span>Property value</span>
                    <span className="text-[#0A0A0A] font-bold text-[13px]">₹{propertyPrice.toLocaleString()}</span>
                  </div>
                  <input type="range" min={10000000} max={300000000} step={1000000} value={propertyPrice} onChange={(e) => setPropertyPrice(parseInt(e.target.value))} className={sliderClass} />
                  <div className={sliderScale}><span>₹1 Cr</span><span>₹15 Cr</span><span>₹30 Cr</span></div>
                </div>

                {/* Down payment */}
                <div className="space-y-3.5">
                  <div className={sliderLabel}>
                    <span>Down payment</span>
                    <span className="text-[#0A0A0A] font-bold text-[13px]">{downPaymentPercent}% (₹{downPayment.toLocaleString()})</span>
                  </div>
                  <input type="range" min={10} max={50} step={1} value={downPaymentPercent} onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))} className={sliderClass} />
                  <div className={sliderScale}><span>10%</span><span>30%</span><span>50%</span></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Interest rate */}
                  <div className="space-y-3.5">
                    <div className={sliderLabel}>
                      <span>Interest rate</span>
                      <span className="text-[#0A0A0A] font-bold text-[13px]">{interestRate}%</span>
                    </div>
                    <input type="range" min={2} max={12} step={0.1} value={interestRate} onChange={(e) => setInterestRate(parseFloat(e.target.value))} className={sliderClass} />
                    <div className={sliderScale}><span>2%</span><span>7%</span><span>12%</span></div>
                  </div>

                  {/* Tenure */}
                  <div className="space-y-3.5">
                    <div className={sliderLabel}>
                      <span>Loan tenure</span>
                      <span className="text-[#0A0A0A] font-bold text-[13px]">{tenureYears} Years</span>
                    </div>
                    <input type="range" min={5} max={30} step={1} value={tenureYears} onChange={(e) => setTenureYears(parseInt(e.target.value))} className={sliderClass} />
                    <div className={sliderScale}><span>5 Yrs</span><span>15 Yrs</span><span>30 Yrs</span></div>
                  </div>
                </div>
              </div>

              {/* Guidelines */}
              <div className="bg-[#FAF7F1] border border-[#EEE9E0] rounded-2xl p-6 flex items-start gap-4">
                <Info size={18} className="text-[#D31E28] flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-[13px] font-semibold text-[#0A0A0A] tracking-wide uppercase">Indicative estimate</h4>
                  <p className="text-[14.5px] text-[#57534a] leading-relaxed mt-1">
                    These figures are algorithmic estimates for planning. Exact lender terms, processing fees, and eligibility
                    vary by bank and your financial profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-[#0A0A0A] text-white rounded-2xl p-6 lg:p-8 space-y-7">
                {/* EMI */}
                <div>
                  <span className="text-[11px] tracking-widest font-bold text-white/40 uppercase block">Monthly EMI</span>
                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="font-display font-semibold text-[44px] lg:text-[48px] leading-none text-white">
                      ₹{Math.round(monthlyEMI).toLocaleString()}
                    </span>
                    <span className="text-[13px] text-white/50">/ month</span>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Breakdown */}
                <div className="grid grid-cols-2 gap-5">
                  <div>
                    <span className="text-[11px] tracking-widest text-white/40 font-bold uppercase block">Down Payment</span>
                    <span className="text-[15px] font-semibold">₹{Math.round(downPayment).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-widest text-white/40 font-bold uppercase block">Loan Principal</span>
                    <span className="text-[15px] font-semibold">₹{Math.round(loanAmount).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-widest text-white/40 font-bold uppercase block">Interest Cost</span>
                    <span className="text-[15px] font-semibold text-[#ff6b73]">₹{Math.round(totalInterest).toLocaleString()}</span>
                  </div>
                  <div>
                    <span className="text-[11px] tracking-widest text-white/40 font-bold uppercase block">Target Income</span>
                    <span className="text-[15px] font-semibold text-emerald-400">₹{Math.round(suggestedIncome).toLocaleString()}</span>
                  </div>
                </div>

                <div className="h-px bg-white/10" />

                {/* Donut */}
                <div className="flex items-center gap-8">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg width="112" height="112" viewBox="0 0 120 120" className="transform -rotate-90">
                      <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#222222" strokeWidth="12" />
                      <circle
                        cx="60" cy="60" r={radius} fill="transparent" stroke="#FFFFFF" strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference - (principalPercentage / 100) * circumference}
                      />
                      <circle
                        cx="60" cy="60" r={radius} fill="transparent" stroke="#D31E28" strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={interestStrokeOffset}
                        className="transition-all duration-700 ease-out"
                        style={{ transformOrigin: "60px 60px", transform: `rotate(${(principalPercentage / 100) * 360}deg)` }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-[10px] tracking-widest font-bold text-white/30 uppercase leading-none">Interest</span>
                      <span className="text-[15px] font-bold text-[#ff6b73] leading-none mt-1">{Math.round(interestPercentage)}%</span>
                    </div>
                  </div>

                  <div className="space-y-3 flex-grow text-[13px]">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                        <span className="text-white/70">Principal</span>
                      </div>
                      <span className="font-semibold">{Math.round(principalPercentage)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#D31E28] block" />
                        <span className="text-white/70">Interest</span>
                      </div>
                      <span className="font-semibold text-[#ff6b73]">{Math.round(interestPercentage)}%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Amortization */}
          <div className="mt-12 lg:mt-16 border border-[#EEE9E0] rounded-2xl overflow-hidden">
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full bg-[#FAF7F1] px-6 lg:px-8 py-5 flex items-center justify-between font-semibold text-[13px] tracking-widest text-[#0A0A0A] uppercase focus:outline-none cursor-pointer"
            >
              <span>View amortization schedule</span>
              {showAmortization ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>

            <AnimatePresence>
              {showAmortization && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden bg-white"
                >
                  <div className="p-6 lg:p-8 overflow-x-auto">
                    <table className="w-full text-left text-[13px] min-w-[600px]">
                      <thead>
                        <tr className="border-b border-[#EEE9E0] text-[11px] tracking-widest font-bold uppercase text-[#948d7c]">
                          <th className="pb-3">Year</th>
                          <th className="pb-3 text-right">Principal Paid</th>
                          <th className="pb-3 text-right">Interest Paid</th>
                          <th className="pb-3 text-right">Remaining Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#f0ebe1]">
                        {amortizationData.map((row) => (
                          <tr key={row.year} className="hover:bg-[#FAF7F1]/50 transition-colors">
                            <td className="py-4 font-semibold text-[#0A0A0A]">Year {row.year}</td>
                            <td className="py-4 text-right text-[#57534a]">₹{Math.round(row.principalPaid).toLocaleString()}</td>
                            <td className="py-4 text-right text-[#D31E28]">₹{Math.round(row.interestPaid).toLocaleString()}</td>
                            <td className="py-4 text-right font-medium text-[#0A0A0A]">₹{Math.round(row.remainingBalance).toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
