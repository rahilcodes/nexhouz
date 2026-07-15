"use client";

import Link from "next/link";
import { AlertTriangle, ArrowRight, Check } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, SECTION_X, Reveal, Eyebrow } from "@/components/ui/theme";

export default function SecondOpinionPage() {
  const redFlags = [
    "Title deed disputes and pending litigations",
    "Unregistered or lapsed RERA projects",
    "Inflated pricing above actual market value",
    "Pending GHMC completion certificates",
    "Unclear property tax or encumbrance history",
    "Developer track record of delayed delivery",
  ];

  const steps = [
    { num: "01", title: "Share Property Details", desc: "Send us the builder name, property address, and any documents you've received." },
    { num: "02", title: "Legal Audit", desc: "We run title deed checks, RERA verification, and GHMC clearance audits." },
    { num: "03", title: "Market Valuation", desc: "Our team benchmarks the quoted price against current comparable transactions." },
    { num: "04", title: "Clear Written Report", desc: "You receive an honest, jargon-free report with a clear Go / Proceed with Caution / Avoid recommendation." },
  ];

  const included = [
    "Full RERA registration verification",
    "Title deed and encumbrance certificate check",
    "Builder track record and litigation scan",
    "Fair market price benchmarking",
    "GHMC completion certificate status",
    "Written recommendation within 48 hours",
    "One follow-up consultation included",
  ];

  return (
    <div className="font-archivo bg-white">
      <Navbar />

      {/* Hero — dark band */}
      <section className={`${SECTION_X} py-14 lg:py-20 bg-[#0A0A0A]`}>
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}>
          <Reveal>
            <Eyebrow light>Neutral Expert Review</Eyebrow>
            <h1 className="font-display font-semibold text-[32px] md:text-[46px] lg:text-[54px] leading-[1.12] text-white mt-3 text-balance">
              Someone already showed you a property? Get a second opinion.
            </h1>
            <p className="text-base lg:text-lg leading-[1.7] text-white/65 mt-4 max-w-[520px]">
              Before you sign anything, our certified, commission-free advisors review the legal documents, builder
              track record, and pricing fairness of any property you&apos;ve been shown.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-8">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D31E28] hover:bg-[#B8171F] text-white text-base font-semibold rounded-lg transition-colors shadow-[0_6px_18px_rgba(211,30,40,0.3)]"
              >
                Request free review <ArrowRight size={16} />
              </Link>
              <Link
                href="/expert-advisory"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 border-[1.5px] border-white/25 text-white text-base font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Meet our advisors
              </Link>
            </div>
          </Reveal>

          {/* Red flags card */}
          <Reveal delay={0.1}>
            <div className="border border-white/[0.14] rounded-2xl p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-5">
                <AlertTriangle size={16} className="text-amber-400" />
                <p className="text-[15px] font-semibold text-white">Common red flags we catch</p>
              </div>
              <div className="flex flex-col gap-3.5">
                {redFlags.map((flag) => (
                  <div key={flag} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#D31E28]/20 flex items-center justify-center shrink-0 mt-0.5">
                      <AlertTriangle size={10} className="text-[#D31E28]" />
                    </div>
                    <p className="text-[14px] text-white/70 leading-relaxed">{flag}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* How it works */}
      <section className={`${SECTION_X} py-14 lg:py-20 bg-white`}>
        <div className={CONTAINER}>
          <Reveal className="text-center max-w-[720px] mx-auto mb-8 lg:mb-12">
            <Eyebrow>The Process</Eyebrow>
            <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.15] text-[#0A0A0A] mt-3">
              How our second opinion works.
            </h2>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {steps.map((step, i) => (
              <Reveal key={step.num} delay={i * 0.06}>
                <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-7 h-full hover:shadow-[0_10px_30px_rgba(30,25,15,0.08)] transition-shadow">
                  <span className="text-[44px] font-display font-semibold text-[#D31E28]/20 block leading-none">{step.num}</span>
                  <h3 className="text-[17px] font-semibold text-[#0A0A0A] mt-3">{step.title}</h3>
                  <p className="text-[14px] text-[#6b6659] leading-relaxed mt-2">{step.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* What's included */}
      <section className={`${SECTION_X} py-14 lg:py-20 bg-[#FAF7F1]`}>
        <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}>
          <Reveal>
            <Eyebrow>What you get</Eyebrow>
            <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.15] text-[#0A0A0A] mt-3 text-balance">
              A complete, unbiased property health check.
            </h2>
            <p className="text-[16px] leading-[1.7] text-[#57534a] mt-4">
              Unlike brokers who earn commissions on your deal, our advisors are paid only by you — which means their
              only goal is to protect your interests.
            </p>
            <div className="flex flex-col gap-3 mt-6">
              {included.map((item) => (
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
            <div className="bg-white border border-[#EEE9E0] rounded-2xl p-8 lg:p-10 shadow-[0_1px_3px_rgba(30,25,15,0.04)]">
              <div className="text-center">
                <Eyebrow>Service Inquiry</Eyebrow>
                <p className="text-[28px] font-display font-semibold text-[#0A0A0A] mt-2">Professional Curation</p>
                <p className="text-[14px] text-[#948d7c] mt-1">Independent analysis &amp; risk assessment</p>
              </div>
              <div className="border-t border-[#EEE9E0] pt-6 mt-6 flex flex-col gap-3">
                {["Delivery within 48 hours", "100% commission-free advice", "Covers any property in Hyderabad", "No follow-up sales pressure"].map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-[15px] font-medium text-[#2b2823]">
                    <Check size={15} className="text-emerald-500" strokeWidth={2.5} /> {f}
                  </div>
                ))}
              </div>
              <Link
                href="/contact"
                className="w-full flex items-center justify-center gap-2 py-4 bg-[#D31E28] hover:bg-[#B8171F] text-white font-semibold text-base rounded-lg transition-colors shadow-[0_6px_18px_rgba(211,30,40,0.25)] mt-6"
              >
                Request second opinion <ArrowRight size={15} />
              </Link>
              <p className="text-[13px] text-center text-[#948d7c] mt-3">
                Complete peace of mind before making your final investment.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      <Footer />
    </div>
  );
}
