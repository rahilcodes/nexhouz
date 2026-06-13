"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Percent,
  Calendar,
  DollarSign,
  Briefcase,
  Layers,
  ArrowRight,
  Info,
  TrendingDown,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

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
    
    // Monthly interest rate
    const r = (interestRate / 100) / 12;
    // Total months
    const n = tenureYears * 12;
    
    let emi = 0;
    if (r === 0) {
      emi = loan / n;
    } else {
      emi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }
    
    const totPay = emi * n;
    const totInt = totPay - loan;
    
    // Fintech Rule: EMI should not exceed 35% of monthly gross income
    const sugAnnual = (emi / 0.35) * 12;

    setDownPayment(down);
    setLoanAmount(loan);
    setMonthlyEMI(emi);
    setTotalInterest(totInt);
    setTotalPayment(totPay);
    setSuggestedIncome(sugAnnual);
  }, [propertyPrice, downPaymentPercent, interestRate, tenureYears]);

  // Dynamic Amortization schedule calculation
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

      // Safeguard final balance rounding
      if (balance < 0) balance = 0;

      schedule.push({
        year,
        principalPaid: yearPrincipal,
        interestPaid: yearInterest,
        remainingBalance: balance
      });
    }

    return schedule;
  };

  const amortizationData = generateAmortizationSchedule();

  // SVG Donut calculation
  const interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;
  const principalPercentage = 100 - interestPercentage;
  
  // SVG Stroke parameters
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const interestStrokeOffset = circumference - (interestPercentage / 100) * circumference;

  return (
    <>
      <Navbar />

      <main className="flex-grow bg-white min-h-screen pt-36 pb-32">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Header */}
          <div className="max-w-2xl space-y-4 mb-16 border-b border-brand-gray-dark pb-10">
            <span className="text-xs tracking-[0.3em] font-bold text-brand-red uppercase">Fintech Engine</span>
            <h1 className="text-serif text-4xl md:text-5xl font-light tracking-tight text-brand-black">
              Mortgage & Yield Analytics
            </h1>
            <p className="text-xs font-light text-brand-black/50 leading-relaxed font-sans max-w-lg">
              Deconstruct your spatial acquisitions using real-time debt algorithms. Calculate monthly amortizations and projected liquid income reserves.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* ========================================== */}
            {/* 1. CONTROLS / SLIDERS                      */}
            {/* ========================================== */}
            <div className="lg:col-span-7 space-y-8">
              
              <div className="glass-panel p-8 space-y-8 shadow-luxury relative">
                
                {/* Parameter: Property Value */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-brand-black/40">
                    <span>Property Index Value</span>
                    <span className="text-brand-black font-extrabold text-xs">₹{(propertyPrice).toLocaleString()}</span>
                  </div>
                  <input
                    type="range"
                    min={10000000}
                    max={300000000}
                    step={1000000}
                    value={propertyPrice}
                    onChange={(e) => setPropertyPrice(parseInt(e.target.value))}
                    className="w-full h-1 bg-brand-gray-dark appearance-none cursor-pointer accent-brand-red"
                  />
                  <div className="flex justify-between text-xs text-brand-black/40 font-bold">
                    <span>₹1 Cr</span>
                    <span>₹15 Cr</span>
                    <span>₹30 Cr</span>
                  </div>
                </div>

                {/* Parameter: Down Payment Percent */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-brand-black/40">
                    <span>Down Payment Allocation</span>
                    <span className="text-brand-black font-extrabold text-xs">
                      {downPaymentPercent}% (₹{downPayment.toLocaleString()})
                    </span>
                  </div>
                  <input
                    type="range"
                    min={10}
                    max={50}
                    step={1}
                    value={downPaymentPercent}
                    onChange={(e) => setDownPaymentPercent(parseInt(e.target.value))}
                    className="w-full h-1 bg-brand-gray-dark appearance-none cursor-pointer accent-brand-red"
                  />
                  <div className="flex justify-between text-xs text-brand-black/40 font-bold">
                    <span>10% (₹1 Cr)</span>
                    <span>30% (₹3 Cr)</span>
                    <span>50% (₹5 Cr)</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Parameter: Interest Rate */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-brand-black/40">
                      <span>Annual Cost of Debt</span>
                      <span className="text-brand-black font-extrabold text-xs">{interestRate}%</span>
                    </div>
                    <input
                      type="range"
                      min={2}
                      max={12}
                      step={0.1}
                      value={interestRate}
                      onChange={(e) => setInterestRate(parseFloat(e.target.value))}
                      className="w-full h-1 bg-brand-gray-dark appearance-none cursor-pointer accent-brand-red"
                    />
                    <div className="flex justify-between text-xs text-brand-black/40 font-bold">
                      <span>2.0%</span>
                      <span>7.0%</span>
                      <span>12.0%</span>
                    </div>
                  </div>

                  {/* Parameter: Tenure Years */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-xs tracking-widest uppercase font-bold text-brand-black/40">
                      <span>Loan Tenure Horizon</span>
                      <span className="text-brand-black font-extrabold text-xs">{tenureYears} Years</span>
                    </div>
                    <input
                      type="range"
                      min={5}
                      max={30}
                      step={1}
                      value={tenureYears}
                      onChange={(e) => setTenureYears(parseInt(e.target.value))}
                      className="w-full h-1 bg-brand-gray-dark appearance-none cursor-pointer accent-brand-red"
                    />
                    <div className="flex justify-between text-xs text-brand-black/40 font-bold">
                      <span>5 Yrs</span>
                      <span>15 Yrs</span>
                      <span>30 Yrs</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Informational Guidelines card */}
              <div className="bg-brand-gray p-6 flex items-start space-x-4 border border-black/5">
                <Info size={18} className="text-brand-red flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-brand-black tracking-wider uppercase">KYC Acquisition Standard</h4>
                  <p className="text-sm font-light text-brand-black/60 leading-relaxed font-sans">
                    These metrics represent algorithmic estimates for institutional capital analysis. Exact lender terms and private ledger certifications may vary based on international tax nodes and personal sovereign balance sheets.
                  </p>
                </div>
              </div>

            </div>

            {/* ========================================== */}
            {/* 2. RESULTS & CHARTS DISPLAY                */}
            {/* ========================================== */}
            <div className="lg:col-span-5 space-y-8">
              
              <div className="bg-brand-black text-white p-8 space-y-8 shadow-luxury relative overflow-hidden">
                <div className="absolute inset-0 opacity-5 architectural-grid pointer-events-none" />
                
                {/* Result: Monthly EMI */}
                <div className="space-y-2 relative z-10">
                  <span className="text-xs tracking-widest font-extrabold text-white/40 uppercase block">
                    Calculated Monthly Premium (EMI)
                  </span>
                  <div className="flex items-baseline space-x-1">
                    <span className="text-serif text-5xl font-light text-white">
                      ₹{Math.round(monthlyEMI).toLocaleString()}
                    </span>
                    <span className="text-xs text-white/50 font-medium font-sans">/ month</span>
                  </div>
                </div>

                <div className="h-px bg-white/10 relative z-10" />

                {/* Grid statistics breakdown */}
                <div className="grid grid-cols-2 gap-6 relative z-10">
                  
                  <div className="space-y-1">
                    <span className="text-xs tracking-widest text-white/40 font-bold uppercase block">Down Payment</span>
                    <span className="text-sm font-semibold">₹{Math.round(downPayment).toLocaleString()}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs tracking-widest text-white/40 font-bold uppercase block">Debt Principal</span>
                    <span className="text-sm font-semibold">₹{Math.round(loanAmount).toLocaleString()}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs tracking-widest text-white/40 font-bold uppercase block">Interest Cost</span>
                    <span className="text-sm font-semibold text-brand-red">₹{Math.round(totalInterest).toLocaleString()}</span>
                  </div>

                  <div className="space-y-1">
                    <span className="text-xs tracking-widest text-white/40 font-bold uppercase block">Target Income</span>
                    <span className="text-sm font-semibold text-emerald-400">₹{Math.round(suggestedIncome).toLocaleString()}</span>
                  </div>

                </div>

                <div className="h-px bg-white/10 relative z-10" />

                {/* SVG DONUT CHART */}
                <div className="flex items-center space-x-8 relative z-10">
                  <div className="relative w-28 h-28 flex items-center justify-center">
                    <svg width="112" height="112" viewBox="0 0 120 120" className="transform -rotate-90">
                      {/* Grey Base Track */}
                      <circle cx="60" cy="60" r={radius} fill="transparent" stroke="#222222" strokeWidth="12" />
                      {/* Principal (White segment) */}
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#FFFFFF"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={(circumference - (principalPercentage / 100) * circumference)}
                      />
                      {/* Interest (Red segment) */}
                      <circle
                        cx="60"
                        cy="60"
                        r={radius}
                        fill="transparent"
                        stroke="#D31E28"
                        strokeWidth="12"
                        strokeDasharray={circumference}
                        strokeDashoffset={interestStrokeOffset}
                        className="transition-all duration-700 ease-out"
                        style={{
                          transformOrigin: "60px 60px",
                          transform: `rotate(${(principalPercentage / 100) * 360}deg)`
                        }}
                      />
                    </svg>
                    
                    {/* Centered details */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                      <span className="text-xs tracking-widest font-extrabold text-white/30 uppercase leading-none">Interest</span>
                      <span className="text-sm font-bold text-brand-red leading-none mt-1">
                        {Math.round(interestPercentage)}%
                      </span>
                    </div>
                  </div>

                  {/* Chart Legend */}
                  <div className="space-y-3 flex-grow text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-white block" />
                        <span className="font-light text-white/70">Principal</span>
                      </div>
                      <span className="font-semibold">{Math.round(principalPercentage)}%</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-brand-red block" />
                        <span className="font-light text-white/70">Interest Cost</span>
                      </div>
                      <span className="font-semibold text-brand-red">{Math.round(interestPercentage)}%</span>
                    </div>
                  </div>
                </div>

              </div>

            </div>

          </div>

          {/* ========================================== */}
          {/* 3. AMORTIZATION SCHEDULE TABLE             */}
          {/* ========================================== */}
          <div className="mt-16 border border-black/5 shadow-luxury">
            <button
              onClick={() => setShowAmortization(!showAmortization)}
              className="w-full bg-brand-gray px-8 py-5 flex items-center justify-between font-bold text-xs tracking-widest text-brand-black uppercase focus:outline-none"
            >
              <span>View Amortization Schedule</span>
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
                  <div className="p-8 overflow-x-auto">
                    <table className="w-full text-left text-xs font-sans">
                      <thead>
                        <tr className="border-b border-brand-gray-dark pb-4 text-xs tracking-widest font-extrabold uppercase text-brand-black/40">
                          <th className="pb-3">Year Node</th>
                          <th className="pb-3 text-right">Principal Paid</th>
                          <th className="pb-3 text-right">Interest Paid</th>
                          <th className="pb-3 text-right">Remaining Balance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-gray">
                        {amortizationData.map((row) => (
                          <tr key={row.year} className="hover:bg-brand-gray/30 transition-colors duration-200">
                            <td className="py-4 font-semibold text-brand-black">Year {row.year}</td>
                            <td className="py-4 text-right text-brand-black/80">₹{Math.round(row.principalPaid).toLocaleString()}</td>
                            <td className="py-4 text-right text-brand-red/80">₹{Math.round(row.interestPaid).toLocaleString()}</td>
                            <td className="py-4 text-right font-medium text-brand-black">₹{Math.round(row.remainingBalance).toLocaleString()}</td>
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
      </main>

      <Footer />
    </>
  );
}
