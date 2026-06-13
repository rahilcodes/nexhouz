"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  ShieldCheck, Target, Eye, Handshake, ArrowRight, Check,
  Building, Users, Star, TrendingUp, Award, Heart, Zap,
  FileText, MapPin, Clock, BadgeCheck, Globe, ChevronRight
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const milestones = [
  { year: "2024", title: "NexHouz Founded", desc: "Started with a single mission: make Hyderabad property buying transparent, safe, and human." },
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

export default function AboutPage() {
  const [activeTab, setActiveTab] = useState<"vision" | "mission" | "story">("story");

  const tabContent = {
    story: {
      heading: "How NexHouz was born",
      body: "NexHouz was founded in 2024 by a group of Hyderabad residents who had personally experienced the pain of buying property in the city — legal confusion, broker pressure, undisclosed disputes, and zero transparency. We built the firm we wished had existed when we were looking for our own homes. Today, NexHouz is Hyderabad's most trusted property curation firm — not because we have the most listings, but because every listing we show you has been personally verified by our legal and advisory team.",
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
    <>
      <Navbar />
      <main className="bg-white min-h-screen">

        {/* ================================================================ */}
        {/* HERO — Full-bleed dark with property image                        */}
        {/* ================================================================ */}
        <section className="relative h-screen overflow-hidden bg-brand-black">
          {/* Background image */}
          <img
            src="/images/hero_modernist_villa.png"
            alt="NexHouz Story"
            className="absolute inset-0 w-full h-full object-cover opacity-25"
          />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-brand-black/60 via-transparent to-brand-black/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-brand-black via-brand-black/40 to-transparent" />

          {/* Content */}
          <div className="relative z-10 h-full flex flex-col justify-center max-w-7xl mx-auto px-6 lg:px-10 pt-20 pb-10">
            <div className="max-w-2xl space-y-5">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-2.5 py-1 bg-white/10 border border-white/20 rounded-full"
              >
                <BadgeCheck size={10} className="text-brand-red" />
                <span className="text-xs md:text-xs font-extrabold tracking-[0.2em] uppercase text-white/80">
                  Hyderabad's Most Trusted Property Firm
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.08 }}
                className="font-extrabold text-white leading-[1.08] tracking-tight"
                style={{ fontSize: "clamp(1.8rem, 4vw, 3.25rem)" }}
              >
                We don't just find you a house.<br />
                We find you a <span className="text-brand-red">home you can trust.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.16 }}
                className="text-xs md:text-sm text-white/55 font-medium leading-relaxed max-w-lg"
              >
                NexHouz was founded by people who got burned by the broken Hyderabad property market — and decided to fix it. In just 2 years, we've helped 130+ families buy homes with complete legal clarity and zero regret.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.24 }}
                className="flex flex-col sm:flex-row gap-3 pt-2"
              >
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-brand-red hover:bg-brand-red/90 text-white text-xs font-extrabold uppercase tracking-wider rounded-full transition-all hover:scale-105 shadow-lg shadow-brand-red/20"
                >
                  Talk to Our Team <ArrowRight size={13} />
                </Link>
                <Link
                  href="/properties"
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-full transition-all border border-white/20"
                >
                  Browse Verified Properties
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-white/30">Our Story</span>
            <motion.div animate={{ y: [0, 4, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
          </motion.div>
        </section>

        {/* ================================================================ */}
        {/* STATS BAR                                                         */}
        {/* ================================================================ */}
        <section className="bg-brand-black border-t border-white/5 py-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-3 lg:grid-cols-6 gap-6">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  className="text-center space-y-1"
                >
                  <p className="text-3xl font-extrabold text-white">{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-widest text-white/35">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* STORY / VISION / MISSION TABS                                     */}
        {/* ================================================================ */}
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: image */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative rounded-3xl overflow-hidden aspect-[4/3] shadow-xl"
              >
                <img
                  src="/images/obsidian_pavilion.png"
                  alt="NexHouz Office"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-black/50 to-transparent" />
                {/* Floating badge */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-white/90 backdrop-blur-md rounded-2xl px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-brand-red flex items-center justify-center shrink-0">
                      <ShieldCheck size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-extrabold text-brand-black">100% Commission-Free Advisory</p>
                      <p className="text-xs text-gray-500 font-medium">Our advisors earn salaries, not commissions on your deal</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Right: tab content */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="space-y-8"
              >
                {/* Tab switcher */}
                <div className="flex items-center gap-1 p-1 bg-gray-50 border border-gray-100 rounded-full w-fit">
                  {(["story", "vision", "mission"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-2 text-xs font-extrabold uppercase tracking-widest rounded-full transition-all cursor-pointer ${activeTab === tab ? "bg-brand-black text-white shadow-sm" : "text-gray-400 hover:text-gray-700"}`}
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
                  className="space-y-5"
                >
                  <h2 className="text-4xl font-extrabold text-brand-black leading-tight">
                    {tabContent[activeTab].heading}
                  </h2>
                  <p className="text-sm text-gray-500 leading-relaxed font-medium">
                    {tabContent[activeTab].body}
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  {[
                    { icon: BadgeCheck, text: "RERA Certified Advisors" },
                    { icon: ShieldCheck, text: "14-Point Legal Audit" },
                    { icon: Heart, text: "Zero Pressure Culture" },
                    { icon: Star, text: "4.9★ Client Rating" },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <div key={item.text} className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-brand-red/8 flex items-center justify-center shrink-0">
                          <Icon size={13} className="text-brand-red" />
                        </div>
                        <span className="text-xs font-bold text-brand-black">{item.text}</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* CORE VALUES                                                        */}
        {/* ================================================================ */}
        <section className="py-24 bg-gray-50/50 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brand-red">What We Stand For</p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black tracking-tight">
                Six principles we never compromise on.
              </h2>
              <p className="text-sm text-gray-500 font-medium max-w-xl mx-auto leading-relaxed">
                These are not marketing words. These are the standards we hold every team member, every listing, and every client conversation to.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map((val, idx) => {
                const Icon = val.icon;
                return (
                  <motion.div
                    key={val.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="bg-white border border-gray-100 rounded-3xl p-8 space-y-4 shadow-sm hover:shadow-lg hover:border-brand-red/20 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-brand-red/5 flex items-center justify-center text-brand-red group-hover:bg-brand-red group-hover:text-white transition-all">
                      <Icon size={20} className="stroke-[1.8]" />
                    </div>
                    <h3 className="text-lg font-extrabold text-brand-black">{val.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed font-medium">{val.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* TIMELINE — Company milestones                                     */}
        {/* ================================================================ */}
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Left heading */}
              <div className="space-y-5 lg:sticky lg:top-28">
                <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brand-red">Our Journey</p>
                <h2 className="text-4xl md:text-5xl font-extrabold text-brand-black leading-tight">
                  Two years of building trust, one verified listing at a time.
                </h2>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  From a small team with a simple idea to Hyderabad's most verified property firm — every milestone here represents real families who found their right home.
                </p>
                <Link href="/contact" className="inline-flex items-center gap-2 px-6 py-3 border border-brand-red text-brand-red text-xs font-extrabold uppercase tracking-wider rounded-full hover:bg-brand-red hover:text-white transition-all">
                  Be Part of Our Story <ArrowRight size={12} />
                </Link>
              </div>

              {/* Right timeline */}
              <div className="relative pl-8">
                {/* Vertical line */}
                <div className="absolute left-0 top-2 bottom-2 w-px bg-gradient-to-b from-brand-red via-gray-200 to-gray-100" />

                <div className="space-y-10">
                  {milestones.map((m, idx) => (
                    <motion.div
                      key={m.year}
                      initial={{ opacity: 0, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: idx * 0.07 }}
                      className="relative"
                    >
                      {/* Dot */}
                      <div className={`absolute -left-10 top-1.5 w-4 h-4 rounded-full border-2 ${idx === 0 ? "bg-brand-red border-brand-red" : "bg-white border-gray-300"} `} />

                      <div className="space-y-1.5 pl-2">
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-extrabold text-brand-red bg-brand-red/8 border border-brand-red/15 px-2.5 py-0.5 rounded-full">{m.year}</span>
                          <h3 className="text-sm font-extrabold text-brand-black">{m.title}</h3>
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed font-medium">{m.desc}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* WHAT MAKES US DIFFERENT — split comparison                        */}
        {/* ================================================================ */}
        <section className="py-24 bg-gray-50/40 border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16 space-y-3">
              <p className="text-xs font-extrabold uppercase tracking-[0.3em] text-brand-red">The Difference</p>
              <h2 className="text-4xl font-extrabold text-brand-black">NexHouz vs. Traditional Brokers</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left py-4 pr-8 w-1/3"><span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Factor</span></th>
                    <th className="py-4 px-6 text-center bg-brand-black rounded-t-2xl">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-white">NexHouz</span>
                    </th>
                    <th className="py-4 px-6 text-center">
                      <span className="text-xs font-extrabold uppercase tracking-widest text-gray-400">Traditional Broker</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["RERA & Legal Audit", true, false],
                    ["Commission-Free Advice", true, false],
                    ["Builder Track Record Check", true, false],
                    ["AI-Powered Property Matching", true, false],
                    ["Written Due Diligence Report", true, false],
                    ["Post-Purchase Support", true, false],
                    ["NRI Remote Buying Facility", true, false],
                    ["Unbiased Second Opinion", true, false],
                  ].map(([label, nexhouz, broker], i) => (
                    <tr key={String(label)} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50/40"}`}>
                      <td className="py-4 pr-8 text-sm font-semibold text-brand-black">{label as string}</td>
                      <td className="py-4 px-6 text-center bg-brand-black/3">
                        {nexhouz ? <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mx-auto"><Check size={13} className="text-white" /></div> : <span className="text-gray-300 text-lg">—</span>}
                      </td>
                      <td className="py-4 px-6 text-center">
                        {broker ? <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center mx-auto"><Check size={13} className="text-white" /></div> : <span className="text-gray-300 text-lg font-bold">✕</span>}
                      </td>
                    </tr>
                  ))}
                  <tr>
                    <td className="py-4" />
                    <td className="pt-4 pb-6 px-6 rounded-b-2xl bg-brand-black/3 text-center">
                      <Link href="/contact" className="inline-flex items-center gap-2 px-5 py-2.5 bg-brand-black hover:bg-brand-red text-white text-xs font-extrabold uppercase tracking-wide rounded-full transition-all">
                        Start with NexHouz <ArrowRight size={11} />
                      </Link>
                    </td>
                    <td />
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* TESTIMONIAL + TEAM TEASER                                         */}
        {/* ================================================================ */}
        <section className="py-24 bg-white border-b border-gray-100">
          <div className="max-w-4xl mx-auto px-6">
            {/* Testimonial */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="bg-brand-black rounded-3xl p-10 md:p-12 flex flex-col justify-between min-h-[300px] relative overflow-hidden text-center items-center"
            >
              <div className="absolute top-0 right-0 w-48 h-48 bg-brand-red/10 rounded-full blur-3xl" />
              <div className="relative space-y-6 max-w-2xl">
                <div className="flex items-center gap-0.5 justify-center">
                  {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-brand-red text-brand-red" />)}
                </div>
                <blockquote className="text-xl md:text-2xl font-light text-white leading-relaxed italic">
                  "I had been misled by two different brokers before NexHouz. Their team personally audited the property I wanted, found a pending litigation, and saved me from a catastrophic mistake. I can't recommend them enough."
                </blockquote>
              </div>
              <div className="relative pt-8 border-t border-white/10 w-full max-w-md mt-6">
                <p className="text-xs font-extrabold uppercase tracking-widest text-white">Karthik Mehta</p>
                <p className="text-xs text-white/40 font-medium mt-0.5">Software Architect, Gachibowli — bought a villa in Narsingi</p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* FINAL CTA                                                          */}
        {/* ================================================================ */}
        <section className="py-24 bg-brand-black overflow-hidden relative">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #D31E28, transparent 60%), radial-gradient(circle at 80% 30%, #D31E28, transparent 50%)" }} />
          <div className="absolute inset-0" style={{ backgroundImage: "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)", backgroundSize: "60px 60px" }} />
          <div className="relative max-w-4xl mx-auto px-6 text-center space-y-7">
            <h2 className="font-extrabold text-white leading-tight tracking-tight" style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }}>
              Ready to find a home you can trust completely?
            </h2>
            <p className="text-sm text-white/55 font-medium leading-relaxed max-w-xl mx-auto">
              Start with a free 45-minute strategy call. No spam, no broker pressure — just an honest conversation about what's right for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-brand-red hover:bg-brand-red/90 text-white text-sm font-extrabold uppercase tracking-wider rounded-full transition-all shadow-lg shadow-brand-red/20 hover:scale-105">
                Book Free Consultation <ArrowRight size={14} />
              </Link>
              <Link href="/properties" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/15 text-white text-sm font-bold uppercase tracking-wider rounded-full transition-all border border-white/20">
                Browse Verified Properties
              </Link>
            </div>
            <div className="flex flex-wrap justify-center gap-6 pt-4">
              {["Zero broker pressure", "100% legal clear listings", "Hyderabad's most trusted team"].map(badge => (
                <div key={badge} className="flex items-center gap-2 text-xs font-bold text-white/40 uppercase tracking-wider">
                  <Check size={11} className="text-brand-red" />{badge}
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
