"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShieldCheck, Handshake, ArrowRight, Check, Star, Heart, Zap,
  FileText, BadgeCheck, Globe,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { CONTAINER, Reveal, Eyebrow } from "@/components/ui/theme";

const milestones = [
  { year: "2025", title: "NexHouz Founded", desc: "Started with a single mission: make Hyderabad property buying transparent, safe, and human." },
  { year: "2025", title: "800+ Properties Scanned", desc: "Built our advanced internal RERA + GHMC audit framework. Manually reviewed 800+ builder projects." },
  { year: "2026", title: "130+ Families Served", desc: "Helping buyers with zero disputes and complete peace of mind, now offering 1,500+ verified properties." },
];

const values = [
  { icon: ShieldCheck, title: "Radical Transparency", desc: "We share everything — the good, the bad, and the complicated. If a property has a risk, we tell you before you ask." },
  { icon: Handshake, title: "Commission-Free Advice", desc: "Our advisors earn salaries — not commissions on your purchase. That means our only goal is your best outcome." },
  { icon: FileText, title: "Verified Every Time", desc: "Every listing goes through our 14-point legal audit — RERA, GHMC, title deed, encumbrance, and builder track record." },
  { icon: Heart, title: "Human-First Culture", desc: "Real estate is one of the biggest decisions of your life. We treat it with the gravity, patience, and empathy it deserves." },
  { icon: Zap, title: "Speed & Precision", desc: "Our AI + human hybrid model means you get recommendations in hours, not weeks — without sacrificing depth." },
  { icon: Globe, title: "Pan-Hyderabad Knowledge", desc: "From Kokapet to Jubilee Hills, Narsingi to Gachibowli — we have boots-on-ground insight across every major corridor." },
];

const stats = [
  { value: "2", label: "Years in Hyderabad" },
  { value: "1,500+", label: "Properties Verified" },
  { value: "130+", label: "Families Served" },
  { value: "98%", label: "Satisfaction Rate" },
  { value: "0", label: "Legal Disputes" },
  { value: "12", label: "Countries Served (NRI)" },
];

const comparison: [string, boolean, boolean][] = [
  ["RERA & Legal Audit", true, false],
  ["Commission-Free Advice", true, false],
  ["Builder Track Record Check", true, false],
  ["AI-Powered Property Matching", true, false],
  ["Written Due Diligence Report", true, false],
  ["Post-Purchase Support", true, false],
  ["NRI Remote Buying Facility", true, false],
  ["Unbiased Second Opinion", true, false],
];

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"vision" | "mission" | "story">("story");

  const tabContent = {
    story: {
      heading: "How NexHouz was born",
      body: "NexHouz was founded in 2025 by a group of Hyderabad residents who had personally experienced the pain of buying property in the city — legal confusion, broker pressure, undisclosed disputes, and zero transparency. We built the firm we wished had existed when we were looking for our own homes. Today, NexHouz is Hyderabad's most trusted property curation firm — not because we have the most listings, but because every listing we show you has been personally verified by our legal and advisory team.",
    },
    vision: {
      heading: "Our Vision",
      body: "To build a world where buying a home in Hyderabad feels clear, confident, and completely safe — where every family, from first-time buyers to seasoned investors, has access to the same level of expert guidance that was once only available to the ultra-wealthy. We believe trust and transparency are not differentiators — they are the minimum standard.",
    },
    mission: {
      heading: "Our Mission",
      body: "To be the most trusted real estate advisory firm in Hyderabad by doing one thing obsessively well: protecting our clients from making bad property decisions. We do this by independently auditing every builder, every project, and every title deed — and presenting only the properties we would personally recommend to our own families.",
    },
  };

  return (
    <div className="font-archivo bg-white">
      <Navbar />
      <main>

        {/* ================================================================ */}
        {/* HERO — warm split layout                                          */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
          <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-center`}>
            <Reveal>
              <div className="inline-flex items-center gap-2.5 bg-white border border-[#eadfd0] rounded-lg px-4 py-2.5 text-[13px] md:text-[14px] font-semibold text-[#8A6D2F] shadow-[0_2px_8px_rgba(30,25,15,0.06)]">
                <BadgeCheck size={14} className="text-[#8A6D2F]" />
                Hyderabad&apos;s Most Trusted Property Firm
              </div>
              <h1 className="font-display font-semibold text-[34px] md:text-[46px] lg:text-[54px] leading-[1.15] lg:leading-[1.1] text-[#0A0A0A] mt-5 text-balance">
                We don&apos;t just find you a house. We find you a{" "}
                <span className="text-[#D31E28]">home you can trust.</span>
              </h1>
              <p className="text-[15.5px] lg:text-[17px] leading-[1.7] text-[#57534a] mt-4 lg:mt-5 max-w-[540px]">
                NexHouz was founded by people who got burned by the broken Hyderabad property market — and decided to
                fix it. In just 2 years, we&apos;ve helped 130+ families buy homes with complete legal clarity and zero
                regret.
              </p>
              <div className="flex flex-col sm:flex-row gap-3.5 mt-7">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#D31E28] hover:bg-[#B8171F] text-white text-base font-semibold rounded-lg px-7 py-4 shadow-[0_4px_14px_rgba(211,30,40,0.25)] transition-colors"
                >
                  Talk to Our Team <ArrowRight size={15} />
                </Link>
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center border-[1.5px] border-[#d8d2c6] text-[#0A0A0A] hover:border-[#0A0A0A] text-base font-semibold rounded-lg px-6 py-4 transition-colors"
                >
                  Browse Verified Properties
                </Link>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="rounded-[20px] overflow-hidden h-[260px] md:h-[340px] lg:h-[460px]">
                <img
                  src="/images/hero_modernist_villa.png"
                  alt="NexHouz Story — luxury villa in Hyderabad"
                  className="w-full h-full object-cover"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* STATS BAR                                                         */}
        {/* ================================================================ */}
        <section className="border-b border-[#EEE9E0] bg-white px-4 md:px-6 xl:px-[60px]">
          <div className={`${CONTAINER} grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6`}>
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 0.05}>
                <div className="text-center py-6 lg:py-8 px-3">
                  <div className="text-[26px] lg:text-[30px] leading-none font-semibold text-[#0A0A0A]">{stat.value}</div>
                  <div className="text-[13px] lg:text-sm text-[#6b6659] mt-2">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* ================================================================ */}
        {/* STORY / VISION / MISSION TABS                                     */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-white">
          <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center`}>
            {/* Left: image */}
            <Reveal>
              <div className="relative rounded-[20px] overflow-hidden aspect-[4/3]">
                <img
                  src="/images/obsidian_pavilion.png"
                  alt="NexHouz Office"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/50 to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-4 left-4 right-4 lg:bottom-6 lg:left-6 lg:right-6">
                  <div className="bg-white/95 backdrop-blur-md border border-[#EEE9E0] rounded-2xl px-5 py-4 flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full bg-[#D31E28] flex items-center justify-center shrink-0">
                      <ShieldCheck size={17} className="text-white" />
                    </div>
                    <div>
                      <p className="text-[14.5px] font-semibold text-[#0A0A0A]">100% Commission-Free Advisory</p>
                      <p className="text-[13px] text-[#6b6659] mt-0.5">Our advisors earn salaries, not commissions on your deal</p>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Right: tab content */}
            <Reveal delay={0.1}>
              <Eyebrow>Who We Are</Eyebrow>

              {/* Tab switcher */}
              <div className="flex items-center gap-1 p-1 bg-[#FAF7F1] border border-[#EEE9E0] rounded-full w-fit mt-5">
                {(["story", "vision", "mission"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 md:px-5 py-2.5 text-[12.5px] font-semibold uppercase tracking-[0.14em] rounded-full transition-colors cursor-pointer ${
                      activeTab === tab ? "bg-[#0A0A0A] text-white" : "text-[#948d7c] hover:text-[#0A0A0A]"
                    }`}
                  >
                    {tab === "story" ? "Our Story" : tab === "vision" ? "Vision" : "Mission"}
                  </button>
                ))}
              </div>

              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <h2 className="font-display font-semibold text-[28px] md:text-[36px] lg:text-[40px] leading-[1.15] text-[#0A0A0A]">
                  {tabContent[activeTab].heading}
                </h2>
                <p className="text-[15px] lg:text-base leading-[1.7] text-[#57534a] mt-4">
                  {tabContent[activeTab].body}
                </p>
              </motion.div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-7">
                {[
                  { icon: BadgeCheck, text: "RERA Certified Advisors" },
                  { icon: ShieldCheck, text: "14-Point Legal Audit" },
                  { icon: Heart, text: "Zero Pressure Culture" },
                  { icon: Star, text: "4.9★ Client Rating" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.text} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#faf0f0] flex items-center justify-center shrink-0">
                        <Icon size={15} className="text-[#D31E28]" />
                      </div>
                      <span className="text-[14.5px] font-semibold text-[#0A0A0A]">{item.text}</span>
                    </div>
                  );
                })}
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CORE VALUES                                                        */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
          <div className={CONTAINER}>
            <Reveal className="text-center max-w-[760px] mx-auto mb-6 lg:mb-12">
              <Eyebrow>What We Stand For</Eyebrow>
              <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
                Six principles we never compromise on.
              </h2>
              <p className="text-[15px] lg:text-base leading-[1.7] text-[#57534a] mt-4 max-w-[600px] mx-auto">
                These are not marketing words. These are the standards we hold every team member, every listing, and
                every client conversation to.
              </p>
            </Reveal>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 lg:gap-6">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <Reveal key={val.title} delay={(idx % 3) * 0.08}>
                    <div className="bg-white border border-[#EEE9E0] rounded-2xl p-6 lg:p-8 h-full shadow-[0_1px_3px_rgba(30,25,15,0.04)]">
                      <div className="w-12 h-12 rounded-[14px] bg-[#faf0f0] flex items-center justify-center text-[#D31E28]">
                        <Icon size={20} className="stroke-[1.8]" />
                      </div>
                      <h3 className="text-[18px] lg:text-[20px] font-semibold text-[#0A0A0A] mt-5">{val.title}</h3>
                      <p className="text-[14.5px] lg:text-[15px] leading-[1.65] text-[#57534a] mt-2.5">{val.desc}</p>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* TIMELINE — Company milestones                                     */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-white">
          <div className={`${CONTAINER} grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start`}>
            {/* Left heading */}
            <Reveal className="lg:sticky lg:top-10">
              <Eyebrow>Our Journey</Eyebrow>
              <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4 text-balance">
                Two years of building trust, one verified listing at a time.
              </h2>
              <p className="text-[15px] lg:text-base leading-[1.7] text-[#57534a] mt-4 max-w-[480px]">
                From a small team with a simple idea to Hyderabad&apos;s most verified property firm — every milestone
                here represents real families who found their right home.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 border-[1.5px] border-[#d8d2c6] text-[#0A0A0A] hover:border-[#0A0A0A] text-[15px] font-semibold rounded-lg px-6 py-4 mt-6 transition-colors"
              >
                Be Part of Our Story <ArrowRight size={14} />
              </Link>
            </Reveal>

            {/* Right timeline */}
            <div className="relative pl-8">
              {/* Vertical line */}
              <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-[#D31E28] via-[#EEE9E0] to-[#EEE9E0]" />

              <div className="space-y-10">
                {milestones.map((m, idx) => (
                  <Reveal key={m.title} delay={idx * 0.07}>
                    <div className="relative">
                      {/* Dot */}
                      <div
                        className={`absolute -left-10 top-1 w-4 h-4 rounded-full border-2 ${
                          idx === 0 ? "bg-[#D31E28] border-[#D31E28]" : "bg-white border-[#d8d2c6]"
                        }`}
                      />
                      <div className="pl-2">
                        <div className="flex flex-wrap items-center gap-3">
                          <span className="text-[12.5px] font-bold text-[#D31E28] bg-[#faf0f0] border border-[#D31E28]/15 px-3 py-1 rounded-full">
                            {m.year}
                          </span>
                          <h3 className="text-[16.5px] font-semibold text-[#0A0A0A]">{m.title}</h3>
                        </div>
                        <p className="text-[14.5px] leading-[1.65] text-[#57534a] mt-2">{m.desc}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* WHAT MAKES US DIFFERENT — split comparison                        */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#FAF7F1]">
          <div className={CONTAINER}>
            <Reveal className="text-center max-w-[720px] mx-auto mb-6 lg:mb-12">
              <Eyebrow>The Difference</Eyebrow>
              <h2 className="font-display font-semibold text-[28px] md:text-[40px] lg:text-[44px] leading-[1.2] lg:leading-[1.15] text-[#0A0A0A] mt-3 lg:mt-4">
                NexHouz vs. Traditional Brokers
              </h2>
            </Reveal>
            <Reveal>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[640px]">
                  <thead>
                    <tr>
                      <th className="text-left py-4 pr-8 w-1/3">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#948d7c]">Factor</span>
                      </th>
                      <th className="py-4 px-6 text-center bg-[#0A0A0A] rounded-t-2xl">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-white">NexHouz</span>
                      </th>
                      <th className="py-4 px-6 text-center">
                        <span className="text-[12px] font-semibold uppercase tracking-[0.18em] text-[#948d7c]">Traditional Broker</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparison.map(([label, nexhouz, broker], i) => (
                      <tr key={label} className={i % 2 === 0 ? "bg-white" : ""}>
                        <td className="py-4 pr-8 pl-4 text-[15px] font-semibold text-[#0A0A0A]">{label}</td>
                        <td className="py-4 px-6 text-center bg-[#0A0A0A]/[0.03]">
                          {nexhouz ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mx-auto">
                              <Check size={13} className="text-white" />
                            </div>
                          ) : (
                            <span className="text-[#c9c2b4] text-lg">—</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-center">
                          {broker ? (
                            <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mx-auto">
                              <Check size={13} className="text-white" />
                            </div>
                          ) : (
                            <span className="text-[#c9c2b4] text-lg font-bold">✕</span>
                          )}
                        </td>
                      </tr>
                    ))}
                    <tr>
                      <td className="py-4" />
                      <td className="pt-5 pb-6 px-6 rounded-b-2xl bg-[#0A0A0A]/[0.03] text-center">
                        <Link
                          href="/contact"
                          className="inline-flex items-center gap-2 bg-[#0A0A0A] hover:bg-[#D31E28] text-white text-sm font-semibold rounded-lg px-6 py-3.5 transition-colors"
                        >
                          Start with NexHouz <ArrowRight size={13} />
                        </Link>
                      </td>
                      <td />
                    </tr>
                  </tbody>
                </table>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* TESTIMONIAL                                                       */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-white">
          <div className={CONTAINER}>
            <Reveal className="max-w-[880px] mx-auto text-center">
              <div className="flex items-center gap-1 justify-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className="fill-[#8A6D2F] text-[#8A6D2F]" />
                ))}
              </div>
              <blockquote className="font-display italic font-medium text-[22px] md:text-[28px] lg:text-[34px] leading-[1.45] text-[#0A0A0A] mt-5 lg:mt-6">
                &ldquo;I had been misled by two different brokers before NexHouz. Their team personally audited the
                property I wanted, found a pending litigation, and saved me from a catastrophic mistake. I can&apos;t
                recommend them enough.&rdquo;
              </blockquote>
              <div className="text-[15px] font-semibold text-[#0A0A0A] tracking-wide mt-6">KARTHIK MEHTA</div>
              <div className="text-sm text-[#6b6659] mt-1.5">
                Software Architect, Gachibowli — bought a villa in Narsingi
              </div>
            </Reveal>
          </div>
        </section>

        {/* ================================================================ */}
        {/* FINAL CTA — dark band                                             */}
        {/* ================================================================ */}
        <section className="px-4 md:px-6 xl:px-[60px] py-14 lg:py-20 bg-[#0A0A0A]">
          <div className={CONTAINER}>
            <Reveal className="max-w-[880px] mx-auto text-center">
              <Eyebrow light>Start Your Journey</Eyebrow>
              <h2 className="font-display font-semibold text-[28px] md:text-[42px] lg:text-[48px] leading-[1.2] lg:leading-[1.15] text-white mt-3 lg:mt-4 text-balance">
                Ready to find a home you can trust completely?
              </h2>
              <p className="text-[15px] lg:text-[17px] leading-[1.7] text-white/65 mt-4 lg:mt-5 max-w-[560px] mx-auto">
                Start with a free 45-minute strategy call. No spam, no broker pressure — just an honest conversation
                about what&apos;s right for you.
              </p>
              <div className="flex flex-col sm:flex-row gap-3.5 justify-center mt-7 lg:mt-9">
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 bg-[#D31E28] hover:bg-[#B8171F] text-white text-base font-semibold rounded-lg px-7 py-4 shadow-[0_4px_14px_rgba(211,30,40,0.25)] transition-colors"
                >
                  Book Free Consultation <ArrowRight size={15} />
                </Link>
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center border-[1.5px] border-white/25 hover:border-white text-white text-base font-semibold rounded-lg px-6 py-4 transition-colors"
                >
                  Browse Verified Properties
                </Link>
              </div>
              <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 mt-8">
                {["Zero broker pressure", "100% legal clear listings", "Hyderabad's most trusted team"].map((badge) => (
                  <div key={badge} className="flex items-center gap-2 text-[13.5px] font-medium text-white/60">
                    <Check size={13} className="text-[#D31E28]" strokeWidth={3} />
                    {badge}
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
